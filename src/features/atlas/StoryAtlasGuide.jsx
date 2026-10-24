import {useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,ChevronDown,ChevronUp,Crosshair,X} from 'lucide-react';
import {ENGLISH_STORIES} from '../english/content.js';
import './story-atlas.css';
import ProgressMeter from '../../ui/ProgressMeter.jsx';

export default function StoryAtlasGuide({story,index,returnPath,count,onStep,onCenter,onExit,onPerson}) {
 const [chapterOpen,setChapterOpen]=useState(true);
 const en=returnPath?.startsWith('/en/'),translation=en?ENGLISH_STORIES[story.id]:null,step=story.pasos[index];
 if(!step)return null;
 const title=translation?.title||story.titulo,chapter=translation?.chapters[index],heading=chapter?.[0]||step.titulo,text=chapter?.[1]||step.texto;
 return <section className="story-atlas-guide" aria-label={en?'Story in the Atlas':'Historia en el Atlas'}>
  <div className="story-atlas-context"><BookOpen size={16} aria-hidden="true"/><span>{title} <small>· {index+1} / {story.pasos.length}</small></span><a href={returnPath}>{en?'Reading view':'Volver a la lectura'} <ArrowRight size={12}/></a><button type="button" onClick={onExit} aria-label={en?'Close story and stay in the Atlas':'Cerrar historia y seguir en el Atlas'}><X size={18}/></button></div>
  <ProgressMeter className="story-atlas-progress" value={index+1} max={story.pasos.length} label={en?'Chapter position':'Posición en la historia'}/>
  <div className="story-atlas-chapter"><h2 id="story-atlas-heading"><span>{step.anio}</span> {heading}</h2><nav aria-label={en?'Chapter navigation':'Navegación de capítulos'}><button type="button" disabled={index===0} onClick={()=>onStep(-1)} aria-label={en?'Previous chapter':'Capítulo anterior'}><ArrowLeft size={16}/></button><button type="button" className="story-person-action" onClick={onPerson}>{en?'Profile':'Ver ficha'}</button><button type="button" onClick={onCenter} title={en?'Centre this chapter':'Centrar este capítulo'}><Crosshair size={16}/><span>{en?'Centre':'Centrar'}</span></button><button type="button" disabled={index===story.pasos.length-1} onClick={()=>onStep(1)} aria-label={en?'Next chapter':'Capítulo siguiente'}><ArrowRight size={16}/></button><button type="button" aria-expanded={chapterOpen} aria-controls="story-atlas-text" onClick={()=>setChapterOpen(open=>!open)}>{chapterOpen?<ChevronDown size={16}/>:<ChevronUp size={16}/>}<span>{chapterOpen?(en?'Hide text':'Ocultar texto'):(en?'Read chapter':'Leer capítulo')}</span></button></nav></div>
  <div id="story-atlas-text" hidden={!chapterOpen} className="story-atlas-reading" role="region" aria-labelledby="story-atlas-heading" tabIndex={0}><p>{text}</p>{story.revisionPendiente && <small className="story-review-note">{en?'Needs review':'Pendiente de revisión'}</small>}</div>
  <small className="story-atlas-selection">{en?`${count} people in the tree · this chapter highlighted`:`${count} personas en el árbol · protagonistas del capítulo resaltados`}</small>
 </section>;
}
