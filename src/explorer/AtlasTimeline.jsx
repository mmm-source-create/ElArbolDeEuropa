import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ZoomIn,ZoomOut,Crosshair,X} from 'lucide-react';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import {EVENT_CATEGORIES,timelineX,timelineYearAt,layoutTimelineEvents,timelineGovernments} from './timelineLayout.js';
import {TL_MIN,TL_MAX,etiquetaFechaEvento,formatoFechas} from './timelineUtils.js';
import {BY_ID,TIMELINE_SCALES} from './model.js';
import {governmentSummary} from '../data/governmentPresentation.js';
import './atlas-timeline.css';

const MODES=[{value:'personas',label:'Personas'},{value:'eventos',label:'Eventos'},{value:'ambos',label:'Ambos'}];
export default function AtlasTimeline({vm}) {
 const {timelineMode:mode,setTimelineMode, timelineScaleIndex:scaleIndex,setTimelineScaleIndex,tlScrollRef:scrollRef,timelineListRef:listRef,timelineVirtual:virtual,anioGlobal:year,actualizarAnioDesdeRango:onYear,seleccion,seleccionarPersonaPorId,seleccionarEvento:onEvent,eventoSeleccionado:event,setEventoSeleccionadoId,timelinePeople,eventosOrdenados:allEvents,timelinePxPerYear:scale,timelineTrackWidth:width}=vm;
 const onSelect=id=>seleccionarPersonaPorId(id,{abrirAtlas:vm.atlasScene==='europa'});
 const [hidden,setHidden]=useState(()=>new Set()),[cursor,setCursor]=useState(null);
 const drag=useRef(null),zoomAnchor=useRef(null),suppressClick=useRef(false);
 const events=useMemo(()=>allEvents.filter(e=>!hidden.has(e.categoria||'otros')),[allEvents,hidden]);
 const lanes=useMemo(()=>layoutTimelineEvents(events,scale),[events,scale]);
 const categories=useMemo(()=>[...new Set(allEvents.map(e=>e.categoria||'otros'))],[allEvents]);
 const tickStep=scale<3?50:scale<7?20:10;
 const ticks=[];for(let y=Math.ceil(TL_MIN/tickStep)*tickStep;y<=TL_MAX;y+=tickStep)ticks.push(y);
 useEffect(()=>{
  const el=scrollRef.current;if(!el)return;
  if(Number.isInteger(year))el.scrollLeft=Math.max(0,timelineX(year,scale)-el.clientWidth/2);
  const row=virtual.byKey.get(`person:${seleccion?.id}`);
  if(row)el.scrollTop=Math.max(0,row.start+row.size/2-(el.clientHeight-(listRef.current?.offsetTop||0))/2);
  // Initial framing only; deliberate panning is retained while the year changes.
 },[]);
 const setZoom=(index,anchor=null)=>{const el=scrollRef.current;if(!el)return;zoomAnchor.current=anchor||{year:TL_MIN+(el.scrollLeft+el.clientWidth/2)/scale,px:el.clientWidth/2};setTimelineScaleIndex(Math.max(0,Math.min(TIMELINE_SCALES.length-1,index)));};
 useEffect(()=>{if(zoomAnchor.current&&scrollRef.current){const a=zoomAnchor.current;scrollRef.current.scrollLeft=timelineX(a.year,scale)-a.px;zoomAnchor.current=null;}},[scale,scrollRef]);
 useEffect(()=>{const el=scrollRef.current;if(!el)return;const wheel=e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const px=e.clientX-el.getBoundingClientRect().left;setZoom(scaleIndex+(e.deltaY<0?1:-1),{year:TL_MIN+(el.scrollLeft+px)/scale,px});};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);},[scaleIndex,scale,scrollRef]);
 const xFromEvent=e=>e.clientX-e.currentTarget.getBoundingClientRect().left+e.currentTarget.scrollLeft;
 const panStart=e=>{suppressClick.current=false;if(e.button!==0||e.target.closest('.atlas-timeline-axis'))return;drag.current={id:e.pointerId,x:e.clientX,left:e.currentTarget.scrollLeft,moved:false};};
 const panMove=e=>{const x=xFromEvent(e);setCursor(timelineYearAt(x,scale,TL_MIN,TL_MAX));const d=drag.current;if(!d)return;if(!(e.buttons&1)){drag.current=null;return;}if(Math.abs(e.clientX-d.x)>5){d.moved=true;e.currentTarget.setPointerCapture?.(e.pointerId);e.currentTarget.scrollLeft=d.left-(e.clientX-d.x);}};
 const panEnd=e=>{suppressClick.current=Boolean(drag.current?.moved);drag.current=null;if(e.currentTarget.hasPointerCapture?.(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
 const choose=(e,action)=>{if(suppressClick.current&&e.detail!==0){e.preventDefault();suppressClick.current=false;return;}suppressClick.current=false;action();};
 const selectedGroups=seleccion?governmentSummary(seleccion,year):[];
 return <section className={`atlas-timeline panel ${mode==='eventos'?'only-events':''}`} aria-labelledby="atlas-timeline-title">
  <header className="atlas-timeline-heading"><div><h2 id="atlas-timeline-title">Línea temporal</h2><span>{timelinePeople.length} personas · {events.length} acontecimientos</span></div><div className="atlas-timeline-tools"><SegmentedControl options={MODES} value={mode} onChange={setTimelineMode} label="Contenido de la línea temporal"/><div className="atlas-timeline-zoom" aria-label="Escala temporal"><button aria-label="Reducir escala temporal" disabled={scaleIndex===0} onClick={()=>setZoom(scaleIndex-1)}><ZoomOut size={15}/></button><button aria-label="Centrar en el año global" disabled={!Number.isInteger(year)} onClick={()=>vm.centerTimelineOnYear(year)}><Crosshair size={15}/></button><button aria-label="Ampliar escala temporal" disabled={scaleIndex===TIMELINE_SCALES.length-1} onClick={()=>setZoom(scaleIndex+1)}><ZoomIn size={15}/></button></div></div></header>
  <div className="atlas-timeline-status">{Number.isInteger(year)?<><b>{year}</b><span>{vm.personasVivasEnAnio.length} vidas compatibles · {vm.gobernantesActivosEnAnio.length} gobernantes</span></>:<span>Todos los años · pulsa el eje para fijar un año</span>}<small>Vida: trazo fino · Gobierno: barras de color</small></div>
  {mode!=='personas'&&<div className="atlas-timeline-legend" aria-label="Tipos de acontecimientos">{categories.map(c=><button key={c} style={{'--event-color':EVENT_CATEGORIES[c]?.[1]||'#9073ad'}} aria-pressed={!hidden.has(c)} onClick={()=>setHidden(previous=>{const next=new Set(previous);if(next.has(c))next.delete(c);else next.add(c);return next;})}>{EVENT_CATEGORIES[c]?.[0]||c}<span>{allEvents.filter(e=>(e.categoria||'otros')===c).length}</span></button>)}</div>}
  {event&&<div className="atlas-timeline-detail"><div><small>{etiquetaFechaEvento(event)} · {event.categoria}</small><h3>{event.titulo}</h3><p>{event.descripcion}</p>{event.personas?.map(id=><button key={id} onClick={()=>onSelect(id)}>{BY_ID[id]?.nombre||id}</button>)}</div><button aria-label="Cerrar detalle del evento" onClick={()=>setEventoSeleccionadoId(null)}><X size={15}/></button></div>}
  <div className="atlas-timeline-scroll" ref={scrollRef} tabIndex={0} aria-label="Cronología. Flechas para desplazarse; pulsa el eje para elegir un año." onPointerDown={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={()=>{drag.current=null;}} onPointerLeave={()=>setCursor(null)}>
   <div className="atlas-timeline-content" style={{width:width+280}}>
    <div className="atlas-timeline-axis" role="slider" tabIndex={0} aria-label="Año de la línea temporal" aria-valuemin={TL_MIN} aria-valuemax={TL_MAX} aria-valuenow={year??1500} onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();onYear(timelineYearAt(e.clientX-rect.left,scale,TL_MIN,TL_MAX));}} onKeyDown={e=>{const delta={ArrowLeft:-1,ArrowRight:1,PageUp:-10,PageDown:10}[e.key];const next=e.key==='Home'?TL_MIN:e.key==='End'?TL_MAX:delta?(year??1500)+delta:null;if(next!==null){e.preventDefault();onYear(Math.max(TL_MIN,Math.min(TL_MAX,next)));}}}>
     {ticks.map(y=><span key={y} style={{left:timelineX(y,scale)}}>{y}</span>)}
    </div>
    {mode!=='personas'&&<div className="atlas-timeline-events" tabIndex={0} aria-label="Acontecimientos de la cronología" style={{height:lanes.height}}>{lanes.items.map(({event:e,start,duration,width:visualWidth,lane})=><button key={e.id} className={`atlas-timeline-event ${duration?'is-period':'is-point'}`} style={{left:start,top:5+lane*27,width:visualWidth,'--event-color':EVENT_CATEGORIES[e.categoria]?.[1]||'#9073ad'}} onClick={click=>choose(click,()=>onEvent(e))} title={`${etiquetaFechaEvento(e)} · ${e.titulo}`}><span>{e.titulo}</span>{duration>0&&<i style={{width:duration}}/>}</button>)}</div>}
    <div ref={listRef} className="atlas-timeline-rows" style={{height:mode==='eventos'?0:virtual.total,backgroundSize:`${tickStep*scale}px 100%`}}>
     {mode!=='personas'&&events.filter(e=>Number.isInteger(e.desde)&&e.hasta>e.desde).map(e=><span className="atlas-timeline-period" key={e.id} style={{left:timelineX(e.desde,scale),width:(e.hasta-e.desde)*scale,background:EVENT_CATEGORIES[e.categoria]?.[1]||'#9073ad'}} aria-hidden="true"/>)}
     {mode!=='eventos'&&virtual.visible.map(row=>row.kind==='group'?<div key={row.key} className="atlas-timeline-group" style={{top:row.start,height:row.size,'--group-color':row.color}}><span>{row.label} <small>{row.count}</small></span></div>:<div key={row.key} className="atlas-timeline-lane" style={{top:row.start,height:row.size}}>{row.people.map(({person,from,through,start,width:lifeWidth,end})=>{const governments=timelineGovernments(person),keys=[...new Set(governments.map(g=>g.key))];return <button key={person.id} type="button" className={`atlas-timeline-person ${seleccion?.id===person.id?'is-selected':''}`} style={{left:start,width:end-start,height:row.size-4,'--person-color':row.color}} onClick={e=>choose(e,()=>onSelect(person.id))} title={`${person.nombre} · ${formatoFechas(person)}${governments.map(g=>`\n${g.label}: ${g.from}–${g.through}`).join('')}`} aria-label={`${person.nombre}. ${formatoFechas(person)}. ${[...new Set(governments.map(g=>g.label))].join(', ')}`}>
      <span className="atlas-timeline-name">{person.nombre}<small>{formatoFechas(person)}</small></span>
      {Number.isFinite(from)&&Number.isFinite(through)&&<i className={`atlas-timeline-life ${!Number.isInteger(person.nac)||!Number.isInteger(person.muer)?"is-incomplete":""}`} style={{width:lifeWidth}}/>}
      {governments.map((g,i)=><i className={`atlas-timeline-reign ${g.kind!=='sovereign'?'is-delegated':''}`} key={i} style={{left:(g.from-from)*scale,width:Math.max(3,(g.through-g.from+1)*scale),top:31+keys.indexOf(g.key)*7,backgroundColor:g.color}}/>)}
     </button>;})}</div>)}
    </div>
    {Number.isInteger(year)&&<span className="atlas-timeline-year" style={{left:timelineX(year,scale)}} aria-hidden="true"><b>{year}</b></span>}
    {cursor!==null&&<span className="atlas-timeline-hover" style={{left:timelineX(cursor,scale)}} aria-hidden="true"><b>{cursor}</b></span>}
   </div>
  </div>
  <footer className="atlas-timeline-footer">{seleccion?<><strong>{seleccion.nombre}</strong><span>{formatoFechas(seleccion)}{selectedGroups.length?` · ${selectedGroups.join(' · ')}`:''}</span></>:<span>Elige una persona para ver su ficha · arrastra para desplazarte · Ctrl/⌘ + rueda para ampliar</span>}</footer>
 </section>;
}
