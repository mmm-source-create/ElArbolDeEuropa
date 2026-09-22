// Una sola definición de los metadatos para el HTML de compilación y el navegador.
import {translatedEquivalent} from '../english/routes.js';
import {SITE_NAME, DEFAULT_SITE_URL} from '../siteConfig.js';
export {DEFAULT_SITE_URL} from '../siteConfig.js';
export function publicMeta({title,description,path='/es/'},siteUrl=DEFAULT_SITE_URL) {
 const canonical=new URL(path,siteUrl).href;
 const lang=path.startsWith('/en/')?'en':'es';
 const equivalent=translatedEquivalent(path,lang==='en'?'es':'en');
 const alternates=[{hreflang:lang,href:canonical},...(equivalent?[{hreflang:lang==='en'?'es':'en',href:new URL(equivalent,siteUrl).href}]:[]),{hreflang:'x-default',href:lang==='en'&&equivalent?new URL(equivalent,siteUrl).href:canonical}];
 return {title,description,path,canonical,lang,meta:[
  ['name','description',description],['property','og:site_name',SITE_NAME],
  ['property','og:title',title],['property','og:description',description],
  ['property','og:type','website'],['property','og:locale',lang==='en'?'en_GB':'es_ES'],['property','og:url',canonical],
  ['name','twitter:card','summary'],['name','twitter:title',title],['name','twitter:description',description],
 ],alternates};
}
export function entityMeta(kind,data,slug) {
 if(kind==='english')return {title:`${data?.nombre||'English edition'} — The Tree of Europe`,description:data?.description||'Explore European families and stories.',path:data?.path||'/en/'};
 if(kind==='historia')return {title:`${data?.nombre || 'Historia'} — ${SITE_NAME}`,description:(data?.chapter?data.pasos[data.chapter-1].texto:data?.descripcion||'Historias de Europa, capítulo a capítulo.').slice(0,155),path:`/es/historia/${encodeURIComponent(data?.slug||slug)}${data?.chapter?`/capitulo/${data.chapter}`:''}`};
 if(kind==='persona')return {
  title:data?`${data.nombre} — ${SITE_NAME}`:`Persona — ${SITE_NAME}`,
  description:data?(data.biografia||data.resumen||'').replace(/\s+/g,' ').trim().slice(0,155):'Ficha histórica en El Árbol de Europa.',
  path:`/es/persona/${encodeURIComponent(slug||'persona')}`,
 };
 if(kind==='dinastia')return {
  title:data?`Casa de ${data.nombre} — ${SITE_NAME}`:`Dinastía — ${SITE_NAME}`,
  description:data?.resumen||'Personas, ramas y territorios de una casa en el Atlas.',
  path:`/es/dinastia/${encodeURIComponent(data?.slug||slug)}`,
 };
 if(kind==='territorio')return {
  title:data?`${data.nombre} — Historia y sucesión — ${SITE_NAME}`:'Territorio',
  description:data?.resumen||'Gobiernos, dinastías y conexiones históricas registradas.',
  path:`/es/territorio/${encodeURIComponent(slug)}`,
 };
 throw new Error(`Tipo de ficha desconocido: ${kind}`);
}
