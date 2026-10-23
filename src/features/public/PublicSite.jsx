import {profileLabel,profileNote,profileClaims,profileEntityPath} from '../english/profilePresentation.js';
import {displayedNickname} from '../../domain/people/personNaming.js';
import {MAP_READING_GUIDE} from '../../content/mapReadingGuide.js';
import {territoriosDe, gobiernosDe} from '../../domain/genealogy/personAccessors.js';
import {SITE_NAME} from '../../app/siteConfig.js';
import {entityMeta} from './publicMeta.js';
import CrownTimeline from '../../components/CrownTimeline.jsx';
import DocumentationNotes from '../../components/DocumentationNotes.jsx';
import {SOURCE_SECTIONS} from '../../content/sources.js';
import EvidencePanel, {EvidenceMark} from '../../components/EvidencePanel.jsx';
import {formatClaimDate} from '../../evidence/claims.js';
import React, {useState, useMemo, useEffect} from 'react';
import {Info, Landmark, Scale, Heart, ExternalLink, Users, Shield, BookOpen, Search, ArrowRight, ArrowLeft, GitBranch} from 'lucide-react';
import {IMAGENES_PERSONAS} from '../../data/imagenesPersonas.js';
import {usePublicMeta, PublicLayout, Breadcrumbs, useJson, PersonaMiniCard, rutaEntidad, personaDates} from './publicShared.jsx';
import ProjectSupport from '../../components/ProjectSupport.jsx';
import DynastyArms from '../../components/DynastyArms.jsx';
import DynastyCard from './DynastyCard.jsx';
import {CREDITOS_ESCUDOS} from '../../content/dinastias/escudos.js';
import {textoBusquedaPersona, normalizarBusquedaPublica, slugPublico, etiquetaClaseGobierno} from '../../domain/people/personLabels.js';
import {responsiveImage} from '../../utils/responsiveImage.js';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import {STORY_PROGRESS_KEY} from '../stories/storyModel.js';
import {translatedEquivalent} from '../english/routes.js';
import '../../styles/theme.css';

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
      {...MAP_READING_GUIDE,paragraphs:[...MAP_READING_GUIDE.paragraphs,...MAP_READING_GUIDE.examples]},
      { title: "Ámbito principal", paragraphs: [
        "El periodo principal de trabajo es 1200–1800. El proyecto está en desarrollo y la base continúa ampliándose, corrigiéndose y documentándose.",
        "Lo mantiene Manuel Muriel Cagigal, estudiante de Estudios Europeos con especialización en Relaciones Internacionales."
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
      { id: "escudos", title: "Escudos: autores y licencias", paragraphs: [
        "Los dibujos proceden de Wikimedia Commons, de WappenWiki y de las aportaciones de Manuel Muriel Cagigal realizadas con Heraldicon. Cada imagen conserva su autoría, procedencia y licencia o autorización de uso. Las obras propias de Manuel Muriel Cagigal se utilizan con su autorización para el Atlas. Zrinski conserva la licencia CC BY-NC-SA 3.0 de WappenWiki. Las fichas describen las adaptaciones, como la retirada de coronas exteriores o la composición del león coronado de Nassau, y las imágenes para compartir incorporan sus créditos."
      ], links: CREDITOS_ESCUDOS.flatMap(c => [[`${c.dinastia} · ${c.autor} · ${c.licencia}`, c.fuente],...(c.fuentesAdicionales||[]).map(f=>[`${c.dinastia} · ${f.titulo} · ${f.autor} · ${f.licencia}`,f.fuente])])},
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
      { title: "Heráldica", paragraphs: [
        "Gracias a Heraldicon, la herramienta con la que Manuel Muriel Cagigal ha creado y aportado los escudos propios. La autoría y las condiciones de uso de cada dibujo se indican en sus créditos."
      ], links: [["Heraldicon", "https://heraldicon.org/"]]},
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
            <section className="public-info-card" key={section.title} id={section.id}>
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {!!section.links?.length && <div className="public-info-links">{section.links.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label} <ExternalLink size={11} /></a>)}</div>}
            </section>
          ))}
          {tipo === 'proyecto' && <ProjectSupport />}
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

const ROMANOS = {10: "X", 11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV", 16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX"};

function textoCatalogoItem(item, tipo) {
  if (tipo === "personas") return textoBusquedaPersona(item);
  if (tipo === "historias") return [item.titulo, item.subtitulo, item.descripcion].filter(Boolean).join(" ");
  return [item.nombre, ...(item.aliases||[]), ...(item.miembros || []).map((p) => p.nombre)].filter(Boolean).join(" ");
}

export function CatalogPage({ tipo }) {
  const config = CATALOG_CONFIG[tipo] || CATALOG_CONFIG.personas;
  const Icon = config.icon;
  const { data, loading, error } = useJson(`/catalogos/${tipo}.json`);
  const [query, setQuery] = useState("");
  const [soloHistoria, setSoloHistoria] = useState(false);
  // V5.23 · Personas: orden por relevancia o alfabético, filtros y paginación.
  const [orden, setOrden] = useState("destacadas");
  const [filtrosPersona, setFiltrosPersona] = useState({siglo: null, papel: null, region: null, letra: null});
  const [limite, setLimite] = useState(120);
  const items = Array.isArray(data?.items) ? data.items : [];
  const filtrados = useMemo(() => {
    const q = normalizarBusquedaPublica(query);
    const lista = items.filter(item => (!soloHistoria || tipo !== "dinastias" || item.editorial) && (!q || normalizarBusquedaPublica(textoCatalogoItem(item, tipo)).includes(q)));
    if (tipo !== "personas") return lista;
    const {siglo, papel, region, letra} = filtrosPersona;
    const inicial = item => normalizarBusquedaPublica(item.nombre).charAt(0).toUpperCase();
    const elegidos = lista.filter(item => (siglo === null || (siglo === "sin" ? item.siglo == null : item.siglo === siglo))
      && (!papel || item.papel === papel) && (!region || item.region === region) && (!letra || inicial(item) === letra));
    return orden === "destacadas" && !q ? elegidos.slice().sort((a, b) => (b.relevancia || 0) - (a.relevancia || 0) || a.nombre.localeCompare(b.nombre, "es")) : elegidos;
  }, [items, query, tipo, soloHistoria, filtrosPersona, orden]);
  useEffect(() => { setLimite(120); }, [query, filtrosPersona, orden]);
  const visibles = tipo === "personas" ? filtrados.slice(0, limite) : filtrados;
  const facetas = useMemo(() => {
    if (tipo !== "personas") return null;
    const contar = clave => { const m = new Map(); for (const item of items) if (item[clave] != null) m.set(item[clave], (m.get(item[clave]) || 0) + 1); return m; };
    const letras = [...new Set(items.map(item => normalizarBusquedaPublica(item.nombre).charAt(0).toUpperCase()).filter(l => /[A-Z]/.test(l)))].sort();
    return {siglos: [...contar("siglo")].sort((a, b) => a[0] - b[0]), papeles: [...contar("papel")].sort((a, b) => b[1] - a[1]), regiones: [...contar("region")].sort((a, b) => (a[0] === "Otros") - (b[0] === "Otros") || b[1] - a[1]), letras};
  }, [items, tipo]);
  // Progreso de lectura guardado en este navegador (solo se lee tras montar).
  const [progresoHistorias, setProgresoHistorias] = useState({});
  useEffect(() => {
    if (tipo !== "historias") return;
    try { setProgresoHistorias(JSON.parse(window.localStorage.getItem(STORY_PROGRESS_KEY)) || {}); } catch { setProgresoHistorias({}); }
  }, [tipo]);
  const alternarFiltro = (clave, valor) => setFiltrosPersona(actual => ({...actual, [clave]: actual[clave] === valor ? null : valor}));
  const filtrosActivos = Object.values(filtrosPersona).filter(v => v !== null).length;
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
        {loading && <ReadingSkeleton kind="catalog-list" list={tipo === "personas" ? "people" : tipo === "historias" ? "stories" : "entities"}/>}
        {error && <div className="public-error">No se ha podido cargar este catálogo. Puedes seguir explorando el atlas.</div>}

        {!loading && !error && tipo === "personas" && facetas && (
          <section className="people-facets" aria-label="Ordenar y filtrar personas">
            <div className="people-facets-head">
              <div className="people-order" role="group" aria-label="Orden">
                {[["destacadas", "Destacadas"], ["alfabetico", "A–Z"]].map(([valor, etiqueta]) => <button key={valor} type="button" aria-pressed={orden === valor} onClick={() => { setOrden(valor); if (valor === "destacadas") setFiltrosPersona(a => ({...a, letra: null})); }}>{etiqueta}</button>)}
              </div>
              {filtrosActivos > 0 && <button type="button" className="people-facets-clear" onClick={() => setFiltrosPersona({siglo: null, papel: null, region: null, letra: null})}>Quitar filtros ({filtrosActivos})</button>}
            </div>
            {orden === "alfabetico" && <nav className="people-alphabet" aria-label="Índice alfabético">{facetas.letras.map(letra => <button key={letra} type="button" aria-pressed={filtrosPersona.letra === letra} onClick={() => alternarFiltro("letra", letra)}>{letra}</button>)}</nav>}
            <div className="people-facet"><span>Siglo</span><div>{facetas.siglos.map(([siglo, n]) => <button key={siglo} type="button" aria-pressed={filtrosPersona.siglo === siglo} onClick={() => alternarFiltro("siglo", siglo)}>s. {ROMANOS[siglo] || siglo}<small>{n}</small></button>)}</div></div>
            <div className="people-facet"><span>Papel</span><div>{facetas.papeles.map(([papel, n]) => <button key={papel} type="button" aria-pressed={filtrosPersona.papel === papel} onClick={() => alternarFiltro("papel", papel)}>{papel}<small>{n}</small></button>)}</div></div>
            <div className="people-facet"><span>Región</span><div>{facetas.regiones.map(([region, n]) => <button key={region} type="button" aria-pressed={filtrosPersona.region === region} onClick={() => alternarFiltro("region", region)}>{region === "Otros" ? "Sin territorio registrado" : region}<small>{n}</small></button>)}</div></div>
          </section>
        )}
        {!loading && !error && tipo === "personas" && (
          <>
            <div className="public-catalog-note">{filtrados.length} {filtrados.length === 1 ? "persona" : "personas"}{orden === "destacadas" && !query.trim() ? " · las más relevantes primero: con retrato, biografía extensa y gobiernos registrados" : ""}</div>
            <div className="public-person-list">{visibles.map((persona) => <PersonaMiniCard key={persona.id} persona={persona} compact />)}</div>
            {visibles.length < filtrados.length && <button type="button" className="public-secondary people-more" onClick={() => setLimite(n => n + 120)}>Ver más ({filtrados.length - visibles.length} restantes)</button>}
            {!filtrados.length && <p className="public-muted">Ninguna persona coincide con estos filtros.</p>}
          </>
        )}

        {!loading && !error && (tipo === "dinastias" || tipo === "territorios") && (
          <div className="public-entity-grid">
            {filtrados.map((item) => tipo === 'dinastias' ? <DynastyCard key={item.slug} item={item}/> : (
              <article key={item.slug} className="public-entity-card">
                <div className="public-entity-card-head"><div className="public-entity-heading">{tipo === "dinastias" && <DynastyArms dinastia={item.nombre} size={30}/>}<div><span>{tipo === "dinastias" ? (item.editorial ? "Historia de la dinastía" : "Dinastía") : "Territorio"}</span><h2>{item.nombre}</h2></div></div><strong aria-label={`${item.total} personas`}>{item.total}<small aria-hidden="true">{item.total === 1 ? "persona" : "personas"}</small></strong></div>
                {tipo === "dinastias" && item.resumen && <p className="public-muted public-dynasty-summary">{item.resumen}</p>}
                {!!item.miembros?.length && <div className="public-entity-members">{item.miembros.map((p) => <a key={p.id} href={rutaEntidad("persona", p.slug)}>{p.nombre}</a>)}</div>}
                <a className="public-entity-action" href={rutaEntidad(tipo === "dinastias" ? "dinastia" : "territorio", item.slug)}>Ver ficha <ArrowRight size={13} /></a>
              </article>
            ))}
          </div>
        )}
        {!loading && !error && tipo === "dinastias" && <p className="public-catalog-note public-arms-note">Escudos: autores, procedencia y licencias en <a href="/es/licencias#escudos">Licencias</a>.</p>}

        {!loading && !error && tipo === "historias" && (
          <>
            <section className="story-catalog-section" aria-labelledby="historias-disponibles">
              <h2 id="historias-disponibles">Disponibles <small>{filtrados.filter(h => h.disponible).length}</small></h2>
              <div className="public-story-grid public-story-catalog">
                {filtrados.filter(h => h.disponible).map((historia) => {
                  const progreso = progresoHistorias[historia.id], leidos = Math.min(progreso?.read?.length || 0, historia.pasos);
                  return <article key={historia.id} className="public-story-card">
                    <span>{historia.pasos} capítulos{historia.minutos ? ` · ${historia.minutos} min` : ""}</span>
                    <h2>{historia.titulo}</h2><p>{historia.subtitulo || historia.descripcion}</p>
                    {leidos > 0 && <div className="story-card-progress" aria-label={`${leidos} de ${historia.pasos} capítulos leídos`}><i style={{width: `${Math.round(leidos / historia.pasos * 100)}%`}}/></div>}
                    <a href={leidos > 0 && leidos < historia.pasos ? `${rutaEntidad("historia", historia.slug)}/capitulo/${progreso.last}` : rutaEntidad("historia", historia.slug)}>
                      {leidos >= historia.pasos ? "Volver a leer" : leidos > 0 ? `Continuar en el capítulo ${progreso.last}` : "Comenzar recorrido"} <ArrowRight size={13} />
                    </a>
                  </article>;
                })}
              </div>
            </section>
            {filtrados.some(h => !h.disponible) && <section className="story-catalog-section is-coming" aria-labelledby="historias-preparacion">
              <h2 id="historias-preparacion">En preparación <small>{filtrados.filter(h => !h.disponible).length}</small></h2>
              <ul className="story-coming-list">{filtrados.filter(h => !h.disponible).map(historia => <li key={historia.id}><strong>{historia.titulo}</strong><span>{historia.subtitulo || historia.descripcion}</span></li>)}</ul>
            </section>}
          </>
        )}
      </main>
    </PublicLayout>
  );
}

function Portrait({ persona, locale = 'es' }) {
  const image = locale === 'en' && persona.portrait || IMAGENES_PERSONAS[persona?.id];
  if (!image) return null;
  const objectPosition = image.encuadre || image.posicion || "50% 20%";
  const zoom = Number.isFinite(image.zoom) && image.zoom > 0 ? image.zoom : 1;
  return (
    <figure className="public-portrait">
      <div className="public-portrait-frame"><img {...responsiveImage(image.archivo, "(max-width: 680px) 280px, 320px")} alt={locale === 'en' ? `Portrait of ${persona.nombre}` : image.alt || `Retrato de ${persona.nombre}`} decoding="async" style={{ objectPosition, transform: `scale(${zoom})`, transformOrigin: objectPosition }} /></div>
      <figcaption lang={locale === 'en' ? persona.translationComplete ? 'en' : 'es' : undefined}><strong>{image.tipo}</strong><span>{image.obra}</span><span>{image.autor}{image.fecha ? ` · ${image.fecha}` : ""}</span>{image.institucion && <span>{image.institucion}</span>}<small>{image.derechos}{image.fuenteUrl && <> · <a href={image.fuenteUrl} target="_blank" rel="noreferrer">{locale === 'en' ? 'Source' : 'Fuente'} <ExternalLink size={10} /></a></>}</small></figcaption>
    </figure>
  );
}

function RelationList({ label, items, locale = 'es', claims = [], field }) {
  if (!items?.length) return null;
  return <div className="public-relation-row"><strong>{label}</strong><div>{items.map((p) => { const path = p.path || (locale === 'en' && translatedEquivalent(rutaEntidad('persona', p.slug), 'en')) || rutaEntidad('persona', p.slug); const claim=claims.find(c=>c.value===p.id && (field==='parents' ? ['Padre','Madre'].includes(c.field) : field==='partners' ? c.field==='Matrimonio o vínculo conyugal' : false)); return <span key={p.id} className="public-relation-evidence"><a href={path}>{p.nombre}{locale === 'en' && path.startsWith('/es/') ? ' · ES' : ''}</a>{claim&&<EvidenceMark claim={claim} locale={locale}/>}</span>; })}</div></div>;
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
  const claims=profileClaims(persona);
  const fact=field=>claims.find(claim=>claim.field===field);
  return <main className="public-main public-person-page">
    <Breadcrumbs locale={locale} items={[{label:label('Inicio','Home'),href:en?'/en/':'/es/'},{label:label('Personas','People'),href:peoplePath},{label:persona.nombre}]}/>
    <article>
      <header className="public-person-hero">
        <div className="public-person-hero-copy">
          <span>{label('El Árbol de Europa · Persona','The Tree of Europe · Person')}</span>
          <h1>{persona.nombre}</h1>
          {(!en || persona.translationComplete) && displayedNickname(persona) && <div className="public-person-nickname">«{displayedNickname(persona)}»</div>}
          <p>{en ? persona.summary : persona.biografia || persona.resumen || ''}</p>
          <div className="public-person-badges"><span>{personaDates(persona,locale)}</span>{(en?persona.role:persona.titulo)&&<span>{en?persona.role:persona.titulo}</span>}{persona.dinastia&&<a href={profileEntityPath('dinastia',persona.dinastia,locale)}>{profileLabel(persona,persona.dinastia)}{en&&profileEntityPath('dinastia',persona.dinastia,locale).startsWith('/es/')?' · ES':''}</a>}</div>
          <div className="public-person-actions"><a className="public-primary" href={atlasPath} onClick={onExplore?e=>{e.preventDefault();onExplore();}:undefined}>{label('Abrir en el atlas interactivo','Explore this family · Spanish Atlas')}<ArrowRight size={15}/></a><a className="public-secondary" href={peoplePath}><ArrowLeft size={14}/>{label('Volver a personas','Back to people')}</a></div>
        </div>
        <Portrait persona={persona} locale={locale}/>
      </header>
      {(!en||persona.translationComplete)&&!!persona.biografiaExtensa?.length&&<section className="public-long-bio" aria-labelledby="public-long-bio-title"><span>{label('Biografía','Biography')}</span><h2 id="public-long-bio-title">{label('Vida de','Life of')} {persona.nombre}</h2>{persona.biografiaExtensa.map(part=><section key={part.titulo}><h3>{part.titulo}</h3><p>{part.texto}</p>{!!part.fuentes?.length&&<p className="public-long-bio-refs">{label('Referencias:','References:')} {part.fuentes.map((f,i)=><React.Fragment key={f.url}>{i>0&&' · '}<a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></React.Fragment>)}</p>}</section>)}</section>}
      {en&&<p className="public-translation-note">{persona.translationComplete?'This complete profile is available in English. Bibliographic titles retain their original language. Links marked ES open the Spanish edition.':'This short profile is translated. Names of dynasties and territories, picture credits and original documentary records retain their source language. Links marked ES open the Spanish edition.'}</p>}
      <div className="public-person-columns">
        <section className="public-content-card"><span>{label('Perfil histórico','Historical profile')}</span><h2>{label('Datos principales','Key details')}</h2>{fact('Nacimiento')&&<p><strong>{label('Nacimiento:','Birth:')}</strong> {formatClaimDate(fact('Nacimiento'),locale)} <EvidenceMark claim={fact('Nacimiento')} locale={locale}/></p>}{fact('Fallecimiento')&&<p><strong>{label('Fallecimiento:','Death:')}</strong> {formatClaimDate(fact('Fallecimiento'),locale)} <EvidenceMark claim={fact('Fallecimiento')} locale={locale}/></p>}{(en?persona.role:persona.titulo)&&<p><strong>{label('Título:','Role:')}</strong> {en?persona.role:persona.titulo}</p>}{!!persona.aliases?.length&&<p><strong>{label('Otros nombres:','Other recorded names:')}</strong> {persona.aliases.join(' · ')}</p>}{persona.dinastia&&<p><strong>{label('Dinastía:','Dynasty:')}</strong> <a href={profileEntityPath('dinastia',persona.dinastia,locale)}>{profileLabel(persona,persona.dinastia)}{en&&profileEntityPath('dinastia',persona.dinastia,locale).startsWith('/es/')?' · ES':''}</a></p>}{!!territoriosDe(persona).length&&<p><strong>{label('Territorios:','Territories:')}</strong> {territoriosDe(persona).map((r,i)=><React.Fragment key={r}>{i>0&&' · '}<a href={profileEntityPath('territorio',r,locale)}>{profileLabel(persona,r)}{en&&profileEntityPath('territorio',r,locale).startsWith('/es/')?' (ES)':''}</a></React.Fragment>)}</p>}{(!en||persona.translationComplete)&&<RecordedGovernments persona={persona} claims={claims} locale={locale}/>}</section>
        <section className="public-content-card"><span>{label('Red familiar','Family network')}</span><h2>{label('Relaciones registradas','Recorded relationships')}</h2><RelationList locale={locale} label={label('Padres','Parents')} items={persona.padres} claims={claims} field="parents"/><RelationList locale={locale} label={label(persona.conyuges?.length>1?'Cónyuges':'Cónyuge','Partners')} items={persona.conyuges} claims={claims} field="partners"/><RelationList locale={locale} label={label('Hijos/as','Children')} items={persona.hijos}/>{!persona.padres?.length&&!persona.conyuges?.length&&!persona.hijos?.length&&<p className="public-muted">{label('No hay relaciones directas cargadas para esta persona.','No direct relationships are recorded for this person.')}</p>}</section>
      </div>
      {en && !persona.translationComplete ? <details className="public-original-content"><summary>Governments and documentary notes · Spanish original</summary><div lang="es"><RecordedGovernments persona={persona}/><CrownTimeline key={persona.id} persona={persona} accesos={persona.accesosCoronas} fuentes={persona.fuentes}/><DocumentationNotes persona={persona}/></div><p className="public-translation-note"><a href={persona.esPath}>Read the complete Spanish record →</a></p></details> : <><CrownTimeline key={persona.id} persona={persona} accesos={persona.accesosCoronas} fuentes={persona.fuentes} locale={locale}/><DocumentationNotes persona={persona} locale={locale}/></>}
      {!!persona.fuentes?.length&&<section className="public-content-card"><span>{label('Documentación','Documentation')}</span><h2>{label('Fuentes de esta ficha','Sources for this profile')}</h2><ul>{persona.fuentes.map((f,i)=><li key={f.url||i}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><p className="public-muted">{label('Referencias biográficas y de contexto.','Biographical and contextual references in their original language.')} <a href={sourcePath}>{label('Consultar metodología y bibliografía completa','Sources and methodology')}</a>.</p></section>}
      <EvidencePanel person={persona} locale={locale} />
      {!!persona.historias?.length&&<section className="public-section public-person-section"><div className="public-section-heading"><div><span>{label('Historias relacionadas','Related stories')}</span><h2>{label('Aparece en estos recorridos','Follow this person through history')}</h2></div></div><div className="public-story-grid">{persona.historias.map(h=><a key={h.id} className="public-story-card" href={h.path||rutaEntidad('historia',h.slug)}><span>{en&&!h.path?'Story · Spanish original':label('Historia','Story')}</span><h3>{h.titulo}</h3><p>{h.subtitulo}</p><b>{label('Comenzar','Start reading')}<ArrowRight size={13}/></b></a>)}</div></section>}
      <section className="public-section public-person-section"><div className="public-section-heading"><div><span>{label('Seguir explorando','Keep exploring')}</span><h2>{en?`More paths from ${persona.nombre}`:`Más caminos desde ${persona.nombre}`}</h2></div></div><div className="public-follow-grid">
        <div><h3><GitBranch size={16}/>{label('Familia','Family')}</h3>{[...(persona.padres||[]),...(persona.conyuges||[]),...(persona.hijos||[])].slice(0,6).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
        <div><h3><Shield size={16}/>{label('Misma dinastía','Same dynasty')}</h3>{(persona.relacionadosDinastia||[]).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
        <div><h3><Users size={16}/>{label('En su época','In their lifetime')}</h3>{(persona.contemporaneos||[]).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
      </div></section>
    </article>
  </main>;
}

function RecordedGovernments({persona,claims=[],locale='es'}) {
  const en=locale==='en';
  const gobiernos = gobiernosDe(persona);
  if(!gobiernos.length)return null;
  return <div className="public-reigns"><strong>{en?'Recorded governments and reigns':'Gobiernos y reinados registrados'}</strong>{gobiernos.map((r,index)=>{const claim=claims.find(c=>c.field==='Gobierno'&&c.value.territorio===r.territorio&&c.interval.from===r.desde&&c.interval.to===r.hasta&&c.value.titulo===r.titulo);return <div key={`${r.territorio}-${r.desde}-${index}`}><span>{profileLabel(persona,r.titulo)} · {profileLabel(persona,r.territorio)|| (en?'Territory':'Territorio')} · {profileLabel(persona,etiquetaClaseGobierno(persona,r))} {claim&&<EvidenceMark claim={claim} locale={locale}/>}</span><b>{r.desde??'?'}–{r.hasta??'?'}</b>{r.condicion&&<small>{profileLabel(persona,r.condicion)}</small>}{en&&r.nota&&<small>{profileNote(persona,r.nota)}</small>}</div>;})}</div>;
}
