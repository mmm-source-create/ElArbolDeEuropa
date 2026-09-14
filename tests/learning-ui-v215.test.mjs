import test,{after, before} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React,{act} from 'react';
import {PERSONAS} from '../src/personas.jsx';
import {successionBank,challengeUrl,createChallenge,REVIEW_KEY} from '../src/desafio/learning.js';
import {crearDesafioDiario} from '../src/desafio/desafioEngine.jsx';
const dom=new JSDOM('<div id="root"></div>',{url:'https://treeofeurope.eu/es/desafio',pretendToBeVisual:true});
for(const name of ['window','document','navigator','HTMLElement','Event','MouseEvent'])Object.defineProperty(globalThis,name,{value:name==='window'?dom.window:dom.window[name],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let createRoot,Desafio,app;const bank=successionBank(PERSONAS);let opens=[];
window.open=(...args)=>opens.push(args);
before(async()=>{({createRoot}=await import('react-dom/client'));({default:Desafio}=await import('../src/desafio/Desafio.jsx'));});
after(async()=>{if(app)await act(async()=>app.unmount());dom.window.close();});
async function mount(search='') {if(app)await act(async()=>app.unmount());window.history.replaceState(null,'','/es/desafio'+search);await act(async()=>{app=createRoot(document.getElementById('root'));app.render(React.createElement(Desafio,{personas:PERSONAS}));});}
async function click(el) {assert.ok(el,'control disponible');await act(async()=>{el.click();});}
const button=text=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes(text));
const option=label=>[...document.querySelectorAll('.desafio-option')].find(b=>b.querySelector('strong').textContent===label);
// This file uses createElement so the tests remain plain Node modules.
test('partida compartida: explicación visible tras acertar y fallar, avance manual y resultado final',async()=>{
 window.localStorage.clear();const qs=createChallenge(bank,'ui-flow');await mount(challengeUrl(bank,'ui-flow').slice('/es/desafio'.length));
 assert.equal(document.querySelector('h2').textContent,qs[0].pregunta);
 assert.equal(document.querySelector('.desafio-fast-feedback'),null);
 const copied=document.querySelector('[aria-label="Enlace del desafío compartido"]').value;assert.match(copied,/reto=ui-flow/);
 for(let i=0;i<qs.length;i++){
  const q=qs[i];const chosen=i===0?q.opciones.find(o=>o.id!==q.correctaId):q.opciones.find(o=>o.id===q.correctaId);
  await click(option(chosen.label));
  assert.equal(document.querySelector('h2').textContent,q.pregunta);assert.match(document.querySelector('[role=status]').textContent,new RegExp(i===0?'No esta vez':'Correcto'));
  assert.ok(document.querySelector('.desafio-fast-feedback').textContent.includes(q.explicacion));
  assert.equal(document.querySelectorAll('.desafio-option:disabled').length,4);
  assert.equal(document.querySelector('.desafio-sources a').getAttribute('href'),q.fuentes[0]);
  if(i===0){await click(button('Ver en el Atlas'));assert.match(opens.at(-1)[0],/\?atlas=1$/);}
  await click(button('Continuar'));
 }
 assert.match(document.querySelector('.desafio-learning-end').textContent,/4 de 5/);
 assert.equal(JSON.parse(window.localStorage.getItem(REVIEW_KEY)).length,1);
 assert.equal(window.localStorage.getItem('arbol-europa-desafio-v2'),null);
});
test('el repaso sobrevive a recargar y un acierto lo elimina sin modificar récords',async()=>{
 const legacy={totalAciertos:42,precisionPreguntas:10,precisionAciertos:8};window.localStorage.setItem('arbol-europa-desafio-v2',JSON.stringify(legacy));
 const [q]=JSON.parse(window.localStorage.getItem(REVIEW_KEY));assert.ok(q);await mount();await click(button('Repasar errores'));
 assert.equal(document.querySelector('h2').textContent,q.pregunta);
 await click(option(q.opciones.find(o=>o.id===q.correctaId).label));await click(button('Continuar'));
 assert.deepEqual(JSON.parse(window.localStorage.getItem(REVIEW_KEY)),[]);assert.deepEqual(JSON.parse(window.localStorage.getItem('arbol-europa-desafio-v2')),legacy);
 await mount();await click(button('Repasar errores'));assert.match(document.querySelector('h2').textContent,/Todavía no hay errores/);
});
test('un enlace de otra edición muestra una salida clara y conserva los modos',async()=>{
 await mount('?reto=old&banco=unknown');assert.match(document.querySelector('[role=alert]').textContent,/otra edición/);assert.ok(button('Desafío compartido'));
});
test('el diario muestra la explicación hasta continuar y contabiliza una sola respuesta',async()=>{
 window.localStorage.clear();await mount();await click(button('Desafío diario'));
 const q=crearDesafioDiario(PERSONAS,new Date().toISOString().slice(0,10))[0];
 if(q.formato==='orden'){for(const id of q.ordenCorrecto)await click([...document.querySelectorAll('.desafio-order-card')].find(b=>b.querySelector('strong').textContent===q.opciones.find(o=>o.id===id).label));}
 else await click(option(q.opciones.find(o=>o.id===q.correctaId).label));
 assert.ok(document.querySelector('.desafio-fast-feedback').textContent.includes(q.explicacion));
 // Wait longer than the former automatic delay: the question must remain.
 await act(async()=>{await new Promise(r=>setTimeout(r,1200));});
 assert.equal(document.querySelector('h2').textContent,q.pregunta);
 assert.equal(JSON.parse(window.localStorage.getItem('arbol-europa-desafio-v2')).totalPreguntas,1);
 await click(button('Continuar'));assert.notEqual(document.querySelector('h2').textContent,q.pregunta);
});
test('El Camino y Racha mantienen la explicación y avanzan solo con Continuar',async()=>{
 for(const mode of ['El Camino','Racha']){
  await mount();await click(button(mode));const text=document.querySelector('h2').textContent;const options=[...document.querySelectorAll('.desafio-option strong')].map(x=>x.textContent).join('|');
  await click(document.querySelector('.desafio-option'));
  assert.ok(document.querySelector('.desafio-fast-feedback-detail p').textContent);
  await act(async()=>{await new Promise(r=>setTimeout(r,1500));});
  assert.equal(document.querySelector('h2').textContent,text);await click(button('Continuar'));assert.notEqual([...document.querySelectorAll('.desafio-option strong')].map(x=>x.textContent).join('|'),options);
 }
});
test('repasar una ordenación conserva el orden elegido y corrige sin puntuar',async()=>{
 const ids=PERSONAS.slice(0,3).map(p=>p.id);
 const q={firma:'orden:fixture',formato:'orden',tipo:'orden',pregunta:'Ordena estas tres personas',explicacion:'Orden de comprobación',ordenCorrecto:ids,opciones:ids.map(id=>({id,label:PERSONAS.find(p=>p.id===id).nombre}))};
 window.localStorage.clear();window.localStorage.setItem(REVIEW_KEY,JSON.stringify([q]));await mount();await click(button('Repasar errores'));
 for(const id of ids)await click([...document.querySelectorAll('.desafio-order-card')].find(b=>b.querySelector('strong').textContent===q.opciones.find(o=>o.id===id).label));
 assert.match(document.querySelector('.desafio-fast-feedback').textContent,/Correcto/);
 assert.equal(window.localStorage.getItem('arbol-europa-desafio-v2'),null);assert.deepEqual(JSON.parse(window.localStorage.getItem(REVIEW_KEY)),[]);
});
test('Retratos mantiene la explicación del acierto y espera a Continuar',async()=>{
 const {IMAGENES_PERSONAS}=await import('../src/imagenesPersonas.js');
 window.localStorage.clear();await mount();await click(button('Retratos'));
 const source=document.querySelector('.desafio-portrait-stage img').getAttribute('src');
 const person=PERSONAS.find(p=>IMAGENES_PERSONAS[p.id]?.archivo===source);assert.ok(person);
 const input=document.querySelector('.desafio-name-input input');
 await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,person.nombre);input.dispatchEvent(new window.Event('input',{bubbles:true}));});
 await click([...document.querySelectorAll('.desafio-name-suggestions button')].find(b=>b.querySelector('strong').textContent===person.nombre));
 assert.ok(document.querySelector('.desafio-fast-feedback').textContent.includes(person.nombre));
 await act(async()=>{await new Promise(r=>setTimeout(r,800));});assert.equal(document.querySelector('.desafio-portrait-stage img').getAttribute('src'),source);
 await click(button('Continuar'));assert.notEqual(document.querySelector('.desafio-portrait-stage img').getAttribute('src'),source);
});
