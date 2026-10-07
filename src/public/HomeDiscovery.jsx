import React, {useEffect, useId, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, Crown, Pause, Play} from 'lucide-react';
import {IMAGENES_PERSONAS} from '../imagenesPersonas.js';
import {responsiveImage} from '../utils/responsiveImage.js';
import {documentaryLife} from '../utils/documentaryDates.js';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import useReducedMotion from '../ui/useReducedMotion.js';
import './home-discovery.css';

const STORY_PORTRAITS = {borgona: 'CAR1BORG', emperadores: 'CARLOS5', 'cien-anos': 'CARLOS7FRA', papales: 'PAPA_JULIO2', condotieros: 'FRAN1SFOR', gioconda: 'LEONARDODAVINCI'};
const TABS_ES = [{value: 'people', label: 'Personajes'}, {value: 'stories', label: 'Historias'}];
const TABS_EN = [{value: 'people', label: 'People'}, {value: 'stories', label: 'Stories'}];

function Portrait({id, className = '', sizes = '300px'}) {
  const image = IMAGENES_PERSONAS[id];
  return <span className={`home-portrait ${className}`} aria-hidden="true">{image
    ? <img {...responsiveImage(image.archivo, sizes)} alt="" loading="lazy" decoding="async" style={{objectPosition: image.encuadre || image.posicion || '50% 20%'}}/>
    : <Crown size={64} strokeWidth={.65}/>}</span>;
}

export function DiscoveryCarousel({items, renderItem, label, locale = 'es', hint}) {
  const track = useRef(null), frame = useRef(null);
  const id = useId(), reduced = useReducedMotion();
  const [position, setPosition] = useState({index: 0, previous: false, next: false});
  const measure = () => {
    const element = track.current;
    if (!element?.clientWidth) return;
    const cards = [...element.children];
    const relative = element.scrollLeft;
    if (!cards.length) return;
    const index = cards.reduce((nearest, card, current) => Math.abs(card.offsetLeft - element.offsetLeft - relative)
      < Math.abs(cards[nearest].offsetLeft - element.offsetLeft - relative) ? current : nearest, 0);
    setPosition({index, previous: relative > 2, next: relative + element.clientWidth < element.scrollWidth - 2});
  };
  useEffect(() => {
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    if (track.current) observer?.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {observer?.disconnect(); window.removeEventListener('resize', measure); if (frame.current) cancelAnimationFrame(frame.current);};
  }, [items]);
  const move = direction => track.current?.scrollBy({left: direction * track.current.clientWidth * .85, behavior: reduced ? 'instant' : 'smooth'});
  const onScroll = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(measure);
  };
  if (!items.length) return null;
  return <div className="home-carousel" role="region" aria-roledescription={locale === 'en' ? 'carousel' : 'carrusel'} aria-label={label}>
    <div className="home-carousel-track" id={id} ref={track} onScroll={onScroll} tabIndex={0} onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);}
    }}>
      {items.map((item, index) => <div key={item.id} className="home-carousel-slide" role="group" aria-label={`${index + 1} / ${items.length}`}>{renderItem(item, index)}</div>)}
    </div>
    <div className="home-carousel-footer">
      <span>{hint || (locale === 'en' ? 'Follow a life. Discover its connections.' : 'Sigue una vida. Descubre sus conexiones.')}</span>
      <div className="home-carousel-navigation">
        <span className="home-carousel-count" aria-live="polite" aria-atomic="true">{String(position.index + 1).padStart(2, '0')} <i aria-hidden="true">/</i> {String(items.length).padStart(2, '0')}</span>
        <button type="button" aria-label={locale === 'en' ? 'Previous cards' : 'Tarjetas anteriores'} aria-controls={id} disabled={!position.previous} onClick={() => move(-1)}><ArrowLeft size={18}/></button>
        <button type="button" aria-label={locale === 'en' ? 'Next cards' : 'Tarjetas siguientes'} aria-controls={id} disabled={!position.next} onClick={() => move(1)}><ArrowRight size={18}/></button>
      </div>
    </div>
  </div>;
}

export default function HomeDiscovery({people = [], stories = [], locale = 'es', peoplePath, storiesPath}) {
  const [active, setActive] = useState(people.length ? 'people' : 'stories');
  const id = useId(), en = locale === 'en';
  const peopleCard = (person, index) => <a className="home-feature-card home-feature-person" href={person.path || `/es/persona/${encodeURIComponent(person.slug)}`}>
    <div className="home-feature-art"><Portrait id={person.id}/><span className="home-feature-index">{String(index + 1).padStart(2, '0')}</span><span className="home-feature-arrow"><ArrowRight size={19}/></span></div>
    <div className="home-feature-copy"><span>{en ? person.role || 'Historical profile' : (person.dinastia && person.dinastia !== 'Sin casa identificada' ? person.dinastia : person.titulo)}</span><h3>{person.nombre}</h3><p>{en ? documentaryLife(person).replace('Fechas no documentadas', 'Dates not recorded').replace('antes de ', 'before ').replace('después de ', 'after ') : documentaryLife(person)}</p></div>
  </a>;
  const storyCard = (story, index) => <a className={`home-feature-card home-feature-story story-tone-${index % 3}`} href={story.path || `/es/historia/${encodeURIComponent(story.slug)}`}>
    <div className="home-feature-art"><Portrait id={STORY_PORTRAITS[story.id]} className="home-story-portrait"/><span className="home-story-chapters"><BookOpen size={14}/>{story.pasos} {en ? 'chapters' : 'capítulos'}</span><span className="home-feature-arrow"><ArrowRight size={19}/></span></div>
    <div className="home-feature-copy"><span>{en ? 'Guided journey' : 'Recorrido guiado'}</span><h3>{en ? story.nombre : story.titulo}</h3><p>{en ? story.description : story.subtitulo || story.descripcion}</p></div>
  </a>;
  if (!people.length && !stories.length) return null;
  return <section className="home-discovery public-section" aria-labelledby={`${id}-heading`}>
    <div className="home-discovery-heading"><div><span className="home-eyebrow">{en ? 'A point of departure' : 'Un punto de partida'}</span><h2 id={`${id}-heading`}>{en ? 'Open a door to history.' : 'Abre una puerta a la historia.'}</h2></div><a className="home-text-link" href={active === 'people' ? peoplePath : storiesPath}>{active === 'people' ? en ? 'All people' : 'Todos los personajes' : en ? 'All stories' : 'Todas las historias'}<ArrowRight size={15}/></a></div>
    <SegmentedControl id={id} tabs label={en ? 'Explore featured content' : 'Explorar contenido destacado'} options={en ? TABS_EN : TABS_ES} value={active} onChange={setActive}/>
    <div id={`${id}-panel-people`} role="tabpanel" aria-labelledby={`${id}-tab-people`} hidden={active !== 'people'}><DiscoveryCarousel items={people} renderItem={peopleCard} label={en ? 'Featured people' : 'Personajes de puerta'} locale={locale}/></div>
    <div id={`${id}-panel-stories`} role="tabpanel" aria-labelledby={`${id}-tab-stories`} hidden={active !== 'stories'}><DiscoveryCarousel items={stories} renderItem={storyCard} hint={en ? "Find a thread. Follow the story." : "Encuentra un hilo. Sigue la historia."} label={en ? 'Featured stories' : 'Historias de puerta'} locale={locale}/></div>
  </section>;
}

export function DynastyMarquee({dynasties = [], locale = 'es'}) {
  const [paused, setPaused] = useState(false), reduced = useReducedMotion();
  if (!dynasties.length) return null;
  return <section className={`home-marquee${paused || reduced ? ' is-paused' : ''}`} aria-label={locale === 'en' ? 'Discover dynasties' : 'Descubre dinastías'}>
    <div className="home-marquee-window"><div className="home-marquee-track">{[0, 1].map(copy => <div className="home-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{dynasties.map(dynasty => <a key={dynasty.slug} href={`/es/dinastia/${encodeURIComponent(dynasty.slug)}`} tabIndex={copy === 1 ? -1 : undefined}>{dynasty.nombre}<span aria-hidden="true">✦</span></a>)}</div>)}</div></div>
    <button type="button" aria-label={paused ? locale === 'en' ? 'Resume dynasty ribbon' : 'Reanudar cinta de dinastías' : locale === 'en' ? 'Pause dynasty ribbon' : 'Pausar cinta de dinastías'} aria-pressed={paused} onClick={() => setPaused(value => !value)} disabled={reduced}>{paused || reduced ? <Play size={14}/> : <Pause size={14}/>}</button>
  </section>;
}
