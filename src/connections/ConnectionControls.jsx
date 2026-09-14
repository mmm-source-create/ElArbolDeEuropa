import React,{useMemo,useState} from 'react';
import {Users,X} from 'lucide-react';
import {normalizarBusquedaPublica} from '../utils/personLabels.js';
import {CONNECTION_LIMIT,connectionUrl} from './connectionTree.js';
import './connections.css';
export default function ConnectionControls({people,ids,onChange,criterion,onCriterion,result,onSelect}) {
 const [query,setQuery]=useState('');
 const [shareStatus,setShareStatus]=useState('');
 async function share(){const url=new URL(connectionUrl(ids,criterion),window.location.origin).href;try{await navigator.clipboard.writeText(url);setShareStatus('Enlace copiado.');}catch{setShareStatus('Puedes copiar el enlace desde «Abrir esta conexión».');}}
 const byId=useMemo(()=>Object.fromEntries(people.map(p=>[p.id,p])),[people]);
 const searchable=useMemo(()=>people.map(p=>({p,text:normalizarBusquedaPublica([p.nombre,...p.aliases||[]].join(' '))})),[people]);
 const matches=useMemo(()=>query.trim()?searchable.filter(x=>!ids.includes(x.p.id)&&x.text.includes(normalizarBusquedaPublica(query))).slice(0,8).map(x=>x.p):[],[query,ids,searchable]);
 const add=id=>{if(ids.length<CONNECTION_LIMIT&&!ids.includes(id)){onChange([...ids,id]);setQuery('');}};
 return <section className="connection-controls workspace-mode-bar" aria-label="Conectar varias personas">
  <div className="connection-heading"><strong><Users size={14}/> Conectar personas</strong><span>{ids.length}/{CONNECTION_LIMIT}</span>
   <label>Vínculos <select value={criterion} onChange={e=>onCriterion(e.target.value)}><option value="matrimonio">Parentesco y matrimonios</option><option value="sangre">Solo parentesco</option></select></label>
   <button className="clear-btn" type="button" onClick={()=>{onChange([]);setQuery('');}}>Reiniciar</button>
  </div>
  <div className="connection-selection">{ids.map(id=><span key={id} className="connection-chip"><button type="button" onClick={()=>onSelect?.(id)}>{byId[id]?.nombre||id}</button><button type="button" aria-label={`Quitar ${byId[id]?.nombre||id}`} onClick={()=>onChange(ids.filter(x=>x!==id))}><X size={12}/></button></span>)}</div>
  <div className="connection-search"><label>Buscar persona para conectar<input type="search" value={query} disabled={ids.length>=CONNECTION_LIMIT} onChange={e=>setQuery(e.target.value)} placeholder="Nombre o nombre alternativo…"/></label>
   {!!query.trim()&&ids.length<CONNECTION_LIMIT&&<ul aria-label="Resultados para conectar">{matches.map(p=><li key={p.id}><button type="button" onClick={()=>add(p.id)}>{p.nombre}<small>{p.dinastia}</small></button></li>)}{!matches.length&&<li>No hay coincidencias disponibles.</li>}</ul>}
  </div>
  <p className="connection-status" role="status">{ids.length<2?'Elige de dos a cinco personas. También puedes añadirlas pulsando sus fichas en el árbol.':!result.connected?`No hay conexión documentada entre los ${result.groups.length} grupos. Se muestran por separado.`:`${result.ids.length} personas · ${result.edges.length} vínculos documentados · conexión mínima con este criterio.`}</p>
  {ids.length>=2&&<div className="connection-share"><button className="clear-btn" type="button" onClick={share}>Copiar enlace</button> <a href={connectionUrl(ids,criterion)}>Abrir esta conexión</a><span role="status">{shareStatus}</span></div>}
  {ids.length>=2&&<p className="connection-note">Línea continua: filiación; discontinua: matrimonio. La conexión utiliza toda la base. Al salir vuelven a aplicarse los filtros de exploración.</p>}
 </section>;
}
