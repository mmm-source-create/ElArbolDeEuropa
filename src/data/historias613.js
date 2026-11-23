import {catalanCompany,greatCompanies,whiteCompany} from './stories613/companies.js';
import {swissConfederation,mohacs,oneill} from './stories613/realms.js';
// 6.1.3: three stories of free companies (with «Los condotieros», the «Compañías
// libres» collection), the Swiss Confederation, Mohács and the fall of Buda, and
// Hugh O’Neill. Spanish and English are published together.
const COLLECTIONS={'compania-catalana':['companias-libres'],'grandes-companias':['companias-libres'],'compania-blanca':['companias-libres'],'mohacs-caida-buda':['herencias-conflictivas']};
export const STORY_DRAFTS_613=[catalanCompany,greatCompanies,whiteCompany,swissConfederation,mohacs,oneill].map(story=>({...story,...(COLLECTIONS[story.id]?{colecciones:COLLECTIONS[story.id]}:{})}));
const content=(story,en=false)=>({
 id:story.id,titulo:en?story.enTitle:story.esTitle,subtitulo:en?story.enSubtitle:story.esSubtitle,
 descripcion:en?story.enDescription:story.esDescription,disponible:true,recomendadas:story.related,fuentes:story.sources,...(story.colecciones?{colecciones:story.colecciones}:{}),
 pasos:story.chapters.map(c=>({anio:c.anio,persona:c.personas[0],personas:c.personas,titulo:en?c.enTitle:c.esTitle,texto:en?c.en:c.es,fuentes:c.sourceRefs.map(i=>story.sources[i])})),
});
export const STORIES_613_ES=STORY_DRAFTS_613.map(story=>content(story));
export const STORIES_613_EN=Object.fromEntries(STORY_DRAFTS_613.map(story=>[story.id,{enSlug:story.enSlug,content:content(story,true)}]));
