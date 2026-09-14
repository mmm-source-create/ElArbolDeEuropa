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
 await click(button('Comparar parentesco'));assert.equal(document.querySelector('.connection-controls'),null);assert.equal(new URLSearchParams(window.location.search).has('conectar'),false);
 assert.deepEqual(errors.filter(e=>!e.includes('not wrapped in act')),[]);
 }finally{console.error=originalError;}
});
