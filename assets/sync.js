(async function (favorites) {
  const root = document.documentElement;
  if (root.dataset.jivaSync === 'running') return;
  root.dataset.jivaSync = 'running';
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const fight = () => [...document.querySelectorAll('button')].some(x => x.getClientRects().length && /^(Fin du tour|Abandonner|Prêt)$/i.test((x.innerText || '').trim()));
  const result = {added:0, present:0, missing:0, reason:''};
  let openedInventory = false;
  const original = document.querySelector('[data-testid=shortcut-tab-spells][aria-selected=true]') ? 'spells' : 'items';
  try {
    if (!document.querySelector('[data-testid=hp-heart]') || fight()) throw Error('Synchronisation disponible hors combat.');
    for (const kind of ['spell', 'item']) {
      const list = favorites.filter(f => f.type === kind && f.name);
      if (!list.length) continue;
      if (kind === 'item' && !document.querySelector('[data-testid=window-inventory]')) {
        const menu = document.querySelector('[data-testid=menu-inventory]');
        if (!menu) throw Error('Sac indisponible pour synchroniser les objets.');
        menu.click(); openedInventory = true; await pause(500);
      }
      const tab = kind === 'spell' ? 'spells' : 'items';
      const prefix = kind === 'spell' ? 'spell-slot-' : 'item-slot-';
      const expected = kind === 'spell' ? /^spell-(\d+)$/ : /^bag-(\d+)$/;
      const button = document.querySelector(`[data-testid="shortcut-tab-${tab}"]`);
      if (!button) throw Error('Barre du jeu indisponible.');
      button.click();
      await pause(350);
      for (const entry of list) {
        if (!document.querySelector('[data-testid=hp-heart]') || fight()) throw Error('Synchronisation interrompue : combat ou jeu indisponible.');
        const slots = [...document.querySelectorAll(`[data-testid^="${prefix}"]`)];
        if (slots.some(s => s.title === entry.name)) { result.present++; continue; }
        const id = expected.exec(entry.id || '');
        if (!id) { result.missing++; continue; }
        const slot = slots.find(s => /^Emplacement\s+\d+$/.test(s.title || ''));
        if (!slot) { result.missing++; result.reason = 'Barre du jeu pleine ou inaccessible.'; continue; }
        const slotId = slot.dataset.testid;
        const transfer = new DataTransfer();
        let source = null;
        if (kind === 'spell') transfer.setData('application/x-spell', id[1]);
        else {
          source = document.querySelector(`[data-testid="window-inventory"] [data-testid="${entry.id}"]`);
          if (!source || !source.draggable) { result.missing++; result.reason = 'Objet introuvable dans le sac.'; continue; }
          source.dispatchEvent(new DragEvent('dragstart', {bubbles:true, cancelable:true, dataTransfer:transfer}));
          if (!transfer.getData('application/x-item')) { result.missing++; result.reason = 'Objet indisponible dans le sac.'; continue; }
        }
        slot.dispatchEvent(new DragEvent('drop', {bubbles:true, cancelable:true, dataTransfer:transfer}));
        if (source) source.dispatchEvent(new DragEvent('dragend', {bubbles:true, dataTransfer:transfer}));
        let confirmed = false;
        for (let i = 0; i < 10; i++) {
          await pause(200);
          const current = document.querySelector(`[data-testid="${slotId}"]`);
          if (current && current.title === entry.name) { confirmed = true; break; }
          if (current && !/^Emplacement\s+\d+$/.test(current.title || '')) break;
        }
        if (!confirmed) { result.missing++; result.reason = 'Le jeu n’a pas confirmé l’ajout.'; break; }
        result.added++;
      }
      if (result.reason === 'Le jeu n’a pas confirmé l’ajout.') break;
    }
  } catch (e) { result.reason = e.message || 'Synchronisation impossible.'; }
  finally {
    if (openedInventory && document.querySelector('[data-testid=window-inventory]')) document.querySelector('[data-testid=menu-inventory]')?.click();
    if (!fight()) document.querySelector(`[data-testid="shortcut-tab-${original}"]`)?.click();
    root.dataset.jivaSync = JSON.stringify(result);
  }
})(/*FAVORITES*/[])
