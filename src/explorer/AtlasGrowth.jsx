import React from 'react';
import './atlas-growth.css';
export default function AtlasGrowth({ids,selected,query,results,additions,onStart,onSelect,onExpand,onUndo,canUndo,onFull,onNew,onFilters,filtersOpen,popeCount}) {
 const starting=Array.isArray(ids)&&!ids.length;
 return <section className={`atlas-growth${starting?' is-starting':''}`} aria-label="Explorar familias">
  {starting?<><h2>¿Por quién empezamos?</h2><p>Busca en toda la base o elige un personaje. Comenzarás con sus padres, parejas, hijos y hermanos registrados.</p><div className="growth-actions">{[['ISAB1CAST','Isabel de Castilla'],['CARLOS5','Carlos V'],['LEONARDODAVINCI','Leonardo da Vinci']].map(([id,name])=><button key={id} onClick={()=>onStart(id)}>{name} →</button>)}</div></>:<p><strong>{ids===null?'Árbol completo':`${ids.length} personas en tu selección`}</strong>{selected&&` · ${selected.nombre}`}</p>}
  {query.trim()&&<div className="growth-results" aria-label="Resultados de toda la base"><p>{results.length?'Coincidencias en toda la base (hasta 12):':'No hay coincidencias en la base completa.'}</p>{results.slice(0,12).map(p=><div key={p.id}><button onClick={()=>onSelect(p.id)}>Ver ficha de {p.nombre}</button><button onClick={()=>onStart(p.id)}>Explorar su familia →</button></div>)}</div>}
  {!starting&&ids!==null&&selected&&<div className="growth-actions">{[['parents','Añadir padres'],['children','Añadir descendencia (1 generación)'],['family','Añadir familia inmediata']].map(([kind,label])=><button key={kind} disabled={!additions[kind]?.length} onClick={()=>onExpand(kind)}>{label} (+{additions[kind]?.length||0})</button>)}</div>}
  <div className="growth-actions"><button disabled={!canUndo} onClick={onUndo}>Deshacer expansión</button>{ids!==null&&<button onClick={onFull}>Ver el árbol completo</button>}{!starting&&<button onClick={onNew}>Empezar otra familia</button>}<button aria-expanded={filtersOpen} onClick={onFilters}>Filtros avanzados</button></div>
  {!!popeCount&&<small>{popeCount} pontífices sin familiares registrados agrupados al pie del árbol. Los pontífices con familia conservan sus ramas.</small>}
 </section>;
}
