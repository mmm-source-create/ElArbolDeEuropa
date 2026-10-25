import {useEffect,useRef} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Crosshair,X} from 'lucide-react';
import {ENGLISH_STORIES} from '../english/content.js';
import './story-atlas.css';
import ProgressMeter from '../../ui/ProgressMeter.jsx';

export default function StoryAtlasGuide({story,index,returnPath,count,onStep,onCenter,onExit,onPerson}) {
 const reading=useRef(null);
 useEffect(()=>{if(reading.current)reading.current.scrollTop=0;},[story.id,index]);
 const en=returnPath?.startsWith('/en/'),translation=en?ENGLISH_STORIES[story.id]:null,step=story.pasos[index];
 if(!step)return null;
 const title=translation?.title||story.titulo,chapter=translation?.chapters[index],heading=chapter?.[0]||step.titulo,text=chapter?.[1]||step.texto;
 return <section className="story-atlas-guide" aria-label={en?'Story in the Atlas':'Historia en el Atlas'}>
  <div className="story-atlas-context"><BookOpen size={16} aria-hidden="true"/><span>{title} <small>· {index+1} / {story.pasos.length}</small></span><a href={returnPath+(index===story.pasos.length-1?'#seguir-leyendo':'')}>{index===story.pasos.length-1?(en?'Keep reading':'Seguir leyendo'):(en?'Reading view':'Volver a la lectura')} <ArrowRight size={12}/></a><button type="button" onClick={onExit} aria-label={en?'Close story and stay in the Atlas':'Cerrar historia y seguir en el Atlas'}><X size={18}/></button></div>
  <ProgressMeter className="story-atlas-progress" value={index+1} max={story.pasos.length} label={en?'Chapter position':'Posición en la historia'}/>
  <div className="story-atlas-chapter"><nav aria-label={en?'Chapter navigation':'Navegación de capítulos'}><button type="button" disabled={index===0} onClick={()=>onStep(-1)} aria-label={en?'Previous chapter':'Capítulo anterior'}><ArrowLeft size={16}/></button><button type="button" className="story-person-action" onClick={onPerson}>{en?'Profile':'Ver ficha'}</button><button type="button" onClick={onCenter} title={en?'Centre this chapter':'Centrar este capítulo'}><Crosshair size={16}/><span>{en?'Centre':'Centrar'}</span></button><button type="button" disabled={index===story.pasos.length-1} onClick={()=>onStep(1)} aria-label={en?'Next chapter':'Capítulo siguiente'}><ArrowRight size={16}/></button></nav><h2 id="story-atlas-heading"><span>{step.anio}</span> {heading}</h2></div>
  <div ref={reading} id="story-atlas-text" className="story-atlas-reading" role="region" aria-labelledby="story-atlas-heading" tabIndex={0}><p>{text}</p>{story.revisionPendiente && <small className="story-review-note">{en?'Needs review':'Pendiente de revisión'}</small>}</div>
  <small className="story-atlas-selection">{en?`${count} people in the tree · this chapter highlighted`:`${count} personas en el árbol · protagonistas del capítulo resaltados`}</small>
 </section>;
}
