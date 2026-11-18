import kosciuszko from './stories607/kosciuszko.js';
import gustavusAdolphus from './stories607/gustavusAdolphus.js';
// 6.0.7: two new stories, complete in Spanish and English in the same delivery.
export const STORY_DRAFTS_607=[kosciuszko,gustavusAdolphus];
const content=(story,en=false)=>({
 id:story.id,titulo:en?story.enTitle:story.esTitle,subtitulo:en?story.enSubtitle:story.esSubtitle,
 descripcion:en?story.enDescription:story.esDescription,disponible:true,recomendadas:story.related,fuentes:story.sources,
 pasos:story.chapters.map(c=>({anio:c.anio,persona:c.personas[0],personas:c.personas,titulo:en?c.enTitle:c.esTitle,texto:en?c.en:c.es,fuentes:c.sourceRefs.map(i=>story.sources[i])})),
});
export const STORIES_607_ES=STORY_DRAFTS_607.map(story=>content(story));
export const STORIES_607_EN=Object.fromEntries(STORY_DRAFTS_607.map(story=>[story.id,{enSlug:story.enSlug,content:content(story,true)}]));
