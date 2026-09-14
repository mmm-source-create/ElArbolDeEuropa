// Una sola definición de los metadatos para el HTML de compilación y el navegador.
export const DEFAULT_SITE_URL = 'https://www.treeofeurope.eu';
export function publicMeta({title,description,path='/es/'},siteUrl=DEFAULT_SITE_URL) {
 const canonical=new URL(path,siteUrl).href;
 return {title,description,path,canonical,lang:'es',meta:[
  ['name','description',description],['property','og:site_name','El Árbol de Europa'],
  ['property','og:title',title],['property','og:description',description],
  ['property','og:type','website'],['property','og:locale','es_ES'],['property','og:url',canonical],
  ['name','twitter:card','summary'],['name','twitter:title',title],['name','twitter:description',description],
 ],alternates:[{hreflang:'es',href:canonical},{hreflang:'x-default',href:canonical}]};
}
export function entityMeta(kind,data,slug) {
 if(kind==='persona')return {
  title:data?`${data.nombre} — El Árbol de Europa`:'Persona — El Árbol de Europa',
  description:data?(data.biografia||data.resumen||'').replace(/\s+/g,' ').trim().slice(0,155):'Ficha histórica en El Árbol de Europa.',
  path:`/es/persona/${encodeURIComponent(slug||'persona')}`,
 };
 if(kind==='dinastia')return {
  title:data?`Casa de ${data.nombre} — El Árbol de Europa`:'Dinastía — El Árbol de Europa',
  description:data?.resumen||'Personas, ramas y territorios de una casa en el Atlas.',
  path:`/es/dinastia/${encodeURIComponent(data?.slug||slug)}`,
 };
 if(kind==='territorio')return {
  title:data?`${data.nombre} — Historia y sucesión`:'Territorio',
  description:data?.resumen||'Gobiernos, dinastías y conexiones históricas registradas.',
  path:`/es/territorio/${encodeURIComponent(slug)}`,
 };
 throw new Error(`Tipo de ficha desconocido: ${kind}`);
}
