import {englishRoute} from '../english/routes.js';
// Sin dependencias del DOM: también se utiliza para validar el HTML generado.
export const STATIC_SCHEMA = 1;
export const STATIC_DATA_ID = 'eade-initial-page';
export const STATIC_FOLDERS = {persona:'personas-meta',dinastia:'dinastias-meta',territorio:'territorios-meta',historia:'historias-meta',english:'english-meta'};
export function staticRoute(pathname) {
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
 if(page.kind==='english')return page.data.path===route.path&&page.chapter===route.chapter&&page.data.chapter===route.chapter&&['home','about','stories','people','methodology','person','story'].includes(page.data.type)&&(page.data.type!=='story'||Array.isArray(page.data.pasos)&&page.data.pasos.length>0&&(!page.chapter||page.chapter<=page.data.pasos.length)&&Array.isArray(page.data.protagonists));
 if(page.kind==='historia')return page.chapter===route.chapter&&page.data.chapter===route.chapter&&Array.isArray(page.data.pasos)&&page.data.pasos.length>0&&(!page.chapter||page.chapter<=page.data.pasos.length)&&['protagonists','fuentes'].every(k=>Array.isArray(page.data[k]));
 if(page.kind==='persona')return typeof page.data.id==='string'&&Array.isArray(page.data.reinados)&&Array.isArray(page.data.fuentes);
 if(page.kind==='dinastia')return ['miembros','ramas','gobiernos','fuentes','territorios','protagonistas'].every(k=>Array.isArray(page.data[k]));
 return ['gobiernos','personas','fuentes','dinastias','historias','eventos','relacionados','componentes'].every(k=>Array.isArray(page.data[k]));
}
export function initialPageForLocation(page,pathname,search='') {
 if(new URLSearchParams(search).get('atlas')==='1')return null;
 const route=staticRoute(pathname);
 return validatePage(page)&&route?.path===page.path?page:null;
}
export function readInitialPage(document,location) {
 const element=document.getElementById(STATIC_DATA_ID);
 if(!element)return null;
 try{return initialPageForLocation(JSON.parse(element.textContent),location.pathname,location.search);}catch{return null;}
}
export const serializePage = page => JSON.stringify(page).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
