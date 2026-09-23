import React, {useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Crosshair,X} from 'lucide-react';
import {ENGLISH_STORIES} from '../english/content.js';
import './story-atlas.css';

export default function StoryAtlasGuide({story,index,returnPath,count,onStep,onCenter,onExit}) {
 const [chapterOpen,setChapterOpen]=useState(()=>typeof window==='undefined'||typeof window.matchMedia!=='function'||window.matchMedia('(min-width: 701px)').matches);
 const en=returnPath?.startsWith('/en/'),translation=en?ENGLISH_STORIES[story.id]:null,step=story.pasos[index];
 if(!step)return null;
 const title=translation?.title||story.titulo,chapter=translation?.chapters[index],heading=chapter?.[0]||step.titulo,text=chapter?.[1]||step.texto;
 return <section className="story-atlas-guide" aria-label={en?'Story in the Atlas':'Historia en el Atlas'}>
  <div className="story-atlas-context"><BookOpen size={14}/><span>{title} <small>· {index+1} / {story.pasos.length}</small></span><a href={returnPath}>{en?'Reading view':'Volver a la lectura'} <ArrowRight size={12}/></a><button type="button" onClick={onExit} aria-label={en?'Leave story':'Salir del recorrido'}><X size={13}/></button></div>
  <div className="story-atlas-chapter"><h2><span>{step.anio}</span> {heading}</h2><nav aria-label={en?'Chapter navigation':'Navegación de capítulos'}><button type="button" disabled={index===0} onClick={()=>onStep(-1)} aria-label={en?'Previous chapter':'Capítulo anterior'}><ArrowLeft size={13}/></button><button type="button" onClick={onCenter} title={en?'Centre this chapter':'Centrar este capítulo'}><Crosshair size={13}/><span>{en?'Centre':'Centrar'}</span></button><button type="button" disabled={index===story.pasos.length-1} onClick={()=>onStep(1)} aria-label={en?'Next chapter':'Capítulo siguiente'}><ArrowRight size={13}/></button></nav></div>
  <div className="story-atlas-reading"><details open={chapterOpen} onToggle={(event)=>setChapterOpen(event.currentTarget.open)}><summary>{en?'Read chapter here':'Leer el capítulo aquí'}</summary><p>{text}</p></details><small>{en?`Whole story · ${count} people · this chapter highlighted`:`Historia completa · ${count} personas · este capítulo resaltado`}</small></div>
 </section>;
}
