import burgundy from './stories606/burgundy.js';
import portugal from './stories606/portugal.js';
import lowCountries from './stories606/lowCountries.js';
import italy from './stories606/italy.js';
import prussia from './stories606/prussia.js';
import spanishSuccession from './stories606/spanishSuccession.js';
import hanover from './stories606/hanover.js';
import eleanor from './stories606/eleanor.js';
import milan from './stories606/milan.js';
export const STORY_DRAFTS_606=[burgundy,portugal,lowCountries,italy,prussia,spanishSuccession,hanover,eleanor,milan];
const content=(story,en=false)=>({
 id:story.id,titulo:en?story.enTitle:story.esTitle,subtitulo:en?story.enSubtitle:story.esSubtitle,
 descripcion:en?story.enDescription:story.esDescription,disponible:true,recomendadas:story.related,fuentes:story.sources,
 pasos:story.chapters.map(c=>({anio:c.anio,persona:c.personas[0],personas:c.personas,titulo:en?c.enTitle:c.esTitle,texto:en?c.en:c.es,fuentes:c.sourceRefs.map(i=>story.sources[i])})),
});
export const STORIES_606_ES=STORY_DRAFTS_606.map(story=>content(story));
export const STORIES_606_EN=Object.fromEntries(STORY_DRAFTS_606.map(story=>[story.id,{enSlug:story.enSlug,content:content(story,true)}]));
export const completeStories606=stories=>stories.map(story=>STORIES_606_ES.find(s=>s.id===story.id)||story);
