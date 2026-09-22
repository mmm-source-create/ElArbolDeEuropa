import {PERSONAS} from '../personas.jsx';
import {changesBetween, sharedGovernments, governmentRegions, nextRecordedYear} from '../data/europeTimeline.js';
import {connectionUrl} from '../connections/connectionTree.js';
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

export function EuropeYearContent({resultado,onSelect=()=>{},comparison=null,compareYear=null}) {
 const [query,setQuery]=useState(''),[limit,setLimit]=useState(30);
 const grupos=new Map();
 for(const g of resultado.gobiernos) {if(!grupos.has(g.territorio))grupos.set(g.territorio,[]);grupos.get(g.territorio).push(g);}
 const vivas=resultado.vivas.filter(({persona:p})=>normalizarBusquedaPublica(`${p.nombre} ${(p.aliases||[]).join(' ')}`).includes(normalizarBusquedaPublica(query)));
 return <>
  <div className="europe-year-counts"><span><b>{grupos.size}</b> territorios con gobierno</span><span><b>{new Set(resultado.gobiernos.map(g=>g.persona.id)).size}</b> personas gobernando</span><span><b>{resultado.vivas.length}</b> vidas compatibles</span></div>
  <p>En este año coinciden {resultado.eventos.length} acontecimientos registrados y {resultado.crisis.length} sucesiones en disputa. {sharedGovernments(resultado.gobiernos).length} personas reúnen gobiernos en varios territorios.</p>
  {comparison&&<details className="europe-year-details"><summary>Qué ha cambiado desde {compareYear}</summary><p>{comparison.added.length} mandatos presentes ahora y ausentes entonces; {comparison.removed.length} ya no aparecen. Las fechas anuales no precisan el día del relevo.</p>{[['Ahora',comparison.added],['Antes',comparison.removed]].map(([label,items])=><div key={label}><h4>{label}</h4><ul>{items.map((g,i)=><li key={i}><button className="europe-person-link" onClick={()=>onSelect(g.persona.id)}>{g.persona.nombre}</button> · {g.territorio} · {g.titulo}</li>)}</ul></div>)}{comparison.newEvents.map(e=><p key={e.id}>{e.titulo}</p>)}</details>}
  <details className="europe-year-details"><summary>Coronas y gobiernos compartidos</summary><p>Compartir gobernante no implica la fusión de los territorios ni simultaneidad exacta dentro del año.</p>{sharedGovernments(resultado.gobiernos).map(g=><p key={g.persona.id}><button className="europe-person-link" onClick={()=>onSelect(g.persona.id)}>{g.persona.nombre}</button>: {[...g.territorios].join(', ')}</p>)}</details>
  <details className="europe-year-details"><summary>Quién gobierna, por regiones</summary><p>Incluye las funciones registradas de gobierno, con regencias y corregencias identificadas. La serie puede estar incompleta.</p>
   {!grupos.size&&<p>No hay gobiernos registrados en este año y selección.</p>}
   <p className="europe-year-note">Agrupaciones de consulta: no representan fronteras ni soberanías de ese año.</p>{governmentRegions(resultado.gobiernos,territorioCoincideConFiltro).map(([region,regionGovernments])=><section key={region}><h3>{region}</h3>   <div className="europe-government-grid">{[...new Map(regionGovernments.map(g=>[g.territorio,regionGovernments.filter(x=>x.territorio===g.territorio)]))].map(([territorio,gs])=><article key={territorio}><h4><a href={`/es/territorio/${slugPublico(territorio)}`}>{territorio} →</a></h4>{gs.map((g,i)=><div key={`${g.persona.id}-${g.desde}-${i}`}><button type="button" className="europe-person-link" onClick={()=>onSelect(g.persona.id)}>{g.persona.nombre}</button><small>{g.titulo} · {g.condicion}{g.ambito&&` · ${g.ambito}`} · {g.desde}–{g.hasta}</small>{g.nota&&<details><summary>Contexto del mandato</summary><p>{g.nota}</p></details>}</div>)}{gs.some(a=>gs.some(b=>a!==b&&a.hasta===b.desde))&&<p className="europe-year-note">Hay un relevo dentro del año; las fechas anuales no prueban simultaneidad.</p>}</article>)}</div>
</section>)}
  </details>
  {!!resultado.nominales.length&&<details className="europe-year-details"><summary>Títulos nominales o en disputa ({resultado.nominales.length})</summary><ul>{resultado.nominales.map((g,i)=><li key={i}><button className="europe-person-link" type="button" onClick={()=>onSelect(g.persona.id)}>{g.persona.nombre}</button> · {g.territorio} · {g.titulo} · {g.condicion}{g.nota&&<p>{g.nota}</p>}</li>)}</ul></details>}
  <details className="europe-year-details"><summary>Sucesiones en disputa</summary>{!resultado.crisis.length?<p>No hay una crisis explicada para este año y selección. Esto no implica que no existieran conflictos.</p>:resultado.crisis.map(c=><article className="europe-context" key={c.id}><h4>{c.titulo}</h4><p>{c.resumen}</p><a href={`/es/territorio/${slugPublico(c.territorios[0])}#crisis-${c.id}`}>Candidatos y fundamentos de las reclamaciones →</a></article>)}</details>
  <details className="europe-year-details"><summary>Acontecimientos que coinciden</summary>{!resultado.eventos.length?<p>No hay acontecimientos cargados que coincidan con este año y selección.</p>:resultado.eventos.map(e=><article className="europe-context" key={e.id}><h4>{e.titulo}</h4><p>{e.descripcion}</p>{!!e.personas?.length&&<p className="europe-year-note">Vinculado a {e.personas.length} personajes del Atlas.</p>}{e.personas?.length>=2&&<a href={connectionUrl(e.personas)}>Explorar conexiones (hasta cinco protagonistas) →</a>}</article>)}</details>
  {!!resultado.uniones.length&&<details className="europe-year-details"><summary>Uniones en contexto</summary><p>Estos marcos históricos incluyen separaciones temporales; no afirman que todos sus reinos compartieran monarca ese año.</p>{resultado.uniones.map(u=><article className="europe-context" key={u.id}><h4>{u.titulo}</h4><p>{u.resumen}</p><a href={`/es/territorio/${slugPublico(u.territorios[0])}#union-${u.id}`}>Ver la secuencia de uniones y separaciones →</a></article>)}</details>}
  <details className="europe-year-details"><summary>Personajes vivos o compatibles con las fechas ({resultado.vivas.length})</summary><p>Las fechas incompletas y aproximadas se indican. Una vida sin límites suficientes no se prolonga indefinidamente.</p><label className="europe-life-search">Buscar en esta selección<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(30);}} placeholder="Nombre o nombre alternativo"/></label><ul className="europe-life-list">{vivas.slice(0,limit).map(({persona:p,estado})=><li key={p.id}><button type="button" className="europe-person-link" onClick={()=>onSelect(p.id)}>{p.nombre}</button><small>{documentaryLife(p)} · {estado}</small></li>)}</ul>{!vivas.length&&<p>No hay coincidencias.</p>}{vivas.length>limit&&<button type="button" className="europe-year-action" onClick={()=>setLimit(limit+30)}>Mostrar 30 más ({vivas.length-limit} pendientes)</button>}</details>
 </>;
}

export default function EuropeYearDialog({anio,onYearChange,onClose,onSelect,personas,territorios=[],filtros=[],alcanceCompleto=false,min,max}) {
 const [input,setInput]=useState(String(anio??1500));
 const [scope,setScope]=useState('all');
 const [compareYear,setCompareYear]=useState((anio??1500)-1);
 const all=scope==='all';
 const chosen=all?PERSONAS:personas;
 const dialog=useRef(null),close=useRef(null);
 useEffect(()=>{setInput(String(anio??1500));},[anio]);
 useEffect(()=>{
  const previous=document.activeElement;close.current?.focus();
  return ()=>{if(previous?.isConnected)previous.focus();};
 },[]);
 const scopeTerritories=all?[]:territorios;
 const resultFor=year=>europaEnAnio({personas:chosen,anio:year,eventos:EVENTOS_HISTORICOS,crisis:CRISIS,uniones:UNIONES_CORONAS,territorioIncluido:t=>!scopeTerritories.length||scopeTerritories.some(f=>territorioCoincideConFiltro(t,f)),alcanceCompleto:all});
 const resultado=useMemo(()=>resultFor(anio),[chosen,anio,territorios,all]);
 const previous=useMemo(()=>resultFor(compareYear),[chosen,compareYear,territorios,all]);
 const comparison=Number.isInteger(compareYear)&&compareYear>=min&&compareYear<=max?changesBetween(previous,resultado):null;
 const next=nextRecordedYear(anio??min-1,{personas:chosen,eventos:all?EVENTOS_HISTORICOS:EVENTOS_HISTORICOS.filter(e=>(e.personas||[]).some(id=>chosen.some(p=>p.id===id))),min,max});

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
  <div className="project-modal-body"><label className="europe-year-scope">Alcance <select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">Toda Europa</option><option value="selection">Mi selección</option></select></label><form className="europe-year-form" onSubmit={e=>{e.preventDefault();if(input.trim()&&Number.isInteger(Number(input))){const year=Number(input);if(year>=min&&year<=max)onYearChange(year);}}}><label>Año global<input type="number" min={min} max={max} required value={input} onChange={e=>setInput(e.target.value)}/></label><button className="europe-year-action" type="submit">Ver año</button><button type="button" className="europe-year-action" disabled={next===null} onClick={()=>onYearChange(next)}>Siguiente acontecimiento registrado{next!==null?` (${next})`:''}</button></form>
  <label className="europe-year-compare">Comparar con <input type="number" min={min} max={max} value={compareYear} onChange={e=>setCompareYear(e.target.value===''?'':Number(e.target.value))}/></label><button className="europe-year-action" onClick={()=>setCompareYear((anio??1500)-1)}>Año anterior</button>
  <p className="europe-year-note">{all?'Base completa del Atlas.':`Selección actual: ${personas.length} personas${filtros.length?` · ${filtros.join(' · ')}`:''}.`} Cambiar el año aquí actualiza también el Atlas.</p>
  {Number.isInteger(anio)?<EuropeYearContent key={anio} resultado={resultado} onSelect={onSelect} comparison={comparison} compareYear={compareYear}/>:<p>Elige un año para consultar gobernantes, acontecimientos y conexiones de la selección actual.</p>}
  </div>
 </section></div>;
}
