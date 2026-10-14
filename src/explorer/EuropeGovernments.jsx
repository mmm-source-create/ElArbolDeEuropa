import React,{useMemo,useState} from 'react';
import {governmentTableAt} from '../data/europePanorama.js';
import {normalizarBusquedaPublica,slugPublico} from '../utils/personLabels.js';
import {AUTHORITY_LABELS} from '../data/mapAuthorities.js';
import {COLLECTIVE_AUTHORITIES} from '../data/politicalMapIndex.js';
export default function GovernmentsTable({people,year,onSelect=()=>{}}) {
 const [query,setQuery]=useState('');
 const rows=useMemo(()=>governmentTableAt(people,year,COLLECTIVE_AUTHORITIES),[people,year]);
 const term=normalizarBusquedaPublica(query);
 const filtered=rows.filter(row=>normalizarBusquedaPublica([row.label,...(row.collectives||[]).map(c=>c.nombre),...row.governments.flatMap(g=>[g.person.nombre,...g.mandates.map(m=>m.territorio)])].join(' ')).includes(term));
 return <section className="europe-governments" aria-labelledby="europe-governments-title">
  <div className="europe-section-heading"><div><span>El poder, por entidades</span><h2 id="europe-governments-title">Quién gobierna en {year}</h2></div><label>Buscar entidad o gobernante<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="España, Carlos, Bohemia…"/></label></div>
  <p className="europe-note">Una entrada por conjunto político; los títulos que lo componen se pueden desplegar. Regencias, gobiernos delegados y soberanías conservan su condición.</p>
  <div className="europe-ruler-grid">{filtered.map(row=><article key={row.id} style={{'--entity-color':row.color}}>
   <h3><i aria-hidden="true"/>{row.label}</h3>
   {row.governments.map(group=><div className="europe-ruler" key={group.person.id+group.key}>
    <button type="button" onClick={()=>onSelect(group.person.id)}>{group.person.nombre} <span aria-hidden="true">↗</span></button>
    <small>{group.id==='sacro-imperio'?'Dignidad imperial y realeza de Romanos':group.kinds.map(kind=>AUTHORITY_LABELS[kind]).join(' · ')}</small>
    <details><summary>{group.mandates.length===1?group.mandates[0].titulo:`${group.mandates.length} títulos y mandatos`}</summary>
     <ul>{group.mandates.map((m,i)=><li key={i}><a href={`/es/territorio/${slugPublico(m.territorio)}`}>{m.territorio}</a> · {m.titulo} · {m.desde}–{m.hasta}{m.condicion!=='efectivo'?` · ${m.condicion}`:''}{m.nota&&<p>{m.nota}</p>}</li>)}</ul>
     {group.note&&<p>{group.note} {group.source&&<a href={group.source} target="_blank" rel="noreferrer">Fuente de la agrupación</a>}</p>}
    </details>
   </div>)}
   {row.collectives?.map((c,i)=><div key={c.nombre+i} className="europe-ruler"><strong>{c.nombre}</strong><small>{c.cargo} · {c.desde}–{c.hasta}</small><details><summary>Gobierno institucional y fuentes</summary><p>{c.nota}</p><a href={c.fuente.url}>{c.fuente.title}</a></details></div>)}
   {row.governments.some(a=>row.governments.some(b=>a.person.id!==b.person.id&&a.mandates.some(m=>b.mandates.some(n=>m.hasta===n.desde))))&&<p className="europe-note">Hay un relevo dentro del año; las fechas anuales no prueban simultaneidad.</p>}
  </article>)}</div>
  {!filtered.length&&<p>No hay gobiernos que coincidan con esta búsqueda y año.</p>}
 </section>;
}
