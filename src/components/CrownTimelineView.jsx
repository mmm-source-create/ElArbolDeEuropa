// 6.3.2: vista de «Sus títulos en el tiempo». No calcula nada: recibe las
// etapas ya resueltas. El Atlas las calcula al vuelo (CrownTimeline.jsx); una
// ficha pública las trae en sus datos, calculadas al generar el sitio.
import {useState} from 'react';
import './crowns.css';
import {profileLabel,profileNote,profileEntityPath} from '../features/english/profilePresentation.js';

// Datos serializados en la ficha: solo se puede elegir el comienzo de una etapa.
export function staticCrownModel(data) {
 if(!data)return null;
 const empty={effective:0,nominales:[],grouped:[]};
 const mandate=index=>data.mandates[index];
 const situation=stage=>({effective:stage.effective,nominales:stage.nominales.map(mandate),grouped:stage.grouped.map(group=>({...group,mandates:group.mandates.map(mandate)}))});
 return {...data,at:year=>{const stage=data.stages.find(item=>item.desde===year);return stage?situation(stage):empty;}};
}

export default function CrownTimelineView({persona,model,fuentes=[],anio,onYearChange,compact=false,locale='es'}) {
 const en=locale==='en',label=(es,english)=>en?english:es;
 const term=text=>profileLabel(persona,text),note=text=>profileNote(persona,text);
 const [elegido,setElegido]=useState(null);
 if(!model?.stages?.length)return null;
 const stages=model.stages;
 const year=Number.isInteger(anio)?anio:(elegido??model.initial);
 const {effective,nominales,grouped}=model.at(year);
 const cambiar=n=>{setElegido(n);onYearChange?.(n);};
 const cuerpo=<>
  <p className="crown-intro">{label(`Sigue cómo cambiaron los territorios y las funciones de ${persona.nombre}. Cada título conserva su condición propia.`,`Follow the changing territories and offices of ${persona.nombre}. Each title retains its own status.`)}</p>
  <label className="crown-year">{label('Etapa','Period')} <select value={stages.findIndex(e=>e.desde<=year&&year<=e.hasta)} onChange={e=>{const etapa=stages[Number(e.target.value)];if(etapa)cambiar(etapa.desde);}}>
   {!stages.some(e=>e.desde<=year&&year<=e.hasta)&&<option value={-1}>{year} · {label('Sin gobiernos registrados','No recorded governments')}</option>}
   {stages.map((e,i)=><option key={e.desde} value={i}>{e.desde}–{e.hasta} · {e.entities} {label('entidades con gobierno',e.entities===1?'governed entity':'governed entities')}</option>)}
  </select></label>
  <h3>{label('Gobiernos en','Governments in')} {year}</h3>
  {!effective?<p>{label('No hay gobierno efectivo registrado para este año.','No effective government is recorded for this year.')}</p>:<ul className="crown-mandates">{grouped.map(group=><li key={group.key}><strong>{term(group.label)}</strong><span>{group.mandates.length===1?term(group.mandates[0].titulo):label(`${group.mandates.length} títulos y mandatos`,`${group.mandates.length} titles and offices`)}</span><details><summary>{label('Ver títulos y ámbitos','View titles and jurisdictions')}</summary><ul>{group.mandates.map(g=><li key={g.key}><a href={profileEntityPath('territorio',g.territorio,locale)}>{term(g.territorio)}{en&&profileEntityPath('territorio',g.territorio,locale).startsWith('/es/')?' · ES':''}</a><span>{term(g.titulo)} · {term(g.condicion)}{g.ambito&&` · ${term(g.ambito)}`}</span><small>{g.desde}–{g.hasta}{g.nota&&` · ${note(g.nota)}`}</small></li>)}</ul>{group.note&&<p>{note(group.note)} {group.source&&<a href={group.source}>{label('Fuente de la agrupación','Source for this grouping')}</a>}</p>}</details></li>)}</ul>}
  {!!nominales.length&&<details className="crown-details"><summary>{label('Títulos nominales y disputados','Nominal and disputed titles')} ({nominales.length})</summary><ul className="crown-mandates">{nominales.map(g=><li key={g.key}><a href={profileEntityPath('territorio',g.territorio,locale)}>{term(g.territorio)}{en&&profileEntityPath('territorio',g.territorio,locale).startsWith('/es/')?' · ES':''}</a><span>{term(g.titulo)} · {term(g.condicion)}</span><small>{g.desde}–{g.hasta}{g.nota&&` · ${note(g.nota)}`}</small></li>)}</ul></details>}
  <p className="crown-note">{label('Fechas anuales: coincidir en un año no demuestra que dos mandatos se ejercieran el mismo día. Las regencias y corregencias conservan su etiqueta.','Annual dates: overlap within one year does not prove that two offices were held on the same day. Regencies and co-rulerships retain their labels.')}</p>
  {!!model.accesos.length&&<details className="crown-details"><summary>{label('Cómo reunió estos títulos','How these titles came together')}</summary><ol className="crown-accessions">{model.accesos.map(a=><li key={a.key}><strong>{a.desde} · {a.territorios.map(term).join(" · ")}</strong><span>{a.motivos.map(term).join(' · ')}</span><p>{note(a.explicacion)}</p>{a.fuentes?.length>0&&<div className="crown-sources">{a.fuentes.map(url=><a key={url} href={url} target="_blank" rel="noreferrer">{fuentes.find(f=>f.url===url)?.titulo||label('Referencia','Reference')}</a>)}</div>}</li>)}</ol><p className="crown-note">{label('Selección de accesos explicados. Los demás títulos permanecen en la relación de gobiernos de la ficha.','Selected explained accessions. Other titles remain in the profile’s list of recorded governments.')}</p></details>}
 </>;
 return compact?<details className="crown-timeline crown-compact"><summary>{label('Coronas y títulos en el tiempo','Crowns and titles over time')}</summary>{cuerpo}</details>:<section className="public-content-card crown-timeline"><span>{label('Coronas y uniones','Crowns and unions')}</span><h2>{label('Sus títulos en el tiempo','Their titles over time')}</h2>{cuerpo}</section>;
}
