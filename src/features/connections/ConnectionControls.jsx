import {useMemo,useState} from 'react';
import {Users,X,ArrowLeft,ArrowRight} from 'lucide-react';
import {rutasEntre,tipoRelacionEntre} from '../../domain/genealogy/relationshipGraph.js';
import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';
import {CONNECTION_LIMIT,connectionUrl} from './connectionTree.js';
import './connections.css';
import {englishLabel} from '../english/v6/atlasPresentation.js';
export default function ConnectionControls({people,graph,ids,onChange,criterion,onCriterion,result,onSelect,locale='es'}) {
 const en=locale==='en',tr=(es,english)=>en?english:es;
 const relation=value=>en?({'padre':'father','madre':'mother','hijo':'child','hija':'child','cónyuge':'spouse','amante':'lover','pariente':'relative'}[value]||englishLabel(value)):value;
 const [query,setQuery]=useState('');
 const [routeIndex,setRouteIndex]=useState(0);
 // Two people: the connection is a path that reads as a sentence, with alternatives.
 const routes=useMemo(()=>graph&&ids.length===2?rutasEntre(graph,ids[0],ids[1],criterion):[],[graph,ids,criterion]);
 const route=routes[Math.min(routeIndex,Math.max(0,routes.length-1))];
 const [shareStatus,setShareStatus]=useState('');
 async function share(){const url=new URL(connectionUrl(ids,criterion,locale),window.location.origin).href;try{await navigator.clipboard.writeText(url);setShareStatus(tr('Enlace copiado.','Link copied.'));}catch{setShareStatus(tr('Puedes copiar el enlace desde «Abrir esta conexión».','You can copy the link from “Open this connection”.'));}}
 const byId=useMemo(()=>Object.fromEntries(people.map(p=>[p.id,p])),[people]);
 const searchable=useMemo(()=>people.map(p=>({p,text:normalizarBusquedaPublica([p.nombre,...p.aliases||[]].join(' '))})),[people]);
 const matches=useMemo(()=>query.trim()?searchable.filter(x=>!ids.includes(x.p.id)&&x.text.includes(normalizarBusquedaPublica(query))).slice(0,8).map(x=>x.p):[],[query,ids,searchable]);
 const add=id=>{if(ids.length<CONNECTION_LIMIT&&!ids.includes(id)){onChange([...ids,id]);setQuery('');setRouteIndex(0);}};
 return <section className="connection-controls workspace-mode-bar" aria-label={tr('Conectar varias personas','Connect several people')}>
  <div className="connection-heading"><strong><Users size={14}/> {tr('Conectar personas','Connect people')}</strong><span>{ids.length}/{CONNECTION_LIMIT}</span>
   <label>{tr('Vínculos','Links')} <select value={criterion} onChange={e=>onCriterion(e.target.value)}><option value="matrimonio">{tr('Parentesco y matrimonios','Kinship and marriages')}</option><option value="sangre">{tr('Solo parentesco','Kinship only')}</option></select></label>
   <button className="clear-btn" type="button" onClick={()=>{onChange([]);setQuery('');}}>{tr('Reiniciar','Reset')}</button>
  </div>
  <div className="connection-selection">{ids.map(id=><span key={id} className="connection-chip"><button type="button" onClick={()=>onSelect?.(id)}>{byId[id]?.nombre||id}</button><button type="button" aria-label={`${tr('Quitar','Remove')} ${byId[id]?.nombre||id}`} onClick={()=>onChange(ids.filter(x=>x!==id))}><X size={12}/></button></span>)}</div>
  <div className="connection-search"><label>{tr('Buscar persona para conectar','Find a person to connect')}<input type="search" value={query} disabled={ids.length>=CONNECTION_LIMIT} onChange={e=>setQuery(e.target.value)} placeholder={tr('Nombre o nombre alternativo…','Name or alternative name…')}/></label>
   {!!query.trim()&&ids.length<CONNECTION_LIMIT&&<ul aria-label={tr('Resultados para conectar','Connection results')}>{matches.map(p=><li key={p.id}><button type="button" onClick={()=>add(p.id)}>{p.nombre}<small>{en?englishLabel(p.dinastia):p.dinastia}</small></button></li>)}{!matches.length&&<li>{tr('No hay coincidencias disponibles.','No available matches.')}</li>}</ul>}
  </div>
  <p className="connection-status" role="status">{ids.length<2?tr('Elige de dos a cinco personas. También puedes añadirlas pulsando sus fichas en el árbol.','Choose two to five people. You can also add them by selecting their cards in the tree.'):!result.connected?(en?`No documented connection exists between the ${result.groups.length} groups. They are shown separately.`:`No hay conexión documentada entre los ${result.groups.length} grupos. Se muestran por separado.`):(en?`${result.ids.length} people · ${result.edges.length} documented links · shortest connection for this criterion.`:`${result.ids.length} personas · ${result.edges.length} vínculos documentados · conexión mínima con este criterio.`)}</p>
  {route&&<div className="connection-route" aria-label={tr('Recorrido entre las dos personas','Path between the two people')}>
   <ol>{route.map((id,index)=><li key={`${id}-${index}`}>{index>0&&<span className="connection-route-edge">{relation(tipoRelacionEntre(route[index-1],id))}</span>}<button type="button" onClick={()=>onSelect?.(id)}>{byId[id]?.nombre||id}</button></li>)}</ol>
   {routes.length>1&&<div className="connection-route-switch"><button type="button" aria-label={tr('Recorrido anterior','Previous path')} onClick={()=>setRouteIndex(i=>(i-1+routes.length)%routes.length)}><ArrowLeft size={12}/></button><span>{tr('Recorrido','Path')} {Math.min(routeIndex,routes.length-1)+1} {tr('de','of')} {routes.length}</span><button type="button" aria-label={tr('Recorrido siguiente','Next path')} onClick={()=>setRouteIndex(i=>(i+1)%routes.length)}><ArrowRight size={12}/></button></div>}
  </div>}
  {ids.length>=2&&<div className="connection-share"><button className="clear-btn" type="button" onClick={share}>{tr('Copiar enlace','Copy link')}</button> <a href={connectionUrl(ids,criterion,locale)}>{tr('Abrir esta conexión','Open this connection')}</a><span role="status">{shareStatus}</span></div>}
  {ids.length>=2&&<p className="connection-note">{tr('Línea continua: filiación; discontinua: matrimonio. La conexión utiliza toda la base. Al salir vuelven a aplicarse los filtros de exploración.','Solid line: parentage; dashed line: marriage. Connections use the complete database. Exploration filters apply again when you leave.')}</p>}
 </section>;
}
