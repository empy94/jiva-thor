const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const script = fs.readFileSync('assets/sync.js', 'utf8');
async function run({favorite, slots, fighting=false, accept=true}) {
  let drops=0;
  const tab={click(){},getAttribute(){return 'true'}};
  const root={dataset:{}};
  const doc={documentElement:root,querySelector(selector){
    if(selector==='[data-testid=hp-heart]')return {};
    if(selector.includes('shortcut-tab-spells'))return tab;
    const match=selector.match(/data-testid="(spell-slot-\d+)"/); if(match)return slots.find(s=>s.dataset.testid===match[1]);
    return null;
  },querySelectorAll(selector){if(selector==='button')return fighting?[{innerText:'Fin du tour',getClientRects:()=>[{}]}]:[];if(selector.includes('spell-slot-'))return slots;return []}};
  class DataTransfer{constructor(){this.values={}}setData(k,v){this.values[k]=v}getData(k){return this.values[k]||''}}
  class DragEvent{constructor(type,options){this.type=type;Object.assign(this,options)}}
  for(const slot of slots)slot.dispatchEvent=e=>{drops++;if(accept)slot.title=favorite.name};
  await vm.runInNewContext(script.replace('/*FAVORITES*/[]',JSON.stringify([favorite])),{document:doc,DataTransfer,DragEvent,setTimeout:fn=>fn(),Promise,Error});
  return {result:JSON.parse(root.dataset.jivaSync),drops,slots};
}
(async()=>{
  const favorite={type:'spell',id:'spell-51',name:'Sort choisi'};
  const slot=(n,title)=>({dataset:{testid:`spell-slot-${n}`},title});
  let r=await run({favorite,slots:[slot(1,'Existant'),slot(2,'Emplacement 2')]});
  assert.equal(r.result.added,1);assert.equal(r.slots[0].title,'Existant');assert.equal(r.drops,1);
  r=await run({favorite,slots:[slot(1,'Existant')]});assert.equal(r.drops,0);assert.equal(r.result.missing,1);
  r=await run({favorite,slots:[slot(1,'Emplacement 1')],fighting:true});assert.equal(r.drops,0);assert.match(r.result.reason,/hors combat/);
  r=await run({favorite,slots:[slot(1,'Emplacement 1')],accept:false});assert.equal(r.drops,1);assert.equal(r.result.added,0);assert.match(r.result.reason,/confirmé/);
  console.log('Synchronization: empty slots, full bar, combat and missing confirmation passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
