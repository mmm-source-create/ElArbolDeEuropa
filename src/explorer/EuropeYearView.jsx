import GovernmentsTable from './EuropeGovernments.jsx';
import {EVENT_CATEGORIES} from './timelineLayout.js';
import React,{useMemo,useState} from 'react';
import {MapaEuropa} from '../MapaEuropa.jsx';
import {PERSONAS} from '../personas.jsx';
import {EVENTOS_HISTORICOS,HISTORIAS} from '../historiaData.jsx';
import {CRISIS} from '../content/sucesiones/index.js';
import {UNIONES_CORONAS} from '../content/coronas/index.js';
import {europaEnAnio} from '../data/europeYear.js';
import {protagonistsAt} from '../data/europePanorama.js';
import {governmentSummary} from '../data/governmentPresentation.js';
import {IMAGENES_PERSONAS} from '../imagenesPersonas.js';
import {slugPublico} from '../utils/personLabels.js';
import './europe-panorama.css';


export default function EuropeYearView({year,onSelect,onEvent,onYearChange,timeline}) {
 const [peopleLimit,setPeopleLimit]=useState(8);
 const [eventCategory,setEventCategory]=useState('all');
 const result=useMemo(()=>europaEnAnio({personas:PERSONAS,anio:year,eventos:EVENTOS_HISTORICOS,crisis:CRISIS,uniones:UNIONES_CORONAS}),[year]);
 const protagonists=useMemo(()=>protagonistsAt(PERSONAS,year,HISTORIAS,result.eventos),[year,result.eventos]);
 const categories=[...new Set(result.eventos.map(e=>e.categoria||'otros'))];
 const currentCategory=categories.includes(eventCategory)?eventCategory:'all';
 const events=result.eventos.filter(e=>currentCategory==='all'||e.categoria===currentCategory).toSorted((a,b)=>(a.desde??a.anio)-(b.desde??b.anio)||a.titulo.localeCompare(b.titulo,'es'));
 const validMap=year>=1200&&year<=1800;
 return <main className="europe-panorama" aria-labelledby="europe-panorama-title">
  <header className="europe-heading"><div><span>Una mirada al continente</span><h1 id="europe-panorama-title">Europa en <em>{year}</em></h1><p>Territorios, acontecimientos y personas en un mismo momento.</p></div><a href="#europe-governments-title">Ver gobernantes ↓</a></header>
  <div className="europe-overview">
   <section className="europe-map" aria-label={`Mapa político de Europa en ${year}`}>
    {validMap?<MapaEuropa panorama anioGlobal={year} onSelectPersona={onSelect}/>:<div className="europe-map-unavailable"><h2>Mapa disponible de 1200 a 1800</h2><p>La cronología y las fichas siguen disponibles para {year}.</p><button type="button" onClick={()=>onYearChange(1500)}>Ver Europa en 1500</button></div>}
   </section>
   <section className="europe-events" aria-labelledby="europe-events-title"><div className="europe-section-heading"><div><span>La cronología del año</span><h2 id="europe-events-title">Qué ocurre en {year}</h2></div><b>{result.eventos.length}</b></div>
    <label className="europe-category">Tipo de acontecimiento<select value={currentCategory} onChange={e=>setEventCategory(e.target.value)}><option value="all">Todos</option>{categories.map(c=><option key={c} value={c}>{EVENT_CATEGORIES[c]?.[0]||c}</option>)}</select></label>
    {!events.length&&<p className="europe-empty">No hay hitos registrados para este año y categoría. Puedes explorar otro año en la línea temporal.</p>}
    <ol>{events.map(event=><li key={event.id}><small>{event.desde??event.anio}{event.hasta&&event.hasta!==(event.desde??event.anio)?`–${event.hasta} · En curso`:''} · {event.categoria}</small><button type="button" onClick={()=>onEvent(event)}>{event.titulo}</button><p>{event.descripcion}</p>{event.personas?.length>0&&<div className="europe-event-people">{event.personas.map(id=>{const p=PERSONAS.find(p=>p.id===id);return p?<button key={id} onClick={()=>onSelect(id)}>{p.nombre}</button>:null;})}</div>}</li>)}</ol>
   </section>
  </div>
  {timeline}
  <section className="europe-protagonists" aria-labelledby="europe-protagonists-title"><div className="europe-section-heading"><div><span>Desde las historias del Atlas</span><h2 id="europe-protagonists-title">Protagonistas de este momento</h2></div><span>{protagonists.length} personas vinculadas</span></div>
   <p className="europe-note">Selección de las historias y acontecimientos de este momento, completada con soberanos registrados. Cada tarjeta indica su vínculo y permite abrir la ficha.</p>
   {!protagonists.length&&<p>No hay protagonistas vinculados a historias o acontecimientos de este año. La tabla de gobernantes sigue disponible.</p>}
   <div className="europe-person-grid">{protagonists.slice(0,peopleLimit).map(({person,reasons,stories})=>{const image=IMAGENES_PERSONAS[person.id];return <article key={person.id}>
    <button className="europe-person-card" onClick={()=>onSelect(person.id)}>
     {image?<img src={image.archivo} alt={image.alt||`Retrato de ${person.nombre}`} loading="lazy" style={{objectPosition:image.encuadre}}/>:<span className="europe-person-initial" aria-hidden="true">{person.nombre[0]}</span>}
     <span><strong>{person.nombre}</strong><small>{governmentSummary(person,year).join(' · ')||person.titulo}</small><span>{reasons[0]}</span></span>
    </button>
    <div className="europe-person-context">{stories.map(story=><a key={story.id} href={`/es/historia/${slugPublico(story.titulo)}`}>{story.titulo} →</a>)}{image&&<details><summary>Imagen y derechos</summary><p>{image.tipo} · {image.autor} · {image.fecha}</p><a href={image.fuenteUrl}>Fuente</a> · <a href={image.derechosUrl}>{image.derechos}</a></details>}</div>
   </article>;})}</div>
   {protagonists.length>peopleLimit&&<button className="europe-more" onClick={()=>setPeopleLimit(n=>n+8)}>Ver más protagonistas ({protagonists.length-peopleLimit})</button>}
  </section>
  <GovernmentsTable people={PERSONAS} year={year} onSelect={onSelect}/>
  {(result.crisis.length>0||result.uniones.length>0)&&<details className="europe-context-details"><summary>Sucesiones disputadas y uniones en contexto</summary>{[...result.crisis,...result.uniones].map(item=><article key={item.id}><h3>{item.titulo}</h3><p>{item.resumen}</p><a href={`/es/territorio/${slugPublico(item.territorios[0])}`}>Contexto, títulos y fuentes →</a></article>)}</details>}
 </main>;
}
