import {englishRoute} from '../english/routes.js';
import {packPage, parsePage} from './pageTransport.js';
export {parsePage} from './pageTransport.js';
// Sin dependencias del DOM: también se utiliza para validar el HTML generado.
export const STATIC_SCHEMA = 2;
export const STATIC_DATA_ID = 'eade-initial-page';
export const STATIC_FOLDERS = {persona:'personas-meta',dinastia:'dinastias-meta',territorio:'territorios-meta',historia:'historias-meta',english:'english-meta',catalogo:'catalogos'};
// 6.0.10: the Spanish home, its catalogues and the A–Z people index (both
// languages) are also served as static HTML, so that every record is reachable
// through plain links. Slug = data file in /catalogos.
export const CATALOG_ROUTES = Object.freeze({'/es':'inicio','/es/personas':'personas','/es/dinastias':'dinastias','/es/territorios':'territorios','/es/historias':'historias','/es/personas/indice':'indice','/en/people/a-z':'index-en'});
export function staticRoute(pathname) {
 const clean=String(pathname).replace(/(.)\/$/,'$1');
 if(Object.hasOwn(CATALOG_ROUTES,clean))return {kind:'catalogo',slug:CATALOG_ROUTES[clean],chapter:null,path:clean};
 const english=englishRoute(pathname);if(english)return english;
 const story=String(pathname).match(/^\/es\/historia\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/capitulo\/([1-9][0-9]*))?\/?$/);
 if(story)return {kind:'historia',slug:story[1],chapter:story[2]?Number(story[2]):null,path:`/es/historia/${story[1]}${story[2]?`/capitulo/${story[2]}`:''}`};
 const match=String(pathname).match(/^\/es\/(persona|dinastia|territorio)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
 return match?{kind:match[1],slug:match[2],path:`/es/${match[1]}/${match[2]}`}:null;
}
export function validatePage(page) {
 const route=staticRoute(page?.path);
 if(page?.schema!==STATIC_SCHEMA||!route||route.kind!==page.kind||route.slug!==page.slug||typeof page.data?.nombre!=='string'||!page.data.nombre.trim())return false;
 if(typeof page.data.slug!=='string'||!page.data.slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))return false;
 if(page.kind!=='dinastia'&&page.data.slug!==page.slug)return false;
 if(page.kind==='english')return page.data.path===route.path&&page.chapter===route.chapter&&page.data.chapter===route.chapter&&['home','about','stories','people','methodology','licences','acknowledgements','person','story','dynasty','territory','dynasties','territories','challenge'].includes(page.data.type)&&(page.data.type!=='story'||Array.isArray(page.data.pasos)&&page.data.pasos.length>0&&(!page.chapter||page.chapter<=page.data.pasos.length)&&Array.isArray(page.data.protagonists));
 if(page.kind==='historia')return page.chapter===route.chapter&&page.data.chapter===route.chapter&&Array.isArray(page.data.pasos)&&page.data.pasos.length>0&&(!page.chapter||page.chapter<=page.data.pasos.length)&&['protagonists','fuentes'].every(k=>Array.isArray(page.data[k]));
 if(page.kind==='catalogo')return page.slug==='inicio'?typeof page.data.stats==='object'&&page.data.stats!==null:Array.isArray(page.data.items)&&page.data.items.length>0;
 if(page.kind==='persona')return typeof page.data.id==='string'&&Array.isArray(page.data.gobiernos)&&Array.isArray(page.data.fuentes)&&!['reinados','reinado','conyuge','conyuge2'].some(field=>Object.hasOwn(page.data,field));
 if(page.kind==='dinastia')return ['miembros','ramas','gobiernos','fuentes','territorios','protagonistas'].every(k=>Array.isArray(page.data[k]));
 return ['gobiernos','personas','fuentes','dinastias','historias','eventos','relacionados','componentes'].every(k=>Array.isArray(page.data[k]));
}
export function initialPageForLocation(page,pathname,search='') {
 const params=new URLSearchParams(search);
 if(params.get('atlas')==='1')return null;
 // The SPA also opens panels and legacy ?persona= links from the home page.
 if(page?.kind==='catalogo'&&page.slug==='inicio'&&(params.has('panel')||params.has('persona')))return null;
 const route=staticRoute(pathname);
 return validatePage(page)&&route?.path===page.path?page:null;
}
export function readInitialPage(document,location) {
 const element=document.getElementById(STATIC_DATA_ID);
 if(!element)return null;
 try{return initialPageForLocation(parsePage(element.textContent),location.pathname,location.search);}catch{return null;}
}
export const serializePage = (page,compact=true) => JSON.stringify(compact?packPage(page):page).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
