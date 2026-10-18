import {Users, Shield, Landmark, BookOpen, Swords, Sparkles, ArrowRight} from 'lucide-react';
import {usePublicMeta, PublicLayout} from './publicShared.jsx';
import HOME_DATA from '../../generated/home.json';
import HomeDiscovery from './HomeDiscovery.jsx';
import Odometer from '../../ui/Odometer.jsx';
import '../../styles/theme.css';

export function HomePage({ onEnterAtlas, onOpenPanel }) {
  usePublicMeta({
    title: "El Árbol de Europa | Atlas genealógico e histórico interactivo",
    description: "Explora personas, dinastías, parentescos, reinados, territorios e historias de la Europa medieval y moderna.",
    path: "/es/",
  });

  return (
    <PublicLayout>
      <HomeContent data={HOME_DATA} onEnterAtlas={onEnterAtlas} onOpenPanel={onOpenPanel} />
    </PublicLayout>
  );
}

const HOME_COPY = {
  es: {
    title: "La historia de Europa, vista como una red",
    eyebrow: "Genealogía · política · territorio · 1200–1800",
    introduction: "Recorre familias, coronas, matrimonios, rivalidades y sucesiones en un atlas que une árbol genealógico, mapa, biografías, cronología e historias guiadas.",
    explore: "Explorar el atlas", stories: "Ver historias", year: "Europa en 1500",
    statsLabel: "Resumen del proyecto", stats: ["personas", "dinastías", "territorios", "historias disponibles"],
    doorsEyebrow: "Entradas rápidas", doorsTitle: "Elige cómo quieres empezar",
    peopleEyebrow: "Personas destacadas", peopleTitle: "Puertas a la red", allPeople: "Ver todas las personas",
    storiesEyebrow: "Recorridos guiados", storiesTitle: "Historias para entrar en el atlas", allStories: "Todas las historias", chapters: "capítulos", start: "Comenzar recorrido",
    aboutEyebrow: "Un proyecto en crecimiento", aboutTitle: "Una base histórica para explorar, no una lista cerrada",
    about: "El proyecto combina genealogía, cronología y cartografía. La ausencia de una relación o personaje puede significar que todavía no se ha incorporado; las correcciones documentadas tienen prioridad sobre la mera coherencia visual.",
    project: "Acerca del proyecto", methodology: "Fuentes y metodología",
  },
  en: {
    title: "The history of Europe, seen as a network",
    eyebrow: "Genealogy · politics · territory · 1200–1800",
    introduction: "Explore families, crowns, marriages, rivalries and successions in an Atlas that connects genealogy, maps, biographies, timelines and guided stories.",
    explore: "Explore the Atlas (Spanish)", stories: "Read the stories", year: "Europe in 1500 (Spanish)",
    statsLabel: "The complete Atlas", stats: ["people", "dynasties", "territories", "stories in the Atlas"],
    doorsEyebrow: "Ways into the Atlas", doorsTitle: "Choose where to begin",
    peopleEyebrow: "Featured people", peopleTitle: "Doors into the network", allPeople: "All English profiles",
    storiesEyebrow: "Guided journeys", storiesTitle: "Stories that open the Atlas", allStories: "All English stories", chapters: "chapters", start: "Begin the story",
    aboutEyebrow: "A growing project", aboutTitle: "A historical base to explore, not a closed list",
    about: "The project brings together genealogy, chronology and cartography. A missing person or relationship may simply not have been added yet. Documented corrections take priority over visual consistency.",
    project: "About the project", methodology: "Sources and methodology",
  },
};

// Both editions use the original public layout; only the copy and available records differ.
export function HomeContent({ data = HOME_DATA, locale = "es", title, onEnterAtlas, onOpenPanel, prerendered = false }) {
  const english = locale === "en";
  const copy = HOME_COPY[english ? "en" : "es"];
  const stats = data?.stats || HOME_DATA.stats || {};
  const people = english ? data?.people : data?.personasDestacadas;
  const stories = english ? data?.stories : data?.historiasDestacadas;
  const peoplePath = english ? "/en/people" : "/es/personas";
  const storiesPath = english ? "/en/stories" : "/es/historias";
  const doors = [
    { href: peoplePath, Icon: Users, title: english ? "People" : "Personas", description: english ? "Begin with a person, their family and their time." : "Busca una figura y entra por su familia, reinados y época." },
    { href: "/es/dinastias", Icon: Shield, title: english ? "Dynasties" : "Dinastías", description: english ? "Capetians, Habsburgs, Trastámaras, Bourbons and many more." : "Capetos, Habsburgo, Trastámara, Borbones y muchas más.", spanish: true },
    { href: "/es/territorios", Icon: Landmark, title: english ? "Territories" : "Territorios", description: english ? "Discover who ruled where and how the crowns connect." : "Explora quién gobernó dónde y cómo se conectan las coronas.", spanish: true },
    { href: storiesPath, Icon: BookOpen, title: english ? "Stories" : "Historias", description: english ? "Read guided journeys through art, politics and dynastic history." : "Recorridos guiados por guerras, artistas, favoritos y dinastías." },
    { href: "/es/desafio", Icon: Swords, title: english ? "Challenge" : "Desafío", description: english ? "Test your knowledge through connections, portraits and a daily challenge." : "El Camino, Racha, Retratos y un desafío diario con la propia base histórica.", spanish: true },
    { href: "/es/?atlas=1&panel=estadisticas", Icon: Sparkles, title: english ? "Statistics" : "Estadísticas", description: english ? "Explore the houses, territories and people represented in the Atlas." : "Descubre qué casas, territorios y figuras dominan la base.", spanish: true, panel: "estadisticas" },
  ];
  const navigateInApp = (event, callback, value) => {
    if (typeof callback !== "function" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    callback(value);
  };
  return (
      <main className="public-main public-home">
        <section className="public-hero">
          <div className="public-hero-eyebrow">{copy.eyebrow}</div>
          <h1>{title || copy.title}</h1>
          <p>{copy.introduction}</p>
          <div className="public-hero-actions">
            <a className="public-primary" href="/es/?atlas=1" onClick={(event) => navigateInApp(event, onEnterAtlas, null)}>{copy.explore} <ArrowRight size={16} /></a>
            <a className="public-secondary" href={storiesPath}><BookOpen size={15} /> {copy.stories}</a>
          </div>
          <a className="public-home-year" href="/es/?atlas=1&anio=1500&panel=europa"><Landmark size={14}/> {copy.year}</a>
          {english && <p className="public-home-edition">Selected profiles and stories are available in English. The interactive Atlas is in Spanish.</p>}
          <div className="public-hero-stats" aria-label={copy.statsLabel}>
            {["personas", "dinastias", "territorios", "historias"].map((key, index) => <span key={key}><strong><Odometer value={stats[key]} locale={locale}/></strong>{copy.stats[index]}</span>)}
          </div>
        </section>

        <section className="public-section home-quick-links" aria-label={copy.doorsTitle}>
          <div className="public-section-heading"><div><span>{copy.doorsEyebrow}</span><h2>{copy.doorsTitle}</h2></div></div>
          <div className="public-door-grid">
            {doors.map(({ href, Icon, title: doorTitle, description, spanish, panel }) => (
              <a key={href} href={href} className="public-door-card" onClick={panel ? (event) => navigateInApp(event, onOpenPanel, panel) : undefined}>
                <Icon size={24} aria-hidden="true" /><strong>{doorTitle}</strong><span>{description}</span><ArrowRight className="public-door-arrow" size={16} aria-hidden="true" />
                {english && spanish && <small className="public-home-language">In Spanish</small>}
              </a>
            ))}
          </div>
        </section>

        <HomeDiscovery people={people} stories={stories} locale={locale} peoplePath={peoplePath} storiesPath={storiesPath}/>

        <section className="public-section public-about-strip">
          <div><span>{copy.aboutEyebrow}</span><h2>{copy.aboutTitle}</h2><p>{copy.about}</p></div>
          <div className="public-about-actions">
            <a href={english ? "/en/about" : "/es/proyecto"}>{copy.project}</a>
            <a href={english ? "/en/methodology" : "/es/fuentes"}>{copy.methodology}</a>
          </div>
        </section>

      </main>
  );
}
