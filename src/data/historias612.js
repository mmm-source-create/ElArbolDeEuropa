import drafts from './stories612/dynasties.json' with {type:'json'};
// 6.1.2: ten guided stories about dynasties, written in 6.0.15 and kept as drafts
// until now (docs/borradores-historias-dinastias-615.md). Spanish and English
// are published together; they form the «Dinastías» collection.
export const STORY_DRAFTS_612=drafts;
const content=(story,en=false)=>({
 id:story.id,titulo:en?story.enTitle:story.esTitle,subtitulo:en?story.enSubtitle:story.esSubtitle,
 descripcion:en?story.enDescription:story.esDescription,disponible:true,recomendadas:story.related,fuentes:story.sources,colecciones:story.colecciones,
 pasos:story.chapters.map(c=>({anio:c.anio,persona:c.personas[0],personas:c.personas,titulo:en?c.enTitle:c.esTitle,texto:en?c.en:c.es,fuentes:c.sourceRefs.map(i=>story.sources[i])})),
});
export const STORIES_612_ES=STORY_DRAFTS_612.map(story=>content(story));
export const STORIES_612_EN=Object.fromEntries(STORY_DRAFTS_612.map(story=>[story.id,{enSlug:story.enSlug,content:content(story,true)}]));
