import React,{useMemo,useState} from 'react';
import {etapasCoronas,coronasEn,claveMandato,gobiernosDe,agruparAccesos} from '../data/crowns.js';
import {slugPublico} from '../utils/personLabels.js';
import './crowns.css';

export default function CrownTimeline({persona,accesos=[],fuentes=[],anio,onYearChange,compact=false}) {
 const etapas=useMemo(()=>etapasCoronas(persona),[persona]);
 const [elegido,setElegido]=useState(null);
 if(new Set(gobiernosDe(persona).map(g=>g.territorio)).size<2||!etapas.length)return null;
 const inicial=etapas.reduce((a,b)=>b.efectivos.length>a.efectivos.length?b:a).desde;
 const year=Number.isInteger(anio)?anio:(elegido??inicial);
 const {efectivos,nominales}=coronasEn(persona,year);
 const cambiar=n=>{setElegido(n);onYearChange?.(n);};
 const cuerpo=<>
  <p className="crown-intro">Sigue cómo cambiaron los territorios y las funciones de {persona.nombre}. Cada título conserva su condición propia.</p>
  <label className="crown-year">Etapa <select value={etapas.findIndex(e=>e.desde<=year&&year<=e.hasta)} onChange={e=>{const etapa=etapas[Number(e.target.value)];if(etapa)cambiar(etapa.desde);}}>
   {!etapas.some(e=>e.desde<=year&&year<=e.hasta)&&<option value={-1}>{year} · Sin gobiernos registrados</option>}
   {etapas.map((e,i)=><option key={e.desde} value={i}>{e.desde}–{e.hasta} · {new Set(e.efectivos.map(g=>g.territorio)).size} territorios con gobierno</option>)}
  </select></label>
  <h3>Gobiernos en {year}</h3>
  {!efectivos.length?<p>No hay gobierno efectivo registrado para este año.</p>:<ul className="crown-mandates">{efectivos.map(g=><li key={claveMandato(g)}><a href={`/es/territorio/${slugPublico(g.territorio)}`}>{g.territorio}</a><span>{g.titulo} · {g.condicion}{g.ambito&&` · ${g.ambito}`}</span><small>{g.desde}–{g.hasta}{g.nota&&` · ${g.nota}`}</small></li>)}</ul>}
  {!!nominales.length&&<details className="crown-details"><summary>Títulos nominales y disputados ({nominales.length})</summary><ul className="crown-mandates">{nominales.map(g=><li key={claveMandato(g)}><a href={`/es/territorio/${slugPublico(g.territorio)}`}>{g.territorio}</a><span>{g.titulo} · {g.condicion}</span><small>{g.desde}–{g.hasta}{g.nota&&` · ${g.nota}`}</small></li>)}</ul></details>}
  <p className="crown-note">Fechas anuales: coincidir en un año no demuestra que dos mandatos se ejercieran el mismo día. Las regencias y corregencias conservan su etiqueta.</p>
  {!!accesos.length&&<details className="crown-details"><summary>Cómo reunió estos títulos</summary><ol className="crown-accessions">{agruparAccesos(accesos).map(a=><li key={claveMandato(a)}><strong>{a.desde} · {a.territorios.join(" · ")}</strong><span>{a.motivos.join(' · ')}</span><p>{a.explicacion}</p>{a.fuentes?.length>0&&<div className="crown-sources">{a.fuentes.map(url=><a key={url} href={url} target="_blank" rel="noreferrer">{fuentes.find(f=>f.url===url)?.titulo||'Referencia'}</a>)}</div>}</li>)}</ol><p className="crown-note">Selección de accesos explicados. Los demás títulos permanecen en la relación de gobiernos de la ficha.</p></details>}
 </>;
 return compact?<details className="crown-timeline crown-compact"><summary>Coronas y títulos en el tiempo</summary>{cuerpo}</details>:<section className="public-content-card crown-timeline"><span>Coronas y uniones</span><h2>Sus títulos en el tiempo</h2>{cuerpo}</section>;
}
