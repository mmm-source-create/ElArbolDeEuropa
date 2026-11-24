// Una sola definición de los metadatos para el HTML de compilación y el navegador.
import {translatedEquivalent} from '../english/routes.js';
import {SITE_NAME, SITE_NAME_EN, DEFAULT_SITE_URL} from '../../app/siteConfig.js';
import {OG_DEFAULT_IMAGE, OG_DEFAULT_IMAGE_EN, OG_IMAGE_SIZE} from './ogImages.js';
import {personTitle,personDescription,dynastyTitle,territoryTitle,entityDescription,clip} from './seoText.js';
export {DEFAULT_SITE_URL} from '../../app/siteConfig.js';
// 6.0.10: Cloudflare serves both homes without the trailing slash (/es/ answers
// with a redirect), so the canonical URLs and alternates use /es and /en.
export const canonicalPath=path=>path==='/es/'?'/es':path==='/en/'?'/en':path;
// 6.2.0: every page shares the site card in its language.
export function publicMeta({title,description,path='/es/',imageAlt},siteUrl=DEFAULT_SITE_URL) {
 const canonical=new URL(canonicalPath(path),siteUrl).href;
 const lang=path.startsWith('/en/')||path==='/en'?'en':'es';
 const imageUrl=new URL(lang==='en'?OG_DEFAULT_IMAGE_EN:OG_DEFAULT_IMAGE,siteUrl).href;
 imageAlt=lang==='en'?SITE_NAME_EN:SITE_NAME;
 const equivalent=translatedEquivalent(path,lang==='en'?'es':'en');
 const alternates=[{hreflang:lang,href:canonical},...(equivalent?[{hreflang:lang==='en'?'es':'en',href:new URL(canonicalPath(equivalent),siteUrl).href}]:[]),{hreflang:'x-default',href:lang==='en'&&equivalent?new URL(canonicalPath(equivalent),siteUrl).href:canonical}];
 return {title,description,path,canonical,lang,meta:[
  ['name','description',description],['property','og:site_name',SITE_NAME],
  ['property','og:title',title],['property','og:description',description],
  ['property','og:type','website'],['property','og:locale',lang==='en'?'en_GB':'es_ES'],['property','og:url',canonical],
  ['property','og:image',imageUrl],['property','og:image:width',String(OG_IMAGE_SIZE.width)],['property','og:image:height',String(OG_IMAGE_SIZE.height)],['property','og:image:alt',imageAlt],
  ['name','twitter:card','summary_large_image'],['name','twitter:title',title],['name','twitter:description',description],['name','twitter:image',imageUrl],
 ],alternates};
}
export function entityMeta(kind,data,slug) {
 if(kind==='english'&&data?.type==='home')return {title:ENGLISH_HOME_TITLE,description:data.description,path:'/en/',imageAlt:SITE_NAME_EN};
 if(kind==='english')return {imageAlt:SITE_NAME_EN,title:data?.type==='person'?personTitle(data,'en'):data?.type==='dynasty'?dynastyTitle(data,'en'):data?.type==='territory'?territoryTitle(data,'en'):`${data?.nombre||'English edition'} — The Tree of Europe`,description:data?.type==='person'?personDescription(data,'en'):['dynasty','territory'].includes(data?.type)?entityDescription(data,data.type==='dynasty'?'dinastia':'territorio','en'):data?.description||'Explore European families and stories.',path:data?.path||'/en/',...(data?.ogImage?{image:data.ogImage,imageAlt:`${data.type==='dynasty'?'Arms of':'Portrait of'} ${data.nombre}`}:{})};
 if(kind==='historia')return {title:`${data?.nombre || 'Historia'} — ${SITE_NAME}`,description:(data?.chapter?data.pasos[data.chapter-1].texto:data?.descripcion||'Historias de Europa, capítulo a capítulo.').slice(0,155),path:`/es/historia/${encodeURIComponent(data?.slug||slug)}${data?.chapter?`/capitulo/${data.chapter}`:''}`};
 if(kind==='persona')return {
  title:data?personTitle(data):`Persona — ${SITE_NAME}`,
  description:data?personDescription(data):'Ficha histórica en El Árbol de Europa.',
  path:`/es/persona/${encodeURIComponent(slug||'persona')}`,
 };
 if(kind==='dinastia')return {
  title:data?dynastyTitle(data):`Dinastía — ${SITE_NAME}`,
  description:data?entityDescription(data,'dinastia'):'Personas, ramas y territorios de una casa en el Atlas.',
  path:`/es/dinastia/${encodeURIComponent(data?.slug||slug)}`,
 };
 if(kind==='territorio')return {
  title:data?territoryTitle(data):'Territorio',
  description:data?entityDescription(data,'territorio'):'Gobiernos, dinastías y conexiones históricas registradas.',
  path:`/es/territorio/${encodeURIComponent(slug)}`,
 };
 if(kind==='catalogo')return catalogMeta(slug,data);
 throw new Error(`Tipo de ficha desconocido: ${kind}`);
}

// 6.1.0: the English home says what the site is, like the Spanish one.
export const ENGLISH_HOME_TITLE='The Tree of Europe | Interactive genealogical and historical atlas';
// Same strings as the client components (HomePage, CatalogPage, PeopleIndexPage).
export const HOME_META={title:'El Árbol de Europa | Atlas genealógico e histórico interactivo',description:'Explora personas, dinastías, parentescos, reinados, territorios e historias de la Europa medieval y moderna.',path:'/es'};
export const CATALOG_META={
 personas:{title:`Personas — ${SITE_NAME}`,description:'Busca por nombre, título, dinastía o territorio.',path:'/es/personas'},
 dinastias:{title:`Dinastías — ${SITE_NAME}`,description:'Explora el origen de las casas, sus ramas, herencias y conexiones con las personas del Atlas.',path:'/es/dinastias'},
 territorios:{title:`Territorios — ${SITE_NAME}`,description:'Explora entidades históricas, uniones y agrupaciones por región, tipo y gobiernos registrados.',path:'/es/territorios'},
 historias:{title:`Historias — ${SITE_NAME}`,description:'Historias construidas con las personas, mapas, biografías y cronología de la propia aplicación.',path:'/es/historias'},
};
export function catalogMeta(slug,data) {
 if(slug==='inicio')return HOME_META;
 if(slug==='indice')return {title:`Índice de personas de la A a la Z — ${SITE_NAME}`,description:`Las ${data.items.length} personas del Atlas por orden alfabético, con sus fechas y su casa.`,path:'/es/personas/indice'};
 if(slug==='index-en')return {title:'People from A to Z — The Tree of Europe',description:`All ${data.items.length} people in the Atlas in alphabetical order, with their dates and house.`,path:'/en/people/a-z'};
 if(CATALOG_META[slug])return CATALOG_META[slug];
 throw new Error(`Catálogo desconocido: ${slug}`);
}
export {clip};
