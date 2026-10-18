// Los imports sin nombre de componentes que ahora usa ./view/ conservan aquí el orden de sus estilos en la cascada.
import {dynastyRegions} from '../../domain/filters/atlasFilters.js';
import AtlasTimeline from './AtlasTimeline.jsx';
import './europe-panorama.css';
import {AtlasLoadError} from './AtlasSkeleton.jsx';
import './AtlasGrowth.jsx';
import StoryAtlasGuide from './StoryAtlasGuide.jsx';
import '../stories/stories.css';
import ConnectionControls from "../connections/ConnectionControls.jsx";
import "../connections/TreeExport.jsx";
import React from "react";
import { X, Crosshair, SlidersHorizontal, List } from "lucide-react";
import "./MapaEuropa.jsx";
import { TERRITORIOS } from "../../data/territorios.js";
import { PERSONAS } from "../../data/personas.js";
import { EVENTOS_HISTORICOS, HISTORIAS } from "../../data/historias.js";
import "../../ui/FavoriteStar.jsx";
import "../../ui/HoldButton.jsx";
import useReducedMotion from "../../ui/useReducedMotion.js";
import SiteHeader from "../../components/SiteHeader.jsx";
import SiteFooter from "../../components/SiteFooter.jsx";
import { normalizaTexto } from "./atlasModel.js";
import { ModalProyecto } from "./ExplorerPrimitives.jsx";
import AtlasGuide from "./AtlasGuide.jsx";
import { atlasSearch } from "./atlasSearch.js";
import '../../components/EvidencePanel.jsx';
import CoverageDialog from '../../components/CoverageDialog.jsx';
import {readPreferences} from '../settings/preferences.js';
import "./atlas-controls.css";
import "../../ui/SegmentedControl.jsx";
import ActionDial from "../../ui/ActionDial.jsx";
import "./atlas-interactions.css";
import "./atlas-refinements.css";
import AtlasToolbar from './view/AtlasToolbar.jsx';
import AtlasTopbar from './view/AtlasTopbar.jsx';
import CompareBar from './view/CompareBar.jsx';
import FocusBar from './view/FocusBar.jsx';
import AtlasFiltersPanel from './view/AtlasFiltersPanel.jsx';
import AtlasTreeStage from './view/AtlasTreeStage.jsx';
import AtlasMapStage from './view/AtlasMapStage.jsx';
import AtlasBiographyPanel from './view/AtlasBiographyPanel.jsx';

const SEARCH_DYNASTIES = [...new Set(PERSONAS.map(persona => persona.dinastia).filter(Boolean))];
const SEARCH_TERRITORIES = Object.keys(TERRITORIOS);

const loadEuropeYearView = () => import('./EuropeYearView.jsx');
const EuropeYearView = React.lazy(loadEuropeYearView);

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
    connectionIds, setConnectionIds, connectionCriterion, setConnectionCriterion, connectionResult, locale, territorios,
    dinastias, titulos, siglos, relaciones, seleccion, mode, compareMenuOpen, setCompareMenuOpen, anioGlobal, atlasScene,
    infoProyecto, setInfoProyecto, favoritosOpen, setFavoritosOpen, soloFavoritos, soloDocumentados, historiaPasoIndex,
    compareMenuRef, favoritosMenuRef, personHistory, modoTrabajo, setModoTrabajo, graph, historiaActiva, opciones,
    actualizarAnioDesdeRango, mostrarArbol, mostrarMapa, mostrarFiltros, mostrarBiografia, mostrarCronologia, vistaPrincipal,
    layoutLaterales, alternarPanelAuxiliar, visiblePeople, queryTrim, seleccionarPersonaPorId, centrarSeleccion,
    seleccionarEvento, aplicarPasoHistoria, iniciarHistoria, cambiarPasoHistoria, salirHistoria, filtrosActivosCompactos,
    cambiarIdioma,
  } = vm;
  const filtrosCompactosVisibles = filtrosActivosCompactos.slice(0, 6);
  const filtrosCompactosRestantes = Math.max(0, filtrosActivosCompactos.length - filtrosCompactosVisibles.length);
  const filterCount = territorios.length + dinastias.length + titulos.length + siglos.length + relaciones.length + Number(soloFavoritos) + Number(soloDocumentados);
  const personaAnteriorId = personHistory.index > 0 ? personHistory.ids[personHistory.index - 1] : null;
  const personaSiguienteId = personHistory.index >= 0 && personHistory.index < personHistory.ids.length - 1
    ? personHistory.ids[personHistory.index + 1]
    : null;
  const canAddFamily = Boolean(seleccion && !historiaActiva && vm.growth.ids !== null && vm.growth.additions.family.length);
  const vistasAntesDeConectarRef = React.useRef(null);
  const regionesDinasticas = React.useMemo(() => dynastyRegions(PERSONAS, opciones.dinastias), [opciones.dinastias]);
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
      <AtlasToolbar vm={vm} closeOtherToolbarMenus={closeOtherToolbarMenus} guideButtonRef={guideButtonRef} mobileToolsOpen={mobileToolsOpen} onToolbarMenuToggle={onToolbarMenuToggle} panelsMenuRef={panelsMenuRef} setGuideOpen={setGuideOpen} setMobileToolsOpen={setMobileToolsOpen} toolsMenuRef={toolsMenuRef} vistasAntesDeConectarRef={vistasAntesDeConectarRef} />
      <AtlasTopbar vm={vm} searchOpen={searchOpen} searchResults={searchResults} setSearchOpen={setSearchOpen} />

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

      {mode === "conexion" && <ConnectionControls people={PERSONAS} graph={graph} ids={connectionIds} onChange={setConnectionIds} criterion={connectionCriterion} onCriterion={setConnectionCriterion} result={connectionResult} onSelect={seleccionarPersonaPorId}/>}

      {mode === "compare" && <CompareBar vm={vm} />}

      {mode === "foco" && <FocusBar vm={vm} />}

      {historiaActiva && <StoryAtlasGuide story={historiaActiva} index={historiaPasoIndex} returnPath={vm.storyReturn} count={vm.growth.ids?.length || 0} onStep={cambiarPasoHistoria} onCenter={()=>aplicarPasoHistoria(historiaActiva,historiaPasoIndex,{replace:true})} onExit={salirHistoria}/>}

      {/* V5.20 · Atlas y Europa comparten URL y se deslizan como dos paneles contiguos. */}
      <div className={`atlas-scenes is-${atlasScene}${sceneSliding ? ' is-sliding' : ''}`}>
      <div className="atlas-scenes-track">
      <div className="atlas-traditional" hidden={atlasScene !== 'atlas' && !sceneSliding}>
      <div
        className={`workspace-grid ${layoutLaterales} workspace-no-timeline`}
        style={{
          // V5.20 · Anchos fijos: sin redimensionar, sin saltos ni marcos de arrastre.
          "--workspace-left-width": "280px",
          "--workspace-right-width": "330px",
        }}
      >
        {mostrarFiltros && <AtlasFiltersPanel vm={vm} filterCount={filterCount} filtrosCompactosRestantes={filtrosCompactosRestantes} filtrosCompactosVisibles={filtrosCompactosVisibles} regionesDinasticas={regionesDinasticas} />}

        <main
          className={`workspace-main workspace-main-${vistaPrincipal}`}
          style={mostrarArbol && mostrarMapa ? {
            "--tree-pane-fr": "1fr",
            "--map-pane-fr": "1fr",
          } : undefined}
        >
          {mostrarArbol && <AtlasTreeStage vm={vm} setGuideOpen={setGuideOpen} setTreeListOpen={setTreeListOpen} treeListOpen={treeListOpen} />}

          {mostrarMapa && atlasScene === 'atlas' && <AtlasMapStage vm={vm} />}
        </main>

        {mostrarBiografia && <AtlasBiographyPanel vm={vm} bioMobileOpen={bioMobileOpen} bioScrollRef={bioScrollRef} bioSection={bioSection} personaAnteriorId={personaAnteriorId} personaSiguienteId={personaSiguienteId} scrollToBioSection={scrollToBioSection} setBioMobileOpen={setBioMobileOpen} updateBioSectionOnScroll={updateBioSectionOnScroll} />}

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
