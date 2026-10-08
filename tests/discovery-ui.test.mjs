import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import React, {act} from 'react';
import {renderToString} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import HomeDiscovery, {DiscoveryCarousel, DynastyMarquee} from '../src/public/HomeDiscovery.jsx';
import SegmentedControl from '../src/ui/SegmentedControl.jsx';
import ActionDial from '../src/ui/ActionDial.jsx';
import Odometer from '../src/ui/Odometer.jsx';
import ProgressMeter from '../src/ui/ProgressMeter.jsx';

const dom = new JSDOM('<div id="root"></div>', {url:'https://treeofeurope.eu/es/', pretendToBeVisual:true});
for (const name of ['window','document','navigator','HTMLElement','Event','MouseEvent','KeyboardEvent','MutationObserver']) {
  Object.defineProperty(globalThis,name,{value:name==='window'?dom.window:dom.window[name],configurable:true,writable:true});
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
window.matchMedia = () => ({matches:false,addEventListener(){},removeEventListener(){}});
const node = document.getElementById('root');
let createRoot, hydrateRoot, app;
before(async()=>{({createRoot,hydrateRoot}=await import('react-dom/client'));});
after(async()=>{if(app) await act(async()=>app.unmount()); dom.window.close();});
async function mount(component) {
  if(app) await act(async()=>app.unmount());
  await act(async()=>{app=createRoot(node); app.render(component);});
}
async function click(button) {await act(async()=>button.click());}
async function key(button,key) {await act(async()=>button.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true})));}
const people = [{id:'CARLOS5',nombre:'Carlos V',slug:'carlos-v',dinastia:'Habsburgo',nac:1500,muer:1558}];
const stories = [{id:'emperadores',titulo:'Los emperadores',slug:'los-emperadores',pasos:19,descripcion:'Un recorrido por el Imperio.'}];

test('el carrusel conserva sus enlaces en el servidor y las pestañas se hidratan sin sustituirlo',async()=>{
  if(app) await act(async()=>app.unmount()); app=null;
  const component=React.createElement(HomeDiscovery,{people,stories,peoplePath:'/es/personas',storiesPath:'/es/historias'});
  node.innerHTML=renderToString(component);
  const heading=node.querySelector('h2'), profile=node.querySelector('a[href="/es/persona/carlos-v"]');
  assert.ok(profile,'La puerta funciona antes de cargar JavaScript');
  const errors=[];
  await act(async()=>{app=hydrateRoot(node,component,{onRecoverableError:error=>errors.push(error.message)});});
  assert.equal(node.querySelector('h2'),heading);
  assert.equal(node.querySelector('a[href="/es/persona/carlos-v"]'),profile);
  const tabs=node.querySelectorAll('[role=tab]');
  await key(tabs[0],'ArrowRight');
  assert.equal(tabs[1].getAttribute('aria-selected'),'true');
  assert.equal(document.activeElement,tabs[1]);
  assert.equal(node.querySelectorAll('[role=tabpanel]')[0].hidden,true);
  assert.equal(node.querySelectorAll('[role=tabpanel]')[1].hidden,false);
  assert.ok(node.querySelector('a[href="/es/historia/los-emperadores"]'));
  await key(tabs[1],'Home');
  assert.equal(tabs[0].getAttribute('aria-selected'),'true');
  assert.deepEqual(errors,[]);
});

test('los enlaces traducidos mantienen su destino y un carrusel vacío no inventa un contador',async()=>{
  await mount(React.createElement(HomeDiscovery,{locale:'en',people:[{...people[0],path:'/en/person/charles-v'}],stories:[{...stories[0],nombre:'The emperors',path:'/en/story/the-emperors'}]}));
  assert.ok(node.querySelector('a[href="/en/person/charles-v"]'));
  await click(node.querySelectorAll('[role=tab]')[1]);
  assert.ok(node.querySelector('a[href="/en/story/the-emperors"]'));
  await mount(React.createElement(DiscoveryCarousel,{items:[],renderItem:()=>null,label:'Vacío'}));
  assert.equal(node.textContent,'');
});

test('el último elemento avanza al primero y el primero retrocede al último sin duplicar enlaces de teclado',async()=>{
  await mount(React.createElement(DiscoveryCarousel,{items:[{id:'a'},{id:'b'},{id:'c'}],renderItem:item=>React.createElement('a',{href:`/${item.id}`},item.id),label:'Puertas'}));
  const track=node.querySelector('.home-carousel-track'), moves=[];
  Object.defineProperty(track,'clientWidth',{value:200,configurable:true});
  [...track.children].forEach((card,index)=>Object.defineProperty(card,'offsetLeft',{value:index*200}));
  track.scrollTo=({left,behavior})=>{moves.push({left,behavior});track.scrollLeft=left;track.dispatchEvent(new Event('scroll'));};
  await act(async()=>window.dispatchEvent(new Event('resize')));
  const [previous,next]=node.querySelectorAll('.home-carousel-navigation button');
  const counter=()=>node.querySelector('.home-carousel-count').textContent;
  const finish=()=>act(async()=>track.dispatchEvent(new Event('scrollend')));
  assert.equal(previous.disabled,false);assert.equal(next.disabled,false);
  assert.equal(node.querySelectorAll('.home-carousel-slide:not([aria-hidden]) a').length,3);
  assert.ok([...node.querySelectorAll('.home-carousel-slide[aria-hidden] a')].every(a=>a.tabIndex===-1));
  await click(next);await finish();assert.match(counter(),/^02/);
  await key(track,'ArrowRight');await finish();assert.match(counter(),/^03/);
  const before=track.scrollLeft;
  await click(next);assert.ok(moves.at(-1).left>before,'El paso al primero mantiene la dirección de avance');
  await finish();assert.match(counter(),/^01/);
  await click(previous);await finish();assert.match(counter(),/^03/);
  const last=track.scrollLeft;
  await key(track.querySelector('a'),'ArrowRight');assert.equal(track.scrollLeft,last,'No intercepta teclas de enlaces internos');
});

test('los controles del Atlas responden al teclado desde la opción enfocada',async()=>{
  let selected='arbol';
  const options=[{value:'arbol',label:'Árbol'},{value:'mapa',label:'Mapa'},{value:'ambos',label:'Ambos'}];
  await mount(React.createElement(SegmentedControl,{options,value:selected,label:'Vista',onChange:value=>{selected=value;}}));
  const buttons=node.querySelectorAll('button');
  await key(buttons[1],'ArrowRight');assert.equal(selected,'ambos');assert.equal(document.activeElement,buttons[2]);
  await key(buttons[2],'Home');assert.equal(selected,'arbol');
});

test('las acciones rápidas reciben foco, se cierran con Escape y ejecutan una sola acción',async()=>{
  let count=0;
  const Icon=()=>React.createElement('svg');
  await mount(React.createElement(ActionDial,{actions:[{id:'disabled',label:'No disponible',Icon,disabled:true},{id:'center',label:'Centrar',Icon,onClick:()=>count++}]}));
  const trigger=node.querySelector('.ui-action-dial-trigger');
  await click(trigger);
  assert.equal(trigger.getAttribute('aria-expanded'),'true');
  assert.equal(document.activeElement.textContent,'Centrar');
  await key(document.activeElement,'Escape');
  assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(document.activeElement,trigger);
  await click(trigger);await click(document.activeElement);
  assert.equal(count,1);assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(document.activeElement,trigger);
});

test('las cifras y el progreso anuncian sus valores reales, incluso sin movimiento',async()=>{
  document.documentElement.dataset.eadeMotion='reduce';
  await mount(React.createElement('div',null,React.createElement(Odometer,{value:2483}),React.createElement(ProgressMeter,{value:3,max:5,label:'Respondidas',className:'lesson-progress'})));
  assert.equal(node.querySelector('.ui-sr-only').textContent,new Intl.NumberFormat('es').format(2483));
  const progress=node.querySelector('[role=progressbar]');
  assert.equal(progress.getAttribute('aria-valuenow'),'3');assert.equal(progress.getAttribute('aria-valuemax'),'5');
  assert.ok(progress.classList.contains('lesson-progress'));
  assert.equal(progress.firstElementChild.style.transform,'scaleX(0.6)');
  await mount(React.createElement(Odometer,{value:undefined}));assert.equal(node.textContent,'—');
  await mount(React.createElement(DynastyMarquee,{dynasties:[{nombre:'Habsburgo',slug:'habsburgo'}]}));
  assert.ok(node.querySelector('.home-marquee').classList.contains('is-paused'));
  assert.equal(node.querySelector('button').disabled,true);
  assert.equal(node.querySelector('[aria-hidden=true] a').tabIndex,-1);
  await act(async()=>{delete document.documentElement.dataset.eadeMotion;});
});
