import {ArrowRight, BookOpen, GraduationCap, Map as MapIcon} from 'lucide-react';
import {usePublicMeta, PublicLayout, useJson} from './publicShared.jsx';
import {HOME_META} from './publicMeta.js';
import HOME_DATA from '../../generated/home.json';
import {DiscoveryCarousel, Portrait} from './HomeDiscovery.jsx';
import HomeSearch from './HomeSearch.jsx';
import DynastyArms from '../../components/DynastyArms.jsx';
import Odometer from '../../ui/Odometer.jsx';
import {documentaryLife} from '../../domain/time/documentaryDates.js';
import {pickOfTheDay} from './dailyPick.js';
import {useState} from 'react';
import '../../styles/theme.css';
import './home-discovery.css';
import './home-atlas.css';

export function HomePage({ onEnterAtlas, onOpenPanel, prerendered = false }) {
  usePublicMeta(HOME_META);

  return (
    <PublicLayout pathname="/es" prerendered={prerendered}>
      <HomeContent data={HOME_DATA} onEnterAtlas={onEnterAtlas} onOpenPanel={onOpenPanel} />
    </PublicLayout>
  );
}

// 6.0.10: the map of Europe opens the home page; below it, a person of the day
// and carousels of people, dynasties and stories.
export {HOME_YEARS} from './homeYears.js';
import {HOME_YEARS} from './homeYears.js';
const HOME_YEAR = 1500;
export const mapImage = (year, dark) => `/home/mapa-${year}-${dark ? 'oscuro' : 'claro'}.webp`;
export const HOME_TITLES = {es: 'Seis siglos de Europa, familia a familia', en: 'Six centuries of Europe, family by family'};

const HOME_COPY = {
  es: {
    eyebrow: 'Genealogía · política · territorio · 1200–1800',
    introduction: 'Mira el mapa de cada época, sigue los parentescos entre las casas que gobernaron y lee la vida de quienes las formaron, de 1200 a 1800.',
    explore: 'Explorar el atlas', tutorial: 'Tutorial', searched: 'Más buscados',
    rulers: (year, total) => [`Gobernaban en ${year}`, `${total} soberanos`], allRulers: year => `Ver Europa en ${year}`,
    travel: 'Viaja en el tiempo', mapOf: year => `Mapa de Europa en ${year}`,
    statsLabel: 'Resumen del proyecto', stats: ['personas', 'dinastías', 'territorios', 'historias guiadas'],
    dailyEyebrow: 'Persona del día', readBio: 'Leer su biografía', seeAtlas: 'Verla en el atlas',
    peopleEyebrow: 'Personas', peopleTitle: 'Figuras de seis siglos', allPeople: 'Todas las personas',
    dynastiesEyebrow: 'Dinastías', dynastiesTitle: 'Las casas que se repartieron Europa', allDynasties: 'Todas las dinastías', members: 'personas',
    storiesEyebrow: 'Historias', storiesTitle: 'Recorridos guiados', allStories: 'Todas las historias', chapters: 'capítulos', guided: 'Recorrido guiado',
  },
  en: {
    eyebrow: 'Genealogy · politics · territory · 1200–1800',
    introduction: 'See the map of each era, follow the kinship between the ruling houses and read the lives of the people who made them, from 1200 to 1800.',
    explore: 'Explore the Atlas', tutorial: 'Tutorial', searched: 'Most searched',
    rulers: (year, total) => [`Ruling in ${year}`, `${total} sovereigns`], allRulers: year => `See Europe in ${year}`,
    travel: 'Travel in time', mapOf: year => `Map of Europe in ${year}`,
    statsLabel: 'The complete Atlas', stats: ['people', 'dynasties', 'territories', 'guided stories'],
    dailyEyebrow: 'Person of the day', readBio: 'Read the biography', seeAtlas: 'See them in the Atlas',
    peopleEyebrow: 'People', peopleTitle: 'Figures from six centuries', allPeople: 'All people',
    dynastiesEyebrow: 'Dynasties', dynastiesTitle: 'The houses that divided Europe', allDynasties: 'All dynasties', members: 'people',
    storiesEyebrow: 'Stories', storiesTitle: 'Guided journeys', allStories: 'All stories', chapters: 'chapters', guided: 'Guided journey',
  },
};

const STORY_PORTRAITS = {borgona: 'CAR1BORG', emperadores: 'CARLOS5', 'cien-anos': 'CARLOS7FRA', papales: 'PAPA_JULIO2', condotieros: 'FRAN1SFOR', gioconda: 'LEONARDODAVINCI'};

function SectionHead({eyebrow, title, href, link}) {
  return <div className="home-discovery-heading"><div><span className="home-eyebrow">{eyebrow}</span><h2>{title}</h2></div><a className="home-text-link" href={href}>{link} <ArrowRight size={14}/></a></div>;
}

function DailyPerson({locale}) {
  const en = locale === 'en', copy = HOME_COPY[en ? 'en' : 'es'];
  // Chosen in the browser from the date, so the static page does not depend on
  // the day it was built; the space is reserved while the pool loads.
  const {data, error} = useJson('/catalogos/recomendaciones.json');
  const person = pickOfTheDay(data?.items);
  if (error) return null;
  if (!person) return <section className="home-daily home-daily-loading public-section" aria-busy="true" aria-label={copy.dailyEyebrow}><span className="home-daily-art"/><div className="home-daily-copy"><span className="home-eyebrow">{copy.dailyEyebrow}</span></div></section>;
  const text = en ? person.en : person.es;
  const dates = documentaryLife(person).replace(/^\?\s*–\s*\?$/, '');
  return <section className="home-daily public-section" aria-label={copy.dailyEyebrow}>
    <a className="home-daily-art" href={text.path} tabIndex={-1} aria-hidden="true"><Portrait id={person.id} sizes="(max-width: 760px) 100vw, 360px"/></a>
    <div className="home-daily-copy">
      <span className="home-eyebrow">{copy.dailyEyebrow}</span>
      <h2><a href={text.path}>{text.nombre}</a></h2>
      <p className="home-daily-meta">{[dates, text.titulo, text.casa].filter(Boolean).join(' · ')}</p>
      <p className="home-daily-text">{text.texto}</p>
      <div className="home-daily-actions">
        <a className="public-primary" href={text.path}>{copy.readBio} <ArrowRight size={16}/></a>
        <a className="public-secondary" href={`${text.path}?atlas=1`}><MapIcon size={16}/> {copy.seeAtlas}</a>
      </div>
    </div>
  </section>;
}

// Both editions share this layout; only the copy and the records differ.
export function HomeContent({ data = HOME_DATA, locale = "es", title, onEnterAtlas, prerendered = false }) {
  // 6.0.11: the time line previews each year's map here; the button opens the Atlas.
  const [year, setYear] = useState(HOME_YEAR);
  const en = locale === "en";
  const copy = HOME_COPY[en ? "en" : "es"];
  const base = en ? '/en' : '/es';
  const stats = data?.stats || HOME_DATA.stats || {};
  const rulers = (en ? data?.rulersByYear?.[year] : data?.gobernantesPorAnio?.[year]) || (year === HOME_YEAR ? (en ? data?.rulersOfYear : data?.gobernantesAnio) : null);
  const warm = y => { if (typeof Image === 'function') new Image().src = mapImage(y, document.documentElement.dataset.eadeTheme === 'dark'); };
  const searched = (en ? data?.mostSearched : data?.masBuscados) || [];
  const people = (en ? data?.people : data?.personasDestacadas) || [];
  const dynasties = (en ? data?.dynasties : data?.dinastiasCarrusel) || [];
  const stories = (en ? data?.stories : data?.historiasCarrusel || data?.historiasDestacadas) || [];
  const atlasYear = y => `${base}?atlas=1&anio=${y}&panel=europa`;
  const enterAtlas = event => {
    if (typeof onEnterAtlas !== "function" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onEnterAtlas(null);
  };
  const [rulersEyebrow, rulersTitle] = copy.rulers(year, rulers?.total || 0);

  const personCard = (person, index) => <a className="home-feature-card home-feature-person" href={person.path || `/es/persona/${encodeURIComponent(person.slug)}`}>
    <div className="home-feature-art"><Portrait id={person.id}/><span className="home-feature-index">{String(index + 1).padStart(2, '0')}</span><span className="home-feature-arrow"><ArrowRight size={19}/></span></div>
    <div className="home-feature-copy"><span>{en ? person.role || 'Historical profile' : (person.dinastia && person.dinastia !== 'Sin casa identificada' ? person.dinastia : person.titulo)}</span><h3>{person.nombre}</h3><p>{documentaryLife(person)}</p></div>
  </a>;
  const dynastyCard = dynasty => <a className="home-feature-card home-feature-dynasty" href={dynasty.path || `/es/dinastia/${encodeURIComponent(dynasty.slug)}`}>
    <div className="home-feature-art home-dynasty-art"><DynastyArms dinastia={dynasty.key || dynasty.nombre} size={132} locale={locale}/><span className="home-feature-arrow"><ArrowRight size={19}/></span></div>
    <div className="home-feature-copy"><span>{dynasty.total} {copy.members}</span><h3>{dynasty.nombre}</h3><p>{en ? dynasty.description : dynasty.resumen}</p></div>
  </a>;
  const storyCard = (story, index) => <a className={`home-feature-card home-feature-story story-tone-${index % 3}`} href={story.path || `/es/historia/${encodeURIComponent(story.slug)}`}>
    <div className="home-feature-art"><Portrait id={story.retrato || STORY_PORTRAITS[story.id]} className="home-story-portrait"/><span className="home-story-chapters"><BookOpen size={14}/>{story.pasos} {copy.chapters}</span><span className="home-feature-arrow"><ArrowRight size={19}/></span></div>
    <div className="home-feature-copy"><span>{copy.guided}</span><h3>{en ? story.nombre : story.titulo}</h3><p>{en ? story.description : story.subtitulo || story.descripcion}</p></div>
  </a>;

  return (
      <main className="public-main public-home home-atlas">
        <section className="home-atlas-hero">
          <div className="home-atlas-map" role="img" aria-label={copy.mapOf(year)} style={{'--home-map-light': `url(${mapImage(year, false)})`, '--home-map-dark': `url(${mapImage(year, true)})`}}><span className="home-atlas-map-year" aria-hidden="true">{year}</span></div>
          <div className="home-atlas-copy">
            <div className="home-eyebrow">{copy.eyebrow}</div>
            <h1>{title || HOME_TITLES[en ? 'en' : 'es']}</h1>
            <p>{copy.introduction}</p>
            <HomeSearch locale={locale}/>
            {!!searched.length && <p className="home-atlas-searched"><span>{copy.searched}:</span> {searched.map(item => <a key={item.path} href={item.path}>{item.nombre}</a>)}</p>}
            <div className="public-hero-actions">
              <a className="public-primary" href={`${base}?atlas=1`} onClick={enterAtlas}>{copy.explore} <ArrowRight size={16} /></a>
              <a className="public-secondary" href={`${base}?atlas=1&tutorial=1`}><GraduationCap size={16} /> {copy.tutorial}</a>
            </div>
          </div>
          {!!rulers?.people?.length || !!rulers?.personas?.length ? <aside className="home-atlas-rulers" aria-label={rulersEyebrow}>
            <span className="home-eyebrow">{rulersEyebrow}</span>
            <h2>{rulersTitle}</h2>
            <ul>{(en ? rulers.people : rulers.personas).map(r => <li key={r.id}><a href={r.path || `/es/persona/${r.slug}`}><Portrait id={r.id} className="home-atlas-ruler-portrait" sizes="48px"/><span><strong>{r.nombre}</strong><small>{en ? r.territory : r.territorio} · {en ? r.from : r.desde}–{en ? r.to : r.hasta}</small></span></a></li>)}</ul>
          </aside> : null}
          <nav className="home-atlas-years" aria-label={copy.travel}>
            <span className="home-eyebrow">{copy.travel}</span>
            <div>{HOME_YEARS.map(y => <button key={y} type="button" aria-pressed={y === year} aria-label={copy.mapOf(y)} onClick={() => setYear(y)} onPointerEnter={() => warm(y)} onFocus={() => warm(y)}>{y}</button>)}</div>
            <a className="home-atlas-open" href={atlasYear(year)}>{copy.allRulers(year)} <ArrowRight size={15}/></a>
          </nav>
        </section>

        <div className="public-hero-stats home-atlas-stats" aria-label={copy.statsLabel}>
          {["personas", "dinastias", "territorios", "historias"].map((key, index) => <span key={key}><strong><Odometer value={stats[key]} locale={locale}/></strong>{copy.stats[index]}</span>)}
        </div>

        <DailyPerson locale={locale}/>

        {!!people.length && <section className="home-discovery public-section">
          <SectionHead eyebrow={copy.peopleEyebrow} title={copy.peopleTitle} href={en ? '/en/people' : '/es/personas'} link={copy.allPeople}/>
          <DiscoveryCarousel items={people} renderItem={personCard} label={copy.peopleTitle} locale={locale}/>
        </section>}
        {!!dynasties.length && <section className="home-discovery public-section">
          <SectionHead eyebrow={copy.dynastiesEyebrow} title={copy.dynastiesTitle} href={en ? '/en/dynasties' : '/es/dinastias'} link={copy.allDynasties}/>
          <DiscoveryCarousel items={dynasties.map(d => ({...d, id: d.slug || d.path}))} renderItem={dynastyCard} label={copy.dynastiesTitle} locale={locale} hint={en ? 'Follow a house through the centuries.' : 'Sigue una casa a lo largo de los siglos.'}/>
        </section>}
        {!!stories.length && <section className="home-discovery public-section">
          <SectionHead eyebrow={copy.storiesEyebrow} title={copy.storiesTitle} href={en ? '/en/stories' : '/es/historias'} link={copy.allStories}/>
          <DiscoveryCarousel items={stories} renderItem={storyCard} label={copy.storiesTitle} locale={locale} hint={en ? 'Find a thread. Follow the story.' : 'Encuentra un hilo. Sigue la historia.'}/>
        </section>}
      </main>
  );
}
