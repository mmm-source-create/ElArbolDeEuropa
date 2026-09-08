import React from "react";
import { Search, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, RotateCcw, GitCompare, Focus, Share2, Play, Pause, SkipBack, SkipForward, X, Info, Heart, BookOpen, BarChart3, Scale, Flag, Mail, ExternalLink, Crosshair, Maximize2 } from "lucide-react";
import { MapaEuropa } from "../MapaEuropa";
import { TERRITORIOS_SUB, TERRITORIOS_DESTACADOS, REINO_COLOR, REINO_COLOR_DEFAULT, listaReinados, territoriosGobernadosEnAño, reinadoEsEfectivo, esGobernante } from "../Territorios";
import { PERSONAS } from "../personas.jsx";
import { IMAGENES_PERSONAS } from "../imagenesPersonas.js";
import { HISTORIAS } from "../historiaData.jsx";
import { t } from "../i18n.jsx";
import BioRelations from "../components/BioRelations.jsx";
import BioDiscovery from "../components/BioDiscovery.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { etiquetaClaseGobierno, resumenCortoPersona } from "../utils/personPresentation.js";
import { ACCENTS, getCategoriaDinastía, DINASTIAS_DESTACADAS, GRUPOS_DINASTICOS, CATEGORIAS_TITULO, FILTROS_RELACION, BY_ID, HIJOS_POR_ID, SIN_FECHA, TIMELINE_SCALES, rutaEntidadLocalizada, slugPersonaPorLocale, slugPublico, listaConyuges, listaAmantes, siglosDePersona, etiquetaTipoReinado, normalizaTexto, estaVivaEn } from "./model.js";
import { nRomano, formatoFechas, sobrenombreDePersona, nombrePrincipal, pct, etiquetaFechaEvento, inicioEvento, finEvento, TL_MIN, TL_MAX, anioInicioPersona, anioFinPersona } from "./timelineUtils.js";
import { ALCANCES_FOCO, MODOS_COMPARACION, tipoRelacionEntre } from "./relationshipGraph.js";
import { Chip, ModalProyecto } from "./ExplorerPrimitives.jsx";

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

export default function ExplorerView({ vm }) {
  const {
    scrollRef, nodeRefs, tlScrollRef, tlBarRefs, locale, setLocale, query, setQuery,
    territorios, setTerritorios, dinastias, setDinastias, dinastiasExpandidas, setDinastiasExpandidas, territoriosExpandidos, setTerritoriosExpandidos,
    titulos, setTitulos, siglos, setSiglos, relaciones, setRelaciones, hovered, setHovered,
    seleccion, setSeleccion, currentSearchIndex, setCurrentSearchIndex, zoom, setZoom, mode, setMode,
    origen, setOrigen, destino, setDestino, modoComparacion, setModoComparacion, compareMenuOpen, setCompareMenuOpen,
    compareRouteIndex, setCompareRouteIndex, focoMenuOpen, setFocoMenuOpen, focoId, setFocoId, focoAlcance, setFocoAlcance,
    anioGlobal, setAnioGlobal, anioInput, setAnioInput, reproduciendoHistoria, setReproduciendoHistoria, velocidadHistoria, setVelocidadHistoria,
    shareStatus, setShareStatus, collapsedIds, setCollapsedIds, vistasActivas, setVistasActivas, panelesVisibles, setPanelesVisibles,
    infoProyecto, setInfoProyecto, timelineScaleIndex, setTimelineScaleIndex, timelineMode, setTimelineMode, eventoSeleccionadoId, setEventoSeleccionadoId,
    favoritos, setFavoritos, favoritosOpen, setFavoritosOpen, soloFavoritos, setSoloFavoritos, historiaActivaId, setHistoriaActivaId,
    historiaPasoIndex, setHistoriaPasoIndex, compareMenuRef, focoMenuRef, favoritosMenuRef, historiaSnapshotRef, shareStatusTimerRef, urlStateLoadedRef,
    historyPopRef, dragState, workspaceGridRef, workspaceMainRef, panelWidths, setPanelWidths, treeMapSplit, setTreeMapSplit, filterSectionsOpen, setFilterSectionsOpen,
    bioSectionsOpen, setBioSectionsOpen, personHistory, modoTrabajo, setModoTrabajo,
    alternarSeccionFiltro, alternarSeccionBio, ajustarAnchoPanel, restablecerAnchoPanel, comenzarResizeLateral, comenzarResizeArbolMapa,
    gen, rows, graph, favoritosSet, timelinePxPerYear, timelineTrackWidth,
    timelineContentWidth, timelineTickStep, timelineTicks, eventosOrdenadosTodos, totalEventosTimeline, eventosOrdenados, timelineCombinedEvents, eventoSeleccionado,
    historiaActiva, historiaPasoActual, historiaPersonasSet, opciones, personaBio, toggle, focoSet, collapsedSet,
    hiddenByCollapse, toggleDescendants, ajustarAnio, actualizarAnioDesdeRango, confirmarAnioEscrito, restablecerAnio, moverAnioHistoria, alternarReproduccionHistoria,
    mostrarArbol, mostrarMapa, mostrarFiltros, mostrarBiografia, mostrarCronologia, vistaPrincipal, layoutLaterales, alternarVista,
    alternarPanelAuxiliar, personasVivasEnAnio, gobernantesActivosEnAnio, matches, visiblePeople, visibleIds, visibleSignature, visibleRows,
    treeLayout, positions, canvasSize, queryTrim, searchMatchIds, searchMatchSet, searchSignature, searchCurrentId,
    irACoincidencia, hayFiltros, limpiar, lineage, comparePaths, comparePath, pathEdges, groupsByRow,
    routing, relacionFocoId, amantesFoco, styleForFamilyLine, connectorLayerKey, connectors, scrollBy, onPointerDown,
    onPointerMove, endDrag, centerOn, pendingZoomCenterRef, cambiarZoomArbol, centerOnTimeline, seleccionarPersonaPorId, navegarHistorialPersona, centrarSeleccion, cerrarSeleccion,
    centerTimelineOnYear, alternarFavorito, seleccionarEvento, aplicarPasoHistoria, iniciarHistoria, cambiarPasoHistoria, salirHistoria, mostrarEstadoCompartir,
    construirEnlaceCompartido, compartirPersona, handleBoxClick, getBoxHandlers, renderPersonBox, miniW, miniScaleX, miniScaleY,
    onMinimapClick, filtrosActivosCompactos, cambiarIdioma, atlasContextLabel,
  } = vm;
  const filtrosCompactosVisibles = filtrosActivosCompactos.slice(0, 6);
  const filtrosCompactosRestantes = Math.max(0, filtrosActivosCompactos.length - filtrosCompactosVisibles.length);
  const personaAnteriorId = personHistory.index > 0 ? personHistory.ids[personHistory.index - 1] : null;
  const personaSiguienteId = personHistory.index >= 0 && personHistory.index < personHistory.ids.length - 1
    ? personHistory.ids[personHistory.index + 1]
    : null;
  return (
    <div className={`wrap${modoTrabajo ? " atlas-work-mode" : ""}`}>
      {!modoTrabajo && <SiteHeader variant="atlas" locale={locale} onLanguageChange={cambiarIdioma} contextLabel={atlasContextLabel} />}
      <div className={`workspace-topbar${modoTrabajo ? " is-work-mode" : ""}`}>
        <section className="workspace-topbar-section workspace-toolbar-search">
          <div className="toolbar-label">Búsqueda</div>
          <div className="search-box toolbar-search-box">
            <Search size={13} color="#8A7F65" />
            <input
              placeholder="Buscar nombre, título, dinastía o territorio…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") irACoincidencia(event.shiftKey ? -1 : 1);
              }}
            />
            {queryTrim && (
              <div className="toolbar-search-nav">
                <span className="toolbar-search-count">
                  {searchMatchIds.length ? `${currentSearchIndex + 1} / ${searchMatchIds.length}` : "0 / 0"}
                </span>
                <button type="button" className="nav-btn search-nav-btn" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(-1)}>
                  <ChevronRight size={10} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(1)}>
                  <ChevronRight size={10} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="workspace-topbar-section workspace-toolbar-year">
          <div className="global-year-heading-row">
            <div className="toolbar-label">Año global</div>
            {Number.isFinite(anioGlobal) && (
              <span className="global-year-header-summary">
                {personasVivasEnAnio.length} vivas · {gobernantesActivosEnAnio.length} gobernando
              </span>
            )}
          </div>
          <div className="global-year-control global-year-control-inline" aria-label="Selector global de año">
            <input
              className={`global-year-range${Number.isFinite(anioGlobal) ? "" : " is-idle"}`}
              type="range"
              min={TL_MIN}
              max={TL_MAX}
              step="1"
              value={Number.isFinite(anioGlobal) ? anioGlobal : Math.max(TL_MIN, Math.min(TL_MAX, 1500))}
              onChange={(event) => actualizarAnioDesdeRango(event.target.value)}
              aria-label="Seleccionar año"
            />
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
                title={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir historia"}
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
              <label className="history-speed-control">
                <span>Velocidad</span>
                <select
                  value={velocidadHistoria}
                  onChange={(event) => setVelocidadHistoria(Number(event.target.value))}
                  aria-label="Velocidad de reproducción"
                >
                  <option value={1}>1 año/paso</option>
                  <option value={5}>5 años/paso</option>
                  <option value={10}>10 años/paso</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        {!modoTrabajo && (
        <div className="workspace-topbar-secondary">
          <section className="workspace-topbar-section workspace-toolbar-view workspace-toolbar-panels">
            <div className="toolbar-label">Paneles visibles</div>
            <div className="segmented-control view-toggle-control panel-toggle-control" aria-label="Paneles visibles">
              <button type="button" className={`segment-btn${mostrarFiltros ? " active" : ""}`} aria-pressed={mostrarFiltros} onClick={() => alternarPanelAuxiliar("filtros")}>Filtros</button>
              <button type="button" className={`segment-btn${mostrarArbol ? " active" : ""}`} aria-pressed={mostrarArbol} onClick={() => alternarVista("arbol")}>Árbol</button>
              <button type="button" className={`segment-btn${mostrarMapa ? " active" : ""}`} aria-pressed={mostrarMapa} onClick={() => alternarVista("mapa")}>Mapa</button>
              <button type="button" className={`segment-btn${mostrarBiografia ? " active" : ""}`} aria-pressed={mostrarBiografia} onClick={() => alternarPanelAuxiliar("biografia")}>Biografía</button>
              <button type="button" className={`segment-btn${mostrarCronologia ? " active" : ""}`} aria-pressed={mostrarCronologia} onClick={() => alternarPanelAuxiliar("cronologia")}>Cronología</button>
            </div>
          </section>

          <section className="workspace-topbar-section workspace-toolbar-actions">
            <div className="toolbar-label">Interacción</div>
            <div className="nav-controls topbar-mode-controls">
              <div className="compare-split-control" ref={compareMenuRef}>
                <button
                  type="button"
                  className={`nav-btn nav-btn-wide compare-main-btn ${mode === "compare" ? "active" : ""}`}
                  onClick={() => {
                    const entrar = mode !== "compare";
                    setMode(entrar ? "compare" : "view");
                    if (entrar) { setOrigen(null); setDestino(null); setCompareRouteIndex(0); }
                    setCompareMenuOpen(false);
                    setFocoMenuOpen(false);
                  }}
                >
                  <GitCompare size={12} /> Comparar parentesco
                </button>
                <button
                  type="button"
                  className={`nav-btn compare-menu-btn ${mode === "compare" ? "active" : ""}`}
                  onClick={() => {
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
                  <div className="compare-mode-menu" role="menu">
                    {MODOS_COMPARACION.map((opcion) => (
                      <button
                        type="button"
                        key={opcion.id}
                        role="menuitemradio"
                        aria-checked={modoComparacion === opcion.id}
                        className={`compare-mode-option${modoComparacion === opcion.id ? " active" : ""}`}
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
              <div className="compare-split-control" ref={focoMenuRef}>
                <button
                  type="button"
                  className={`nav-btn nav-btn-wide compare-main-btn ${mode === "foco" ? "active" : ""}`}
                  onClick={() => {
                    const entrar = mode !== "foco";
                    setMode(entrar ? "foco" : "view");
                    setFocoId(entrar ? (seleccion?.id || null) : null);
                    setFocoMenuOpen(false);
                    setCompareMenuOpen(false);
                  }}
                >
                  <Focus size={12} /> Modo foco
                </button>
                <button
                  type="button"
                  className={`nav-btn compare-menu-btn ${mode === "foco" ? "active" : ""}`}
                  onClick={() => {
                    setFocoMenuOpen((actual) => !actual);
                    setCompareMenuOpen(false);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={focoMenuOpen}
                  title="Elegir alcance del modo foco"
                >
                  <ChevronDown size={11} />
                </button>
                {focoMenuOpen && (
                  <div className="compare-mode-menu" role="menu">
                    {ALCANCES_FOCO.map((opcion) => (
                      <button
                        type="button"
                        key={opcion.id}
                        role="menuitemradio"
                        aria-checked={focoAlcance === opcion.id}
                        className={`compare-mode-option${focoAlcance === opcion.id ? " active" : ""}`}
                        onClick={() => {
                          setFocoAlcance(opcion.id);
                          if (mode !== "foco") setFocoId(seleccion?.id || null);
                          setMode("foco");
                          setFocoMenuOpen(false);
                        }}
                      >
                        <strong>{opcion.label}</strong>
                        <span>{opcion.descripcion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className={`nav-btn nav-btn-wide${historiaActiva ? " active" : ""}`} onClick={() => setInfoProyecto("historias")}>
                <BookOpen size={12} /> Historias
              </button>
              <a className="nav-btn nav-btn-wide" href="/es/desafio">Desafío</a>
              <div className="favorites-control" ref={favoritosMenuRef}>
                <button type="button" className={`nav-btn nav-btn-wide${favoritosOpen || soloFavoritos ? " active" : ""}`} onClick={() => setFavoritosOpen((actual) => !actual)} aria-haspopup="menu" aria-expanded={favoritosOpen}>
                  <span className="favorite-star-symbol" aria-hidden="true">★</span> Favoritos {favoritos.length ? `(${favoritos.length})` : ""}
                </button>
                {favoritosOpen && (
                  <div className="favorites-menu" role="menu">
                    <div className="favorites-menu-head"><strong>Mis favoritos</strong><span>{favoritos.length}</span></div>
                    <div className="favorites-menu-list">
                      {favoritos.length ? favoritos.map((id) => (
                        <div key={id} className="favorite-menu-row">
                          <button type="button" onClick={() => { seleccionarPersonaPorId(id); setFavoritosOpen(false); }}>{BY_ID[id]?.nombre || id}</button>
                          <button type="button" className="favorite-remove" onClick={() => alternarFavorito(id)} title="Quitar de favoritos" aria-label={`Quitar ${BY_ID[id]?.nombre || id} de favoritos`}>×</button>
                        </div>
                      )) : <div className="favorites-empty">Marca una ficha con ★ para guardarla aquí.</div>}
                    </div>
                    <label className={`favorites-filter-toggle${favoritos.length ? "" : " is-disabled"}`}>
                      <input type="checkbox" checked={soloFavoritos} disabled={!favoritos.length} onChange={(event) => setSoloFavoritos(event.target.checked)} />
                      <span>Mostrar solo favoritos</span>
                    </label>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="nav-btn nav-btn-wide"
                disabled={!seleccion}
                onClick={centrarSeleccion}
                title={seleccion ? `Centrar ${seleccion.nombre} en el árbol y la cronología` : "Selecciona una persona para centrarla"}
              >
                <Crosshair size={12} /> Centrar
              </button>
              <button
                type="button"
                className="nav-btn nav-btn-wide"
                onClick={() => setModoTrabajo(true)}
                title="Abrir el Atlas en modo de trabajo"
              >
                <Maximize2 size={12} /> Pantalla de trabajo
              </button>
              <div className="share-control-wrap">
                <button
                  type="button"
                  className="nav-btn nav-btn-wide share-person-btn"
                  disabled={!seleccion}
                  onClick={compartirPersona}
                  title={seleccion ? `Compartir ${seleccion.nombre}` : "Selecciona una persona para compartirla"}
                  aria-label={seleccion ? `Compartir ${seleccion.nombre}` : "Selecciona una persona para compartirla"}
                >
                  <Share2 size={12} /> Compartir persona
                </button>
                {shareStatus && <span className="share-status" role="status">{shareStatus}</span>}
              </div>
            </div>
          </section>
        </div>
        )}
      </div>

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
          <span className="compare-mode-label">{ALCANCES_FOCO.find((opcion) => opcion.id === focoAlcance)?.label || "Familia cercana"}</span>
          {focoSet && (
            <span className="focus-count">
              {focoSet.size} persona{focoSet.size === 1 ? "" : "s"}
            </span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => setFocoId(null)}>reiniciar</button>
        </div>
      )}

      <div
        ref={workspaceGridRef}
        className={`workspace-grid ${layoutLaterales}${mostrarCronologia ? "" : " workspace-no-timeline"}`}
        style={{
          "--workspace-left-width": `${panelWidths.filtros}px`,
          "--workspace-right-width": `${panelWidths.biografia}px`,
        }}
      >
        {mostrarFiltros && (
        <aside className="workspace-sidebar">
          <section className="panel workspace-fixed-panel workspace-filter-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title">Filtros</span>
              <span className="panel-count">
                {hayFiltros ? `${visiblePeople.length} / ${PERSONAS.length} visibles` : `${PERSONAS.length} personas`}
              </span>
            </div>
            <div className={`filter-active-overview${filtrosActivosCompactos.length ? " has-active" : ""}`}>
              <span className="filter-active-overview-label">Filtros activos</span>
              <span className="filter-active-overview-values">
                {filtrosCompactosVisibles.length ? filtrosCompactosVisibles.join(" · ") : "Ninguno"}
                {filtrosCompactosRestantes > 0 ? ` · +${filtrosCompactosRestantes}` : ""}
              </span>
            </div>
            <div className="panel-body workspace-panel-scroll workspace-filter-scroll">
              <div className="filters-row filters-row-vertical filters-always-open">
                <FilterSection
                  title="Territorios"
                  open={filterSectionsOpen.territorios}
                  onToggle={() => alternarSeccionFiltro("territorios")}
                  activeCount={territorios.length}
                >
                  <div className="filter-group filter-group-dinastias">
                    {opciones.territorios.map((territorio) => {
                      const hijos = opciones.subsPorTerritorio[territorio] || [];
                      const tieneHijos = hijos.length > 0;
                      const expandido = territoriosExpandidos.includes(territorio);
                      const colorPadre = REINO_COLOR[territorio] || REINO_COLOR_DEFAULT;
                      return (
                        <div key={territorio} className="dinastia-block">
                          <span className="dinastia-chip-row">
                            <Chip label={territorio} active={territorios.includes(territorio)} color={colorPadre} onClick={() => toggle(setTerritorios, territorios, territorio)} />
                            {tieneHijos && (
                              <button
                                type="button"
                                className="dinastia-expand-btn"
                                onClick={() => toggle(setTerritoriosExpandidos, territoriosExpandidos, territorio)}
                                title={expandido ? "Ocultar sub-territorios" : `Ver sub-territorios de ${territorio}`}
                                aria-label={expandido ? `Ocultar sub-territorios de ${territorio}` : `Mostrar sub-territorios de ${territorio}`}
                              >
                                {expandido ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              </button>
                            )}
                          </span>
                          {tieneHijos && expandido && (
                            <div className="dinastia-ramas">
                              {hijos.map((hijo) => (
                                <Chip key={hijo} small label={hijo} active={territorios.includes(hijo)} color={REINO_COLOR[hijo] || colorPadre} onClick={() => toggle(setTerritorios, territorios, hijo)} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Dinastías"
                  open={filterSectionsOpen.dinastias}
                  onToggle={() => alternarSeccionFiltro("dinastias")}
                  activeCount={dinastias.length}
                >
                  <div className="filter-group filter-group-dinastias">
                    {opciones.dinastias.map((dinastia) => {
                      const ramas = opciones.ramasPorPrincipal[dinastia] || [];
                      const tieneRamas = ramas.length > 0;
                      const expandida = dinastiasExpandidas.includes(dinastia);
                      return (
                        <div key={dinastia} className="dinastia-block">
                          <span className="dinastia-chip-row">
                            <Chip label={dinastia} active={dinastias.includes(dinastia)} color={ACCENTS[dinastia] || "#71717A"} onClick={() => toggle(setDinastias, dinastias, dinastia)} />
                            {tieneRamas && (
                              <button
                                type="button"
                                className="dinastia-expand-btn"
                                onClick={() => toggle(setDinastiasExpandidas, dinastiasExpandidas, dinastia)}
                                title={expandida ? "Ocultar ramas menores" : `Ver ramas menores de ${dinastia}`}
                                aria-label={expandida ? `Ocultar ramas de ${dinastia}` : `Mostrar ramas de ${dinastia}`}
                              >
                                {expandida ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              </button>
                            )}
                          </span>
                          {tieneRamas && expandida && (
                            <div className="dinastia-ramas">
                              {ramas.map((rama) => (
                                <Chip key={rama} small label={rama} active={dinastias.includes(rama)} color={ACCENTS[rama] || ACCENTS[dinastia] || "#71717A"} onClick={() => toggle(setDinastias, dinastias, rama)} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
              </div>

              <button
                className="clear-btn"
                onClick={limpiar}
                disabled={!hayFiltros}
                style={{ visibility: hayFiltros ? "visible" : "hidden" }}
              >
                Limpiar filtros
              </button>
            </div>
          </section>
        </aside>
        )}

        {mostrarFiltros && (
          <div
            className="workspace-resize-handle workspace-resize-handle-left"
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionar panel de filtros"
            tabIndex={0}
            onPointerDown={(event) => comenzarResizeLateral("filtros", event)}
            onDoubleClick={() => restablecerAnchoPanel("filtros")}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") { event.preventDefault(); ajustarAnchoPanel("filtros", -12); }
              if (event.key === "ArrowRight") { event.preventDefault(); ajustarAnchoPanel("filtros", 12); }
            }}
            title="Arrastra para cambiar el ancho · doble clic para restablecer"
          ><span /></div>
        )}

        <main
          ref={workspaceMainRef}
          className={`workspace-main workspace-main-${vistaPrincipal}`}
          style={mostrarArbol && mostrarMapa ? {
            "--tree-pane-fr": `${treeMapSplit}fr`,
            "--map-pane-fr": `${100 - treeMapSplit}fr`,
          } : undefined}
        >
          {mostrarArbol && (
            <section className="workspace-stage workspace-tree-stage" aria-label="Árbol genealógico">
              <div className="tree-toolbar" aria-label="Controles del árbol">
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(zoom - 0.1)} title="Alejar árbol" aria-label="Alejar árbol"><ZoomOut size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(0.8)} title="Restablecer árbol" aria-label="Restablecer árbol"><RotateCcw size={12} /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(zoom + 0.1)} title="Acercar árbol" aria-label="Acercar árbol"><ZoomIn size={13} /></button>
                <span className="tree-toolbar-separator" aria-hidden="true" />
                <button type="button" className="nav-btn" onClick={() => scrollBy(-200, 0)} title="Mover árbol a la izquierda" aria-label="Mover árbol a la izquierda"><ArrowLeft size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => scrollBy(0, -150)} title="Mover árbol hacia arriba" aria-label="Mover árbol hacia arriba"><ArrowUp size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => scrollBy(0, 150)} title="Mover árbol hacia abajo" aria-label="Mover árbol hacia abajo"><ArrowDown size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => scrollBy(200, 0)} title="Mover árbol a la derecha" aria-label="Mover árbol a la derecha"><ArrowRight size={13} /></button>
              </div>

              {collapsedIds.length > 0 && (
                <div className="branch-collapse-bar branch-collapse-bar-floating">
                  <span>{collapsedIds.length} rama{collapsedIds.length === 1 ? "" : "s"} cerrada{collapsedIds.length === 1 ? "" : "s"} · {hiddenByCollapse.size} fichas ocultas</span>
                  <button type="button" onClick={() => setCollapsedIds([])}>Abrir todas</button>
                </div>
              )}

              <div className="tree-outer">
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
                  className="tree-scroll"
                  ref={scrollRef}
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

                      {treeLayout.units.map((unit) => (
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
            </section>
          )}

          {mostrarArbol && mostrarMapa && (
            <div
              className="workspace-stage-splitter"
              role="separator"
              aria-orientation="horizontal"
              aria-label="Redimensionar árbol y mapa"
              tabIndex={0}
              onPointerDown={comenzarResizeArbolMapa}
              onDoubleClick={() => setTreeMapSplit(50)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") { event.preventDefault(); setTreeMapSplit((valor) => Math.max(25, valor - 5)); }
                if (event.key === "ArrowDown") { event.preventDefault(); setTreeMapSplit((valor) => Math.min(75, valor + 5)); }
              }}
              title={`Árbol ${Math.round(treeMapSplit)}% · Mapa ${Math.round(100 - treeMapSplit)}% · doble clic para 50/50`}
            ><span /></div>
          )}

          {mostrarMapa && (
            <section className="workspace-stage workspace-map-stage" aria-label="Mapa de territorios">
              <MapaEuropa
                seleccion={seleccion}
                anioGlobal={anioGlobal}
                onSelectTerritorio={(idRegion) => console.log("ID pulsado:", idRegion)}
              />
              <div className="territory-hint workspace-map-hint">
                {seleccion
                  ? (esGobernante(seleccion)
                      ? (Number.isFinite(anioGlobal)
                          ? (territoriosGobernadosEnAño(seleccion, anioGlobal).length
                              ? `En ${anioGlobal}, ${seleccion.nombre} gobernaba: ${territoriosGobernadosEnAño(seleccion, anioGlobal).join(", ")}.`
                              : `${seleccion.nombre} no gobernaba ningún territorio registrado en ${anioGlobal}.`)
                          : `Se destacan los territorios que gobernó ${seleccion.nombre}; elige un año para ver solo los vigentes entonces.`)
                      : `${seleccion.nombre} no ostentó un título de gobierno, así que no se ilumina ningún territorio en el mapa (puedes ver su vinculación territorial en la biografía).`)
                  : (Number.isFinite(anioGlobal)
                      ? `Año ${anioGlobal}: haz clic sobre una persona para ver qué territorios gobernaba entonces.`
                      : "Haz clic sobre una persona para ver los territorios que gobernó.")}
              </div>
            </section>
          )}
        </main>

        {mostrarBiografia && (
          <div
            className="workspace-resize-handle workspace-resize-handle-right"
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionar panel de biografía"
            tabIndex={0}
            onPointerDown={(event) => comenzarResizeLateral("biografia", event)}
            onDoubleClick={() => restablecerAnchoPanel("biografia")}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") { event.preventDefault(); ajustarAnchoPanel("biografia", 12); }
              if (event.key === "ArrowRight") { event.preventDefault(); ajustarAnchoPanel("biografia", -12); }
            }}
            title="Arrastra para cambiar el ancho · doble clic para restablecer"
          ><span /></div>
        )}

        {mostrarBiografia && (
        <aside className="workspace-inspector">
          <section className="panel workspace-fixed-panel workspace-bio-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title">Biografía</span>
              <span className="panel-count">{personaBio ? "1 personaje" : "ninguno"}</span>
            </div>
            <div className="panel-body workspace-panel-scroll workspace-bio-scroll">
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
                      <h3 className="bio-nombre">{nombrePrincipal(personaBio)}</h3>
                      {sobrenombreDePersona(personaBio) && <div className="bio-sobrenombre">«{sobrenombreDePersona(personaBio)}»</div>}
                      <span
                        className="badge"
                        style={{ background: ACCENTS[personaBio.dinastia] || ACCENTS[getCategoriaDinastía(personaBio.dinastia)] || "#71717A" }}
                      >
                        {personaBio.dinastia}
                      </span>
                    </div>
                    <div className="bio-head-actions">
                      <button
                        type="button"
                        className={`bio-favorite-btn${favoritosSet.has(personaBio.id) ? " active" : ""}`}
                        onClick={() => alternarFavorito(personaBio.id)}
                        title={favoritosSet.has(personaBio.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                        aria-label={favoritosSet.has(personaBio.id) ? `Quitar ${personaBio.nombre} de favoritos` : `Añadir ${personaBio.nombre} a favoritos`}
                      >★</button>
                      {!hovered && seleccion && (
                        <button type="button" className="close" aria-label="Cerrar biografía" onClick={cerrarSeleccion}><X size={14} /></button>
                      )}
                    </div>
                  </div>

                  {IMAGENES_PERSONAS[personaBio.id] && (() => {
                    const imagen = IMAGENES_PERSONAS[personaBio.id];
                    const objectPosition = imagen.encuadre || imagen.posicion || "50% 20%";
                    const zoom = Number.isFinite(imagen.zoom) && imagen.zoom > 0 ? imagen.zoom : 1;
                    return (
                      <figure className="bio-portrait-card">
                        <div className="bio-portrait-frame">
                          <img
                            className="bio-portrait-image"
                            src={imagen.archivo}
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

                  <BioSection
                    title="Datos y reinados"
                    open={bioSectionsOpen.datos}
                    onToggle={() => alternarSeccionBio("datos")}
                  >
                    <dl>
                      <dt>ID</dt><dd><code className="bio-id">{personaBio.id}</code></dd>
                      <dt>Territorio(s)</dt><dd>{(personaBio.reinos || []).join(", ") || "No indicado"}</dd>
                      {sobrenombreDePersona(personaBio) && <><dt>Sobrenombre</dt><dd>{sobrenombreDePersona(personaBio)}</dd></>}
                      {!!personaBio.aliases?.length && <><dt>Otros nombres</dt><dd>{personaBio.aliases.join(", ")}</dd></>}
                      <dt>Título</dt><dd>{personaBio.titulo}</dd>
                      <dt>Fechas</dt>
                      <dd>
                        {formatoFechas(personaBio)}
                        {siglosDePersona(personaBio).length > 0 && ` (s. ${siglosDePersona(personaBio).map((valor) => nRomano[valor] || valor).join("–")})`}
                      </dd>
                      {listaReinados(personaBio).map((reinado, index) => {
                        const tipo = etiquetaTipoReinado(reinado.tipo);
                        return (
                          <React.Fragment key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`}>
                            <dt>{etiquetaClaseGobierno(personaBio, reinado)} · {reinado.territorio}</dt>
                            <dd>{reinado.desde} – {reinado.hasta}{tipo ? ` (${tipo})` : ""}</dd>
                          </React.Fragment>
                        );
                      })}
                    </dl>
                  </BioSection>

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

                  <BioSection
                    title="Historias y contexto"
                    open={bioSectionsOpen.contexto}
                    onToggle={() => alternarSeccionBio("contexto")}
                  >
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
                  </BioSection>

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

        {mostrarCronologia && (
        <section className="workspace-bottom">
          <section className="panel timeline-panel">
            <div className="panel-head panel-head-static timeline-panel-head">
              <div className="timeline-title-group">
                <span className="panel-title">Línea temporal</span>
                <span className="panel-count">
                  {timelineMode === "eventos" ? `${totalEventosTimeline} eventos` : `${visiblePeople.length} personas${timelineMode === "ambos" ? ` · ${totalEventosTimeline} eventos` : ""}`}
                </span>
              </div>
              <div className="timeline-head-tools">
                <div className="timeline-mode-toggle" role="group" aria-label="Contenido de la línea temporal">
                  <button type="button" className={timelineMode === "personas" ? "active" : ""} onClick={() => setTimelineMode("personas")}>Personas</button>
                  <button type="button" className={timelineMode === "eventos" ? "active" : ""} onClick={() => setTimelineMode("eventos")}>Eventos</button>
                  <button type="button" className={timelineMode === "ambos" ? "active" : ""} onClick={() => setTimelineMode("ambos")}>Ambos</button>
                </div>
                <div className="timeline-zoom-controls" aria-label="Escala temporal">
                  <button type="button" disabled={timelineScaleIndex === 0} onClick={() => setTimelineScaleIndex((valor) => Math.max(0, valor - 1))} title="Reducir escala temporal"><ZoomOut size={12} /></button>
                  <span aria-hidden="true" className="timeline-zoom-divider" />
                  <button type="button" disabled={timelineScaleIndex === TIMELINE_SCALES.length - 1} onClick={() => setTimelineScaleIndex((valor) => Math.min(TIMELINE_SCALES.length - 1, valor + 1))} title="Ampliar escala temporal"><ZoomIn size={12} /></button>
                </div>
              </div>
            </div>
            <div className="panel-body timeline-panel-body">
              {eventoSeleccionado && (
                <div className="timeline-event-detail">
                  <div>
                    <span>{etiquetaFechaEvento(eventoSeleccionado)} · {eventoSeleccionado.categoria}</span>
                    <strong>{eventoSeleccionado.titulo}</strong>
                    <p>{eventoSeleccionado.descripcion}</p>
                    {!!eventoSeleccionado.personas?.length && (
                      <div className="timeline-event-people">
                        {eventoSeleccionado.personas.filter((id) => BY_ID[id]).map((id) => (
                          <a key={id} href={rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onClick={(event) => { event.preventDefault(); seleccionarPersonaPorId(id); }}>{BY_ID[id].nombre}</a>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" className="timeline-event-close" onClick={() => setEventoSeleccionadoId(null)} aria-label="Cerrar detalle del evento"><X size={13} /></button>
                </div>
              )}
              <div className="timeline-resizable">
                <div className="tl-scroll-container" ref={tlScrollRef}>
                  <div className="tl-content" style={{ minWidth: timelineContentWidth, width: timelineContentWidth }}>
                    <div className="tl-header">
                      <div className="tl-corner">{timelineMode === "eventos" ? "Acontecimiento" : "Personaje"}</div>
                      <div className="tl-axis">
                        {timelineTicks.map((valor) => (
                          <span key={valor} className="tl-tick" style={{ left: `${pct(valor)}%` }}>{valor}</span>
                        ))}
                        {Number.isFinite(anioGlobal) && (
                          <span className="tl-year-cursor tl-year-cursor-axis" style={{ left: `${pct(anioGlobal)}%` }}><span>{anioGlobal}</span></span>
                        )}
                      </div>
                    </div>

                    {timelineMode === "ambos" && (
                      <div className="tl-events-band" style={{ minHeight: timelineCombinedEvents.height }}>
                        <div className="tl-events-band-label" style={{ minHeight: timelineCombinedEvents.height }}>Eventos</div>
                        <div className="tl-events-band-track" style={{ minHeight: timelineCombinedEvents.height }}>
                          {timelineCombinedEvents.items.map(({ evento, nivel, esPeriodo, leftPx, durationPx, visualWidth, lane, mostrarTitulo, compacto }) => (
                            <button
                              type="button"
                              key={evento.id}
                              className={`tl-event-marker level-${nivel}${compacto ? " is-compact" : ""} cat-${evento.categoria}${eventoSeleccionadoId === evento.id ? " active" : ""}${esPeriodo ? " is-range" : " is-point"}`}
                              style={{
                                left: leftPx,
                                width: visualWidth,
                                top: 4 + lane * timelineCombinedEvents.laneHeight,
                              }}
                              onClick={() => seleccionarEvento(evento)}
                              title={`${etiquetaFechaEvento(evento)} · ${evento.titulo}`}
                              aria-label={`${etiquetaFechaEvento(evento)} · ${evento.titulo}`}
                            >
                              {mostrarTitulo && <span className="tl-event-marker-title">{evento.titulo}</span>}
                              {esPeriodo && (
                                <span
                                  className="tl-event-marker-duration"
                                  style={{ width: Math.min(durationPx, visualWidth) }}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          ))}
                          {Number.isFinite(anioGlobal) && <span className="tl-year-cursor" style={{ left: `${pct(anioGlobal)}%` }} aria-hidden="true" />}
                        </div>
                      </div>
                    )}

                    {timelineMode === "eventos" ? (
                      <div className="tl-list tl-event-list">
                        {eventosOrdenados.map((evento) => {
                          const inicio = inicioEvento(evento);
                          const fin = finEvento(evento);
                          const esPeriodo = Number.isFinite(evento.desde) && Number.isFinite(evento.hasta) && evento.hasta > evento.desde;
                          const activoEnAnio = Number.isFinite(anioGlobal) && anioGlobal >= inicio && anioGlobal <= fin;
                          return (
                            <div key={evento.id} className={`tl-row tl-event-row${eventoSeleccionadoId === evento.id ? " selected" : ""}${activoEnAnio ? " year-active" : ""}`} onClick={() => seleccionarEvento(evento)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); seleccionarEvento(evento); } }}>
                              <div className="tl-sticky-col">
                                <div className="name">{evento.titulo}</div>
                                <div className="meta">{etiquetaFechaEvento(evento)} · {evento.categoria}</div>
                              </div>
                              <div className="tl-track tl-event-track">
                                <span
                                  className={`tl-event-bar cat-${evento.categoria}${esPeriodo ? " is-range" : " is-point"}`}
                                  style={{ left: `${pct(inicio)}%`, width: esPeriodo ? `${Math.max((pct(fin) ?? 0) - (pct(inicio) ?? 0), 0.6)}%` : undefined }}
                                />
                                {Number.isFinite(anioGlobal) && <span className="tl-year-cursor" style={{ left: `${pct(anioGlobal)}%` }} aria-hidden="true" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="tl-list">
                        {visiblePeople
                          .slice()
                          .sort((a, b) => (anioInicioPersona(a) ?? Infinity) - (anioInicioPersona(b) ?? Infinity) || a.nombre.localeCompare(b.nombre, "es"))
                          .map((persona) => {
                            const inicio = anioInicioPersona(persona);
                            const fin = anioFinPersona(persona);
                            const tieneFecha = Number.isFinite(inicio) && Number.isFinite(fin);
                            const reinadosPersona = listaReinados(persona);
                            const trackHeight = Math.max(12, 12 + Math.max(0, reinadosPersona.length - 1) * 4);
                            const estadoAnio = Number.isFinite(anioGlobal) ? (estaVivaEn(persona, anioGlobal) ? " year-active" : " year-inactive") : "";
                            return (
                              <div
                                key={persona.id}
                                className={`tl-row ${seleccion?.id === persona.id ? "selected " : ""}${hovered === persona.id ? "hovered" : ""}${estadoAnio}${historiaPersonasSet.has(persona.id) ? " story-related" : ""}`}
                                onMouseEnter={() => setHovered(persona.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => seleccionarPersonaPorId(persona.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); seleccionarPersonaPorId(persona.id); } }}
                              >
                                <div className="tl-sticky-col">
                                  <div className="name">{persona.nombre}</div>
                                  <div className="meta">{persona.titulo} · {(persona.reinos || []).join(" · ")} · {persona.dinastia}</div>
                                </div>
                                <div className="tl-track" style={{ height: trackHeight }} ref={(element) => { if (element) tlBarRefs.current[persona.id] = element; else delete tlBarRefs.current[persona.id]; }}>
                                  {tieneFecha ? (
                                    <div className="tl-bar" style={{ left: `${pct(inicio)}%`, width: `${Math.max((pct(fin) ?? 0) - (pct(inicio) ?? 0), 0.35)}%`, backgroundColor: ACCENTS[persona.dinastia] || ACCENTS[getCategoriaDinastía(persona.dinastia)] || "#71717A" }} title={`${formatoFechas(persona)} (vida)`} />
                                  ) : <span className="tl-unknown">Fechas no precisadas</span>}
                                  {Number.isFinite(anioGlobal) && <span className="tl-year-cursor" style={{ left: `${pct(anioGlobal)}%` }} aria-hidden="true" />}
                                  {reinadosPersona.map((reinado, index) => {
                                    const tipo = etiquetaTipoReinado(reinado.tipo);
                                    const efectivo = reinadoEsEfectivo(reinado);
                                    return (
                                      <div key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`} className={`tl-bar-reinado${efectivo ? "" : " is-non-effective"}`} style={{ left: `${pct(reinado.desde)}%`, width: `${Math.max((pct(reinado.hasta) ?? 0) - (pct(reinado.desde) ?? 0), 0.35)}%`, top: 2 + index * 4, backgroundColor: REINO_COLOR[reinado.territorio] || ACCENTS[persona.dinastia] || ACCENTS[getCategoriaDinastía(persona.dinastia)] || "#71717A" }} title={`${reinado.territorio}: ${reinado.desde}–${reinado.hasta}${tipo ? ` (${tipo})` : ""}`} />
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
        )}
      </div>

      {!modoTrabajo && (
        <SiteFooter
          compact
          onOpenStats={() => setInfoProyecto("estadisticas")}
          onReport={() => setInfoProyecto("reportar")}
        />
      )}

      {historiaActiva && historiaPasoActual && (
        <aside className="story-guide" aria-live="polite">
          <div className="story-guide-head">
            <div>
              <span>Historia · paso {historiaPasoIndex + 1} de {historiaActiva.pasos.length}</span>
              <strong>{historiaActiva.titulo}</strong>
            </div>
            <button type="button" onClick={salirHistoria} aria-label="Salir del recorrido"><X size={14} /></button>
          </div>
          <div className="story-guide-year">{historiaPasoActual.anio}</div>
          <h3>{historiaPasoActual.titulo}</h3>
          <p>{historiaPasoActual.texto}</p>
          {!!historiaPasoActual.personas?.length && (
            <div className="story-guide-people">
              {historiaPasoActual.personas.filter((id) => BY_ID[id]).map((id) => <a key={id} href={rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onClick={(event) => { event.preventDefault(); seleccionarPersonaPorId(id); }}>{BY_ID[id].nombre}</a>)}
            </div>
          )}
          <div className="story-guide-actions">
            <button type="button" disabled={historiaPasoIndex === 0} onClick={() => cambiarPasoHistoria(-1)}><ArrowLeft size={13} /> Anterior</button>
            <button type="button" className="story-return-btn" onClick={() => aplicarPasoHistoria(historiaActiva, historiaPasoIndex)}>Volver al paso</button>
            {historiaPasoIndex < historiaActiva.pasos.length - 1 ? (
              <button type="button" className="story-next-btn" onClick={() => cambiarPasoHistoria(1)}>Continuar <ArrowRight size={13} /></button>
            ) : (
              <button type="button" className="story-next-btn" onClick={salirHistoria}>Terminar</button>
            )}
          </div>
        </aside>
      )}

      <ModalProyecto seccion={infoProyecto} onClose={() => setInfoProyecto(null)} persona={seleccion} personasVista={visiblePeople} onStartHistoria={iniciarHistoria} />
    </div>
  );
}
