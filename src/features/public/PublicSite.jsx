import './thumbnailLookup.js';
import TerritoryCatalog from './TerritoryCatalog.jsx';
import {collectionLabels} from '../stories/storyThemes.js';
import {englishLabel} from '../english/presentationLabels.js';
import {MAP_READING_GUIDE} from '../../content/mapReadingGuide.js';
import {SITE_NAME,SITE_NAME_EN} from '../../app/siteConfig.js';
import {SOURCE_SECTIONS} from '../../content/sources.js';
import React, {useState, useMemo, useEffect} from 'react';
import {Info, Landmark, Scale, Heart, ExternalLink, Users, Shield, BookOpen, Search, ArrowRight, ArrowLeft, GitBranch} from 'lucide-react';
import {usePublicMeta, PublicLayout, Breadcrumbs, useJson, PersonaMiniCard, rutaEntidad} from './publicShared.jsx';
export {PersonPage, PersonContent} from './PersonPage.jsx';
import ProjectSupport from '../../components/ProjectSupport.jsx';
import DynastyArms from '../../components/DynastyArms.jsx';
import DynastyCard from './DynastyCard.jsx';
import {CREDITOS_ESCUDOS} from '../../content/dinastias/escudos.js';
import {textoBusquedaPersona, normalizarBusquedaPublica, slugPublico} from '../../domain/people/personLabels.js';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import StoryCatalog from '../stories/StoryCatalog.jsx';
import {STORY_PROGRESS_KEY} from '../stories/storyModel.js';
import {featuredOrder, personFacets} from './catalogPreview.js';
import {loadJsonAsset} from '../../utils/loadAsset.js';
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
        <Breadcrumbs items={[{ label: "Inicio", href: "/es" }, { label: page.title }]} />
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

function textoCatalogoItem(item, tipo, locale='es') {
  if (tipo === "personas") return textoBusquedaPersona(item);
  if (tipo === "historias") return [item.titulo, item.subtitulo, item.descripcion, ...collectionLabels(item,locale)].filter(Boolean).join(" ");
  return [item.nombre, ...(item.aliases||[]), ...(item.miembros || []).map((p) => p.nombre)].filter(Boolean).join(" ");
}

export function CatalogPage(props) {
  return props.tipo==='territorios'?<TerritoryCatalog {...props}/>:<GeneralCatalogPage {...props}/>;
}

function GeneralCatalogPage({ tipo, locale='es', initialData=null, embedded=false, catalogTitle=null }) {
  const en=locale==='en', tr=(es,english)=>en?english:es;
  const catalogNames={personas:'People',dinastias:'Dynasties',territorios:'Territories',historias:'Stories'};
  const Wrapper=embedded?React.Fragment:PublicLayout;
  const originalConfig = CATALOG_CONFIG[tipo] || CATALOG_CONFIG.personas;
  const config = en ? {...originalConfig,title:catalogTitle||catalogNames[tipo],eyebrow:{personas:'Atlas index',dinastias:'Houses and lineages',territorios:'Crowns and political territories',historias:'Guided stories'}[tipo],description:{personas:'Search by name, title, dynasty or territory.',dinastias:'Explore the origins, branches, inheritances and connections of the houses in the Atlas.',territorios:'Explore the territories in the database and the people who connect them.',historias:'Stories built from the people, maps, biographies and chronology of the Atlas.'}[tipo]} : originalConfig;
  const Icon = config.icon;
  const { data: initial, loading, error } = useJson(`/catalogos/${tipo}.json`, initialData);
  // 6.1.0: a static page carries the first items; the complete list follows.
  const preview = initial?.partial || null;
  const [complete, setComplete] = useState(null);
  useEffect(() => {
    if (!preview?.full) return;
    let cancelled = false;
    loadJsonAsset(preview.full).then(full => { if (!cancelled && Array.isArray(full?.items)) setComplete(full.items); }).catch(() => {});
    return () => { cancelled = true; };
  }, [preview?.full]);
  const partial = preview && !complete ? preview : null;
  const data = complete ? {...initial, items: complete} : initial;
  const [query, setQuery] = useState("");
  useEffect(() => {setQuery(new URLSearchParams(window.location.search).get("q") || "");}, [tipo]);
  const [soloHistoria, setSoloHistoria] = useState(false);
  // V5.23 · Personas: orden por relevancia o alfabético, filtros y paginación.
  const [orden, setOrden] = useState("destacadas");
  const [filtrosPersona, setFiltrosPersona] = useState({siglo: null, papel: null, region: null, letra: null});
  const [limite, setLimite] = useState(120);
  const items = Array.isArray(data?.items) ? data.items : [];
  const filtrados = useMemo(() => {
    const q = normalizarBusquedaPublica(query);
    const lista = items.filter(item => (!soloHistoria || tipo !== "dinastias" || item.editorial) && (!q || normalizarBusquedaPublica(textoCatalogoItem(item, tipo, locale)).includes(q)));
    if (tipo !== "personas") return lista;
    const {siglo, papel, region, letra} = filtrosPersona;
    const inicial = item => normalizarBusquedaPublica(item.nombre).charAt(0).toUpperCase();
    const elegidos = lista.filter(item => (siglo === null || (siglo === "sin" ? item.siglo == null : item.siglo === siglo))
      && (!papel || item.papel === papel) && (!region || item.region === region) && (!letra || inicial(item) === letra));
    return orden === "destacadas" && !q ? featuredOrder(elegidos, locale) : elegidos.slice().sort((a,b)=>a.nombre.localeCompare(b.nombre,locale));
  }, [items, query, tipo, soloHistoria, filtrosPersona, orden, locale]);
  useEffect(() => { setLimite(120); }, [query, filtrosPersona, orden]);
  const visibles = tipo === "personas" ? filtrados.slice(0, limite) : filtrados;
  const facetas = useMemo(() => tipo !== "personas" ? null : partial?.facetas || personFacets(items), [items, tipo, partial]);
  // Progreso de lectura guardado en este navegador (solo se lee tras montar).
  const [progresoHistorias, setProgresoHistorias] = useState({});
  useEffect(() => {
    if (tipo !== "historias") return;
    try { setProgresoHistorias(JSON.parse(window.localStorage.getItem(STORY_PROGRESS_KEY)) || {}); } catch { setProgresoHistorias({}); }
  }, [tipo]);
  const alternarFiltro = (clave, valor) => setFiltrosPersona(actual => ({...actual, [clave]: actual[clave] === valor ? null : valor}));
  const filtrosActivos = Object.values(filtrosPersona).filter(v => v !== null).length;
  // While only the first items are loaded, the counts are those of the whole catalogue.
  const cuenta = partial && !query.trim() && !filtrosActivos && !soloHistoria ? partial.total : filtrados.length;
  usePublicMeta({
    title: `${config.title} — ${en?SITE_NAME_EN:SITE_NAME}`,
    description: config.description,
    path: en ? `/en/${{personas:"people",dinastias:"dynasties",territorios:"territories",historias:"stories"}[tipo]}` : `/es/${tipo}`,
  });

  return (
    <Wrapper {...(embedded?{}:{pathname:`/es/${tipo}`,prerendered:Boolean(initialData)})}>
      <main className="public-main public-catalog">
        <Breadcrumbs locale={locale} items={[{ label: tr("Inicio","Home"), href: en?"/en":"/es" }, { label: config.title }]} />
        <section className="public-page-title">
          <div className="public-page-icon"><Icon size={22} /></div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p>
        </section>
        <label className="public-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`${tr("Buscar en","Search")} ${config.title.toLowerCase()}…`} aria-label={`${tr("Buscar en","Search")} ${config.title.toLowerCase()}`} /><span>{filtrados.length}</span></label>

        {tipo === "dinastias" && <label className="dynasty-editorial-filter"><input type="checkbox" checked={soloHistoria} onChange={e=>setSoloHistoria(e.target.checked)}/>{tr('Mostrar solo casas con historia desarrollada','Show only houses with a developed history')}</label>}
        {loading && <ReadingSkeleton kind="catalog-list" list={tipo === "personas" ? "people" : tipo === "historias" ? "stories" : "entities"}/>}
        {error && <div className="public-error">{tr('No se ha podido cargar este catálogo. Puedes seguir explorando el atlas.','This catalogue could not load. You can continue exploring the Atlas.')}</div>}

        {!loading && !error && tipo === "personas" && facetas && (
          <section className="people-facets" aria-label={tr('Ordenar y filtrar personas','Sort and filter people')}>
            <div className="people-facets-head">
              <div className="people-order" role="group" aria-label={tr("Orden","Order")}>
                {[["destacadas", tr("Destacadas","Featured")], ["alfabetico", "A–Z"]].map(([valor, etiqueta]) => <button key={valor} type="button" aria-pressed={orden === valor} onClick={() => { setOrden(valor); if (valor === "destacadas") setFiltrosPersona(a => ({...a, letra: null})); }}>{etiqueta}</button>)}
              </div>
              {filtrosActivos > 0 && <button type="button" className="people-facets-clear" onClick={() => setFiltrosPersona({siglo: null, papel: null, region: null, letra: null})}>{tr("Quitar filtros","Clear filters")} ({filtrosActivos})</button>}
            </div>
            {orden === "alfabetico" && <nav className="people-alphabet" aria-label={tr('Índice alfabético','Alphabetical index')}>{facetas.letras.map(letra => <button key={letra} type="button" aria-pressed={filtrosPersona.letra === letra} onClick={() => alternarFiltro("letra", letra)}>{letra}</button>)}</nav>}
            <div className="people-facet"><span>{tr("Siglo","Century")}</span><div>{facetas.siglos.map(([siglo, n]) => <button key={siglo} type="button" aria-pressed={filtrosPersona.siglo === siglo} onClick={() => alternarFiltro("siglo", siglo)}>{en?"c.":"s."} {ROMANOS[siglo] || siglo}<small>{n}</small></button>)}</div></div>
            <div className="people-facet"><span>{tr("Papel","Role")}</span><div>{facetas.papeles.map(([papel, n]) => <button key={papel} type="button" aria-pressed={filtrosPersona.papel === papel} onClick={() => alternarFiltro("papel", papel)}>{en?englishLabel(papel):papel}<small>{n}</small></button>)}</div></div>
            <div className="people-facet"><span>{tr("Región","Region")}</span><div>{facetas.regiones.map(([region, n]) => <button key={region} type="button" aria-pressed={filtrosPersona.region === region} onClick={() => alternarFiltro("region", region)}>{region === "Otros" ? tr("Sin territorio registrado","No recorded territory") : en?englishLabel(region):region}<small>{n}</small></button>)}</div></div>
          </section>
        )}
        {!loading && !error && tipo === "personas" && (
          <>
            <div className="public-catalog-note">{cuenta} {cuenta === 1 ? tr("persona","person") : tr("personas","people")}{orden === "destacadas" && !query.trim() ? tr(" · las más relevantes primero: con retrato, biografía extensa y gobiernos registrados"," · most relevant first: portraits, extended biographies and recorded governments") : ""}</div>
            <p className="public-catalog-note"><a href={en?"/en/people/a-z":"/es/personas/indice"}>{tr("Ver todas las personas en el índice de la A a la Z","See everyone in the A–Z index")}</a></p>
            <div className="public-person-list">{visibles.map((persona) => <PersonaMiniCard key={persona.id} persona={persona} compact locale={locale}/>)}</div>
            {visibles.length < cuenta && <button type="button" className="public-secondary people-more" onClick={() => setLimite(n => n + 120)}>{tr("Ver más","Show more")} ({cuenta - visibles.length} {tr("restantes","remaining")})</button>}
            {!filtrados.length && <p className="public-muted">{tr("Ninguna persona coincide con estos filtros.","No people match these filters.")}</p>}
          </>
        )}

        {!loading && !error && (tipo === "dinastias" || tipo === "territorios") && (
          <div className="public-entity-grid">
            {filtrados.map((item) => tipo === 'dinastias' ? <DynastyCard key={item.slug} item={item} locale={locale}/> : (
              <article key={item.slug} className="public-entity-card">
                <div className="public-entity-card-head"><div className="public-entity-heading">{tipo === "dinastias" && <DynastyArms dinastia={item.key||item.nombre} size={30} locale={locale}/>}<div><span>{tipo === "dinastias" ? (item.editorial ? tr("Historia de la dinastía","History of the house") : tr("Dinastía","Dynasty")) : tr("Territorio","Territory")}</span><h2>{item.nombre}</h2></div></div><strong aria-label={`${item.total} ${tr("personas","people")}`}>{item.total}<small aria-hidden="true">{item.total === 1 ? tr("persona","person") : tr("personas","people")}</small></strong></div>
                {tipo === "dinastias" && item.resumen && <p className="public-muted public-dynasty-summary">{item.resumen}</p>}
                {!!item.miembros?.length && <div className="public-entity-members">{item.miembros.map((p) => <a key={p.id} href={p.path || rutaEntidad("persona", p.slug)}>{p.nombre}</a>)}</div>}
                <a className="public-entity-action" href={item.path || rutaEntidad(tipo === "dinastias" ? "dinastia" : "territorio", item.slug)}>{tr("Ver ficha","Read the record")} <ArrowRight size={13} /></a>
              </article>
            ))}
          </div>
        )}
        {!loading && !error && partial && (tipo === "dinastias" || tipo === "territorios") && <p className="public-catalog-note">{tr(`Se muestran ${filtrados.length} de ${partial.total}; el resto se está cargando.`,`Showing ${filtrados.length} of ${partial.total}; the rest is loading.`)}</p>}
        {!loading && !error && tipo === "dinastias" && <p className="public-catalog-note public-arms-note">{tr("Escudos: autores, procedencia y licencias en","Arms: authors, sources and licences in")} <a href={en?"/en/licences#escudos":"/es/licencias#escudos"}>{tr("Licencias","Licences")}</a>.</p>}

        {!loading && !error && tipo === "historias" && <StoryCatalog items={filtrados} progress={progresoHistorias} locale={locale}/>}
      </main>
    </Wrapper>
  );
}


