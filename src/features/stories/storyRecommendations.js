import {slugPublico} from '../../domain/people/personLabels.js';
export function storyRecommendations(story,stories) {
 const people=new Set((story.pasos||[]).flatMap(step=>step.personas||[step.persona]));
 const named=story.recomendadas?.length?story.recomendadas:stories.filter(item=>item.id!==story.id&&item.disponible&&item.pasos?.length)
  .map(item=>({id:item.id,score:new Set(item.pasos.flatMap(step=>step.personas||[step.persona]).filter(id=>people.has(id))).size}))
  .filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,3).map(item=>item.id);
 return [...new Set(named)].filter(id=>id!==story.id).map(id=>stories.find(item=>item.id===id)).filter(Boolean).map(item=>({id:item.id,titulo:item.titulo,subtitulo:item.subtitulo||'',disponible:Boolean(item.disponible&&item.pasos?.length),path:`/es/historia/${slugPublico(item.titulo)}`}));
}
