import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/personas.jsx';
import {RELEVOS} from '../src/content/sucesiones/index.js';
import {successionBank,bankVersion,createChallenge,challengeUrl,readChallenge,readReview,reviewQuestions,saveReview,updateReview,validReviewQuestion,REVIEW_KEY} from '../src/desafio/learning.js';
const bank=successionBank(PERSONAS), byId=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
const store=initial=>{let value=initial;return {getItem:()=>value,setItem:(_,v)=>{value=v;}};};
test('el banco usa exclusivamente relevos editoriales y conserva la explicación y sus fuentes',()=>{
 assert.equal(bank.length,168);
 assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
 for(const q of bank){
  const r=RELEVOS.find(r=>r.id===q.relevoId);
  assert.ok(r);assert.equal(q.explicacion,r.explicacion);assert.deepEqual(q.fuentes,r.fuentes);
  assert.ok(validReviewQuestion(q,byId));assert.equal(q.opciones.length,4);
  assert.equal(q.opciones.filter(o=>o.id===q.correctaId).length,1);
  if(q.tipo==='sucesor-documentado')assert.equal(q.correctaId,r.sucesor.persona);
  else assert.equal(q.correctaId,[...r.motivos].sort().join(' + '));
 }
});
test('la corregencia de Flandes en 1384 conserva motivos pero no impone un sucesor único',()=>{
 const relevant=bank.filter(q=>q.relevoId==='Flandes-MARGFLAN-1384'||q.relevoId==='Flandes-FEL2BORG-1384');
 assert.equal(relevant.length,2);assert.ok(relevant.every(q=>q.tipo==='fundamento'));
 assert.equal(successionBank(PERSONAS,[]).length,0);
});
test('una partida compartida reproduce cinco preguntas y opciones sin revelar soluciones en el enlace',()=>{
 const first=createChallenge(bank,'same-round');const url=challengeUrl(bank,'same-round');
 assert.deepEqual(first,readChallenge(url.split('?')[1],bank).preguntas);
 assert.equal(first.length,5);assert.equal(new Set(first.map(q=>q.relevoId)).size,5);
 assert.notDeepEqual(first,createChallenge(bank,'other-round'));
 const params=new URL(url,'https://treeofeurope.eu').searchParams;
 assert.deepEqual([...params.keys()],['reto','banco']);
 assert.deepEqual(bank,successionBank([...PERSONAS].reverse()));
});
test('rechaza enlaces corruptos, duplicados y de otra edición en vez de cambiar las preguntas',()=>{
 assert.equal(readChallenge('',bank),null);
 for(const query of ['?reto=','?reto=x&banco=old','?reto=x&reto=y&banco='+bankVersion(bank),'?reto=%3Cscript%3E&banco='+bankVersion(bank)])assert.ok(readChallenge(query,bank).error);
 const edited=bank.map((q,i)=>i? q:{...q,explicacion:'Actualizada'});
 assert.ok(readChallenge(challengeUrl(bank,'a').split('?')[1],edited).error);
});
test('el repaso persiste errores, evita duplicados, elimina aciertos y limita el historial',()=>{
 let queue=[];queue=updateReview(queue,bank[0],false);queue=updateReview(queue,bank[0],false);assert.equal(queue.length,1);
 const storage=store();assert.equal(saveReview(storage,queue),true);assert.deepEqual(readReview(storage,byId,bank),queue);
 assert.deepEqual(updateReview(queue,bank[0],true),[]);
 for(const q of bank)queue=updateReview(queue,q,false);assert.equal(queue.length,100);
 assert.equal(queue.at(-1).firma,bank.at(-1).firma);
});
test('datos de almacenamiento inválidos o bloqueados no impiden jugar',()=>{
 for(const initial of ['{','null','{}','[null]',JSON.stringify([{...bank[0],fuentes:['javascript:alert(1)']}]),JSON.stringify([{...bank[0],atlasUrl:'https://outside.test'}])])assert.deepEqual(readReview(store(initial),byId,bank),[]);
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
 assert.deepEqual(readReview(blocked,byId,bank),[]);assert.equal(saveReview(blocked,bank),false);assert.equal(saveReview(null,[]),false);
});
test('un repaso de sucesión recupera la explicación vigente y descarta relevos retirados',()=>{
 const storage=store(JSON.stringify([{...bank[0],explicacion:'Antigua'}, {...bank[1],firma:'retirado'}]));
 const loaded=readReview(storage,byId,bank);assert.equal(loaded.length,1);assert.equal(loaded[0].explicacion,bank[0].explicacion);
});

test('el repaso vuelve a mezclar las opciones y no coloca sistemáticamente la correcta primero',()=>{
 const q=bank[0], copy=JSON.stringify(q), practice=reviewQuestions([q],()=>0)[0];
 assert.notEqual(practice.opciones[0].id,q.correctaId);
 assert.deepEqual(practice.opciones.map(o=>o.id).sort(),q.opciones.map(o=>o.id).sort());
 assert.equal(JSON.stringify(q),copy);assert.equal(practice.correctaId,q.correctaId);
});
