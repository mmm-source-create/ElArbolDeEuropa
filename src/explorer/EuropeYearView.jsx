import {MAP_FROM,MAP_THROUGH} from '../data/mapCoverage.js';
import GovernmentsTable from './EuropeGovernments.jsx';
import {EVENT_CATEGORIES} from './timelineLayout.js';
import React,{useMemo,useState} from 'react';
import {CalendarDays, Crown, Share2, Users} from 'lucide-react';
import {MapaEuropa} from '../MapaEuropa.jsx';
import {PERSONAS} from '../personas.jsx';
import {EVENTOS_HISTORICOS,HISTORIAS} from '../historiaData.jsx';
import {CRISIS} from '../content/sucesiones/index.js';
import {UNIONES_CORONAS} from '../content/coronas/index.js';
import {europaEnAnio} from '../data/europeYear.js';
import {protagonistsAt} from '../data/europePanorama.js';
import {governmentSummary} from '../data/governmentPresentation.js';
import {IMAGENES_PERSONAS} from '../imagenesPersonas.js';
import {responsiveImage} from '../utils/responsiveImage.js';
import {slugPublico} from '../utils/personLabels.js';
import './europe-panorama.css';


// Atlas and Europa share one address; a shared link names the scene and year explicitly.
function ShareView({year}) {
  const [status, setStatus] = useState('');
  const share = async () => {
    const url = new URL('/es/', window.location.origin);
    url.searchParams.set('atlas', '1'); url.searchParams.set('escena', 'europa'); url.searchParams.set('anio', String(year));
    try {
      if (navigator.share && window.matchMedia?.('(pointer: coarse)').matches) await navigator.share({title: `Europa en ${year} — El Árbol de Europa`, url: url.href});
      else { await navigator.clipboard.writeText(url.href); setStatus('Enlace copiado'); }
    } catch { setStatus(url.href); }
    setTimeout(() => setStatus(''), 4000);
  };
  return <span className="europe-share"><button type="button" onClick={share}><Share2 size={13} aria-hidden="true"/> Compartir esta vista</button><span role="status">{status}</span></span>;
}

const JUMPS=[['europe-events-title','Cronología',CalendarDays],['europe-protagonists-title','Protagonistas',Users],['europe-governments-title','Gobernantes',Crown]];
const jumpTo=id=>document.getElementById(id)?.closest('section')?.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});

export default function EuropeYearView({year,onSelect,onEvent,onYearChange,timeline}) {
 const [peopleLimit,setPeopleLimit]=useState(8);
 const [eventCategory,setEventCategory]=useState('all');
 const result=useMemo(()=>europaEnAnio({personas:PERSONAS,anio:year,eventos:EVENTOS_HISTORICOS,crisis:CRISIS,uniones:UNIONES_CORONAS}),[year]);
 const protagonists=useMemo(()=>protagonistsAt(PERSONAS,year,HISTORIAS,result.eventos),[year,result.eventos]);
 const categories=[...new Set(result.eventos.map(e=>e.categoria||'otros'))];
 const currentCategory=categories.includes(eventCategory)?eventCategory:'all';
 const events=result.eventos.filter(e=>currentCategory==='all'||e.categoria===currentCategory).toSorted((a,b)=>(a.desde??a.anio)-(b.desde??b.anio)||a.titulo.localeCompare(b.titulo,'es'));
 const validMap=year>=MAP_FROM&&year<=MAP_THROUGH;
 return <main className="europe-panorama" aria-labelledby="europe-panorama-title">
  <header className="europe-heading"><div><span>Una mirada al continente</span><h1 id="europe-panorama-title">Europa en <em>{year}</em></h1><p>Territorios, acontecimientos y personas en un mismo momento.</p></div><div className="europe-heading-actions"><nav className="europe-jump" aria-label="Secciones de esta vista">{JUMPS.map(([target,label,Icon])=><button key={target} type="button" onClick={()=>jumpTo(target)}><Icon size={13} aria-hidden="true"/>{label}</button>)}</nav><ShareView year={year}/></div></header>
  <div className="europe-overview">
   <section className="europe-map" aria-label={`Mapa político de Europa en ${year}`}>
    {validMap?<MapaEuropa panorama anioGlobal={year} onSelectPersona={onSelect}/>:<div className="europe-map-unavailable"><h2>Mapa disponible de {MAP_FROM} a {MAP_THROUGH}</h2><p>La cronología y las fichas siguen disponibles para {year}.</p><button type="button" onClick={()=>onYearChange(1500)}>Ver Europa en 1500</button></div>}
   </section>
   <section className="europe-events" aria-labelledby="europe-events-title"><div className="europe-section-heading"><div><span>La cronología del año</span><h2 id="europe-events-title">Qué ocurre en {year}</h2></div><b>{result.eventos.length}</b></div>
    {categories.length>1&&<div className="europe-filter-pills" role="group" aria-label="Tipo de acontecimiento"><button type="button" aria-pressed={currentCategory==='all'} onClick={()=>setEventCategory('all')}>Todos <b>{result.eventos.length}</b></button>{categories.map(c=><button key={c} type="button" style={{'--event-color':EVENT_CATEGORIES[c]?.[1]||'var(--eade-muted)'}} aria-pressed={currentCategory===c} onClick={()=>setEventCategory(c)}><i aria-hidden="true"/>{EVENT_CATEGORIES[c]?.[0]||c} <b>{result.eventos.filter(e=>(e.categoria||'otros')===c).length}</b></button>)}</div>}
    {!events.length&&<p className="europe-empty">No hay hitos registrados para este año y categoría. Puedes explorar otro año en la línea temporal.</p>}
    <ol>{events.map(event=><li key={event.id}><small>{event.desde??event.anio}{event.hasta&&event.hasta!==(event.desde??event.anio)?`–${event.hasta} · En curso`:''} · {EVENT_CATEGORIES[event.categoria]?.[0]||event.categoria}</small><button type="button" onClick={()=>onEvent(event)}>{event.titulo}</button><p>{event.descripcion}</p>{event.personas?.length>0&&<div className="europe-event-people">{event.personas.map(id=>{const p=PERSONAS.find(p=>p.id===id);return p?<button key={id} onClick={()=>onSelect(id)}>{p.nombre}</button>:null;})}</div>}</li>)}</ol>
   </section>
  </div>
  {timeline}
  <section className="europe-protagonists" aria-labelledby="europe-protagonists-title"><div className="europe-section-heading"><div><span>Desde las historias del Atlas</span><h2 id="europe-protagonists-title">Protagonistas de este momento</h2></div><span>{protagonists.length} personas vinculadas</span></div>
   <p className="europe-note">Selección de las historias y acontecimientos de este momento, completada con soberanos registrados. Cada tarjeta indica su vínculo y permite abrir la ficha.</p>
   {!protagonists.length&&<p>No hay protagonistas vinculados a historias o acontecimientos de este año. La tabla de gobernantes sigue disponible.</p>}
   <div className="europe-person-grid">{protagonists.slice(0,peopleLimit).map(({person,reasons,stories})=>{const image=IMAGENES_PERSONAS[person.id];return <article key={person.id}>
    <button className="europe-person-card" onClick={()=>onSelect(person.id)}>
     {image?<img {...responsiveImage(image.archivo,'66px')} alt={image.alt||`Retrato de ${person.nombre}`} loading="lazy" style={{objectPosition:image.encuadre}}/>:<span className="europe-person-initial" aria-hidden="true">{person.nombre[0]}</span>}
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
