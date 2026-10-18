import TreeExport from '../../connections/TreeExport.jsx';
import {ChevronDown, PanelsTopLeft, GitCompare, Star, CircleHelp, SlidersHorizontal, Crosshair, Share2, BarChart3, Maximize2} from 'lucide-react';
import HoldButton from '../../../ui/HoldButton.jsx';
import {BY_ID} from '../../../domain/genealogy/relations.js';
import SegmentedControl from '../../../ui/SegmentedControl.jsx';

const VIEW_OPTIONS = [{value:'arbol',label:'Árbol'},{value:'mapa',label:'Mapa'},{value:'ambos',label:'Árbol y mapa'}];

const SCENES=[{value:'atlas',label:'Atlas'},{value:'europa',label:'Europa en este año'}];

// Cabecera fija del Atlas: escena, vistas, paneles y herramientas.
export default function AtlasToolbar({vm, closeOtherToolbarMenus, guideButtonRef, mobileToolsOpen, onToolbarMenuToggle, panelsMenuRef, setGuideOpen, setMobileToolsOpen, toolsMenuRef, vistasAntesDeConectarRef}) {
  const {alternarFavorito, alternarPanelAuxiliar, atlasScene, centrarSeleccion, changeAtlasScene, compareMenuRef, compartirPersona, connectionIds, favoritos, favoritosMenuRef, favoritosOpen, getExportSelection, mode, modoTrabajo, mostrarArbol, mostrarBiografia, mostrarCronologia, mostrarFiltros, mostrarMapa, seleccion, seleccionarPersonaPorId, setCompareMenuOpen, setConnectionIds, setFavoritos, setFavoritosOpen, setFocoMenuOpen, setInfoProyecto, setMode, setModoTrabajo, setSoloFavoritos, setVistasActivas, shareStatus, soloFavoritos} = vm;
  return (
    <div className={`atlas-toolbar${atlasScene !== 'atlas' ? ' is-europa' : ''}`}>
        <div className="atlas-scene-switch"><SegmentedControl options={SCENES} value={atlasScene} onChange={changeAtlasScene} label="Modo de exploración"/></div>
        {!modoTrabajo && <button type="button" className="atlas-tools-toggle" aria-expanded={mobileToolsOpen} aria-controls="atlas-secondary-tools" onClick={()=>setMobileToolsOpen(open=>!open)}>Vistas y herramientas <ChevronDown size={12}/></button>}
        {!modoTrabajo && (
        <div id="atlas-secondary-tools" className={`workspace-topbar-secondary${mobileToolsOpen?' is-expanded':''}`} inert={atlasScene !== 'atlas' ? true : undefined}>
          <section className="workspace-topbar-section workspace-toolbar-view workspace-toolbar-panels">
            <SegmentedControl className="atlas-view-pills" label="Vista principal" options={VIEW_OPTIONS} value={mostrarArbol && mostrarMapa ? 'ambos' : mostrarMapa ? 'mapa' : 'arbol'} onChange={value=>setVistasActivas({arbol:value!=='mapa',mapa:value!=='arbol'})}/>
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
                {/* V5.21 · Comparar y Conectar son una sola herramienta: de dos a cinco personas. */}
                <button
                  type="button"
                  className={`nav-btn compare-main-btn ui-tip ${mode === "conexion" ? "active" : ""}`}
                  data-tip="Conectar personas"
                  aria-pressed={mode === "conexion"}
                  onClick={() => {
                    const entrar = mode !== "conexion";
                    setMode(entrar ? "conexion" : "view");
                    if (entrar) {
                      vistasAntesDeConectarRef.current = {arbol: mostrarArbol, mapa: mostrarMapa};
                      setVistasActivas({arbol: true, mapa: false});
                      if (!connectionIds.length && seleccion?.id) setConnectionIds([seleccion.id]);
                    } else if (vistasAntesDeConectarRef.current) setVistasActivas(vistasAntesDeConectarRef.current);
                    setCompareMenuOpen(false);
                    setFocoMenuOpen(false);
                  }}
                >
                  <GitCompare size={14} aria-hidden="true" /><span className="ui-sr-only">Conectar personas</span>
                </button>
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
  );
}
