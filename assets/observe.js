(function () {
  const q = s => document.querySelector(s);
  const attr = (s, a) => q(s)?.getAttribute(a) || '';
  const make = (x, name, type) => {
    const image = [...x.querySelectorAll('*')].find(z => getComputedStyle(z).backgroundImage !== 'none');
    const style = image ? getComputedStyle(image) : null;
    const rect = image?.getBoundingClientRect();
    return {id:x.getAttribute('data-testid'), name, type,
      image:style?.backgroundImage || '', position:style?.backgroundPosition || '',
      size:style?.backgroundSize || '', width:rect?.width || 0, height:rect?.height || 0};
  };
  const spells = [...document.querySelectorAll('[data-testid^=spell-slot-]')]
    .filter(x => x.title && !/^Emplacement/.test(x.title)).map(x => make(x, x.title, 'spell'));
  const items = [...document.querySelectorAll('[data-testid^=item-slot-]')]
    .filter(x => x.title && !/^Emplacement/.test(x.title)).map(x => make(x, x.title, 'item'));
  const buttons = [...document.querySelectorAll('button')].filter(x => x.getClientRects().length);
  const combat = buttons.some(x => /^(Fin du tour|Abandonner|Prêt)$/i.test((x.innerText || '').trim()));
  const view = q('[data-testid=minimap-view]');
  let map = null;
  if (view) {
    const r = view.getBoundingClientRect();
    const rect = e => { const a=e.getBoundingClientRect(); return {x:a.left-r.left,y:a.top-r.top,w:a.width,h:a.height}; };
    map = {width:r.width,height:r.height, tiles:[...view.querySelectorAll('.world-plane > img')].map(e=>({...rect(e),url:e.src})),
      hints:[...view.querySelectorAll('.world-hint')].map(e=>{const s=getComputedStyle(e);return {...rect(e),image:s.backgroundImage,position:s.backgroundPosition,size:s.backgroundSize}}),
      marker:q('[data-testid=minimap-me]')?rect(q('[data-testid=minimap-me]')):null};
  }
  const messages = [...document.querySelectorAll('[data-testid=chat-lines] .chat-line')].slice(-5).map(x=>x.innerText.slice(0,250));
  return JSON.stringify({hp:attr('[data-testid=hp-heart]','aria-label'),ap:attr('[data-testid=ap-badge]','aria-label'),
    mp:attr('[data-testid=mp-badge]','aria-label'),kamas:q('[data-testid=kamas]')?.textContent || '',
    combat,spells,items,map,messages});
})()
