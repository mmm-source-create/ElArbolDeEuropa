import {TERRITORIAL_FOLDER_LABELS} from '../data/atlasFilters.js';
import AtlasTimeline from './AtlasTimeline.jsx';
import {governmentSummary} from '../data/governmentPresentation.js';
import './europe-panorama.css';
import {AtlasLoadError} from './AtlasSkeleton.jsx';
import {gobiernosDe, territoriosDe} from '../data/personAccessors.js';
import AtlasGrowth from './AtlasGrowth.jsx';
import StoryAtlasGuide from './StoryAtlasGuide.jsx';
import '../stories/stories.css';
import ConnectionControls from "../connections/ConnectionControls.jsx";
import TreeExport from "../connections/TreeExport.jsx";
import DocumentationNotes from "../components/DocumentationNotes.jsx";
import { responsiveImage } from "../utils/responsiveImage.js";
import React from "react";
import { Search, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, GitCompare, Share2, Play, Pause, SkipBack, SkipForward, X, Info, Heart, BookOpen, BarChart3, Scale, Flag, Mail, ExternalLink, Crosshair, Maximize2, CircleHelp, SlidersHorizontal, List, Star, PanelsTopLeft } from "lucide-react";
import { MapaEuropa } from "../MapaEuropa";
import { TERRITORIOS_SUB, TERRITORIOS_DESTACADOS, REINO_COLOR, REINO_COLOR_DEFAULT, listaReinados, territoriosGobernadosEnAño, reinadoEsEfectivo, reinadosActivos, idsDeGobiernoEnAño, añoReferenciaTerritorial, esGobernante } from "../Territorios";
import { TERRITORIOS } from "../data/territorios.js";
import { PERSONAS } from "../personas.jsx";
import { IMAGENES_PERSONAS } from "../imagenesPersonas.js";
import { EVENTOS_HISTORICOS, HISTORIAS } from "../historiaData.jsx";
import { t } from "../i18n.jsx";
import BioRelations from "../components/BioRelations.jsx";
import BioDiscovery from "../components/BioDiscovery.jsx";
import FavoriteStar from "../ui/FavoriteStar.jsx";
import HoldButton from "../ui/HoldButton.jsx";
import useReducedMotion from "../ui/useReducedMotion.js";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { etiquetaClaseGobierno, resumenCortoPersona } from "../utils/personPresentation.js";
import { ACCENTS, getCategoriaDinastía, DINASTIAS_DESTACADAS, GRUPOS_DINASTICOS, CATEGORIAS_TITULO, FILTROS_RELACION, BY_ID, HIJOS_POR_ID, SIN_FECHA, TIMELINE_SCALES, rutaEntidadLocalizada, slugPersonaPorLocale, slugPublico, listaConyuges, listaAmantes, siglosDePersona, etiquetaTipoReinado, normalizaTexto, estaVivaEn } from "./model.js";
import { nRomano, formatoFechas, sobrenombreDePersona, nombrePrincipal, pct, etiquetaFechaEvento, inicioEvento, finEvento, TL_MIN, TL_MAX, anioInicioPersona, anioFinPersona } from "./timelineUtils.js";
import { ALCANCES_FOCO, MODOS_COMPARACION, tipoRelacionEntre } from "./relationshipGraph.js";
import { Chip, ModalProyecto } from "./ExplorerPrimitives.jsx";
import AtlasGuide from "./AtlasGuide.jsx";
import { atlasSearch } from "./atlasSearch.js";
import TreeAccessibleList from "./TreeAccessibleList.jsx";
import EvidencePanel from '../evidence/EvidencePanel.jsx';
import CoverageDialog from '../evidence/CoverageDialog.jsx';
import {readPreferences} from '../settings/preferences.js';
import "./v39.css";
import "./v40.css";
import SegmentedControl from "../ui/SegmentedControl.jsx";
import ActionDial from "../ui/ActionDial.jsx";
import "./atlas-interactions.css";
import "../styles/v518.css";
import "../styles/v519.css";
import "../styles/v520.css";

const VIEW_OPTIONS = [{value:'arbol',label:'Árbol'},{value:'mapa',label:'Mapa'},{value:'ambos',label:'Árbol y mapa'}];
const BIO_OPTIONS = ['resumen','familia','coronas','historias','fuentes'].map((value,index)=>({value,label:['Resumen','Familia','Coronas','Historias','Fuentes'][index],controls:`bio-section-${value}`}));

const SEARCH_DYNASTIES = [...new Set(PERSONAS.map(persona => persona.dinastia).filter(Boolean))];
const SEARCH_TERRITORIES = Object.keys(TERRITORIOS);
const IRISH_MAP_TERRITORIES = new Set(['Irlanda','Connacht','Leinster','Tír Eoghain','Tír Chonaill','Condado de Tyrone','Condado de Tyrconnell','Thomond','Condado de Thomond','Desmond','Condado de Desmond','Condado de Clancare','Condado de Ulster','Kildare','Ormond','Clanricarde','Vizcondado de Mayo']);

const loadEuropeYearView = () => import('./EuropeYearView.jsx');
const EuropeYearView = React.lazy(loadEuropeYearView);
const TERRITORY_FILTER_MODES=[{value:'associated',label:'Vinculados'},{value:'government',label:'Gobernaban en el año'}];
const SCENES=[{value:'atlas',label:'Atlas'},{value:'europa',label:'Europa en este año'}];
const AtlasCrowns = React.lazy(() => import('./AtlasCrowns.jsx'));

function FilterSection({ title, open, onToggle, activeCount = 0, children }) {
  return (
    <section className={`filter-static-section${open ? " is-open" : " is-collapsed"}`}>
      <button type="button" className="filter-section-toggle" onClick={onToggle} aria-expanded={open}>
        <span className="filter-section-title">{title}</span>
        <span className="filter-section-meta">
          {activeCount > 0 && <span className="filter-section-count">{activeCount}</span>}
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>
      {open && <div className="filter-static-content">{children}</div>}
    </section>
  );
}

function TerritoryFilterNode({ name, options, selected, expanded, onToggleTerritory, onToggleExpanded, depth = 0, ancestors = [] }) {
  if (ancestors.includes(name)) return null;
  const children = options[name] || [];
  const hasChildren = children.length > 0;
  const isExpanded = expanded.includes(name);
  const color = REINO_COLOR[name] || REINO_COLOR_DEFAULT;
  return (
    <div className={`dinastia-block territory-filter-node${depth ? ' is-nested' : ''}`}>
      <span className="dinastia-chip-row">
        <Chip label={TERRITORIAL_FOLDER_LABELS.has(name)?`${name} · región`:name} small={depth > 0} active={selected.includes(name)} color={color} onClick={() => onToggleTerritory(name)} />
        {hasChildren && <button type="button" className="dinastia-expand-btn"
          onClick={() => onToggleExpanded(name)} aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Ocultar' : 'Mostrar'} territorios de ${name}`}>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>}
      </span>
      {hasChildren && isExpanded && <div className="territory-filter-children">
        {children.map(child => <TerritoryFilterNode key={child} name={child} options={options}
          selected={selected} expanded={expanded} onToggleTerritory={onToggleTerritory}
          onToggleExpanded={onToggleExpanded} depth={depth + 1} ancestors={[...ancestors, name]} />)}
      </div>}
    </div>
  );
}

function DynastyFilterNode({name,options,selected,expanded,onToggle,onExpand,folder=false,path=[]}) {
 if(path.includes(name))return null;
 const children=options[name]||[],open=expanded.includes(name);
 return <div className="dinastia-block"><span className="dinastia-chip-row"><Chip label={name} small={path.length>0} active={selected.includes(name)} color={ACCENTS[name]||'#71717A'} onClick={()=>onToggle(name)}/>{children.length>0&&<button type="button" className="dinastia-expand-btn" aria-expanded={open} aria-label={`${open?'Ocultar':'Mostrar'} ${folder?'casas':'ramas'} de ${name}`} onClick={()=>onExpand(name)}>{open?<ChevronDown size={11}/>:<ChevronRight size={11}/>}</button>}</span>{open&&<div className="territory-filter-children">{children.map(child=><DynastyFilterNode key={child} name={child} options={options} selected={selected} expanded={expanded} onToggle={onToggle} onExpand={onExpand} path={[...path,name]}/>)}</div>}</div>;
}

function BioSection({ title, open, onToggle, children }) {
  return (
    <section className={`bio-collapsible${open ? " is-open" : " is-collapsed"}`}>
      <button type="button" className="bio-collapsible-toggle" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && <div className="bio-collapsible-content">{children}</div>}
    </section>
  );
}

const DOGES_IN_ORDER = PERSONAS.flatMap(persona => gobiernosDe(persona)
  .filter(gobierno => gobierno.territorio === 'Venecia' && gobierno.titulo === 'Dogo' && gobierno.condicion === 'efectivo')
  .map(gobierno => ({ persona, gobierno })))
  .sort((a, b) => a.gobierno.desde - b.gobierno.desde || a.gobierno.hasta - b.gobierno.hasta);

function VenetianOfficeSequence({ persona, onSelect }) {
  const index = DOGES_IN_ORDER.findIndex(item => item.persona.id === persona.id);
  if (index < 0) return null;
  const current = DOGES_IN_ORDER[index];
  return (
    <div className="bio-office-sequence" aria-label="Sucesión documentada del dogado veneciano">
      <strong>Dogado de Venecia</strong>
      <p>Magistratura electiva de la República; el cargo no se heredaba ni convertía sus territorios en patrimonio familiar.</p>
      <div className="bio-office-sequence-links">
        {index > 0 && <button type="button" onClick={() => onSelect(DOGES_IN_ORDER[index - 1].persona.id)}>← {DOGES_IN_ORDER[index - 1].persona.nombre}</button>}
        <span>{current.gobierno.desde}–{current.gobierno.hasta}</span>
        {index < DOGES_IN_ORDER.length - 1 && <button type="button" onClick={() => onSelect(DOGES_IN_ORDER[index + 1].persona.id)}>{DOGES_IN_ORDER[index + 1].persona.nombre} →</button>}
      </div>
    </div>
  );
}

export default function ExplorerView({ vm, loading = false, loadError = false, onRetry, ready = true }) {
  const [searchOpen,setSearchOpen] = React.useState(false);
  const [mobileToolsOpen,setMobileToolsOpen] = React.useState(false);
  const [guideOpen,setGuideOpen] = React.useState(false);
  const [bioSection,setBioSection] = React.useState('resumen');
  const bioScrollRef = React.useRef(null);
  const [bioMobileOpen,setBioMobileOpen] = React.useState(true);
  const [treeListOpen,setTreeListOpen] = React.useState(() => {
    try { return readPreferences(window.localStorage).treeView === 'list'; } catch { return false; }
  });
  React.useEffect(() => {
    const onPreferences = (event) => setTreeListOpen(event.detail?.treeView === 'list');
    window.addEventListener('eade:preferences-changed', onPreferences);
    return () => window.removeEventListener('eade:preferences-changed', onPreferences);
  }, []);
  const guideButtonRef = React.useRef(null);
  const viewMenuRef = React.useRef(null);
  const panelsMenuRef = React.useRef(null);
  const toolsMenuRef = React.useRef(null);
  const toolbarMenus = [viewMenuRef, panelsMenuRef, toolsMenuRef];
  const closeOtherToolbarMenus = (current) => {
    toolbarMenus.forEach((ref) => { if (ref.current && ref.current !== current) ref.current.open = false; });
  };
  React.useEffect(() => {
    const onPointerDown = (event) => {
      if (toolbarMenus.some((ref) => ref.current?.contains(event.target))) return;
      toolbarMenus.forEach((ref) => { if (ref.current) ref.current.open = false; });
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      const menu = toolbarMenus.find((ref) => ref.current?.open)?.current;
      if (!menu) return;
      menu.open = false;
      if (menu.contains(event.target)) { event.preventDefault(); menu.querySelector('summary')?.focus(); }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, []);
  const closeGuide = () => { setGuideOpen(false); requestAnimationFrame(() => guideButtonRef.current?.focus()); };
  const {
    connectionIds, setConnectionIds, connectionCriterion, setConnectionCriterion, connectionResult, getExportSelection,
    initialMapViewport, recordMapViewport, timelineVirtual, timelineListRef, scrollRef, tlScrollRef, locale, setLocale, query, setQuery,
    territorios, setTerritorios, dinastias, setDinastias, dinastiasExpandidas, setDinastiasExpandidas, territoriosExpandidos, setTerritoriosExpandidos,
    titulos, setTitulos, siglos, setSiglos, relaciones, setRelaciones, hovered, setHovered,
    seleccion, setSeleccion, currentSearchIndex, setCurrentSearchIndex, zoom, setZoom, mode, setMode,
    origen, setOrigen, destino, setDestino, modoComparacion, setModoComparacion, compareMenuOpen, setCompareMenuOpen,
    compareRouteIndex, setCompareRouteIndex, focoMenuOpen, setFocoMenuOpen, focoId, setFocoId, focoAlcance, setFocoAlcance,
    anioGlobal, setAnioGlobal, anioInput, setAnioInput, reproduciendoHistoria, setReproduciendoHistoria,
    shareStatus, setShareStatus, collapsedIds, setCollapsedIds, vistasActivas, setVistasActivas, panelesVisibles, setPanelesVisibles,
    atlasScene, changeAtlasScene, infoProyecto, setInfoProyecto, timelineScaleIndex, setTimelineScaleIndex, timelineMode, setTimelineMode, eventoSeleccionadoId, setEventoSeleccionadoId,
    favoritos, setFavoritos, favoritosOpen, setFavoritosOpen, soloFavoritos, setSoloFavoritos, soloDocumentados, setSoloDocumentados, historiaActivaId, setHistoriaActivaId,
    historiaPasoIndex, setHistoriaPasoIndex, compareMenuRef, focoMenuRef, favoritosMenuRef, historiaSnapshotRef, shareStatusTimerRef, urlStateLoadedRef,
    territorialFilterMode,setTerritorialFilterMode,historyPopRef, dragState, workspaceGridRef, workspaceMainRef, panelWidths, setPanelWidths, treeMapSplit, setTreeMapSplit, filterSectionsOpen, setFilterSectionsOpen,
    bioSectionsOpen, setBioSectionsOpen, personHistory, modoTrabajo, setModoTrabajo,
    alternarSeccionFiltro, alternarSeccionBio, ajustarAnchoPanel, restablecerAnchoPanel, comenzarResizeLateral, comenzarResizeArbolMapa,
    gen, rows, graph, favoritosSet, timelinePxPerYear, timelineTrackWidth,
    eventosOrdenadosTodos, totalEventosTimeline, eventosOrdenados, eventoSeleccionado,
    historiaActiva, historiaPasoActual, historiaPersonasSet, opciones, personaBio, toggle, focoSet, collapsedSet,
    hiddenByCollapse, toggleDescendants, ajustarAnio, actualizarAnioDesdeRango, confirmarAnioEscrito, restablecerAnio, moverAnioHistoria, alternarReproduccionHistoria,
    mostrarArbol, mostrarMapa, mostrarFiltros, mostrarBiografia, mostrarCronologia, vistaPrincipal, layoutLaterales, alternarVista,
    alternarPanelAuxiliar, personasVivasEnAnio, gobernantesActivosEnAnio, matches, visiblePeople, visibleIds, visibleSignature, visibleRows,
    treeLayout, renderedTreeUnits, positions, canvasSize, queryTrim, searchMatchIds, searchMatchSet, searchSignature, searchCurrentId,
    irACoincidencia, hayFiltros, limpiar, limpiarSoloFiltros, lineage, comparePaths, comparePath, pathEdges, groupsByRow,
    routing, relacionFocoId, amantesFoco, styleForFamilyLine, connectorLayerKey, connectors, scrollBy, onPointerDown,
    onPointerMove, endDrag, centerOn, pendingZoomCenterRef, cambiarZoomArbol, centerOnTimeline, seleccionarPersonaPorId, navegarHistorialPersona, centrarSeleccion, cerrarSeleccion,
    centerTimelineOnYear, alternarFavorito, seleccionarEvento, aplicarPasoHistoria, iniciarHistoria, cambiarPasoHistoria, salirHistoria, mostrarEstadoCompartir,
    construirEnlaceCompartido, compartirPersona, handleBoxClick, getBoxHandlers, renderPersonBox, miniW, miniScaleX, miniScaleY,
    onMinimapClick, filtrosActivosCompactos, cambiarIdioma,
  } = vm;
  const filtrosCompactosVisibles = filtrosActivosCompactos.slice(0, 6);
  const filtrosCompactosRestantes = Math.max(0, filtrosActivosCompactos.length - filtrosCompactosVisibles.length);
  const filterCount = territorios.length + dinastias.length + titulos.length + siglos.length + relaciones.length + Number(soloFavoritos) + Number(soloDocumentados);
  const personaAnteriorId = personHistory.index > 0 ? personHistory.ids[personHistory.index - 1] : null;
  const personaSiguienteId = personHistory.index >= 0 && personHistory.index < personHistory.ids.length - 1
    ? personHistory.ids[personHistory.index + 1]
    : null;
  const canAddFamily = Boolean(seleccion && !historiaActiva && vm.growth.ids !== null && vm.growth.additions.family.length);
  // Changing scene slides the whole view; the inactive pane is hidden once it settles.
  const reducedMotion = useReducedMotion();
  // Warm the Europa scene once the Atlas is idle, so the slide reveals content.
  React.useEffect(() => {
    if (!ready) return;
    const idle = window.requestIdleCallback || (callback => setTimeout(callback, 1500));
    const handle = idle(() => { loadEuropeYearView().catch(() => {}); });
    return () => (window.cancelIdleCallback || clearTimeout)(handle);
  }, [ready]);
  // The sticky Atlas toolbar sits right under the site header, whatever its height.
  React.useEffect(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const root = document.documentElement;
    const update = () => {
      const position = window.getComputedStyle?.(header).position;
      const sticky = position === 'sticky' || position === 'fixed';
      root.style.setProperty('--atlas-header-offset', sticky ? `${header.getBoundingClientRect().height}px` : '0px');
    };
    update();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
    observer?.observe(header);
    return () => { observer?.disconnect(); root.style.removeProperty('--atlas-header-offset'); };
  }, [modoTrabajo]);
  const [sceneSliding, setSceneSliding] = React.useState(false);
  const previousSceneRef = React.useRef(atlasScene);
  React.useEffect(() => {
    if (previousSceneRef.current === atlasScene) return;
    previousSceneRef.current = atlasScene;
    if (reducedMotion) return;
    setSceneSliding(true);
    const timer = setTimeout(() => setSceneSliding(false), 650);
    return () => clearTimeout(timer);
  }, [atlasScene, reducedMotion]);
  const searchResults = React.useMemo(() => atlasSearch(queryTrim, {
    people: PERSONAS, dynasties: SEARCH_DYNASTIES, territories: SEARCH_TERRITORIES,
    stories: HISTORIAS, events: EVENTOS_HISTORICOS, normalize: normalizaTexto,
  }, 4), [queryTrim]);
  React.useEffect(() => {
    setBioSection('resumen');
    setBioMobileOpen(true);
    if (bioScrollRef.current) bioScrollRef.current.scrollTop = 0;
  }, [seleccion?.id]);
  const scrollToBioSection = (key) => {
    const scroller = bioScrollRef.current;
    const section = scroller?.querySelector(`#bio-section-${key}`);
    if (!scroller || !section) return;
    setBioSection(key);
    const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 8;
    scroller.scrollTo({ top, behavior: 'instant' });
    section.focus({ preventScroll: true });
  };
  const updateBioSectionOnScroll = () => {
    const scroller = bioScrollRef.current;
    if (!scroller) return;
    const top = scroller.getBoundingClientRect().top + 16;
    const sections = [...scroller.querySelectorAll('[data-bio-section]')];
    const current = sections.filter(section => section.getBoundingClientRect().top <= top).at(-1) || sections[0];
    if (current) setBioSection(current.dataset.bioSection);
  };
  const onToolbarMenuToggle = (event) => {
    if (!event.currentTarget.open) return;
    closeOtherToolbarMenus(event.currentTarget);
    setCompareMenuOpen(false);
    setFavoritosOpen(false);
  };
  React.useEffect(() => {
    const onEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (compareMenuOpen) { setCompareMenuOpen(false); compareMenuRef.current?.querySelector('.compare-menu-btn')?.focus(); }
      if (favoritosOpen) { setFavoritosOpen(false); favoritosMenuRef.current?.querySelector('button')?.focus(); }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [compareMenuOpen, favoritosOpen, compareMenuRef, favoritosMenuRef, setCompareMenuOpen, setFavoritosOpen]);
  return (
    <div className={`atlas-loading ${loading ? "loading" : ready ? "loaded" : ""}`} aria-busy={loading}>
      {loading && <span className="atlas-loading-status" role="status">Cargando el atlas…</span>}
      {loadError && <AtlasLoadError onRetry={onRetry}/>}
      {!modoTrabajo && <SiteHeader variant="atlas" locale={locale} onLanguageChange={cambiarIdioma} />}
    <div className={`wrap atlas-scene-${atlasScene}${modoTrabajo ? " atlas-work-mode" : ""}`} inert={!ready}>
      {/* V5.20 · Cabecera fija: vistas y paneles, escena en el centro y acciones. */}
      <div className={`atlas-toolbar${atlasScene !== 'atlas' ? ' is-europa' : ''}`}>
        <div className="atlas-scene-switch"><SegmentedControl rail options={SCENES} value={atlasScene} onChange={changeAtlasScene} label="Modo de exploración"/></div>
        {!modoTrabajo && <button type="button" className="atlas-tools-toggle" aria-expanded={mobileToolsOpen} aria-controls="atlas-secondary-tools" onClick={()=>setMobileToolsOpen(open=>!open)}>Vistas y herramientas <ChevronDown size={12}/></button>}
        {!modoTrabajo && (
        <div id="atlas-secondary-tools" className={`workspace-topbar-secondary${mobileToolsOpen?' is-expanded':''}`} inert={atlasScene !== 'atlas' ? true : undefined}>
          <section className="workspace-topbar-section workspace-toolbar-view workspace-toolbar-panels">
            <SegmentedControl rail className="atlas-view-pills" label="Vista principal" options={VIEW_OPTIONS} value={mostrarArbol && mostrarMapa ? 'ambos' : mostrarMapa ? 'mapa' : 'arbol'} onChange={value=>setVistasActivas({arbol:value!=='mapa',mapa:value!=='arbol'})}/>
            <details ref={panelsMenuRef} className="atlas-toolbar-menu atlas-panels-menu" onToggle={onToolbarMenuToggle}>
              <summary className="ui-tip" data-tip="Paneles"><PanelsTopLeft size={14} aria-hidden="true" /><span className="ui-sr-only">Paneles</span></summary>
              <div className="atlas-toolbar-menu-panel" role="group" aria-label="Paneles visibles">
                <button type="button" aria-pressed={mostrarFiltros} onClick={() => alternarPanelAuxiliar('filtros')}>Filtros</button>
                <button type="button" aria-pressed={mostrarBiografia} onClick={() => alternarPanelAuxiliar('biografia')}>Biografía</button>
                <button type="button" aria-pressed={mostrarCronologia} onClick={() => alternarPanelAuxiliar('cronologia')}>Cronología</button>
              </div>
            </details>
          </section>

          <section className="workspace-topbar-section workspace-toolbar-actions">
            <div className="nav-controls topbar-mode-controls">
              <div className="compare-split-control" ref={compareMenuRef}>
                <button
                  type="button"
                  className={`nav-btn compare-main-btn ui-tip ${["compare","conexion"].includes(mode) ? "active" : ""}`}
                  data-tip="Comparar o conectar personas"
                  onClick={() => {
                    const entrar = !["compare","conexion"].includes(mode);
                    setMode(entrar ? "compare" : "view");
                    if (entrar) { setOrigen(null); setDestino(null); setCompareRouteIndex(0); }
                    setCompareMenuOpen(false);
                    setFocoMenuOpen(false);
                  }}
                >
                  <GitCompare size={14} aria-hidden="true" /><span className="ui-sr-only">Comparar</span>
                </button>
                <button
                  type="button"
                  className={`nav-btn compare-menu-btn ${["compare","conexion"].includes(mode) ? "active" : ""}`}
                  onClick={() => {
                    closeOtherToolbarMenus();
                    setFavoritosOpen(false);
                    setCompareMenuOpen((actual) => !actual);
                    setFocoMenuOpen(false);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={compareMenuOpen}
                  title="Elegir tipo de comparación"
                >
                  <ChevronDown size={11} />
                </button>
                {compareMenuOpen && (
                  <div className="compare-mode-menu" role="group">
                    <button type="button" aria-pressed={mode === "conexion"} className={`compare-mode-option${mode === "conexion" ? " active" : ""}`} onClick={() => {setMode("conexion");setVistasActivas({arbol:true,mapa:false});setCompareMenuOpen(false);}}><strong>Conectar 3–5 personas</strong><span>Reunir varias personas con los vínculos necesarios.</span></button>
                    {MODOS_COMPARACION.map((opcion) => (
                      <button
                        type="button"
                        key={opcion.id}
                        role="menuitemradio"
                        aria-checked={mode === "compare" && modoComparacion === opcion.id}
                        className={`compare-mode-option${mode === "compare" && modoComparacion === opcion.id ? " active" : ""}`}
                        onClick={() => {
                          if (mode !== "compare") { setOrigen(null); setDestino(null); }
                          setModoComparacion(opcion.id);
                          setMode("compare");
                          setCompareRouteIndex(0);
                          setCompareMenuOpen(false);
                        }}
                      >
                        <strong>{opcion.label}</strong>
                        <span>{opcion.descripcion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="favorites-control" ref={favoritosMenuRef}>
                <button type="button" className={`nav-btn favorites-trigger ui-tip${favoritosOpen || soloFavoritos ? " active" : ""}`} data-tip="Favoritos" onClick={() => { closeOtherToolbarMenus(); setCompareMenuOpen(false); setFavoritosOpen((actual) => !actual); }} aria-expanded={favoritosOpen}>
                  <Star size={14} aria-hidden="true" className="favorite-star-symbol"/><span className="ui-sr-only">Favoritos</span>{favoritos.length ? <span key={favoritos.length} className="favorites-count ui-count-bump" aria-label={`${favoritos.length} guardados`}>{favoritos.length}</span> : null}
                </button>
                {favoritosOpen && (
                  <div className="favorites-menu" role="group">
                    <div className="favorites-menu-head"><strong>Mis favoritos</strong><span>{favoritos.length}</span></div>
                    <div className="favorites-menu-list">
                      {favoritos.length ? favoritos.map((id) => (
                        <div key={id} className="favorite-menu-row">
                          <button type="button" onClick={() => { seleccionarPersonaPorId(id); setFavoritosOpen(false); }}>{BY_ID[id]?.nombre || id}</button>
                          <button type="button" className="favorite-remove" onClick={() => alternarFavorito(id)} title="Quitar de favoritos" aria-label={`Quitar ${BY_ID[id]?.nombre || id} de favoritos`}>×</button>
                        </div>
                      )) : <div className="favorites-empty">Marca una ficha con ★ para guardarla aquí.</div>}
                    </div>
                    {favoritos.length > 1 && <div className="favorites-clear"><HoldButton label="Mantén pulsado para borrar todos los favoritos" onConfirm={() => { setFavoritos([]); setSoloFavoritos(false); }}>Mantén para borrar todos</HoldButton></div>}
                    <label className={`favorites-filter-toggle${favoritos.length ? "" : " is-disabled"}`}>
                      <input type="checkbox" checked={soloFavoritos} disabled={!favoritos.length} onChange={(event) => setSoloFavoritos(event.target.checked)} />
                      <span>Mostrar solo favoritos</span>
                    </label>
                  </div>
                )}
              </div>
              <button type="button" className="nav-btn ui-tip" data-tip="Ayuda y guía" ref={guideButtonRef} onClick={() => { if (toolsMenuRef.current) toolsMenuRef.current.open = false; setGuideOpen(true); }}><CircleHelp size={14} aria-hidden="true" /><span className="ui-sr-only">Ayuda</span></button>
              <details ref={toolsMenuRef} className="atlas-toolbar-menu atlas-tools-menu" onToggle={onToolbarMenuToggle}>
                <summary className="ui-tip" data-tip="Herramientas"><SlidersHorizontal size={14} aria-hidden="true" /><span className="ui-sr-only">Herramientas</span></summary>
                <div className="atlas-toolbar-menu-panel" role="group" aria-label="Herramientas del Atlas">
                  <strong>Persona seleccionada</strong>
                  <button type="button" disabled={!seleccion} onClick={centrarSeleccion}><Crosshair size={13} /> Centrar persona</button>
                  <button type="button" disabled={!seleccion} onClick={compartirPersona}><Share2 size={13} /> Compartir persona</button>
                  {shareStatus && <span className="share-status" role="status">{shareStatus}</span>}
                  <strong>Salida</strong>
                  <TreeExport getSelection={getExportSelection} label="Exportar árbol" />
                  <button type="button" onClick={() => setInfoProyecto('cobertura')}><BarChart3 size={13} /> Cobertura documental</button>
                  <button type="button" onClick={() => setModoTrabajo(true)}><Maximize2 size={13} /> Pantalla de trabajo</button>
                </div>
              </details>
            </div>
          </section>
        </div>
        )}
      </div>
      <div className={`workspace-topbar${modoTrabajo ? " is-work-mode" : ""}`}>
        <section className="workspace-topbar-section workspace-toolbar-search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setSearchOpen(false);}}>
          <div className="toolbar-label sk" style={{"--sk-index":0}}>Búsqueda</div>
          <div className="search-box toolbar-search-box sk" style={{"--sk-index":1}}>
            <Search size={13} aria-hidden="true" />
            <input
              placeholder="Buscar personas, casas, lugares, historias…"
              aria-label="Buscar en todo el Atlas"
              aria-expanded={searchOpen && Boolean(queryTrim)}
              aria-controls="atlas-search-results"
              value={query}
              onFocus={()=>setSearchOpen(true)}
              onChange={(event) => {setQuery(event.target.value);setSearchOpen(true);}}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
                if (event.key === "Enter" && searchResults.people.length) {
                  event.preventDefault();
                  vm.growth.onSelect(searchResults.people[0].id);
                  setSearchOpen(false);
                }
              }}
            />
            {queryTrim && (
              <div className="toolbar-search-nav">
                <span className="toolbar-search-count">
                  {searchMatchIds.length ? `${Math.max(1, currentSearchIndex + 1)} / ${searchMatchIds.length} personas` : "0 personas"}
                </span>
                <button type="button" className="nav-btn search-nav-btn" aria-label="Persona anterior de la búsqueda" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(-1)}>
                  <ChevronRight size={10} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" aria-label="Persona siguiente de la búsqueda" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(1)}>
                  <ChevronRight size={10} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" aria-label="Borrar búsqueda" title="Borrar búsqueda" onClick={() => { setQuery(''); setSearchOpen(false); }}><X size={12}/></button>
              </div>
            )}
          </div>
          {searchOpen && queryTrim && <div id="atlas-search-results" className="atlas-search-results" aria-label="Resultados de toda la base">
            <span role="status">{searchResults.total ? `${searchResults.total} coincidencias en el Atlas` : 'No hay coincidencias'}</span>
            {searchResults.people.length > 0 && <section aria-label="Personas"><strong>Personas</strong>{searchResults.people.map(p=><button type="button" key={p.id} onClick={()=>{if(atlasScene === "europa")seleccionarPersonaPorId(p.id,{abrirAtlas:true});vm.growth.onSelect(p.id);setSearchOpen(false);}}><span>{p.nombre}</span><small>{positions[p.id]?'Ver en el árbol':'Ver ficha y familia'}</small></button>)}</section>}
            {searchResults.dynasties.length > 0 && <section aria-label="Dinastías"><strong>Dinastías</strong>{searchResults.dynasties.map(name=><a key={name} href={rutaEntidadLocalizada('es','dinastia',slugPublico(name))}><span>{name}</span><small>Abrir casa</small></a>)}</section>}
            {searchResults.territories.length > 0 && <section aria-label="Territorios"><strong>Territorios</strong>{searchResults.territories.map(name=><a key={name} href={rutaEntidadLocalizada('es','territorio',slugPublico(name))}><span>{name}</span><small>Abrir territorio</small></a>)}</section>}
            {searchResults.stories.length > 0 && <section aria-label="Historias"><strong>Historias</strong>{searchResults.stories.map(story=><a key={story.id} href={rutaEntidadLocalizada('es','historia',slugPublico(story.titulo))}><span>{story.titulo}</span><small>Leer historia</small></a>)}</section>}
            {searchResults.events.length > 0 && <section aria-label="Acontecimientos"><strong>Acontecimientos</strong>{searchResults.events.map(event=><button type="button" key={event.id} onClick={()=>{seleccionarEvento(event);setSearchOpen(false);}}><span>{event.titulo}</span><small>Ir al año {event.anio ?? event.desde}</small></button>)}</section>}
          </div>}
        </section>

        <section className="workspace-topbar-section workspace-toolbar-year">
          <div className="global-year-heading-row">
            <div className="toolbar-label sk" style={{"--sk-index":0}}>Año global</div>

            {Number.isFinite(anioGlobal) && (
              <span className="global-year-header-summary">
                {personasVivasEnAnio.length} vivas · {gobernantesActivosEnAnio.length} gobernando
              </span>
            )}
          </div>
          <div className="global-year-control global-year-control-inline" aria-label="Selector global de año">
            {/* V5.20 · El año se lee dentro del tirador del control. */}
            <div className={`global-year-slider${Number.isFinite(anioGlobal) ? "" : " is-idle"}`}
              style={{"--p": ((Number.isFinite(anioGlobal) ? anioGlobal : Math.max(TL_MIN, Math.min(TL_MAX, 1500))) - TL_MIN) / (TL_MAX - TL_MIN)}}>
              <input
                className={`global-year-range${Number.isFinite(anioGlobal) ? "" : " is-idle"}`}
                type="range"
                min={TL_MIN}
                max={TL_MAX}
                step="1"
                value={Number.isFinite(anioGlobal) ? anioGlobal : Math.max(TL_MIN, Math.min(TL_MAX, 1500))}
                onChange={(event) => actualizarAnioDesdeRango(event.target.value)}
                aria-label="Seleccionar año"
                aria-valuetext={Number.isFinite(anioGlobal) ? String(anioGlobal) : "Todos los años"}
              />
              <span className="global-year-thumb" aria-hidden="true">{Number.isFinite(anioGlobal) ? anioGlobal : "Todos"}</span>
            </div>
            <div className="global-year-entry-row">
              <input
                className="global-year-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={anioInput}
                placeholder="Año"
                onChange={(event) => {
                  const valor = event.target.value;
                  setReproduciendoHistoria(false);
                  if (/^\d*$/.test(valor)) setAnioInput(valor);
                }}
                onBlur={confirmarAnioEscrito}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    confirmarAnioEscrito();
                    event.currentTarget.blur();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setAnioInput(Number.isFinite(anioGlobal) ? String(anioGlobal) : "");
                  }
                }}
                aria-label="Año global exacto"
                title={`Escribe un año entre ${TL_MIN} y ${TL_MAX} y pulsa Enter`}
              />
              <button
                type="button"
                className="global-year-reset"
                disabled={atlasScene === "europa"}
                onClick={restablecerAnio}
                title="Mostrar todos los años"
                aria-label="Mostrar todos los años"
              >
                <RotateCcw size={12} />
              </button>
            </div>
            <div className="history-playback-controls" aria-label="Reproducción automática de la historia">
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(-1)}
                title="Retroceder un año"
                aria-label="Retroceder un año"
              >
                <SkipBack size={12} />
              </button>
              <button
                type="button"
                className={`history-playback-btn history-playback-main${reproduciendoHistoria ? " active" : ""}`}
                onClick={alternarReproduccionHistoria}
                title={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir: 1 año cada 0,5 segundos"}
                aria-label={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir historia"}
              >
                {reproduciendoHistoria ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(1)}
                title="Avanzar un año"
                aria-label="Avanzar un año"
              >
                <SkipForward size={12} />
              </button>
            </div>
          </div>
        </section>

      </div>

      <p className="atlas-visually-hidden" role="status" aria-live="polite">
        {seleccion ? `Persona seleccionada: ${seleccion.nombre}.` : 'No hay persona seleccionada.'}
        {Number.isFinite(anioGlobal) ? ` Año ${anioGlobal}.` : ' Todos los años.'}
      </p>

      {vm.growth.feedback && !historiaActiva && (
        <div className="family-expansion-feedback" role="status">
          <span>Se añadieron {vm.growth.feedback.count} persona{vm.growth.feedback.count === 1 ? '' : 's'} de la familia de {vm.growth.feedback.person} al árbol.</span>
          <button type="button" onClick={vm.growth.onUndo}>Deshacer</button>
        </div>
      )}

      {modoTrabajo && (
        <button
          type="button"
          className="work-mode-exit"
          onClick={() => setModoTrabajo(false)}
          title="Salir del modo de trabajo (Esc)"
          aria-label="Salir del modo de trabajo"
        >
          <X size={16} />
        </button>
      )}

      {mode === "conexion" && <ConnectionControls people={PERSONAS} ids={connectionIds} onChange={setConnectionIds} criterion={connectionCriterion} onCriterion={setConnectionCriterion} result={connectionResult} onSelect={seleccionarPersonaPorId}/>}

      {mode === "compare" && (
        <div className="compare-bar workspace-mode-bar">
          <span className="compare-mode-label">
            {MODOS_COMPARACION.find((opcion) => opcion.id === modoComparacion)?.label || "Comparación"}
          </span>
          <span>Origen: <b>{origen ? BY_ID[origen]?.nombre : "haz clic en una persona"}</b></span>
          <span>Destino: <b>{destino ? BY_ID[destino]?.nombre : "luego en otra"}</b></span>
          {comparePath && (
            <span className="compare-path" style={{ marginLeft: "auto" }}>
              {comparePath.map((id, index) => (
                <React.Fragment key={`${id}-${index}`}>
                  {index > 0 && <span className="compare-edge"> —{tipoRelacionEntre(comparePath[index - 1], id)}→ </span>}
                  <span>{BY_ID[id]?.nombre || id}</span>
                </React.Fragment>
              ))}
            </span>
          )}
          {comparePaths.length > 1 && (
            <div className="compare-route-switcher" aria-label="Cambiar ruta de parentesco">
              <button
                type="button"
                onClick={() => setCompareRouteIndex((actual) => (actual - 1 + comparePaths.length) % comparePaths.length)}
                aria-label="Ruta anterior"
              >
                <ArrowLeft size={11} />
              </button>
              <span>{Math.min(compareRouteIndex, comparePaths.length - 1) + 1} / {comparePaths.length}</span>
              <button
                type="button"
                onClick={() => setCompareRouteIndex((actual) => (actual + 1) % comparePaths.length)}
                aria-label="Ruta siguiente"
              >
                <ArrowRight size={11} />
              </button>
            </div>
          )}
          {origen && destino && !comparePath && (
            <span style={{ marginLeft: "auto" }}>No hay un camino documentado con este criterio.</span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => { setOrigen(null); setDestino(null); setCompareRouteIndex(0); }}>reiniciar</button>
        </div>
      )}

      {mode === "foco" && (
        <div className="compare-bar workspace-mode-bar focus-mode-bar">
          <span>Foco: <b>{focoId ? BY_ID[focoId]?.nombre : "haz clic en una persona"}</b></span>
          <label className="focus-scope-select">Ver solo <select aria-label="Alcance del modo foco" value={focoAlcance} onChange={(event) => setFocoAlcance(event.target.value)}>{ALCANCES_FOCO.map((opcion) => <option key={opcion.id} value={opcion.id}>{opcion.label}</option>)}</select></label>
          {focoSet && (
            <span className="focus-count">
              {visiblePeople.length} persona{visiblePeople.length === 1 ? "" : "s"} visibles
            </span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => {setMode("view");setFocoId(null);}}>Salir del foco</button>
        </div>
      )}

      {historiaActiva && <StoryAtlasGuide story={historiaActiva} index={historiaPasoIndex} returnPath={vm.storyReturn} count={vm.growth.ids?.length || 0} onStep={cambiarPasoHistoria} onCenter={()=>aplicarPasoHistoria(historiaActiva,historiaPasoIndex,{replace:true})} onExit={salirHistoria}/>}

      {/* V5.20 · Atlas y Europa comparten URL y se deslizan como dos paneles contiguos. */}
      <div className={`atlas-scenes is-${atlasScene}${sceneSliding ? ' is-sliding' : ''}`}>
      <div className="atlas-scenes-track">
      <div className="atlas-traditional" hidden={atlasScene !== 'atlas' && !sceneSliding}>
      <div
        ref={workspaceGridRef}
        className={`workspace-grid ${layoutLaterales} workspace-no-timeline`}
        style={{
          // V5.20 · Anchos fijos: sin redimensionar, sin saltos ni marcos de arrastre.
          "--workspace-left-width": "280px",
          "--workspace-right-width": "330px",
        }}
      >
        {mostrarFiltros && (
        <aside className="workspace-sidebar">
          <section className="panel workspace-fixed-panel workspace-filter-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title sk" style={{"--sk-index":3}}>Filtros</span>
              <span className="panel-count sk" style={{"--sk-index":4}}>
                {visiblePeople.length !== PERSONAS.length ? `${visiblePeople.length} / ${PERSONAS.length} visibles` : `${PERSONAS.length} personas`}
              </span>
            </div>
            <div className={`filter-active-overview${filtrosActivosCompactos.length ? " has-active" : ""}`}>
              <span className="filter-active-overview-label">Filtros activos</span>
              <span className="filter-active-overview-values">
                {filtrosCompactosVisibles.length ? filtrosCompactosVisibles.join(" · ") : "Ninguno"}
                {filtrosCompactosRestantes > 0 ? ` · +${filtrosCompactosRestantes}` : ""}
              </span>
            </div>
            {filterCount > 0 && <button type="button" className="workspace-filter-clear" onClick={limpiarSoloFiltros}>
              Quitar {filterCount} {filterCount === 1 ? 'filtro' : 'filtros'}
            </button>}
            <div className="panel-body workspace-panel-scroll workspace-filter-scroll">
              <div className="atlas-scope"><strong>{vm.growth.ids===null?'Base completa':`${vm.growth.ids.length} personas en tu selección`}</strong><span>Elige una persona y amplía su familia desde su ficha.</span><div>{!historiaActiva&&<>{vm.growth.ids!==null&&<button onClick={vm.growth.onFull}>Ver todas</button>}<button onClick={vm.growth.onNew}>Nueva selección</button>{vm.growth.canUndo&&<button onClick={vm.growth.onUndo}>Deshacer</button>}</>}</div></div>
              <div className="filters-row filters-row-vertical filters-always-open">
                <FilterSection
                  title="Territorios"
                  open={filterSectionsOpen.territorios}
                  onToggle={() => alternarSeccionFiltro("territorios")}
                  activeCount={territorios.length}
                >
                  <SegmentedControl className="atlas-filter-mode" label="Criterio del filtro territorial" value={territorialFilterMode} onChange={setTerritorialFilterMode} options={TERRITORY_FILTER_MODES}/>
                  {territorialFilterMode==='government'&&anioGlobal==null&&<p className="atlas-filter-explanation">Elige un año para ver solo quién gobernaba entonces.</p>}
                  <div className="filter-group filter-group-dinastias">
                    {opciones.territorios.map((territorio) => <TerritoryFilterNode key={territorio}
                      name={territorio} options={opciones.subsPorTerritorio} selected={territorios}
                      expanded={territoriosExpandidos}
                      onToggleTerritory={(name) => toggle(setTerritorios, territorios, name)}
                      onToggleExpanded={(name) => toggle(setTerritoriosExpandidos, territoriosExpandidos, name)} />)}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Dinastías"
                  open={filterSectionsOpen.dinastias}
                  onToggle={() => alternarSeccionFiltro("dinastias")}
                  activeCount={dinastias.length}
                >
                  {[['Casas y ramas',opciones.dynastyFamilies],['Agrupaciones geográficas',opciones.dynastyFolders]].map(([title,names])=><div key={title}><h4 className="atlas-filter-heading">{title}</h4><div className="filter-group filter-group-dinastias">{names.map(name=><DynastyFilterNode key={name} name={name} options={opciones.ramasPorPrincipal} selected={dinastias} expanded={dinastiasExpandidas} onToggle={n=>toggle(setDinastias,dinastias,n)} onExpand={n=>toggle(setDinastiasExpandidas,dinastiasExpandidas,n)} folder={title==='Agrupaciones geográficas'}/>)}</div></div>)}
                </FilterSection>

                <FilterSection
                  title="Función histórica"
                  open={filterSectionsOpen.titulos}
                  onToggle={() => alternarSeccionFiltro("titulos")}
                  activeCount={titulos.length}
                >
                  <div className="filter-group">
                    {opciones.titulos.map((categoria) => (
                      <Chip
                        key={categoria.id}
                        label={categoria.label}
                        active={titulos.includes(categoria.id)}
                        color="#8A6D3B"
                        onClick={() => toggle(setTitulos, titulos, categoria.id)}
                      />
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Periodo vital"
                  open={filterSectionsOpen.siglos}
                  onToggle={() => alternarSeccionFiltro("siglos")}
                  activeCount={siglos.length}
                >
                  <div className="filter-group">
                    {opciones.siglos.map((valor) => (
                      <Chip key={valor} label={`s. ${nRomano[valor] || valor}`} active={siglos.includes(valor)} color="#3D4F63" onClick={() => toggle(setSiglos, siglos, valor)} />
                    ))}
                    {opciones.hayPersonasSinFecha && (
                      <Chip label="Fechas incompletas" active={siglos.includes(SIN_FECHA)} color="#6B6350" onClick={() => toggle(setSiglos, siglos, SIN_FECHA)} />
                    )}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Relaciones y familia"
                  open={filterSectionsOpen.relaciones}
                  onToggle={() => alternarSeccionFiltro("relaciones")}
                  activeCount={relaciones.length}
                >
                  <div className="filter-group filter-group-relaciones">
                    {opciones.relaciones.map((filtro) => (
                      <Chip
                        key={filtro.id}
                        label={filtro.label}
                        active={relaciones.includes(filtro.id)}
                        color={filtro.id === "amantes" ? "#8E3D68" : "#5E6673"}
                        onClick={() => toggle(setRelaciones, relaciones, filtro.id)}
                      />
                    ))}
                  </div>
                </FilterSection>
                <FilterSection
                  title="Evidencia histórica"
                  open={filterSectionsOpen.evidencia}
                  onToggle={() => alternarSeccionFiltro("evidencia")}
                  activeCount={soloDocumentados ? 1 : 0}
                >
                  <label className="evidence-filter-toggle">
                    <input type="checkbox" checked={soloDocumentados} onChange={event => setSoloDocumentados(event.target.checked)} />
                    <span>Con al menos un dato documentado</span>
                  </label>
                  <p className="evidence-filter-hint">La revisión es aún parcial. Cada persona visible tiene al menos una afirmación contrastada con una fuente concreta; otros datos de su ficha pueden seguir pendientes.</p>
                </FilterSection>
              </div>

            </div>
          </section>
        </aside>
        )}


        <main
          ref={workspaceMainRef}
          className={`workspace-main workspace-main-${vistaPrincipal}`}
          style={mostrarArbol && mostrarMapa ? {
            "--tree-pane-fr": "1fr",
            "--map-pane-fr": "1fr",
          } : undefined}
        >
          {mostrarArbol && (
            <section className={`workspace-stage sk dim workspace-tree-stage${mostrarMapa ? " tree-with-map" : ""}${historiaActiva ? " story-tree-stage" : ""}${treeListOpen ? " showing-list" : ""}`} aria-label="Árbol genealógico">
              <div className="tree-toolbar" aria-label="Controles del árbol">
                <span className="tree-scope-label sk" style={{"--sk-index":2}}>{visiblePeople.length} personas</span>
                {modoTrabajo && <TreeExport getSelection={getExportSelection} />}
                <button type="button" className="nav-btn tree-list-toggle" aria-label={treeListOpen ? 'Mostrar árbol gráfico' : 'Mostrar personas como lista accesible'} title={treeListOpen ? 'Árbol gráfico' : 'Lista accesible'} aria-pressed={treeListOpen} onClick={() => setTreeListOpen(open => !open)}><List size={14} aria-hidden="true" /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(zoom - 0.1)} title="Alejar árbol" aria-label="Alejar árbol"><ZoomOut size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(0.8)} title="Restablecer árbol" aria-label="Restablecer árbol"><RotateCcw size={12} /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(zoom + 0.1)} title="Acercar árbol" aria-label="Acercar árbol"><ZoomIn size={13} /></button>
              </div>

              {mode !== "conexion" && collapsedIds.length > 0 && (
                <div className="branch-collapse-bar branch-collapse-bar-floating">
                  <span>{collapsedIds.length} rama{collapsedIds.length === 1 ? "" : "s"} cerrada{collapsedIds.length === 1 ? "" : "s"} · {hiddenByCollapse.size} fichas ocultas</span>
                  <button type="button" onClick={() => setCollapsedIds([])}>Abrir todas</button>
                </div>
              )}

              <div className="tree-outer">
                {!historiaActiva && mode!=="foco" && <AtlasGrowth {...vm.growth} onHelp={() => setGuideOpen(true)}/>}
                <div className="minimap" onClick={onMinimapClick}>
                  {PERSONAS.map((persona) => {
                    const pos = positions[persona.id];
                    if (!pos) return null;
                    return (
                      <span
                        key={persona.id}
                        className="minimap-dot"
                        style={{
                          left: pos.x * miniScaleX,
                          top: pos.y * miniScaleY,
                          background: ACCENTS[persona.dinastia] || ACCENTS[getCategoriaDinastía(persona.dinastia)] || "#71717A",
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  className={`tree-scroll tree-zoom-${zoom < 0.65 ? 'far' : zoom < 1.05 ? 'middle' : 'near'}`}
                  hidden={treeListOpen}
                  inert={treeListOpen ? true : undefined}
                  ref={scrollRef}
                  tabIndex={0}
                  aria-label="Árbol genealógico. Usa las flechas para desplazarte; Tab para recorrer las personas visibles."
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const offsets = { ArrowLeft: [-200, 0], ArrowRight: [200, 0], ArrowUp: [0, -150], ArrowDown: [0, 150] };
                    if (offsets[event.key]) { event.preventDefault(); scrollBy(...offsets[event.key]); }
                  }}
                  onMouseDown={onPointerDown}
                  onMouseMove={onPointerMove}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  style={{ width: "100%" }}
                >
                  <div style={{ width: canvasSize.w * zoom, height: canvasSize.h * zoom, position: "relative" }}>
                    <div
                      className="tree-canvas"
                      style={{
                        width: canvasSize.w,
                        height: canvasSize.h,
                        transform: `scale(${zoom})`,
                        transformOrigin: "0 0",
                      }}
                    >
                      <svg
                        key={connectorLayerKey}
                        className="svg-overlay"
                        width={canvasSize.w}
                        height={canvasSize.h}
                        viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
                        aria-hidden="true"
                      >
                        {connectors}
                      </svg>

                      {renderedTreeUnits.map((unit) => (
                        <div
                          className="unit"
                          key={unit.key}
                          style={{
                            left: unit.x,
                            top: unit.y,
                            width: unit.width,
                            height: unit.height,
                          }}
                        >
                          {unit.boxes.map((box) => renderPersonBox(box.id, box))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {treeListOpen && <TreeAccessibleList year={anioGlobal} people={visiblePeople} selectedId={seleccion?.id} onSelect={seleccionarPersonaPorId}/>}
            </section>
          )}


          {mostrarMapa && atlasScene === 'atlas' && (
            <section className="workspace-stage workspace-map-stage" aria-label="Mapa de territorios">
              <MapaEuropa
                initialViewport={initialMapViewport}
                onViewportChange={recordMapViewport}
                seleccion={seleccion}
                anioGlobal={anioGlobal}
                onSelectPersona={seleccionarPersonaPorId}
              />
              <div className="territory-hint workspace-map-hint sk" style={{"--sk-index":5}}>
                {seleccion
                  ? (esGobernante(seleccion)
                      ? (Number.isFinite(anioGlobal)
                          ? (territoriosGobernadosEnAño(seleccion, anioGlobal).length
                              ? `En ${anioGlobal}, ${seleccion.nombre} gobernaba: ${governmentSummary(seleccion, anioGlobal).join(", ")}.`
                              : `${seleccion.nombre} no gobernaba ningún territorio registrado en ${anioGlobal}.`)
                          : `Se destacan los territorios que gobernó ${seleccion.nombre}; elige un año para ver solo los vigentes entonces.`)
                      : `${seleccion.nombre} no ostentó un título de gobierno, así que no se ilumina ningún territorio en el mapa (puedes ver su vinculación territorial en la biografía).`)
                  : (Number.isFinite(anioGlobal)
                      ? `Año ${anioGlobal}: haz clic sobre una persona para ver qué territorios gobernaba entonces.`
                      : "Haz clic sobre una persona para ver los territorios que gobernó.")}
                {gobiernosDe(seleccion).some(gobierno => IRISH_MAP_TERRITORIES.has(gobierno.territorio)) && <span> Irlanda: contornos regionales aproximados; los señoríos y condados no coincidían necesariamente con estas divisiones.</span>}
              </div>
            </section>
          )}
        </main>


        {mostrarBiografia && (
        <aside className={`workspace-inspector${personaBio ? ' has-person' : ''}${bioMobileOpen ? ' mobile-open' : ' mobile-collapsed'}`}>
          {personaBio && <button type="button" className="bio-mobile-toggle" aria-expanded={bioMobileOpen} aria-controls="atlas-biography-panel" onClick={()=>setBioMobileOpen(open=>!open)}>{bioMobileOpen ? 'Ocultar ficha' : `Ver ficha de ${personaBio.nombre}`} <ChevronDown size={15}/></button>}
          <section id="atlas-biography-panel" className="panel workspace-fixed-panel workspace-bio-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title sk" style={{"--sk-index":3}}>Biografía</span>
              <span className="panel-count sk" style={{"--sk-index":4}}>{personaBio ? "1 personaje" : "ninguno"}</span>
            </div>
            {personaBio && <nav className="bio-tabs" aria-label={`Apartados de ${personaBio.nombre}`}>
              <SegmentedControl current="location" label="Apartados de la biografía" options={BIO_OPTIONS} value={bioSection} onChange={scrollToBioSection}/>
            </nav>}
            <div className="panel-body workspace-panel-scroll workspace-bio-scroll" ref={bioScrollRef} onScroll={updateBioSectionOnScroll}>
              {personaBio ? (
                <div className="bio-panel">
                  {seleccion && personHistory.ids.length > 0 && (
                    <div className="bio-history-nav" aria-label="Historial de personas consultadas">
                      <button
                        type="button"
                        disabled={!personaAnteriorId}
                        onClick={() => navegarHistorialPersona(-1)}
                        title={personaAnteriorId ? `Volver a ${BY_ID[personaAnteriorId]?.nombre || "la persona anterior"}` : "No hay una persona anterior"}
                        aria-label="Persona anterior"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <span className="bio-history-position">
                        {personHistory.index >= 0 ? `${personHistory.index + 1} / ${personHistory.ids.length}` : "—"}
                      </span>
                      <button
                        type="button"
                        disabled={!personaSiguienteId}
                        onClick={() => navegarHistorialPersona(1)}
                        title={personaSiguienteId ? `Avanzar a ${BY_ID[personaSiguienteId]?.nombre || "la persona siguiente"}` : "No hay una persona siguiente"}
                        aria-label="Persona siguiente"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                  <div className="bio-head">
                    <div>
                      <h3 className="bio-nombre sk" style={{"--sk-index":2}}>{nombrePrincipal(personaBio)}</h3>
                      {sobrenombreDePersona(personaBio) && <div className="bio-sobrenombre">«{sobrenombreDePersona(personaBio)}»</div>}
                      <span
                        className="badge"
                        style={{ background: ACCENTS[personaBio.dinastia] || ACCENTS[getCategoriaDinastía(personaBio.dinastia)] || "#71717A" }}
                      >
                        {personaBio.dinastia}
                      </span>
                    </div>
                    <div className="bio-head-actions">
                      <FavoriteStar className="bio-favorite-btn" active={favoritosSet.has(personaBio.id)} onToggle={() => alternarFavorito(personaBio.id)} name={personaBio.nombre}/>
                      {!hovered && seleccion && (
                        <button type="button" className="close" aria-label="Cerrar biografía" onClick={cerrarSeleccion}><X size={14} /></button>
                      )}
                    </div>
                  </div>

                  <section id="bio-section-resumen" data-bio-section="resumen" className="bio-scroll-section" aria-labelledby="bio-heading-resumen" tabIndex={-1}>
                    <h4 id="bio-heading-resumen" className="bio-section-heading">Resumen</h4>

                  {IMAGENES_PERSONAS[personaBio.id] && (() => {
                    const imagen = IMAGENES_PERSONAS[personaBio.id];
                    const objectPosition = imagen.encuadre || imagen.posicion || "50% 20%";
                    const zoom = Number.isFinite(imagen.zoom) && imagen.zoom > 0 ? imagen.zoom : 1;
                    return (
                      <figure className="bio-portrait-card">
                        <div className="bio-portrait-frame">
                          <img
                            className="bio-portrait-image"
                            {...responsiveImage(imagen.archivo, "300px")}
                            alt={imagen.alt || `Retrato de ${personaBio.nombre}`}
                            loading="lazy"
                            decoding="async"
                            style={{
                              objectPosition,
                              transform: `scale(${zoom})`,
                              transformOrigin: objectPosition,
                            }}
                          />
                        </div>
                        <figcaption className="bio-portrait-caption">
                          <strong>{imagen.tipo}</strong>
                          <span>{imagen.obra}</span>
                          <span>{imagen.autor}{imagen.fecha ? ` · ${imagen.fecha}` : ""}</span>
                          {imagen.institucion && <span>{imagen.institucion}</span>}
                          <span className="bio-portrait-rights">
                            {imagen.derechos}
                            {imagen.fuenteUrl && (
                              <>
                                {" · "}
                                <a href={imagen.fuenteUrl} target="_blank" rel="noreferrer">Fuente</a>
                              </>
                            )}
                            {imagen.derechosUrl && (
                              <>
                                {" · "}
                                <a href={imagen.derechosUrl} target="_blank" rel="noreferrer">Derechos</a>
                              </>
                            )}
                          </span>
                        </figcaption>
                      </figure>
                    );
                  })()}

                  {resumenCortoPersona(personaBio) && <p className="bio-texto">{resumenCortoPersona(personaBio)}</p>}
                  <a
                    className="bio-full-profile-link"
                    href={rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(personaBio, "es"))}
                    title={`Abrir la ficha pública completa de ${personaBio.nombre}`}
                  >
                    Leer ficha completa <ExternalLink size={11} />
                  </a>

                  <a className="bio-full-profile-link" href={`/es/dinastia/${slugPublico(personaBio.dinastia)}`}>Explorar la casa de {personaBio.dinastia} <ExternalLink size={11}/></a>
                  </section>

                  <section id="bio-section-familia" data-bio-section="familia" className="bio-scroll-section" aria-labelledby="bio-heading-familia" tabIndex={-1}>
                    <h4 id="bio-heading-familia" className="bio-section-heading">Familia</h4>
                  {seleccion?.id === personaBio.id && !historiaActiva && (
                    <div className="bio-family-actions" aria-label="Ampliar la familia en el árbol">
                      {vm.growth.ids !== null && (vm.growth.additions.family.length > 0 || vm.growth.additions.ancestors.length > 0 || vm.growth.additions.descendants.length > 0) && (
                        <>
                          <span>Ampliar ramas de {personaBio.nombre}</span>
                          <div>
                            {vm.growth.additions.family.length > 0 && <button type="button" className="family-add-button" onClick={() => vm.growth.onExpand('family')}>Familia cercana <small>+{vm.growth.additions.family.length}</small></button>}
                            {vm.growth.additions.ancestors.length > 0 && <button type="button" onClick={() => vm.growth.onExpand('ancestors')}>Antepasados <small>+{vm.growth.additions.ancestors.length}</small></button>}
                            {vm.growth.additions.descendants.length > 0 && <button type="button" onClick={() => vm.growth.onExpand('descendants')}>Descendientes <small>+{vm.growth.additions.descendants.length}</small></button>}
                          </div>
                        </>
                      )}
                      <button type="button" className="bio-focus-link" onClick={() => { setFocoId(personaBio.id); setFocoAlcance('cercana'); setMode('foco'); setCompareMenuOpen(false); }}>Ver solo esta rama</button>
                    </div>
                  )}

                  <BioSection
                    title="Relaciones documentadas"
                    open={bioSectionsOpen.relaciones}
                    onToggle={() => alternarSeccionBio("relaciones")}
                  >
                    <div className="bio-relations bio-relations-collapsible">
                      <BioRelations etiqueta="Padre" ids={personaBio.padre ? [personaBio.padre] : []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta="Madre" ids={personaBio.madre ? [personaBio.madre] : []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta={listaConyuges(personaBio).length > 1 ? "Cónyuges" : "Cónyuge"} ids={listaConyuges(personaBio)} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta={listaAmantes(personaBio).length > 1 ? "Amantes" : "Amante"} ids={listaAmantes(personaBio)} tipo="amantes" byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta="Hijos/as" ids={HIJOS_POR_ID[personaBio.id] || []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      {!personaBio.padre && !personaBio.madre && !listaConyuges(personaBio).length && !listaAmantes(personaBio).length && !(HIJOS_POR_ID[personaBio.id] || []).length && (
                        <div className="bio-relations-empty">No hay relaciones cargadas para esta persona.</div>
                      )}
                    </div>
                  </BioSection>
                  </section>

                  <section id="bio-section-coronas" data-bio-section="coronas" className="bio-scroll-section" aria-labelledby="bio-heading-coronas" tabIndex={-1}>
                    <h4 id="bio-heading-coronas" className="bio-section-heading">Coronas</h4>
                  <VenetianOfficeSequence persona={personaBio} onSelect={seleccionarPersonaPorId}/>
                  <React.Suspense fallback={null}><AtlasCrowns key={personaBio.id} persona={personaBio} anio={anioGlobal} onYearChange={actualizarAnioDesdeRango}/></React.Suspense>
                  <BioSection
                    title="Datos y reinados"
                    open={bioSectionsOpen.datos}
                    onToggle={() => alternarSeccionBio("datos")}
                  >
                    <dl>
                      <dt>ID</dt><dd><code className="bio-id">{personaBio.id}</code></dd>
                      <dt>Territorio(s)</dt><dd>{(governmentSummary(personaBio, anioGlobal).length ? governmentSummary(personaBio, anioGlobal) : territoriosDe(personaBio)).join(", ") || "No indicado"}</dd>
                      {sobrenombreDePersona(personaBio) && <><dt>Sobrenombre</dt><dd>{sobrenombreDePersona(personaBio)}</dd></>}
                      {!!personaBio.aliases?.length && <><dt>Otros nombres</dt><dd>{personaBio.aliases.join(", ")}</dd></>}
                      <dt>Título</dt><dd>{personaBio.titulo}</dd>
                      <dt>Fechas</dt>
                      <dd>
                        {formatoFechas(personaBio)}
                        {siglosDePersona(personaBio).length > 0 && ` (s. ${siglosDePersona(personaBio).map((valor) => nRomano[valor] || valor).join("–")})`}
                      </dd>
                      {listaReinados(personaBio).map((reinado, index) => {
                        const tipo = etiquetaTipoReinado(reinado.condicion);
                        return (
                          <React.Fragment key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`}>
                            <dt>{reinado.titulo} · {reinado.territorio} · {etiquetaClaseGobierno(personaBio, reinado)}</dt>
                            <dd>{reinado.desde} – {reinado.hasta}{tipo ? ` (${tipo})` : ""}</dd>
                          </React.Fragment>
                        );
                      })}
                    </dl>
                  </BioSection>
                  </section>

                  <section id="bio-section-historias" data-bio-section="historias" className="bio-scroll-section" aria-labelledby="bio-heading-historias" tabIndex={-1}>
                    <h4 id="bio-heading-historias" className="bio-section-heading">Historias</h4>
                    <BioDiscovery
                      persona={personaBio}
                      personas={PERSONAS}
                      hijosPorId={HIJOS_POR_ID}
                      historias={HISTORIAS}
                      getSpouses={listaConyuges}
                      getLovers={listaAmantes}
                      getReigns={listaReinados}
                      normalizeText={normalizaTexto}
                      hrefPersona={(persona) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(persona, "es"))}
                      hrefHistoria={(historia) => rutaEntidadLocalizada("es", "historia", slugPublico(historia.titulo))}
                      onSelect={seleccionarPersonaPorId}
                      onStartHistoria={iniciarHistoria}
                    />
                    <a className="bio-full-profile-link" href="/es/historias">Ver todas las historias <ExternalLink size={11}/></a>
                  </section>

                  <section id="bio-section-fuentes" data-bio-section="fuentes" className="bio-scroll-section bio-source-tab" aria-labelledby="bio-heading-fuentes" tabIndex={-1}>
                    <h4 id="bio-heading-fuentes" className="bio-section-heading">Fuentes</h4>
                    <DocumentationNotes persona={personaBio}/>
                    <EvidencePanel person={personaBio} personNameById={id=>BY_ID[id]?.nombre} compact />
                    <p>Las fechas y relaciones incompletas se indican en la ficha. Consulta el método y la bibliografía general para interpretar los datos.</p>
                    <a className="bio-full-profile-link" href="/es/fuentes">Fuentes y metodología <ExternalLink size={11}/></a>
                    <button type="button" onClick={()=>setInfoProyecto('reportar')}>Sugerir una corrección documentada</button>
                  </section>

                  {hovered && seleccion && hovered !== seleccion.id && (
                    <div className="bio-hint">Vista previa de {personaBio.nombre} — al quitar el ratón volverás a ver a {seleccion.nombre}.</div>
                  )}
                </div>
              ) : (
                <div className="bio-empty">Pasa el ratón por encima de un personaje, o haz clic para dejarlo fijo, y su biografía aparecerá aquí.</div>
              )}
            </div>
          </section>
        </aside>
        )}

      </div>
      {mostrarCronologia && atlasScene === 'atlas' && <AtlasTimeline vm={vm}/>}
      </div>
      <div className="atlas-europe-pane" hidden={atlasScene !== 'europa' && !sceneSliding}>
      {(atlasScene === 'europa' || sceneSliding) && <React.Suspense fallback={<p role="status">Preparando Europa en este año…</p>}><EuropeYearView year={anioGlobal ?? 1500} onYearChange={actualizarAnioDesdeRango} onSelect={id=>seleccionarPersonaPorId(id,{abrirAtlas:true})} onEvent={seleccionarEvento} timeline={mostrarCronologia && atlasScene === 'europa' ? <AtlasTimeline vm={vm}/> : null}/></React.Suspense>}
      </div>
      </div>
      </div>

      {!modoTrabajo && (
        <SiteFooter
          compact
          onOpenStats={() => setInfoProyecto("estadisticas")}
          onReport={() => setInfoProyecto("reportar")}
        />
      )}

      {!modoTrabajo && !guideOpen && !infoProyecto && <ActionDial className="atlas-quick-actions" label="Acciones del Atlas" actions={[
        {id:'center',label:'Centrar persona',Icon:Crosshair,disabled:!seleccion,onClick:centrarSeleccion},
        {id:'filters',label:mostrarFiltros?'Ocultar filtros':'Mostrar filtros',Icon:SlidersHorizontal,onClick:()=>alternarPanelAuxiliar('filtros')},
        {id:'timeline',label:mostrarCronologia?'Ocultar cronología':'Mostrar cronología',Icon:List,onClick:()=>alternarPanelAuxiliar('cronologia')},
      ]}/>}
      {guideOpen && <AtlasGuide locale={locale} onClose={closeGuide} onSelect={() => vm.growth.onSelect('CARLOS5')} onExpand={() => vm.growth.onExpand('family')} onYear={() => actualizarAnioDesdeRango(1500)} selectedId={seleccion?.id} canExpand={canAddFamily} />}
      {infoProyecto === 'cobertura' && <CoverageDialog onClose={() => setInfoProyecto(null)} />}
      {infoProyecto !== 'cobertura' && <ModalProyecto seccion={infoProyecto} onClose={() => setInfoProyecto(null)} persona={seleccion} personasVista={visiblePeople} onStartHistoria={iniciarHistoria} />}

    </div>
    </div>
  );
}
