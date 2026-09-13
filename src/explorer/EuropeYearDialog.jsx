import React,{useEffect,useMemo,useRef,useState} from 'react';
import {X} from 'lucide-react';
import {EVENTOS_HISTORICOS} from '../historiaData.jsx';
import {UNIONES_CORONAS} from '../content/coronas/index.js';
import {CRISIS} from '../content/sucesiones/index.js';
import {europaEnAnio} from '../data/europeYear.js';
import {territorioCoincideConFiltro} from '../Territorios.jsx';
import {documentaryLife} from '../utils/documentaryDates.js';
import {slugPublico,normalizarBusquedaPublica} from '../utils/personLabels.js';
import './europe-year.css';

export function EuropeYearContent({resultado,onSelect=()=>{}}) {
 const [query,setQuery]=useState(''),[limit,setLimit]=useState(30);
 const grupos=new Map();
 for(const g of resultado.gobiernos) {if(!grupos.has(g.territorio))grupos.set(g.territorio,[]);grupos.get(g.territorio).push(g);}
 const vivas=resultado.vivas.filter(({persona:p})=>normalizarBusquedaPublica(`${p.nombre} ${(p.aliases||[]).join(' ')}`).includes(normalizarBusquedaPublica(query)));
 return <>
  <div className="europe-year-counts"><span><b>{grupos.size}</b> territorios con gobierno</span><span><b>{new Set(resultado.gobiernos.map(g=>g.persona.id)).size}</b> personas gobernando</span><span><b>{resultado.vivas.length}</b> vidas compatibles</span></div>
  <section><h3>Quién gobierna</h3><p>Incluye las funciones registradas de gobierno, con regencias y corregencias identificadas. La serie puede estar incompleta.</p>
   {!grupos.size&&<p>No hay gobiernos registrados en este año y selección.</p>}
   <div className="europe-government-grid">{[...grupos].map(([territorio,gs])=><article key={territorio}><h4><a href={`/es/territorio/${slugPublico(territorio)}`}>{territorio} →</a></h4>{gs.map((g,i)=><div key={`${g.persona.id}-${g.desde}-${i}`}><button type="button" className="europe-person-link" onClick={()=>onSelect(g.persona.id)}>{g.persona.nombre}</button><small>{g.titulo} · {g.condicion}{g.ambito&&` · ${g.ambito}`} · {g.desde}–{g.hasta}</small>{g.nota&&<details><summary>Contexto del mandato</summary><p>{g.nota}</p></details>}</div>)}{gs.some(a=>gs.some(b=>a!==b&&a.hasta===b.desde))&&<p className="europe-year-note">Hay un relevo dentro del año; las fechas anuales no prueban simultaneidad.</p>}</article>)}</div>
  </section>
  {!!resultado.nominales.length&&<details className="europe-year-details"><summary>Títulos nominales o en disputa ({resultado.nominales.length})</summary><ul>{resultado.nominales.map((g,i)=><li key={i}><button className="europe-person-link" type="button" onClick={()=>onSelect(g.persona.id)}>{g.persona.nombre}</button> · {g.territorio} · {g.titulo} · {g.condicion}{g.nota&&<p>{g.nota}</p>}</li>)}</ul></details>}
  <section><h3>Sucesiones en disputa</h3>{!resultado.crisis.length?<p>No hay una crisis explicada para este año y selección. Esto no implica que no existieran conflictos.</p>:resultado.crisis.map(c=><article className="europe-context" key={c.id}><h4>{c.titulo}</h4><p>{c.resumen}</p><a href={`/es/territorio/${slugPublico(c.territorios[0])}#crisis-${c.id}`}>Candidatos y fundamentos de las reclamaciones →</a></article>)}</section>
  <section><h3>Acontecimientos que coinciden</h3>{!resultado.eventos.length?<p>No hay acontecimientos cargados que coincidan con este año y selección.</p>:resultado.eventos.map(e=><article className="europe-context" key={e.id}><h4>{e.titulo}</h4><p>{e.descripcion}</p>{!!e.personas?.length&&<p className="europe-year-note">Vinculado a {e.personas.length} personajes del Atlas.</p>}</article>)}</section>
  {!!resultado.uniones.length&&<section><h3>Uniones en contexto</h3><p>Estos marcos históricos incluyen separaciones temporales; no afirman que todos sus reinos compartieran monarca ese año.</p>{resultado.uniones.map(u=><article className="europe-context" key={u.id}><h4>{u.titulo}</h4><p>{u.resumen}</p><a href={`/es/territorio/${slugPublico(u.territorios[0])}#union-${u.id}`}>Ver la secuencia de uniones y separaciones →</a></article>)}</section>}
  <details className="europe-year-details"><summary>Personajes vivos o compatibles con las fechas ({resultado.vivas.length})</summary><p>Las fechas incompletas y aproximadas se indican. Una vida sin límites suficientes no se prolonga indefinidamente.</p><label className="europe-life-search">Buscar en esta selección<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(30);}} placeholder="Nombre o nombre alternativo"/></label><ul className="europe-life-list">{vivas.slice(0,limit).map(({persona:p,estado})=><li key={p.id}><button type="button" className="europe-person-link" onClick={()=>onSelect(p.id)}>{p.nombre}</button><small>{documentaryLife(p)} · {estado}</small></li>)}</ul>{!vivas.length&&<p>No hay coincidencias.</p>}{vivas.length>limit&&<button type="button" className="europe-year-action" onClick={()=>setLimit(limit+30)}>Mostrar 30 más ({vivas.length-limit} pendientes)</button>}</details>
 </>;
}

export default function EuropeYearDialog({anio,onYearChange,onClose,onSelect,personas,territorios=[],filtros=[],alcanceCompleto=false,min,max}) {
 const [input,setInput]=useState(String(anio??1500));
 const dialog=useRef(null),close=useRef(null);
 useEffect(()=>{setInput(String(anio??1500));},[anio]);
 useEffect(()=>{
  const previous=document.activeElement;close.current?.focus();
  return ()=>{if(previous?.isConnected)previous.focus();};
 },[]);
 const resultado=useMemo(()=>europaEnAnio({personas,anio,eventos:EVENTOS_HISTORICOS,crisis:CRISIS,uniones:UNIONES_CORONAS,territorioIncluido:t=>!territorios.length||territorios.some(f=>territorioCoincideConFiltro(t,f)),alcanceCompleto}),[personas,anio,territorios,alcanceCompleto]);
 const trap=e=>{
  if(e.key==='Escape'){e.stopPropagation();onClose();return;}
  if(e.key!=='Tab')return;
  const nodes=[...dialog.current.querySelectorAll('a[href],button,input,select,summary,[tabindex="0"]')].filter(n=>!n.disabled&&n.getClientRects().length);
  const first=nodes[0],last=nodes.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
 };
 return <div className="project-modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><section ref={dialog} className="project-modal europe-year-dialog" role="dialog" aria-modal="true" aria-labelledby="europe-year-title" onKeyDown={trap}>
  <header className="project-modal-head"><div><div className="project-modal-kicker">Coronas y uniones · Atlas</div><h2 id="europe-year-title">Europa en {Number.isInteger(anio)?anio:'este año'}</h2></div><button ref={close} className="project-modal-close" type="button" aria-label="Cerrar Europa en este año" onClick={onClose}><X size={16}/></button></header>
  <div className="project-modal-body"><form className="europe-year-form" onSubmit={e=>{e.preventDefault();if(input.trim()&&Number.isInteger(Number(input)))onYearChange(Number(input));}}><label>Año global<input type="number" min={min} max={max} required value={input} onChange={e=>setInput(e.target.value)}/></label><button className="europe-year-action" type="submit">Ver año</button></form>
  <p className="europe-year-note">{alcanceCompleto?'Base completa del Atlas.':`Selección actual: ${personas.length} personas${filtros.length?` · ${filtros.join(' · ')}`:''}.`} Cambiar el año aquí actualiza también el Atlas.</p>
  {Number.isInteger(anio)?<EuropeYearContent key={anio} resultado={resultado} onSelect={onSelect}/>:<p>Elige un año para consultar gobernantes, acontecimientos y conexiones de la selección actual.</p>}
  </div>
 </section></div>;
}
