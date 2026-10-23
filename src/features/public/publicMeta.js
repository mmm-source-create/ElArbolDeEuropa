// Una sola definición de los metadatos para el HTML de compilación y el navegador.
import {translatedEquivalent} from '../english/routes.js';
import {SITE_NAME, DEFAULT_SITE_URL} from '../../app/siteConfig.js';
import {OG_DEFAULT_IMAGE, OG_IMAGE_SIZE} from './ogImages.js';
export {DEFAULT_SITE_URL} from '../../app/siteConfig.js';
export function publicMeta({title,description,path='/es/',image=OG_DEFAULT_IMAGE,imageAlt=SITE_NAME},siteUrl=DEFAULT_SITE_URL) {
 const canonical=new URL(path,siteUrl).href;
 const imageUrl=new URL(image,siteUrl).href;
 const lang=path.startsWith('/en/')?'en':'es';
 const equivalent=translatedEquivalent(path,lang==='en'?'es':'en');
 const alternates=[{hreflang:lang,href:canonical},...(equivalent?[{hreflang:lang==='en'?'es':'en',href:new URL(equivalent,siteUrl).href}]:[]),{hreflang:'x-default',href:lang==='en'&&equivalent?new URL(equivalent,siteUrl).href:canonical}];
 return {title,description,path,canonical,lang,meta:[
  ['name','description',description],['property','og:site_name',SITE_NAME],
  ['property','og:title',title],['property','og:description',description],
  ['property','og:type','website'],['property','og:locale',lang==='en'?'en_GB':'es_ES'],['property','og:url',canonical],
  ['property','og:image',imageUrl],['property','og:image:width',String(OG_IMAGE_SIZE.width)],['property','og:image:height',String(OG_IMAGE_SIZE.height)],['property','og:image:alt',imageAlt],
  ['name','twitter:card','summary_large_image'],['name','twitter:title',title],['name','twitter:description',description],['name','twitter:image',imageUrl],
 ],alternates};
}
export function entityMeta(kind,data,slug) {
 if(kind==='english')return {title:`${data?.nombre||'English edition'} — The Tree of Europe`,description:data?.description||'Explore European families and stories.',path:data?.path||'/en/',...(data?.ogImage?{image:data.ogImage,imageAlt:`${data.type==='dynasty'?'Arms of':'Portrait of'} ${data.nombre}`}:{})};
 if(kind==='historia')return {title:`${data?.nombre || 'Historia'} — ${SITE_NAME}`,description:(data?.chapter?data.pasos[data.chapter-1].texto:data?.descripcion||'Historias de Europa, capítulo a capítulo.').slice(0,155),path:`/es/historia/${encodeURIComponent(data?.slug||slug)}${data?.chapter?`/capitulo/${data.chapter}`:''}`};
 if(kind==='persona')return {
  title:data?`${data.nombre} — ${SITE_NAME}`:`Persona — ${SITE_NAME}`,
  description:data?(data.biografia||data.resumen||'').replace(/\s+/g,' ').trim().slice(0,155):'Ficha histórica en El Árbol de Europa.',
  path:`/es/persona/${encodeURIComponent(slug||'persona')}`,
  ...(data?.ogImage?{image:data.ogImage,imageAlt:`Retrato de ${data.nombre}`}:{}),
 };
 if(kind==='dinastia')return {
  title:data?`Casa de ${data.nombre} — ${SITE_NAME}`:`Dinastía — ${SITE_NAME}`,
  description:data?.resumen||'Personas, ramas y territorios de una casa en el Atlas.',
  path:`/es/dinastia/${encodeURIComponent(data?.slug||slug)}`,
  ...(data?.ogImage?{image:data.ogImage,imageAlt:`Armas de la casa de ${data.nombre}`}:{}),
 };
 if(kind==='territorio')return {
  title:data?`${data.nombre} — Historia y sucesión — ${SITE_NAME}`:'Territorio',
  description:data?.resumen||'Gobiernos, dinastías y conexiones históricas registradas.',
  path:`/es/territorio/${encodeURIComponent(slug)}`,
 };
 throw new Error(`Tipo de ficha desconocido: ${kind}`);
}
