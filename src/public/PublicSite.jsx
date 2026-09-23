import {SITE_NAME, resolveSiteUrl} from "../siteConfig.js";
import {setMetaContent, ensureCanonical, setHreflangAlternates} from "./headMetadata.js";
import {publicMeta,entityMeta} from "./publicMeta.js";
import CrownTimeline from "../components/CrownTimeline.jsx";
import DocumentationNotes from "../components/DocumentationNotes.jsx";
import { documentaryLife } from "../utils/documentaryDates.js";
import { SOURCE_SECTIONS } from "../content/sources.js";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  ExternalLink,
  GitBranch,
  Heart,
  Info,
  Landmark,
  Scale,
  Search,
  Shield,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import { IMAGENES_PERSONAS } from "../imagenesPersonas.js";
import SITE_META from "../generated/siteMeta.json";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { etiquetaClaseGobierno, slugPublico, textoBusquedaPersona, normalizarBusquedaPublica } from "../utils/personLabels.js";
import HOME_DATA from "../generated/home.json";
import { loadJsonAsset } from "../utils/loadAsset.js";
import "./public.css";
import { responsiveImage } from "../utils/responsiveImage.js";
import ReadingSkeleton from "../stories/ReadingSkeleton.jsx";
import { translatedEquivalent } from "../english/routes.js";

const PUBLIC_SITE_URL = resolveSiteUrl(import.meta.env.VITE_SITE_URL);
const BUILD_VERSION = String(SITE_META.buildVersion || SITE_META.personCount || "v2");


function rutaEntidad(tipo, slug, { atlas = false } = {}) {
  const segmentos = { persona: "persona", dinastia: "dinastia", territorio: "territorio", historia: "historia" };
  const segmento = segmentos[tipo];
  if (!segmento || !slug) return "/es/";
  return `/es/${segmento}/${encodeURIComponent(slug)}${atlas ? "?atlas=1" : ""}`;
}

function textoFechas(persona) { return persona ? documentaryLife(persona) : "Fechas no documentadas"; }
function personaDates(persona, locale) { return locale === 'en' ? textoFechas(persona).replaceAll('antes de ', 'before ').replaceAll('después de ', 'after ').replace('Fechas no documentadas', 'Dates not recorded') : textoFechas(persona); }


export function usePublicMeta({ title, description, path }) {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    const metadata=publicMeta({title,description,path},PUBLIC_SITE_URL);
    document.documentElement.lang=metadata.lang;
    document.title=metadata.title;
    for(const [attribute,key,value] of metadata.meta)setMetaContent(`meta[${attribute}="${key}"]`,{[attribute]:key},value);
    ensureCanonical(metadata.canonical);
    setHreflangAlternates(metadata.alternates);
  }, [title, description, path]);
}

export function useJson(path, initialData = null) {
  const [state, setState] = useState(() => ({ path, loading: !initialData, data: initialData, error: false }));
  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setState({ path, loading: true, data: null, error: false });
    loadJsonAsset(`${path}?v=${encodeURIComponent(BUILD_VERSION)}`)
      .then((data) => { if (!cancelled) setState({ path, loading: false, data, error: false }); })
      .catch(() => { if (!cancelled) setState({ path, loading: false, data: null, error: true }); });
    return () => { cancelled = true; };
  }, [path, initialData]);
  return initialData ? {loading:false,data:initialData,error:false} : state.path===path ? state : {loading:true,data:null,error:false};
}

function PublicLayout({ children, pathname, prerendered = false }) {
  return <div className="public-site"><SiteHeader pathname={pathname} prerendered={prerendered}/>{children}<SiteFooter /></div>;
}

function Breadcrumbs({ items, locale = 'es' }) {
  return (
    <nav className="public-breadcrumbs" aria-label={locale === 'en' ? 'Breadcrumb' : 'Migas de pan'}>
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">›</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function PersonaMiniCard({ persona, compact = false, locale = 'es' }) {
  if (!persona) return null;
  const image = IMAGENES_PERSONAS[persona.id];
  return (
    <a className={`public-person-card${compact ? " is-compact" : ""}`} href={persona.path || rutaEntidad("persona", persona.slug)}>
      {image ? (
        <span className="public-person-thumb"><img {...responsiveImage(image.archivo, compact ? "44px" : "58px")} alt="" loading="lazy" decoding="async" style={{ objectPosition: image.encuadre || image.posicion || "50% 20%" }} /></span>
      ) : (
        <span className="public-person-thumb is-placeholder"><Crown size={18} /></span>
      )}
      <span className="public-person-copy">
        <strong>{persona.nombre}</strong>
        <small>{locale === 'en' ? persona.role || 'Historical profile · ES' : [persona.titulo, persona.dinastia].filter(Boolean).join(" · ") || "Ficha histórica"}</small>
        {(Number.isFinite(persona.nac) || Number.isFinite(persona.muer)) && <span>{personaDates(persona, locale)}</span>}
      </span>
      <ArrowRight size={14} aria-hidden="true" />
    </a>
  );
}

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
    peopleEyebrow: "Personajes destacados", peopleTitle: "Puertas a la red", allPeople: "Ver todas las personas",
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
    project: "About the project (Spanish)", methodology: "Sources and methodology",
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
            <a className="public-home-year" href="/es/?atlas=1&anio=1500&panel=europa"><Landmark size={14} /> {copy.year}</a>
          </div>
          {english && <p className="public-home-edition">Selected profiles and stories are available in English. The interactive Atlas is in Spanish.</p>}
          <div className="public-hero-stats" aria-label={copy.statsLabel}>
            {["personas", "dinastias", "territorios", "historias"].map((key, index) => <span key={key}><strong>{stats[key] ?? "—"}</strong>{copy.stats[index]}</span>)}
          </div>
        </section>

        <section className="public-section">
          <div className="public-section-heading"><div><span>{copy.doorsEyebrow}</span><h2>{copy.doorsTitle}</h2></div></div>
          <div className="public-door-grid">
            {doors.map(({ href, Icon, title: doorTitle, description, spanish, panel }) => (
              <a key={href} href={href} className="public-door-card" onClick={panel ? (event) => navigateInApp(event, onOpenPanel, panel) : undefined}>
                <Icon size={22} aria-hidden="true" /><strong>{doorTitle}</strong><span>{description}</span>
                {english && spanish && <small className="public-home-language">In Spanish</small>}
              </a>
            ))}
          </div>
        </section>

        {!!people?.length && (
          <section className="public-section">
            <div className="public-section-heading"><div><span>{copy.peopleEyebrow}</span><h2>{copy.peopleTitle}</h2></div><a href={peoplePath}>{copy.allPeople} <ArrowRight size={13} /></a></div>
            <div className="public-person-grid">{people.map((persona) => <PersonaMiniCard key={persona.id} persona={persona} locale={locale} />)}</div>
          </section>
        )}

        {!!stories?.length && (
          <section className="public-section">
            <div className="public-section-heading"><div><span>{copy.storiesEyebrow}</span><h2>{copy.storiesTitle}</h2></div><a href={storiesPath}>{copy.allStories} <ArrowRight size={13} /></a></div>
            <div className="public-story-grid">
              {stories.map((historia) => (
                <a key={historia.id} className="public-story-card" href={historia.path || rutaEntidad("historia", historia.slug)}>
                  {Number.isFinite(historia.pasos) && <span>{historia.pasos} {copy.chapters}</span>}<h3>{english ? historia.nombre : historia.titulo}</h3><p>{english ? historia.description : historia.subtitulo || historia.descripcion}</p><b>{copy.start} <ArrowRight size={13} /></b>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="public-section public-about-strip">
          <div><span>{copy.aboutEyebrow}</span><h2>{copy.aboutTitle}</h2><p>{copy.about}</p></div>
          <div className="public-about-actions">
            <a href="/es/proyecto">{copy.project}</a>
            <a href={english ? "/en/methodology" : "/es/fuentes"}>{copy.methodology}</a>
          </div>
        </section>

      </main>
  );
}

const INFO_PAGES = {
  proyecto: {
    icon: Info,
    eyebrow: "El proyecto",
    title: "Acerca de El Árbol de Europa",
    description: "Qué intenta hacer el atlas, qué representa y cómo debe leerse una base histórica que sigue creciendo.",
    sections: [
      { title: "Qué intenta hacer", paragraphs: [
        "El Árbol de Europa es un proyecto interactivo de genealogía histórica que busca visualizar parentescos, dinastías, reinados y conexiones políticas de la Europa medieval y moderna en una misma red navegable.",
        "La aplicación combina genealogía, cronología y cartografía para que una misma persona pueda estudiarse dentro de su familia, su época y los territorios con los que estuvo vinculada."
      ]},
      { title: "Cómo leer la base", paragraphs: [
        "La ausencia de una relación o de un personaje no implica que históricamente no existiera: puede significar simplemente que todavía no se ha incorporado a la base.",
        "Se priorizan figuras que conectan ramas, ejercen gobierno, fundan una línea relevante o aportan una conexión históricamente útil para la red. Las correcciones documentadas tienen prioridad sobre la mera coherencia visual."
      ]},
      { title: "Ámbito principal", paragraphs: [
        "El periodo principal de trabajo es 1200–1800. El proyecto está en desarrollo y la base continúa ampliándose, corrigiéndose y documentándose."
      ]},
    ],
  },
  fuentes: {
    icon: Landmark,
    eyebrow: "Fuentes y metodología",
    title: "Cómo se construye la base",
    description: "Repertorios genealógicos, biografías académicas, archivos e instituciones utilizados para contrastar la información.",
    sections: SOURCE_SECTIONS,
  },
  licencias: {
    icon: Scale,
    eyebrow: "Licencias",
    title: "Derechos y materiales de terceros",
    description: "Qué partes del proyecto son originales y qué materiales conservan licencias propias.",
    sections: [
      { title: "Contenido original", paragraphs: [
        "Salvo indicación expresa en sentido contrario, el código, el diseño, los textos, los recorridos históricos y la estructura original de la base de datos de El Árbol de Europa se mantienen con todos los derechos reservados.",
        "Esta reserva de derechos no se aplica a materiales de terceros, que permanecen sujetos a sus respectivas licencias."
      ]},
      { title: "Cartografía de MapChart", paragraphs: [
        "La base cartográfica utilizada en el mapa procede de MapChart y ha sido modificada y adaptada para este proyecto.",
        "El material cartográfico correspondiente se publica bajo Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). Esa licencia no se extiende automáticamente al resto del proyecto."
      ], links: [
        ["MapChart", "https://www.mapchart.net/"],
        ["CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
      ]},
    ],
  },
  agradecimientos: {
    icon: Heart,
    eyebrow: "Agradecimientos",
    title: "Personas e instituciones que ayudan a mejorar el proyecto",
    description: "Reconocimiento a quienes aportan documentación, detectan errores o hacen posible parte de la infraestructura visual del atlas.",
    sections: [
      { title: "Correcciones y aportaciones", paragraphs: [
        "El Árbol de Europa está preparado para acreditar a quienes detecten errores, aporten documentación o ayuden a mejorar la base. Las correcciones documentadas forman parte esencial del crecimiento del proyecto."
      ]},
      { title: "Cartografía", paragraphs: [
        "La representación territorial utiliza como base cartográfica material de MapChart, adaptado para el proyecto bajo sus condiciones de atribución."
      ], links: [["MapChart", "https://www.mapchart.net/"]]},
    ],
  },
};

export function InfoPage({ tipo }) {
  const page = INFO_PAGES[tipo] || INFO_PAGES.proyecto;
  const Icon = page.icon;
  usePublicMeta({ title: `${page.title} — ${SITE_NAME}`, description: page.description, path: `/es/${tipo}` });
  return (
    <PublicLayout>
      <main className="public-main public-info-page">
        <Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: page.title }]} />
        <section className="public-page-title">
          <div className="public-page-icon"><Icon size={22} /></div>
          <span>{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </section>
        <div className="public-info-grid">
          {page.sections.map((section) => (
            <section className="public-info-card" key={section.title}>
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {!!section.links?.length && <div className="public-info-links">{section.links.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label} <ExternalLink size={11} /></a>)}</div>}
            </section>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}

const CATALOG_CONFIG = {
  personas: { title: "Personas", eyebrow: "Índice del atlas", description: "Busca por nombre, título, dinastía o territorio.", icon: Users },
  dinastias: { title: "Dinastías", eyebrow: "Casas y linajes", description: "Explora el origen de las casas, sus ramas, herencias y conexiones con las personas del Atlas.", icon: Shield },
  territorios: { title: "Territorios", eyebrow: "Coronas y espacios políticos", description: "Explora los territorios presentes en la base y las figuras que los conectan.", icon: Landmark },
  historias: { title: "Historias", eyebrow: "Recorridos guiados", description: "Historias construidas con las personas, mapas, biografías y cronología de la propia aplicación.", icon: BookOpen },
};

function textoCatalogoItem(item, tipo) {
  if (tipo === "personas") return textoBusquedaPersona(item);
  if (tipo === "historias") return [item.titulo, item.subtitulo, item.descripcion].filter(Boolean).join(" ");
  return [item.nombre, ...(item.miembros || []).map((p) => p.nombre)].filter(Boolean).join(" ");
}

export function CatalogPage({ tipo }) {
  const config = CATALOG_CONFIG[tipo] || CATALOG_CONFIG.personas;
  const Icon = config.icon;
  const { data, loading, error } = useJson(`/catalogos/${tipo}.json`);
  const [query, setQuery] = useState("");
  const [soloHistoria, setSoloHistoria] = useState(false);
  const items = Array.isArray(data?.items) ? data.items : [];
  const filtrados = useMemo(() => {
    const q = normalizarBusquedaPublica(query);
    return items.filter(item => (!soloHistoria || tipo !== "dinastias" || item.editorial) && (!q || normalizarBusquedaPublica(textoCatalogoItem(item, tipo)).includes(q)));
  }, [items, query, tipo, soloHistoria]);
  const visibles = tipo === "personas" ? filtrados.slice(0, query.trim() ? 200 : 120) : filtrados;
  usePublicMeta({
    title: `${config.title} — ${SITE_NAME}`,
    description: config.description,
    path: `/es/${tipo}`,
  });

  return (
    <PublicLayout>
      <main className="public-main public-catalog">
        <Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: config.title }]} />
        <section className="public-page-title">
          <div className="public-page-icon"><Icon size={22} /></div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p>
        </section>
        <label className="public-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Buscar en ${config.title.toLowerCase()}…`} /><span>{filtrados.length}</span></label>

        {tipo === "dinastias" && <label className="dynasty-editorial-filter"><input type="checkbox" checked={soloHistoria} onChange={e=>setSoloHistoria(e.target.checked)}/> Mostrar solo casas con historia desarrollada</label>}
        {loading && <ReadingSkeleton kind="catalog"/>}
        {error && <div className="public-error">No se ha podido cargar este catálogo. Puedes seguir explorando el atlas.</div>}

        {!loading && !error && tipo === "personas" && (
          <>
            {visibles.length < filtrados.length && <div className="public-catalog-note">Mostrando {visibles.length} de {filtrados.length}. Escribe un nombre, una dinastía, un título o un territorio para afinar la búsqueda.</div>}
            <div className="public-person-list">{visibles.map((persona) => <PersonaMiniCard key={persona.id} persona={persona} compact />)}</div>
          </>
        )}

        {!loading && !error && (tipo === "dinastias" || tipo === "territorios") && (
          <div className="public-entity-grid">
            {filtrados.map((item) => (
              <article key={item.slug} className="public-entity-card">
                <div className="public-entity-card-head"><div><span>{tipo === "dinastias" ? (item.editorial ? "Historia de la dinastía" : "Dinastía") : "Territorio"}</span><h2>{item.nombre}</h2></div><strong>{item.total}</strong></div>
                {tipo === "dinastias" && item.resumen && <p className="public-muted public-dynasty-summary">{item.resumen}</p>}
                {!!item.miembros?.length && <div className="public-entity-members">{item.miembros.map((p) => <a key={p.id} href={rutaEntidad("persona", p.slug)}>{p.nombre}</a>)}</div>}
                <a className="public-entity-action" href={rutaEntidad(tipo === "dinastias" ? "dinastia" : "territorio", item.slug)}>Ver ficha <ArrowRight size={13} /></a>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && tipo === "historias" && (
          <div className="public-story-grid public-story-catalog">
            {filtrados.map((historia) => (
              <article key={historia.id} className={`public-story-card${historia.disponible ? "" : " is-coming"}`}>
                <span>{historia.disponible ? `${historia.pasos} pasos` : "Próximamente"}</span>
                <h2>{historia.titulo}</h2><p>{historia.subtitulo || historia.descripcion}</p>
                {historia.disponible ? <a href={rutaEntidad("historia", historia.slug)}>Comenzar recorrido <ArrowRight size={13} /></a> : <b>En preparación</b>}
              </article>
            ))}
          </div>
        )}
      </main>
    </PublicLayout>
  );
}

function Portrait({ persona, locale = 'es' }) {
  const image = IMAGENES_PERSONAS[persona?.id];
  if (!image) return null;
  const objectPosition = image.encuadre || image.posicion || "50% 20%";
  const zoom = Number.isFinite(image.zoom) && image.zoom > 0 ? image.zoom : 1;
  return (
    <figure className="public-portrait">
      <div className="public-portrait-frame"><img {...responsiveImage(image.archivo, "(max-width: 680px) 280px, 320px")} alt={locale === 'en' ? `Portrait of ${persona.nombre}` : image.alt || `Retrato de ${persona.nombre}`} decoding="async" style={{ objectPosition, transform: `scale(${zoom})`, transformOrigin: objectPosition }} /></div>
      <figcaption lang={locale === 'en' ? 'es' : undefined}><strong>{image.tipo}</strong><span>{image.obra}</span><span>{image.autor}{image.fecha ? ` · ${image.fecha}` : ""}</span>{image.institucion && <span>{image.institucion}</span>}<small>{image.derechos}{image.fuenteUrl && <> · <a href={image.fuenteUrl} target="_blank" rel="noreferrer">{locale === 'en' ? 'Source' : 'Fuente'} <ExternalLink size={10} /></a></>}</small></figcaption>
    </figure>
  );
}

function RelationList({ label, items, locale = 'es' }) {
  if (!items?.length) return null;
  return <div className="public-relation-row"><strong>{label}</strong><div>{items.map((p) => { const path = p.path || (locale === 'en' && translatedEquivalent(rutaEntidad('persona', p.slug), 'en')) || rutaEntidad('persona', p.slug); return <a key={p.id} href={path}>{p.nombre}{locale === 'en' && path.startsWith('/es/') ? ' · ES' : ''}</a>; })}</div></div>;
}

export function PersonPage({ slug, legacyId, onExplore, initialData = null }) {
  const [resolvedSlug, setResolvedSlug] = useState(slug || null);
  const [state, setState] = useState(() => ({ loading: !initialData, persona: initialData, error: false }));

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setState({loading:true,persona:null,error:false});
    async function load() {
      try {
        let finalSlug = slug;
        if (!finalSlug && legacyId) {
          const indexResponse = await fetch("/personas-meta/index.json", { cache: "no-store" });
          if (!indexResponse.ok) throw new Error("index");
          const index = await indexResponse.json();
          finalSlug = index[legacyId] || null;
        }
        if (!finalSlug) throw new Error("slug");
        setResolvedSlug(finalSlug);
        const response = await fetch(`/personas-meta/${encodeURIComponent(finalSlug)}.json`, { cache: "no-store" });
        if (!response.ok) throw new Error("persona");
        const persona = await response.json();
        if (!cancelled) setState({ loading: false, persona, error: false });
      } catch {
        if (!cancelled) setState({ loading: false, persona: null, error: true });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, legacyId, initialData]);

  const persona = initialData || state.persona;
  const metadata=entityMeta('persona',persona,resolvedSlug||slug);
  usePublicMeta(metadata);

  if (state.loading) return <PublicLayout pathname={metadata.path} prerendered={Boolean(initialData)}><main className="public-main"><ReadingSkeleton kind="person"/></main></PublicLayout>;
  if (state.error || !persona) return <PublicLayout pathname={metadata.path} prerendered={Boolean(initialData)}><main className="public-main"><Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: "Personas", href: "/es/personas" }, { label: "Ficha" }]} /><div className="public-error" role="alert"><h1>Ficha no disponible</h1><p>No se ha podido cargar esta ficha. El atlas completo sigue disponible.</p><button className="public-primary" onClick={() => window.location.reload()}>Reintentar</button> <a className="public-secondary" href="/es/?atlas=1">Abrir atlas <ArrowRight size={15} /></a></div></main></PublicLayout>;

  return <PublicLayout pathname={metadata.path} prerendered={Boolean(initialData)}><PersonContent persona={persona} path={metadata.path} onExplore={initialData?undefined:onExplore}/></PublicLayout>;
}

export function PersonContent({ persona, locale = 'es', path, onExplore }) {
  const en = locale === 'en';
  const label = (es, english) => en ? english : es;
  const profilePath = path || rutaEntidad('persona', persona.slug);
  const atlasPath = en ? `/es/?atlas=1&familia=${encodeURIComponent(persona.id)}` : `${profilePath}?atlas=1`;
  const peoplePath = en ? '/en/people' : '/es/personas';
  const sourcePath = en ? '/en/methodology' : '/es/fuentes';
  return <main className="public-main public-person-page">
    <Breadcrumbs locale={locale} items={[{label:label('Inicio','Home'),href:en?'/en/':'/es/'},{label:label('Personas','People'),href:peoplePath},{label:persona.nombre}]}/>
    <article>
      <header className="public-person-hero">
        <div className="public-person-hero-copy">
          <span>{label('El Árbol de Europa · Persona','The Tree of Europe · Person')}</span>
          <h1>{persona.nombre}</h1>
          {!en && persona.sobrenombre && <div className="public-person-nickname">«{persona.sobrenombre}»</div>}
          <p>{en ? persona.summary : persona.biografia || persona.resumen || ''}</p>
          <div className="public-person-badges"><span>{personaDates(persona,locale)}</span>{(en?persona.role:persona.titulo)&&<span>{en?persona.role:persona.titulo}</span>}{persona.dinastia&&<a href={rutaEntidad('dinastia',slugPublico(persona.dinastia))}>{persona.dinastia}{en?' · ES':''}</a>}</div>
          <div className="public-person-actions"><a className="public-primary" href={atlasPath} onClick={onExplore?e=>{e.preventDefault();onExplore();}:undefined}>{label('Abrir en el atlas interactivo','Explore this family · Spanish Atlas')}<ArrowRight size={15}/></a><a className="public-secondary" href={peoplePath}><ArrowLeft size={14}/>{label('Volver a personas','Back to people')}</a></div>
        </div>
        <Portrait persona={persona} locale={locale}/>
      </header>
      {en&&<p className="public-translation-note">This profile is translated. Names of dynasties and territories, picture credits and original documentary records retain their source language. Links marked ES open the Spanish edition.</p>}
      <div className="public-person-columns">
        <section className="public-content-card"><span>{label('Perfil histórico','Historical profile')}</span><h2>{label('Datos principales','Key details')}</h2>{(en?persona.role:persona.titulo)&&<p><strong>{label('Título:','Role:')}</strong> {en?persona.role:persona.titulo}</p>}{!!persona.aliases?.length&&<p><strong>{label('Otros nombres:','Other recorded names:')}</strong> {persona.aliases.join(' · ')}</p>}{persona.dinastia&&<p><strong>{label('Dinastía:','Dynasty:')}</strong> <a href={rutaEntidad('dinastia',slugPublico(persona.dinastia))}>{persona.dinastia}{en?' · ES':''}</a></p>}{!!persona.reinos?.length&&<p><strong>{label('Territorios:','Territories:')}</strong> {persona.reinos.map((r,i)=><React.Fragment key={r}>{i>0&&' · '}<a href={rutaEntidad('territorio',slugPublico(r))}>{r}{en?' (ES)':''}</a></React.Fragment>)}</p>}{!en&&<RecordedGovernments persona={persona}/>}</section>
        <section className="public-content-card"><span>{label('Red familiar','Family network')}</span><h2>{label('Relaciones documentadas','Documented relationships')}</h2><RelationList locale={locale} label={label('Padres','Parents')} items={persona.padres}/><RelationList locale={locale} label={label(persona.conyuges?.length>1?'Cónyuges':'Cónyuge','Partners')} items={persona.conyuges}/><RelationList locale={locale} label={label('Hijos/as','Children')} items={persona.hijos}/>{!persona.padres?.length&&!persona.conyuges?.length&&!persona.hijos?.length&&<p className="public-muted">{label('No hay relaciones directas cargadas para esta persona.','No direct relationships are recorded for this person.')}</p>}</section>
      </div>
      {en ? <details className="public-original-content"><summary>Governments and documentary notes · Spanish original</summary><div lang="es"><RecordedGovernments persona={persona}/><CrownTimeline key={persona.id} persona={persona} accesos={persona.accesosCoronas} fuentes={persona.fuentes}/><DocumentationNotes persona={persona}/></div><p className="public-translation-note"><a href={persona.esPath}>Read the complete Spanish record →</a></p></details> : <><CrownTimeline key={persona.id} persona={persona} accesos={persona.accesosCoronas} fuentes={persona.fuentes}/><DocumentationNotes persona={persona}/></>}
      {!!persona.fuentes?.length&&<section className="public-content-card"><span>{label('Documentación','Documentation')}</span><h2>{label('Fuentes de esta ficha','Sources for this profile')}</h2><ul>{persona.fuentes.map((f,i)=><li key={f.url||i}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><p className="public-muted">{label('Referencias biográficas y de contexto.','Biographical and contextual references in their original language.')} <a href={sourcePath}>{label('Consultar metodología y bibliografía completa','Sources and methodology')}</a>.</p></section>}
      {!!persona.historias?.length&&<section className="public-section public-person-section"><div className="public-section-heading"><div><span>{label('Historias relacionadas','Related stories')}</span><h2>{label('Aparece en estos recorridos','Follow this person through history')}</h2></div></div><div className="public-story-grid">{persona.historias.map(h=><a key={h.id} className="public-story-card" href={h.path||rutaEntidad('historia',h.slug)}><span>{en&&!h.path?'Story · Spanish original':label('Historia','Story')}</span><h3>{h.titulo}</h3><p>{h.subtitulo}</p><b>{label('Comenzar','Start reading')}<ArrowRight size={13}/></b></a>)}</div></section>}
      <section className="public-section public-person-section"><div className="public-section-heading"><div><span>{label('Seguir explorando','Keep exploring')}</span><h2>{en?`More paths from ${persona.nombre}`:`Más caminos desde ${persona.nombre}`}</h2></div></div><div className="public-follow-grid">
        <div><h3><GitBranch size={16}/>{label('Familia','Family')}</h3>{[...(persona.padres||[]),...(persona.conyuges||[]),...(persona.hijos||[])].slice(0,6).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
        <div><h3><Shield size={16}/>{label('Misma dinastía','Same dynasty')}</h3>{(persona.relacionadosDinastia||[]).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
        <div><h3><Users size={16}/>{label('En su época','In their lifetime')}</h3>{(persona.contemporaneos||[]).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
      </div></section>
    </article>
  </main>;
}

function RecordedGovernments({persona}) {
  if(!persona.reinados?.length)return null;
  return <div className="public-reigns"><strong>Gobiernos y reinados registrados</strong>{persona.reinados.map((r,index)=><div key={`${r.territorio}-${r.desde}-${index}`}><span>{r.titulo} · {r.territorio||'Territorio'} · {etiquetaClaseGobierno(persona,r)}</span><b>{r.desde??'?'}–{r.hasta??'?'}</b>{r.condicion&&<small>{r.condicion}</small>}</div>)}</div>;
}
