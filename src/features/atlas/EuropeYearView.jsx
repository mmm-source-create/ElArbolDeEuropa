import {MAP_FROM,MAP_THROUGH} from '../../cartography/mapCoverage.js';
import GovernmentsTable from './EuropeGovernments.jsx';
import {EVENT_CATEGORIES} from './timelineLayout.js';
import {useMemo,useState} from 'react';
import {CalendarDays, Crown, Share2, Users} from 'lucide-react';
import {MapaEuropa} from './MapaEuropa.jsx';
import {PERSONAS} from '../../data/personas.js';
import {EVENTOS_HISTORICOS,HISTORIAS} from '../../data/historias.js';
import {CRISIS} from '../../content/sucesiones/index.js';
import {UNIONES_CORONAS} from '../../content/coronas/index.js';
import {europaEnAnio} from '../../domain/time/europeYear.js';
import {protagonistsAt} from '../../cartography/europePanorama.js';
import {governmentSummary} from '../../domain/government/governmentPresentation.js';
import {IMAGENES_PERSONAS} from '../../data/imagenesPersonas.js';
import {responsiveImage} from '../../utils/responsiveImage.js';
import {slugPublico} from '../../domain/people/personLabels.js';
import {englishLabel,englishNote} from '../english/v6/atlasPresentation.js';
import {translatedEquivalent} from '../english/routes.js';
import './europe-panorama.css';


// Atlas and Europa share one address; a shared link names the scene and year explicitly.
function ShareView({year,locale='es'}) {
  const en=locale==='en';
  const [status, setStatus] = useState('');
  const share = async () => {
    const url = new URL(en?'/en/':'/es/', window.location.origin);
    url.searchParams.set('atlas', '1'); url.searchParams.set('escena', 'europa'); url.searchParams.set('anio', String(year));
    try {
      if (navigator.share && window.matchMedia?.('(pointer: coarse)').matches) await navigator.share({title: en?`Europe in ${year} — The Tree of Europe`:`Europa en ${year} — El Árbol de Europa`, url: url.href});
      else { await navigator.clipboard.writeText(url.href); setStatus(en?'Link copied':'Enlace copiado'); }
    } catch { setStatus(url.href); }
    setTimeout(() => setStatus(''), 4000);
  };
  return <span className="europe-share"><button type="button" onClick={share}><Share2 size={13} aria-hidden="true"/> {en?'Share this view':'Compartir esta vista'}</button><span role="status">{status}</span></span>;
}

const JUMPS=[['europe-events-title','Cronología',CalendarDays],['europe-protagonists-title','Protagonistas',Users],['europe-governments-title','Gobernantes',Crown]];
const jumpTo=id=>document.getElementById(id)?.closest('section')?.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});

export default function EuropeYearView({year,onSelect,onEvent,onYearChange,timeline,locale='es'}) {
 const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value,note=value=>en?englishNote(value):value;
 const [peopleLimit,setPeopleLimit]=useState(8);
 const [eventCategory,setEventCategory]=useState('all');
 const result=useMemo(()=>europaEnAnio({personas:PERSONAS,anio:year,eventos:EVENTOS_HISTORICOS,crisis:CRISIS,uniones:UNIONES_CORONAS}),[year]);
 const protagonists=useMemo(()=>protagonistsAt(PERSONAS,year,HISTORIAS,result.eventos),[year,result.eventos]);
 const categories=[...new Set(result.eventos.map(e=>e.categoria||'otros'))];
 const currentCategory=categories.includes(eventCategory)?eventCategory:'all';
 const events=result.eventos.filter(e=>currentCategory==='all'||e.categoria===currentCategory).toSorted((a,b)=>(a.desde??a.anio)-(b.desde??b.anio)||a.titulo.localeCompare(b.titulo,locale));
 const validMap=year>=MAP_FROM&&year<=MAP_THROUGH;
 return <main className="europe-panorama" aria-labelledby="europe-panorama-title">
  <header className="europe-heading"><div><span>{tr('Una mirada al continente','A view of the continent')}</span><h1 id="europe-panorama-title">{tr('Europa en','Europe in')} <em>{year}</em></h1><p>{tr('Territorios, acontecimientos y personas en un mismo momento.','Territories, events and people at the same moment.')}</p></div><div className="europe-heading-actions"><nav className="europe-jump" aria-label={tr('Secciones de esta vista','Sections in this view')}>{JUMPS.map(([target,label,Icon])=><button key={target} type="button" onClick={()=>jumpTo(target)}><Icon size={13} aria-hidden="true"/>{term(label)}</button>)}</nav><ShareView year={year} locale={locale}/></div></header>
  <div className="europe-overview">
   <section className="europe-map" aria-label={`${tr('Mapa político de Europa en','Political map of Europe in')} ${year}`}>
    {validMap?<MapaEuropa panorama locale={locale} anioGlobal={year} onSelectPersona={onSelect}/>:<div className="europe-map-unavailable"><h2>{tr('Mapa disponible de','Map available from')} {MAP_FROM} {tr('a','to')} {MAP_THROUGH}</h2><p>{tr('La cronología y las fichas siguen disponibles para','The chronology and profiles remain available for')} {year}.</p><button type="button" onClick={()=>onYearChange(1500)}>{tr('Ver Europa en 1500','View Europe in 1500')}</button></div>}
   </section>
   <section className="europe-events" aria-labelledby="europe-events-title"><div className="europe-section-heading"><div><span>{tr('La cronología del año','The year’s chronology')}</span><h2 id="europe-events-title">{tr('Qué ocurre en','What happens in')} {year}</h2></div><b>{result.eventos.length}</b></div>
    {categories.length>1&&<div className="europe-filter-pills" role="group" aria-label={tr('Tipo de acontecimiento','Event type')}><button type="button" aria-pressed={currentCategory==='all'} onClick={()=>setEventCategory('all')}>{tr('Todos','All')} <b>{result.eventos.length}</b></button>{categories.map(c=><button key={c} type="button" style={{'--event-color':EVENT_CATEGORIES[c]?.[1]||'var(--eade-muted)'}} aria-pressed={currentCategory===c} onClick={()=>setEventCategory(c)}><i aria-hidden="true"/>{term(EVENT_CATEGORIES[c]?.[0]||c)} <b>{result.eventos.filter(e=>(e.categoria||'otros')===c).length}</b></button>)}</div>}
    {!events.length&&<p className="europe-empty">{tr('No hay hitos registrados para este año y categoría. Puedes explorar otro año en la línea temporal.','No milestones are recorded for this year and category. Explore another year on the timeline.')}</p>}
    <ol>{events.map(event=><li key={event.id}><small>{event.desde??event.anio}{event.hasta&&event.hasta!==(event.desde??event.anio)?`–${event.hasta} · ${tr('En curso','Ongoing')}`:''} · {term(EVENT_CATEGORIES[event.categoria]?.[0]||event.categoria)}</small><button type="button" onClick={()=>onEvent(event)}>{term(event.titulo)}</button><p>{note(event.descripcion)}</p>{event.personas?.length>0&&<div className="europe-event-people">{event.personas.map(id=>{const p=PERSONAS.find(p=>p.id===id);return p?<button key={id} onClick={()=>onSelect(id)}>{p.nombre}</button>:null;})}</div>}</li>)}</ol>
   </section>
  </div>
  {timeline}
  <section className="europe-protagonists" aria-labelledby="europe-protagonists-title"><div className="europe-section-heading"><div><span>{tr('Desde las historias del Atlas','From the Atlas stories')}</span><h2 id="europe-protagonists-title">{tr('Protagonistas de este momento','People at this moment')}</h2></div><span>{protagonists.length} {tr('personas vinculadas','linked people')}</span></div>
   <p className="europe-note">{tr('Selección de las historias y acontecimientos de este momento, completada con soberanos registrados. Cada tarjeta indica su vínculo y permite abrir la ficha.','A selection from stories and events at this moment, completed with recorded rulers. Each card identifies the connection and opens the profile.')}</p>
   {!protagonists.length&&<p>{tr('No hay protagonistas vinculados a historias o acontecimientos de este año. La tabla de gobernantes sigue disponible.','No people are linked to stories or events in this year. The table of rulers is still available.')}</p>}
   <div className="europe-person-grid">{protagonists.slice(0,peopleLimit).map(({person,reasons,stories})=>{const image=IMAGENES_PERSONAS[person.id];return <article key={person.id}>
    <button className="europe-person-card" onClick={()=>onSelect(person.id)}>
     {image?<img {...responsiveImage(image.archivo,'66px')} alt={en?`Portrait of ${person.nombre}`:(image.alt||`Retrato de ${person.nombre}`)} loading="lazy" style={{objectPosition:image.encuadre}}/>:<span className="europe-person-initial" aria-hidden="true">{person.nombre[0]}</span>}
     <span><strong>{person.nombre}</strong><small>{governmentSummary(person,year).map(term).join(' · ')||term(person.titulo)}</small><span>{term(reasons[0])}</span></span>
    </button>
    <div className="europe-person-context">{stories.map(story=><a key={story.id} href={translatedEquivalent(`/es/historia/${slugPublico(story.titulo)}`,locale)}>{term(story.titulo)} →</a>)}{image&&<details><summary>{tr('Imagen y derechos','Image and rights')}</summary><p>{term(image.tipo)} · {image.autor} · {image.fecha}</p><a href={image.fuenteUrl}>{tr('Fuente','Source')}</a> · <a href={image.derechosUrl}>{image.derechos}</a></details>}</div>
   </article>;})}</div>
   {protagonists.length>peopleLimit&&<button className="europe-more" onClick={()=>setPeopleLimit(n=>n+8)}>{tr('Ver más protagonistas','Show more people')} ({protagonists.length-peopleLimit})</button>}
  </section>
  <GovernmentsTable people={PERSONAS} year={year} onSelect={onSelect} locale={locale}/>
  {(result.crisis.length>0||result.uniones.length>0)&&<details className="europe-context-details"><summary>{tr('Sucesiones disputadas y uniones en contexto','Disputed successions and unions in context')}</summary>{[...result.crisis,...result.uniones].map(item=><article key={item.id}><h3>{term(item.titulo)}</h3><p>{note(item.resumen)}</p><a href={translatedEquivalent(`/es/territorio/${slugPublico(item.territorios[0])}`,locale)}>{tr('Contexto, títulos y fuentes','Context, titles and sources')} →</a></article>)}</details>}
 </main>;
}
