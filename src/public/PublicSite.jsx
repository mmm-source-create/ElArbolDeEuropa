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
import "./public.css";

const PUBLIC_SITE_URL = String(import.meta.env.VITE_SITE_URL || "https://www.treeofeurope.eu").replace(/\/+$/, "");
const BUILD_VERSION = String(SITE_META.buildVersion || SITE_META.personCount || "v2");

function slugPublico(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "entidad";
}

function rutaEntidad(tipo, slug, { atlas = false } = {}) {
  const segmentos = { persona: "persona", dinastia: "dinastia", territorio: "territorio", historia: "historia" };
  const segmento = segmentos[tipo];
  if (!segmento || !slug) return "/es/";
  return `/es/${segmento}/${encodeURIComponent(slug)}${atlas ? "?atlas=1" : ""}`;
}

function formatoFecha(valor, aproximada) {
  return Number.isFinite(valor) ? `${aproximada ? "c. " : ""}${valor}` : "?";
}

function textoFechas(persona) {
  if (!persona) return "Fechas no documentadas";
  return `${formatoFecha(persona.nac, persona.nacAprox)} – ${formatoFecha(persona.muer, persona.muerAprox)}`;
}

function resumenPersona(persona) {
  if (!persona) return "";
  if (persona.biografia) return persona.biografia;
  const partes = [persona.titulo, ...(persona.reinos || [])].filter(Boolean);
  return partes.length ? `${persona.nombre} · ${partes.join(" · ")}.` : `Ficha histórica de ${persona.nombre} en El Árbol de Europa.`;
}

function ensureMetaTag(selector, attributes) {
  if (typeof document === "undefined") return null;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

function setMetaContent(selector, attributes, content) {
  const element = ensureMetaTag(selector, attributes);
  if (element) element.setAttribute("content", content);
}

function ensureCanonical(href) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setHreflangAlternates(items) {
  if (typeof document === "undefined") return;
  document.head.querySelectorAll('link[data-eade-hreflang="1"]').forEach((node) => node.remove());
  items.filter((item) => item?.hreflang && item?.href).forEach((item) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", item.hreflang);
    link.setAttribute("href", item.href);
    link.setAttribute("data-eade-hreflang", "1");
    document.head.appendChild(link);
  });
}

function usePublicMeta({ title, description, path }) {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    const canonicalUrl = new URL(path || "/es/", PUBLIC_SITE_URL || window.location.origin).toString();
    document.documentElement.lang = "es";
    document.title = title;
    setMetaContent('meta[name="description"]', { name: "description" }, description);
    setMetaContent('meta[property="og:site_name"]', { property: "og:site_name" }, "El Árbol de Europa");
    setMetaContent('meta[property="og:title"]', { property: "og:title" }, title);
    setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
    setMetaContent('meta[property="og:type"]', { property: "og:type" }, "website");
    setMetaContent('meta[property="og:locale"]', { property: "og:locale" }, "es_ES");
    setMetaContent('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMetaContent('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
    setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    ensureCanonical(canonicalUrl);
    setHreflangAlternates([
      { hreflang: "es", href: canonicalUrl },
      { hreflang: "x-default", href: canonicalUrl },
    ]);
  }, [title, description, path]);
}

function useJson(path) {
  const [state, setState] = useState({ loading: true, data: null, error: false });
  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, data: null, error: false });
    fetch(`${path}?v=${encodeURIComponent(BUILD_VERSION)}`, { credentials: "same-origin", cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => { if (!cancelled) setState({ loading: false, data, error: false }); })
      .catch(() => { if (!cancelled) setState({ loading: false, data: null, error: true }); });
    return () => { cancelled = true; };
  }, [path]);
  return state;
}

function PublicLayout({ children }) {
  return <div className="public-site"><SiteHeader />{children}<SiteFooter /></div>;
}

function Breadcrumbs({ items }) {
  return (
    <nav className="public-breadcrumbs" aria-label="Migas de pan">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">›</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

function PersonaMiniCard({ persona, compact = false }) {
  if (!persona) return null;
  const image = IMAGENES_PERSONAS[persona.id];
  return (
    <a className={`public-person-card${compact ? " is-compact" : ""}`} href={rutaEntidad("persona", persona.slug)}>
      {image ? (
        <span className="public-person-thumb"><img src={image.archivo} alt="" loading="lazy" decoding="async" style={{ objectPosition: image.encuadre || image.posicion || "50% 20%" }} /></span>
      ) : (
        <span className="public-person-thumb is-placeholder"><Crown size={18} /></span>
      )}
      <span className="public-person-copy">
        <strong>{persona.nombre}</strong>
        <small>{[persona.titulo, persona.dinastia].filter(Boolean).join(" · ") || "Ficha histórica"}</small>
        {(Number.isFinite(persona.nac) || Number.isFinite(persona.muer)) && <span>{textoFechas(persona)}</span>}
      </span>
      <ArrowRight size={14} aria-hidden="true" />
    </a>
  );
}

function HomeLoading() {
  return <main className="public-main"><div className="public-loading">Preparando el atlas…</div></main>;
}

export function HomePage({ onEnterAtlas, onOpenPanel }) {
  const { data, loading, error } = useJson("/catalogos/home.json");
  usePublicMeta({
    title: "El Árbol de Europa | Atlas genealógico e histórico interactivo",
    description: "Explora personas, dinastías, parentescos, reinados, territorios e historias de la Europa medieval y moderna.",
    path: "/es/",
  });

  if (loading) return <PublicLayout><HomeLoading /></PublicLayout>;
  const stats = data?.stats || {};
  return (
    <PublicLayout>
      <main className="public-main public-home">
        <section className="public-hero">
          <div className="public-hero-eyebrow">Genealogía · política · territorio · 1200–1800</div>
          <h1>La historia de Europa, vista como una red</h1>
          <p>Recorre familias, coronas, matrimonios, rivalidades y sucesiones en un atlas que une árbol genealógico, mapa, biografías, cronología e historias guiadas.</p>
          <div className="public-hero-actions">
            <button type="button" className="public-primary" onClick={() => onEnterAtlas?.(null)}>Explorar el atlas <ArrowRight size={16} /></button>
            <a className="public-secondary" href="/es/historias"><BookOpen size={15} /> Ver historias</a>
          </div>
          <div className="public-hero-stats" aria-label="Resumen del proyecto">
            <span><strong>{stats.personas ?? "—"}</strong> personas</span>
            <span><strong>{stats.dinastias ?? "—"}</strong> dinastías</span>
            <span><strong>{stats.territorios ?? "—"}</strong> territorios</span>
            <span><strong>{stats.historias ?? "—"}</strong> historias disponibles</span>
          </div>
        </section>

        <section className="public-section">
          <div className="public-section-heading"><div><span>Entradas rápidas</span><h2>Elige cómo quieres empezar</h2></div></div>
          <div className="public-door-grid">
            <a href="/es/personas" className="public-door-card"><Users size={22} /><strong>Personas</strong><span>Busca una figura y entra por su familia, reinados y época.</span></a>
            <a href="/es/dinastias" className="public-door-card"><Shield size={22} /><strong>Dinastías</strong><span>Capetos, Habsburgo, Trastámara, Borbones y muchas más.</span></a>
            <a href="/es/territorios" className="public-door-card"><Landmark size={22} /><strong>Territorios</strong><span>Explora quién gobernó dónde y cómo se conectan las coronas.</span></a>
            <a href="/es/historias" className="public-door-card"><BookOpen size={22} /><strong>Historias</strong><span>Recorridos guiados por guerras, artistas, favoritos y dinastías.</span></a>
            <a href="/es/desafio" className="public-door-card"><Swords size={22} /><strong>Desafío</strong><span>El Camino, Racha, Retratos y un desafío diario con la propia base histórica.</span></a>
            <button type="button" className="public-door-card" onClick={() => onOpenPanel?.("estadisticas")}><Sparkles size={22} /><strong>Estadísticas</strong><span>Descubre qué casas, territorios y figuras dominan la base.</span></button>
          </div>
        </section>

        {!!data?.personasDestacadas?.length && (
          <section className="public-section">
            <div className="public-section-heading"><div><span>Personajes destacados</span><h2>Seis puertas a la red</h2></div><a href="/es/personas">Ver todas las personas <ArrowRight size={13} /></a></div>
            <div className="public-person-grid">{data.personasDestacadas.map((persona) => <PersonaMiniCard key={persona.id} persona={persona} />)}</div>
          </section>
        )}

        {!!data?.historiasDestacadas?.length && (
          <section className="public-section">
            <div className="public-section-heading"><div><span>Recorridos guiados</span><h2>Historias para entrar en el atlas</h2></div><a href="/es/historias">Todas las historias <ArrowRight size={13} /></a></div>
            <div className="public-story-grid">
              {data.historiasDestacadas.map((historia) => (
                <a key={historia.id} className="public-story-card" href={rutaEntidad("historia", historia.slug)}>
                  <span>{historia.pasos} pasos</span><h3>{historia.titulo}</h3><p>{historia.subtitulo || historia.descripcion}</p><b>Comenzar recorrido <ArrowRight size={13} /></b>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="public-section public-about-strip">
          <div><span>Un proyecto en crecimiento</span><h2>Una base histórica para explorar, no una lista cerrada</h2><p>El proyecto combina genealogía, cronología y cartografía. La ausencia de una relación o personaje puede significar que todavía no se ha incorporado; las correcciones documentadas tienen prioridad sobre la mera coherencia visual.</p></div>
          <div className="public-about-actions">
            <a href="/es/proyecto">Acerca del proyecto</a>
            <a href="/es/fuentes">Fuentes y metodología</a>
          </div>
        </section>

        {error && <div className="public-inline-warning">Algunos contadores no se han podido cargar, pero el atlas sigue disponible.</div>}
      </main>
    </PublicLayout>
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
    sections: [
      { title: "Repertorios principales", links: [
        ["Foundation for Medieval Genealogy · MedLands", "https://fmg.ac/Projects/MedLands/index.htm"],
        ["Deutsche Biographie", "https://www.deutsche-biographie.de/"],
        ["Treccani", "https://www.treccani.it/"],
        ["Encyclopaedia Britannica", "https://www.britannica.com/"],
        ["Wikipedia", "https://en.wikipedia.org/"]
      ], paragraphs: ["Wikipedia se utiliza como herramienta auxiliar de localización, cronología y orientación bibliográfica; los datos sensibles o dudosos se contrastan siempre que es posible con fuentes más especializadas."]},
      { title: "Archivos e instituciones", links: [
        ["Historia Hispánica · Real Academia de la Historia", "https://historia-hispanica.rah.es/"],
        ["PARES · Portal de Archivos Españoles", "https://pares.mcu.es/"],
        ["Biblioteca Digital · Real Academia de la Historia", "https://bibliotecadigital.rah.es/"],
        ["Casa Real de Suecia", "https://www.kungahuset.se/english/the-monarchy-of-sweden"],
        ["Casa Real de Dinamarca", "https://www.kongehuset.dk/en"],
        ["Royal House of the Netherlands", "https://www.royal-house.nl/"],
        ["Burg Hohenzollern", "https://burg-hohenzollern.com/en/"],
        ["MuseoTorino", "https://www.museotorino.it/"]
      ]},
      { title: "Criterios de trabajo", paragraphs: [
        "Cuando una filiación, una fecha o un reinado es discutido, se contrasta el dato con varias referencias antes de incorporarlo.",
        "Las fechas se almacenan normalmente a nivel de año. Los territorios del mapa son una representación histórica simplificada y dependen de los límites disponibles en la base cartográfica."
      ]},
    ],
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
  usePublicMeta({ title: `${page.title} — El Árbol de Europa`, description: page.description, path: `/es/${tipo}` });
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
  dinastias: { title: "Dinastías", eyebrow: "Casas y linajes", description: "Recorre las casas representadas en la base y abre cada una directamente en el atlas.", icon: Shield },
  territorios: { title: "Territorios", eyebrow: "Coronas y espacios políticos", description: "Explora los territorios presentes en la base y las figuras que los conectan.", icon: Landmark },
  historias: { title: "Historias", eyebrow: "Recorridos guiados", description: "Historias construidas con las personas, mapas, biografías y cronología de la propia aplicación.", icon: BookOpen },
};

function textoCatalogoItem(item, tipo) {
  if (tipo === "personas") return [item.nombre, item.sobrenombre, item.titulo, item.dinastia, ...(item.reinos || [])].filter(Boolean).join(" ");
  if (tipo === "historias") return [item.titulo, item.subtitulo, item.descripcion].filter(Boolean).join(" ");
  return [item.nombre, ...(item.miembros || []).map((p) => p.nombre)].filter(Boolean).join(" ");
}

export function CatalogPage({ tipo }) {
  const config = CATALOG_CONFIG[tipo] || CATALOG_CONFIG.personas;
  const Icon = config.icon;
  const { data, loading, error } = useJson(`/catalogos/${tipo}.json`);
  const [query, setQuery] = useState("");
  const items = Array.isArray(data?.items) ? data.items : [];
  const filtrados = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("es");
    if (!q) return items;
    return items.filter((item) => textoCatalogoItem(item, tipo).toLocaleLowerCase("es").includes(q));
  }, [items, query, tipo]);
  const visibles = tipo === "personas" ? filtrados.slice(0, query.trim() ? 200 : 120) : filtrados;
  usePublicMeta({
    title: `${config.title} — El Árbol de Europa`,
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

        {loading && <div className="public-loading">Cargando catálogo…</div>}
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
                <div className="public-entity-card-head"><div><span>{tipo === "dinastias" ? "Dinastía" : "Territorio"}</span><h2>{item.nombre}</h2></div><strong>{item.total}</strong></div>
                {!!item.miembros?.length && <div className="public-entity-members">{item.miembros.map((p) => <a key={p.id} href={rutaEntidad("persona", p.slug)}>{p.nombre}</a>)}</div>}
                <a className="public-entity-action" href={rutaEntidad(tipo === "dinastias" ? "dinastia" : "territorio", item.slug)}>Abrir en el atlas <ArrowRight size={13} /></a>
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

function Portrait({ persona }) {
  const image = IMAGENES_PERSONAS[persona?.id];
  if (!image) return null;
  const objectPosition = image.encuadre || image.posicion || "50% 20%";
  const zoom = Number.isFinite(image.zoom) && image.zoom > 0 ? image.zoom : 1;
  return (
    <figure className="public-portrait">
      <div className="public-portrait-frame"><img src={image.archivo} alt={image.alt || `Retrato de ${persona.nombre}`} decoding="async" style={{ objectPosition, transform: `scale(${zoom})`, transformOrigin: objectPosition }} /></div>
      <figcaption><strong>{image.tipo}</strong><span>{image.obra}</span><span>{image.autor}{image.fecha ? ` · ${image.fecha}` : ""}</span>{image.institucion && <span>{image.institucion}</span>}<small>{image.derechos}{image.fuenteUrl && <> · <a href={image.fuenteUrl} target="_blank" rel="noreferrer">Fuente <ExternalLink size={10} /></a></>}</small></figcaption>
    </figure>
  );
}

function RelationList({ label, items }) {
  if (!items?.length) return null;
  return <div className="public-relation-row"><strong>{label}</strong><div>{items.map((p) => <a key={p.id} href={rutaEntidad("persona", p.slug)}>{p.nombre}</a>)}</div></div>;
}

export function PersonPage({ slug, legacyId, onExplore }) {
  const [resolvedSlug, setResolvedSlug] = useState(slug || null);
  const [state, setState] = useState({ loading: true, persona: null, error: false });

  useEffect(() => {
    let cancelled = false;
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
  }, [slug, legacyId]);

  const persona = state.persona;
  const description = persona ? resumenPersona(persona).replace(/\s+/g, " ").trim().slice(0, 155) : "Ficha histórica en El Árbol de Europa.";
  usePublicMeta({ title: persona ? `${persona.nombre} — El Árbol de Europa` : "Persona — El Árbol de Europa", description, path: `/es/persona/${encodeURIComponent(resolvedSlug || slug || "persona")}` });

  if (state.loading) return <PublicLayout><main className="public-main"><div className="public-loading">Preparando ficha histórica…</div></main></PublicLayout>;
  if (state.error || !persona) return <PublicLayout><main className="public-main"><Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: "Personas", href: "/es/personas" }, { label: "Ficha" }]} /><div className="public-error"><h1>Ficha no disponible</h1><p>No se ha podido cargar esta ficha. El atlas completo sigue disponible.</p><button className="public-primary" onClick={onExplore}>Abrir atlas <ArrowRight size={15} /></button></div></main></PublicLayout>;

  return (
    <PublicLayout>
      <main className="public-main public-person-page">
        <Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: "Personas", href: "/es/personas" }, { label: persona.nombre }]} />
        <article>
          <header className="public-person-hero">
            <div className="public-person-hero-copy">
              <span>El Árbol de Europa · Persona</span>
              <h1>{persona.nombre}</h1>
              {persona.sobrenombre && <div className="public-person-nickname">«{persona.sobrenombre}»</div>}
              <p>{resumenPersona(persona)}</p>
              <div className="public-person-badges"><span>{textoFechas(persona)}</span>{persona.titulo && <span>{persona.titulo}</span>}{persona.dinastia && <a href={rutaEntidad("dinastia", slugPublico(persona.dinastia))}>{persona.dinastia}</a>}</div>
              <div className="public-person-actions"><button className="public-primary" type="button" onClick={onExplore}>Abrir en el atlas interactivo <ArrowRight size={15} /></button><a className="public-secondary" href="/es/personas"><ArrowLeft size={14} /> Volver a personas</a></div>
            </div>
            <Portrait persona={persona} />
          </header>

          <div className="public-person-columns">
            <section className="public-content-card"><span>Perfil histórico</span><h2>Datos principales</h2>{persona.titulo && <p><strong>Título:</strong> {persona.titulo}</p>}{persona.dinastia && <p><strong>Dinastía:</strong> <a href={rutaEntidad("dinastia", slugPublico(persona.dinastia))}>{persona.dinastia}</a></p>}{!!persona.reinos?.length && <p><strong>Territorios:</strong> {persona.reinos.map((r, i) => <React.Fragment key={r}>{i > 0 && " · "}<a href={rutaEntidad("territorio", slugPublico(r))}>{r}</a></React.Fragment>)}</p>}{!!persona.reinados?.length && <div className="public-reigns"><strong>Reinados registrados</strong>{persona.reinados.map((r, index) => <div key={`${r.territorio}-${r.desde}-${index}`}><span>{r.territorio || "Territorio"}</span><b>{r.desde ?? "?"}–{r.hasta ?? "?"}</b>{r.tipo && <small>{r.tipo}</small>}</div>)}</div>}</section>

            <section className="public-content-card"><span>Red familiar</span><h2>Relaciones documentadas</h2><RelationList label="Padres" items={persona.padres} /><RelationList label={persona.conyuges?.length > 1 ? "Cónyuges" : "Cónyuge"} items={persona.conyuges} /><RelationList label="Hijos/as" items={persona.hijos} />{!persona.padres?.length && !persona.conyuges?.length && !persona.hijos?.length && <p className="public-muted">No hay relaciones directas cargadas para esta persona.</p>}</section>
          </div>

          {!!persona.historias?.length && <section className="public-section public-person-section"><div className="public-section-heading"><div><span>Historias relacionadas</span><h2>Aparece en estos recorridos</h2></div></div><div className="public-story-grid">{persona.historias.map((h) => <a key={h.id} className="public-story-card" href={rutaEntidad("historia", h.slug)}><span>Historia</span><h3>{h.titulo}</h3><p>{h.subtitulo}</p><b>Comenzar <ArrowRight size={13} /></b></a>)}</div></section>}

          <section className="public-section public-person-section"><div className="public-section-heading"><div><span>Seguir explorando</span><h2>Más caminos desde {persona.nombre}</h2></div></div><div className="public-follow-grid">
            <div><h3><GitBranch size={16} /> Familia</h3>{[...(persona.padres || []), ...(persona.conyuges || []), ...(persona.hijos || [])].slice(0, 6).map((p) => <PersonaMiniCard key={p.id} persona={p} compact />)}</div>
            <div><h3><Shield size={16} /> Misma dinastía</h3>{(persona.relacionadosDinastia || []).map((p) => <PersonaMiniCard key={p.id} persona={p} compact />)}</div>
            <div><h3><Users size={16} /> En su época</h3>{(persona.contemporaneos || []).map((p) => <PersonaMiniCard key={p.id} persona={p} compact />)}</div>
          </div></section>
        </article>
      </main>
    </PublicLayout>
  );
}
