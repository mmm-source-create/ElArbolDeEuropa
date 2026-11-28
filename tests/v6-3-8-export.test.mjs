import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {PAPAL_SUCCESSION} from '../src/domain/genealogy/papalSuccession.js';
import {treeSvg} from '../src/features/connections/treeExport.js';
const byId=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
function inspect(scene,people) {
 const dom=new JSDOM(scene.svg,{contentType:'image/svg+xml'}),doc=dom.window.document;
 assert.equal(doc.querySelector('parsererror'),null);
 const cards=new Map([...doc.querySelectorAll('g > g > rect')].map(rect=>{
  const title=rect.parentElement.querySelector('title').textContent;
  const person=people.find(p=>title.startsWith(`${p.nombre} · `));assert(person,title);
  const box=Object.fromEntries(['x','y','width','height'].map(k=>[k,Number(rect.getAttribute(k))]));
  for(const text of rect.parentElement.querySelectorAll('text')){
   const x=Number(text.getAttribute('x')),y=Number(text.getAttribute('y'));
   assert(x>=box.x&&x<box.x+box.width,`${person.id}: text starts inside card`);
   assert(y>box.y&&y+4<box.y+box.height,`${person.id}: line fits vertically`);
  }
  return [person.id,box];
 }));
 assert.equal(cards.size,people.length);
 const boxes=[...cards.values()];
 for(let i=0;i<boxes.length;i++){
  const a=boxes[i];assert(a.x>=0&&a.y>=0&&a.x+a.width<scene.width&&a.y+a.height<scene.height);
  for(const b of boxes.slice(i+1))assert(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y,'full export cards do not overlap');
 }
 for(const p of people)for(const id of [p.padre,p.madre])if(cards.has(id)){
  assert(cards.get(p.id).y>=cards.get(id).y+cards.get(id).height,`${p.id} below ${id}`);
 }
 return {cards,doc,close:()=>dom.window.close()};
}
test('638 export: all pontiffs preserve parentage after stacking, including Alexander VI and Lucrezia',()=>{
 const people=[...PAPAL_SUCCESSION.map(id=>byId[id]),byId.LUCRECIABORJA];
 const scene=treeSvg({people,edges:[{from:'RODRIGOBORJA',to:'LUCRECIABORJA',type:'sangre'}]});
 const {cards,doc,close}=inspect(scene,people);
 assert.equal(new Set(PAPAL_SUCCESSION.map(id=>cards.get(id).x)).size,1);
 assert(cards.get('LUCRECIABORJA').y>cards.get('RODRIGOBORJA').y);
 assert.equal(doc.querySelectorAll('path[stroke="#9B8246"]').length,75);
 let bottom=0;
 for(const id of PAPAL_SUCCESSION){const p=cards.get(id);assert(p.y>=bottom,id);bottom=p.y+p.height;}
 close();
});
test('638 export: papal families keep couples together and reserve space for their full labels',()=>{
 const ids=[...PAPAL_SUCCESSION.slice(30,48),'LUCRECIABORJA','ALFONSO1ESTE','VANNOZZACATT','GIULIAFARNESE','PIERLUIGIFARNESE_DUCA','SILVIARUFFINI'];
 const people=[...new Set(ids)].map(id=>byId[id]);
 assert(people.every(Boolean),'all family fixtures refer to recorded people');
 assert(people.some(p=>p.id==='ALFONSO1ESTE'));
 const scene=treeSvg({people,edges:[{from:'RODRIGOBORJA',to:'LUCRECIABORJA',type:'sangre'},{from:'LUCRECIABORJA',to:'ALFONSO1ESTE',type:'matrimonio'}]});
 const {cards,close}=inspect(scene,people);
 assert.equal(cards.get('LUCRECIABORJA').y,cards.get('ALFONSO1ESTE').y);
 assert.equal(cards.get('PAPA_PAULO3').y,cards.get('SILVIARUFFINI').y);
 close();
});
test('638 export: long papal names and titles fit without moving children above their parents',()=>{
 const ids=['PAPA_CLEMENTE7','PAPA_PAULO3','PAPA_JULIO3','LUCRECIABORJA','RODRIGOBORJA'];
 const people=ids.map(id=>({...byId[id],nombre:`${byId[id].nombre} ${'Nombre & título completo '.repeat(9)}`,titulo:'Papa y soberano con un título documental extenso que debe conservarse íntegro'}));
 const {close,doc}=inspect(treeSvg({people,edges:[]}),people);
 assert.match(doc.documentElement.textContent,/Nombre & título completo/);assert.equal(doc.querySelector('script'),null);
 close();
});
