import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import {act} from 'react';
import {build} from 'vite';
const root=fileURLToPath(new URL('../',import.meta.url));
const dom=new JSDOM('<div id="root"></div>',{url:'https://treeofeurope.eu/es/?atlas=1&vista=arbol&vinculos=sangre&conectar=TOMASFRANCISCOSAB&conectar=CARLOSEMANUEL1SAB&conectar=EMANUELFILIBERTOCAR',pretendToBeVisual:true});
for(const name of ['window','document','navigator','HTMLElement','HTMLInputElement','Event','MouseEvent'])Object.defineProperty(globalThis,name,{value:name==='window'?dom.window:dom.window[name],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);
class Observer{observe(){}unobserve(){}disconnect(){}}
globalThis.ResizeObserver=window.ResizeObserver=Observer;globalThis.IntersectionObserver=window.IntersectionObserver=Observer;
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
window.HTMLElement.prototype.scrollTo=function(o){this.scrollLeft=o?.left||0;this.scrollTop=o?.top||0;};window.HTMLElement.prototype.scrollBy=function(){};window.HTMLElement.prototype.scrollIntoView=function(){};
window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
const originalFetch=globalThis.fetch;globalThis.fetch=async url=>{const data=JSON.parse(await fs.readFile(path.join(root,'public',String(url).replace(/^\//,'')),'utf8'));return {ok:true,json:async()=>data};};
let runtime,temp,app,treeBase,downloads=[];
const originalObjectUrl=URL.createObjectURL,originalRevoke=URL.revokeObjectURL;
before(async()=>{
 const nodeEnv=process.env.NODE_ENV;temp=await fs.mkdtemp(path.join(root,'.connections-test-'));
 await build({root,configFile:false,publicDir:false,logLevel:'error',plugins:[{name:'unchanged-map-not-mounted',enforce:'pre',resolveId(id){if(/generated\/(home|siteMeta)\.json$/.test(id))return '\0home-fixture:'+id+'.js';if(id.endsWith('/MapaEuropa')||id.endsWith('/MapaEuropa.jsx'))return '\0map-fixture.js';},load(id){if(id.startsWith('\0home-fixture:'))return 'export default {buildVersion:"test"}';if(id==='\0map-fixture.js')return 'export function MapaEuropa(){return null}';}}],build:{ssr:'tests/fixtures/connections-entry.jsx',outDir:temp,emptyOutDir:false,minify:false,rolldownOptions:{output:{entryFileNames:'entry.mjs'}}}});
 if(nodeEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=nodeEnv;
 runtime=await import(pathToFileURL(path.join(temp,'entry.mjs')).href);
 treeBase=runtime.makeTreeBase();
 URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:fixture';};URL.revokeObjectURL=()=>{};window.HTMLAnchorElement.prototype.click=function(){};
});
after(async()=>{if(app)await act(async()=>app.unmount());dom.window.close();globalThis.fetch=originalFetch;URL.createObjectURL=originalObjectUrl;URL.revokeObjectURL=originalRevoke;if(temp)await fs.rm(temp,{recursive:true,force:true});});
const click=async button=>{assert.ok(button,'control existente');await act(async()=>{button.click();await new Promise(r=>setTimeout(r,40));});};
const button=text=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
test('Atlas real: enlace de rama, búsqueda, retirada, exportación y salida conservan el estado',async()=>{
 window.sessionStorage.clear();window.localStorage.clear();const errors=[],originalError=console.error;console.error=(...args)=>errors.push(args.join(' '));
 try{
 await act(async()=>{app=runtime.mountAtlas(document.getElementById('root'),treeBase);await new Promise(r=>setTimeout(r,100));});
 assert.equal(document.querySelectorAll('.connection-chip').length,3);assert.match(document.querySelector('.connection-status').textContent,/conexión mínima/);
 assert.equal(document.querySelectorAll('.svg-overlay path').length,2);assert.equal(new URLSearchParams(window.location.search).getAll('conectar').length,3);
 const input=document.querySelector('.connection-search input');await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,'Catalina Micaela');input.dispatchEvent(new window.Event('input',{bubbles:true}));});
 await click(document.querySelector('.connection-search li button'));assert.equal(document.querySelectorAll('.connection-chip').length,4);
 await click(document.querySelector('[aria-label="Quitar Catalina Micaela de España"]'));assert.equal(document.querySelectorAll('.connection-chip').length,3);
 await click(document.querySelector('[aria-label="Exportar el árbol"]'));assert.ok(document.querySelector('dialog[open]'));await click(button('Descargar SVG'));assert.equal(downloads[0].type,'image/svg+xml;charset=utf-8');const svg=await downloads[0].text();assert.match(svg,/Tomás Francisco/);assert.match(svg,/El Árbol de Europa/);await click(document.querySelector('[aria-label="Cerrar exportación"]'));
 await click(button('Conectar personas'));assert.equal(document.querySelector('.connection-controls'),null);assert.equal(new URLSearchParams(window.location.search).has('conectar'),false);
 await click(button('Ayuda'));assert.equal(document.querySelectorAll('.atlas-guide-courses li').length,8);
 await click(document.querySelector('.atlas-guide-courses li button'));
 await click(button('Buscar a Carlos V'));assert.equal(document.getElementById('atlas-guide-body').hidden,true);
 assert.equal(document.getElementById('atlas-person-search').value,'Carlos V');
 await click(document.querySelector('[aria-label="Desplegar guía"]'));
 await click(button('Siguiente →'));await click(button('Mostrar a Carlos V'));
 assert.match(document.querySelector('.atlas-guide h3').textContent,/Abre su ficha/);
 assert.equal(document.querySelectorAll('.atlas-guide-tabs button').length,3);
 await click(document.querySelector('[aria-label="Cerrar guía"]'));assert.equal(document.querySelector('.atlas-guide'),null);
 assert.equal(button('Siguiente hito'),undefined);
 assert.equal(document.querySelector('.atlas-panels-menu [aria-label="Paneles visibles"]')?.querySelectorAll('button').length,3);
 await click(document.querySelector('.atlas-tools-menu summary'));
 assert.equal(document.querySelector('.atlas-tools-menu [aria-label="Herramientas del Atlas"]')?.textContent.includes('Paneles'),false);
 await click(button('Pantalla de trabajo'));
 assert.ok(document.querySelector('.tree-toolbar [aria-label="Exportar el árbol"]'));
 assert.deepEqual(errors.filter(e=>!e.includes('not wrapped in act')),[]);
 }finally{console.error=originalError;}
});

test('el tutorial practica, se pliega y reanuda sin repetir acciones ni perder el foco',async()=>{
 if(app){await act(async()=>app.unmount());app=null;}
 document.getElementById('root').innerHTML='';
 window.history.replaceState(null,'','/es/?atlas=1&persona=CARLOS5&seleccion=&dinastia=Valois');
 window.sessionStorage.clear();window.localStorage.clear();
 window.localStorage.setItem('eade:atlas-tutorial:v1','corrupto');
 await act(async()=>{app=runtime.mountAtlas(document.getElementById('root'),treeBase);await new Promise(r=>setTimeout(r,100));});
 const help=button('Ayuda');help.focus();await click(help);
 await click(document.querySelectorAll('.atlas-guide-courses li button')[1]);
 await click(button('Mostrar a Carlos V'));
 assert.match(document.querySelector('.atlas-guide h3').textContent,/Parte de una persona/,'practicar no avanza el paso');
 await click(button('Siguiente →'));
 assert.ok(button('Retirar filtros del ejemplo'),'el ejemplo detecta los filtros existentes');
 await click(button('Retirar filtros del ejemplo'));assert.equal(document.querySelector('.atlas-guide-context'),null);
 await click(button('Añadir familia de Carlos V'));
 const count=Number(document.querySelector('.tree-scope-label').textContent.match(/\d+/)?.[0]);assert.ok(count>1);
 assert.match(document.querySelector('.atlas-guide-status').textContent,/ya está en el árbol/);
 await click(document.querySelector('[aria-label="Plegar guía"]'));
 assert.equal(document.getElementById('atlas-guide-body').hidden,true);
 await click(document.querySelector('[aria-label="Desplegar guía"]'));
 await act(async()=>{document.querySelector('.atlas-guide').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await new Promise(r=>setTimeout(r,40));});
 assert.equal(document.querySelector('.atlas-guide'),null);assert.equal(document.activeElement,help);
 await click(help);assert.match(document.querySelectorAll('.atlas-guide-courses li button')[1].textContent,/Reanudar/);
 await click(document.querySelectorAll('.atlas-guide-courses li button')[1]);
 assert.match(document.querySelector('.atlas-guide h3').textContent,/Añade la familia cercana/);
 assert.equal(Number(document.querySelector('.tree-scope-label').textContent.match(/\d+/)?.[0]),count,'reanudar no vuelve a ampliar');
 await click(button('Siguiente →'));await click(button('Mostrar a Felipe el Hermoso'));
 assert.equal(window.history.state.id,'FEL1CAST');
 await click(document.querySelector('[aria-label="Desplegar guía"]'));
 await click(button('← Todos los recorridos'));await click(document.querySelectorAll('.atlas-guide-courses li button')[2]);
 await click(button('Siguiente →'));
 assert.ok(button('Primero mostrar a Carlos V'),'se adapta si cambió la persona');await click(button('Primero mostrar a Carlos V'));
 await click(button('Ir al año 1500'));assert.equal(document.querySelector('.global-year-number').value,'1500');
 await click(button('Siguiente →'));assert.equal(document.querySelector('.global-year-number').value,'1500','avanzar no cambia el año');
 await click(button('Ir al año 1530'));assert.equal(document.querySelector('.global-year-number').value,'1530');
 await click(button('Siguiente →'));await click(button('Mostrar cronología'));assert.ok(document.querySelector('.atlas-timeline'));
 await click(button('Completar recorrido →'));assert.match(document.querySelectorAll('.atlas-guide-courses li')[2].textContent,/Completado/);
 await click(button('Guía de lectura'));assert.ok(document.querySelector('#atlas-help-mapas'));assert.match(document.querySelector('#atlas-help-mapas').textContent,/conjuntos de poder exterior/);
 await click(document.querySelector('[aria-label="Cerrar guía"]'));
});

test('los recorridos avanzados usan conexiones, filtros, favoritos y la exportación existentes',async()=>{
 if(app){await act(async()=>app.unmount());app=null;}
 document.getElementById('root').innerHTML='';window.history.replaceState(null,'','/es/?atlas=1&persona=CARLOS5&seleccion=CARLOS5');
 window.sessionStorage.clear();window.localStorage.clear();
 const errors=[],originalError=console.error;console.error=(...args)=>errors.push(args.join(' '));
 try{
  await act(async()=>{app=runtime.mountAtlas(document.getElementById('root'),treeBase);await new Promise(r=>setTimeout(r,100));});
  await click(button('Ayuda'));
  await click(document.querySelectorAll('.atlas-guide-courses li button')[3]);await click(button('Conectar a Carlos V y Felipe II'));
  assert.equal(document.getElementById('atlas-guide-body').hidden,true);
  assert.match(window.location.search,/conectar=CARLOS5/);assert.match(window.location.search,/conectar=FEL2ESP/);
  await click(document.querySelector('[aria-label="Desplegar guía"]'));await click(button('Siguiente →'));await click(button('Probar la conexión de sangre'));
  assert.match(window.location.search,/vinculos=sangre/);
  await click(document.querySelector('[aria-label="Desplegar guía"]'));await click(button('Siguiente →'));await click(button('Conectar tres generaciones'));
  assert.match(window.location.search,/conectar=JUANA1CAST/);
  await click(document.querySelector('[aria-label="Desplegar guía"]'));await click(button('Siguiente →'));await click(button('Salir de Conectar personas'));
  assert.doesNotMatch(window.location.search,/conectar=/);
  await click(document.querySelector('[aria-label="Desplegar guía"]'));await click(button('← Todos los recorridos'));
  await click(document.querySelectorAll('.atlas-guide-courses li button')[5]);await click(button('Siguiente →'));await click(button('Primero mostrar a Carlos V'));await click(button('Filtrar por Habsburgo'));
  await click(document.querySelector('[aria-label="Desplegar guía"]'));await click(button('Siguiente →'));await click(button('Ver Habsburgo que gobernaban Castilla en 1530'));
  assert.equal(document.querySelector('.global-year-number').value,'1530');
  assert.match(document.querySelector('.filter-active-overview-values').textContent,/Habsburgo/);assert.match(document.querySelector('.filter-active-overview-values').textContent,/Castilla/);
  await click(document.querySelector('[aria-label="Desplegar guía"]'));await click(button('Siguiente →'));await click(button('Retirar filtros'));
  assert.equal(document.querySelector('.filter-active-overview-values').textContent.trim(),'Ninguno');
  await click(button('← Todos los recorridos'));await click(document.querySelectorAll('.atlas-guide-courses li button')[7]);await click(button('Guardar a Carlos V en favoritos'));await click(button('Guardar a Carlos V en favoritos'));
  assert.match(document.querySelector('.atlas-guide-status').textContent,/guardado en tus favoritos/);
  await click(button('Siguiente →'));await click(button('Siguiente →'));await click(button('Abrir Exportar árbol'));
  assert.ok(document.querySelector('dialog[open]'));await click(button('Descargar SVG'));assert.match(await downloads.at(-1).text(),/Carlos V/);
  await click(document.querySelector('[aria-label="Cerrar exportación"]'));assert.ok(document.querySelector('.atlas-guide'));
  await click(button('Siguiente →'));await click(button('Abrir Mis favoritos'));assert.match(document.querySelector('.favorites-menu').textContent,/Carlos V/);
 }finally{console.error=originalError;}
 assert.deepEqual(errors,[]);
});

test('una persona encontrada amplía el árbol en un clic y cada ampliación se puede deshacer',async()=>{
 if(app){await act(async()=>app.unmount());app=null;}
 document.getElementById('root').innerHTML='';
 window.history.replaceState(null,'','/es/?atlas=1&seleccion=');
 window.sessionStorage.clear();window.localStorage.clear();
 await act(async()=>{app=runtime.mountAtlas(document.getElementById('root'),treeBase);await new Promise(r=>setTimeout(r,100));});
 const input=document.querySelector('.workspace-toolbar-search input');
 await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,'Carlos V');input.dispatchEvent(new window.Event('input',{bubbles:true}));});
 const result=[...document.querySelectorAll('.atlas-search-results button')].find(item=>item.querySelector('span')?.textContent==='Carlos V');
 await click(result);
 assert.equal(document.querySelector('.tree-scope-label').textContent.trim(),'0 personas');
 // The close family is expanded from the biography; the toolbar no longer repeats it.
 await click([...document.querySelectorAll('.bio-tabs button')].find(item=>item.textContent==='Familia'));
 assert.match(document.querySelector('.bio-family-actions .family-add-button').textContent,/Familia cercana\s*\+\d+/);
 await click(document.querySelector('.bio-family-actions .family-add-button'));
 const closeFamilyCount=Number(document.querySelector('.tree-scope-label').textContent.match(/\d+/)?.[0]);
 assert.ok(closeFamilyCount>1);
 assert.match(document.querySelector('.family-expansion-feedback').textContent,/Se añadieron/);
 await click([...document.querySelectorAll('.bio-tabs button')].find(item=>item.textContent==='Familia'));
 const descendants=[...document.querySelectorAll('.bio-family-actions button')].find(item=>item.textContent.includes('Descendientes'));
 assert.ok(descendants,'la rama adicional está visible junto a la biografía');
 await click(descendants);
 assert.ok(Number(document.querySelector('.tree-scope-label').textContent.match(/\d+/)?.[0])>closeFamilyCount);
 await click(document.querySelector('.family-expansion-feedback button'));
 assert.equal(Number(document.querySelector('.tree-scope-label').textContent.match(/\d+/)?.[0]),closeFamilyCount);
 await click(document.querySelector('.atlas-panels-menu summary'));
 await click([...document.querySelectorAll('.atlas-panels-menu button')].find(item=>item.textContent==='Filtros'));
 await click(document.querySelector('.atlas-scope button:last-child'));
 assert.equal(document.querySelector('.tree-scope-label').textContent.trim(),'0 personas');
});

test('Europa es una vista del Atlas: agrupa títulos, abre una persona y restaura año y selección al volver',async()=>{
 if(app){await act(async()=>app.unmount());app=null;}
 document.getElementById('root').innerHTML='';
 const initial='/es/?atlas=1&escena=europa&anio=1530&persona=CARLOS5&seleccion=CARLOS5';
 window.history.replaceState(null,'',initial);window.sessionStorage.clear();window.localStorage.clear();window.scrollTo=()=>{};
 const errors=[],originalError=console.error;console.error=(...args)=>errors.push(args.join(' '));
 try {
  await act(async()=>{app=runtime.mountAtlas(document.getElementById('root'),treeBase);await new Promise(r=>setTimeout(r,100));});
  assert.equal(document.querySelector('.europe-heading h1')?.textContent,'Europa en 1530');
  assert.equal(document.querySelector('.atlas-traditional').hidden,true);
  assert.match(document.querySelector('.atlas-timeline-heading').textContent,/2723 personas/);
  assert.equal(document.querySelector('[aria-modal="true"]'),null);
  const search=document.querySelector('.europe-governments input');
  await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(search,'Carlos V');search.dispatchEvent(new window.Event('input',{bubbles:true}));});
  assert.deepEqual([...document.querySelectorAll('.europe-ruler-grid h4')].map(n=>n.textContent),['Monarquía Hispánica','Sacro Imperio (Alemania)']);
  await click(document.querySelector('.europe-ruler-grid .europe-ruler>button'));
  // The scenes slide for 650ms; the outgoing one is removed when it settles.
  await act(async()=>{await new Promise(r=>setTimeout(r,700));});
  assert.equal(document.querySelector('.europe-heading'),null);assert.equal(document.querySelector('.atlas-traditional').hidden,false);
  assert.equal(new URLSearchParams(window.location.search).has('escena'),false);
  assert.match(document.querySelector('.atlas-visually-hidden[role="status"]').textContent,/Carlos V/);
  await act(async()=>{window.history.replaceState(null,'',initial);window.dispatchEvent(new window.PopStateEvent('popstate'));await new Promise(r=>setTimeout(r,700));});
  assert.equal(document.querySelector('.europe-heading h1')?.textContent,'Europa en 1530');
  assert.match(document.querySelector('.atlas-visually-hidden[role="status"]').textContent,/Carlos V/);
  const axis=document.querySelector('.atlas-timeline-axis');
  await act(async()=>{axis.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));});
  assert.equal(document.querySelector('.europe-heading h1').textContent,'Europa en 1531');
  assert.equal(new URLSearchParams(window.location.search).get('anio'),'1531');assert.match(document.title,/Europa en 1531/);
  const timeline=document.querySelector('.atlas-timeline-scroll');
  await act(async()=>{
   timeline.dispatchEvent(new window.MouseEvent('pointerdown',{button:0,buttons:1,clientX:200,bubbles:true}));
   timeline.dispatchEvent(new window.MouseEvent('pointermove',{buttons:1,clientX:170,bubbles:true}));
   timeline.dispatchEvent(new window.MouseEvent('pointerup',{button:0,buttons:0,clientX:170,bubbles:true}));
  });
  const afterDrag=timeline.scrollLeft;
  await act(async()=>{timeline.dispatchEvent(new window.MouseEvent('pointermove',{buttons:0,clientX:130,bubbles:true}));});
  assert.equal(timeline.scrollLeft,afterDrag,'soltar el gesto impide que el hover siga arrastrando');

  assert.deepEqual(errors.filter(e=>!e.includes('not wrapped in act')),[]);
 } finally {console.error=originalError;}
});
