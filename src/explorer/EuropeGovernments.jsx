import React,{useMemo,useState} from 'react';
import {governmentTableAt} from '../data/europePanorama.js';
import {normalizarBusquedaPublica,slugPublico} from '../utils/personLabels.js';
import {AUTHORITY_LABELS} from '../data/mapAuthorities.js';
import {COLLECTIVE_AUTHORITIES} from '../data/politicalMapIndex.js';
import {componentesDe} from '../data/territorios.js';
import {FILTER_REGIONS,regionResolver} from '../data/filterRegions.js';

const {personRegion}=regionResolver(componentesDe);
// Entities of the government table that are not components of a mapped root.
const ENTITY_REGION={
 'Castellbó':0,'Gandía':0,'Brasil':0,
 'Albret':1,'Alençon':1,'Angulema':1,'Anjou':1,'Aquitania':1,'Armagnac':1,'Artois':1,'Bearne':1,'Berry':1,'Borbón':1,'Borgoña':1,'Bretaña':1,'Champaña':1,'Clermont':1,'Condado de Borgoña':1,'Dreux':1,'Ducado de Auvernia':1,'Estados Belgas Unidos':1,'Estados de Holanda':1,'Foix':1,'Guisa':1,'La Marche':1,'Luxemburgo':1,'Maine':1,'Namur':1,'Nevers':1,'Normandía':1,'Orleans':1,'Penthièvre':1,'Poitou':1,'Provenza':1,'República Bátava':1,'República francesa':1,'Rethel':1,'Toulouse':1,'Valois':1,'Vendôme':1,'Évreux':1,
 'Annandale':2,'Clanricarde':2,'Condado de Clancare':2,'Condado de Desmond':2,'Condado de Thomond':2,'Condado de Tyrconnell':2,'Condado de Tyrone':2,'Condado de Ulster':2,'Connacht':2,'Desmond':2,'Kildare':2,'Leinster':2,'Ormond':2,'Richmond':2,'Thomond':2,'Tír Chonaill':2,'Tír Eoghain':2,'York':2,
 'Ansbach':3,'Austria Interior':3,'Baden':3,'Berg':3,'Brunswick':3,'Cléveris':3,'Hannover':3,'Hesse':3,'Hesse-Darmstadt':3,'Hesse-Kassel':3,'Holstein':3,'Jülich':3,'Kulmbach':3,'Mark':3,'Mecklemburgo':3,'Meißen':3,'Moravia':3,'Nassau':3,'Oldemburgo':3,'Palatinado-Neoburgo':3,'Pomerania':3,'Ravensberg':3,'Silesia':3,'Suabia':3,'Tirol':3,'Turingia':3,'Württemberg':3,'Condado de Bihar':3,'Condado de Temes':3,
 'Administración de ocupación austro-rusa de Lombardía':4,'Administración francesa de Piamonte':4,'Comuna y República de Florencia':4,'Forlì':4,'Imola':4,'Pesaro':4,'República Cisalpina':4,'República de Venecia':4,'Saluzzo':4,'Tarento':4,
 'Curlandia':6,
 'Albania':7,'Comuna de Mljet':7,'Dobruja':7,'Eslavonia':7,'Gran Principado de Transilvania':7,'Herzegovina':7,'Imperio otomano':7,'Kosovo':7,'Monte Athos autónomo bajo autoridad otomana':7,'Morea':7,'Morea veneciana (núcleos)':7,'Prilep':7,'Principado de Transilvania':7,'República de Ragusa':7,'Sirmia':7,'Trebisonda':7,'Voivodato de Transilvania':7,'Zeta':7,
 'Antioquía':8,'Armenia cilicia':8,'Transjordania':8,'Trípoli':8,
};
// Crowns and empires lead each region; lordships, duchies and republics follow
// in a compact list so the major powers are not lost among sixty equal boxes.
const MAJOR_TITLE=/\b(emperador|emperatriz|rey|reina|sult[aá]n|zar|zarina|papa|kan|basileus)\b/i;
export function governmentTier(row){
 const titles=[row.label,...row.governments.flatMap(g=>g.mandates.map(m=>m.titulo||''))].join(' ');
 return row.id==='sacro-imperio'||MAJOR_TITLE.test(titles)?0:1;
}
export function governmentRegion(row){
 if(row.label in ENTITY_REGION)return FILTER_REGIONS[ENTITY_REGION[row.label]];
 return personRegion([row.label,...row.governments.flatMap(g=>g.mandates.map(m=>m.territorio)),...(row.collectives||[]).map(c=>c.territorio)]);
}

function Ruler({group}){
 return <div className="europe-ruler">
  <button type="button" data-person={group.person.id}>{group.person.nombre} <span aria-hidden="true">↗</span></button>
  {/* Plain sovereign rule is the norm; only the exceptions get a label. */}
  {(group.id==='sacro-imperio'||group.kinds.some(kind=>kind!=='sovereign'))&&<small>{group.id==='sacro-imperio'?'Dignidad imperial y realeza de Romanos':group.kinds.filter(kind=>kind!=='sovereign').map(kind=>AUTHORITY_LABELS[kind]).join(' · ')}</small>}
  <details><summary>{group.mandates.length===1?group.mandates[0].titulo:`${group.mandates.length} títulos y mandatos`}</summary>
   <ul>{group.mandates.map((m,i)=><li key={i}><a href={`/es/territorio/${slugPublico(m.territorio)}`}>{m.territorio}</a> · {m.titulo} · {m.desde}–{m.hasta}{m.condicion!=='efectivo'?` · ${m.condicion}`:''}{m.nota&&<p>{m.nota}</p>}</li>)}</ul>
   {group.note&&<p>{group.note} {group.source&&<a href={group.source} target="_blank" rel="noreferrer">Fuente de la agrupación</a>}</p>}
  </details>
 </div>;
}

function Collective({collective}){
 return <div className="europe-ruler"><strong>{collective.nombre}</strong><small>{collective.cargo} · {collective.desde}–{collective.hasta}</small><details><summary>Gobierno institucional y fuentes</summary><p>{collective.nota}</p><a href={collective.fuente.url}>{collective.fuente.title}</a></details></div>;
}

function EntityCard({row}){
 return <article className="europe-entity" style={{'--entity-color':row.color}}>
  <h4><i aria-hidden="true"/>{row.label}</h4>
  {row.governments.map(group=><Ruler key={group.person.id+group.key} group={group}/>)}
  {row.collectives?.map((c,i)=><Collective key={c.nombre+i} collective={c}/>)}
  {row.governments.some(a=>row.governments.some(b=>a.person.id!==b.person.id&&a.mandates.some(m=>b.mandates.some(n=>m.hasta===n.desde))))&&<p className="europe-note">Hay un relevo dentro del año; las fechas anuales no prueban simultaneidad.</p>}
 </article>;
}

function EntityRow({row}){
 const rulers=[...row.governments.map(g=>({key:g.person.id+g.key,id:g.person.id,name:g.person.nombre,title:[g.mandates[0]?.titulo,...g.kinds.filter(kind=>kind!=='sovereign').map(kind=>AUTHORITY_LABELS[kind])].filter(Boolean).join(' · ')})),...(row.collectives||[]).map((c,i)=>({key:c.nombre+i,name:c.nombre,title:c.cargo}))];
 return <li className="europe-entity-row" style={{'--entity-color':row.color}}>
  <i aria-hidden="true"/><h4>{row.label}</h4>
  <span>{rulers.map((r,i)=><React.Fragment key={r.key}>{i>0&&', '}{r.id?<button type="button" data-person={r.id}>{r.name}</button>:<b>{r.name}</b>}{r.title&&<small> · {r.title}</small>}</React.Fragment>)}</span>
 </li>;
}

export default function GovernmentsTable({people,year,onSelect=()=>{}}) {
 const [query,setQuery]=useState('');
 const [region,setRegion]=useState('all');
 const rows=useMemo(()=>governmentTableAt(people,year,COLLECTIVE_AUTHORITIES).map(row=>({...row,tier:governmentTier(row),region:governmentRegion(row)})),[people,year]);
 const term=normalizarBusquedaPublica(query);
 const matching=rows.filter(row=>normalizarBusquedaPublica([row.label,...(row.collectives||[]).map(c=>c.nombre),...row.governments.flatMap(g=>[g.person.nombre,...g.mandates.map(m=>m.territorio)])].join(' ')).includes(term));
 const regions=FILTER_REGIONS.map(name=>({name,count:matching.filter(r=>r.region===name).length})).filter(r=>r.count);
 const currentRegion=regions.some(r=>r.name===region)?region:'all';
 const shown=regions.filter(r=>currentRegion==='all'||r.name===currentRegion);
 const majors=rows.filter(r=>r.tier===0).length;
 // One click handler for every ruler button keeps the cards free of callbacks.
 const pick=event=>{const id=event.target.closest('button[data-person]')?.dataset.person;if(id)onSelect(id);};
 return <section className="europe-governments" aria-labelledby="europe-governments-title">
  <div className="europe-section-heading"><div><span>El poder, por regiones</span><h2 id="europe-governments-title">Quién gobierna en {year}</h2></div><label>Buscar entidad o gobernante<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="España, Carlos, Bohemia…"/></label></div>
  <p className="europe-note">{rows.length} conjuntos políticos, {majors} de ellos reinos o imperios. Las coronas encabezan cada región; ducados, señoríos y repúblicas siguen en lista. Regencias, gobiernos delegados y soberanías conservan su condición.</p>
  {regions.length>1&&<div className="europe-filter-pills" role="group" aria-label="Región">
   <button type="button" aria-pressed={currentRegion==='all'} onClick={()=>setRegion('all')}>Todas <b>{matching.length}</b></button>
   {regions.map(r=><button key={r.name} type="button" aria-pressed={currentRegion===r.name} onClick={()=>setRegion(r.name)}>{r.name} <b>{r.count}</b></button>)}
  </div>}
  <div onClick={pick}>{shown.map(({name})=>{
   const inRegion=matching.filter(r=>r.region===name),major=inRegion.filter(r=>r.tier===0),minor=inRegion.filter(r=>r.tier===1);
   return <section className="europe-region" key={name} aria-label={name}>
    <h3>{name} <span>{inRegion.length}</span></h3>
    {major.length>0&&<div className="europe-ruler-grid">{major.map(row=><EntityCard key={row.id} row={row}/>)}</div>}
    {minor.length>0&&<ul className="europe-ruler-grid europe-ruler-list">{minor.map(row=><EntityRow key={row.id} row={row}/>)}</ul>}
   </section>;
  })}</div>
  {!matching.length&&<p>No hay gobiernos que coincidan con esta búsqueda y año.</p>}
 </section>;
}
