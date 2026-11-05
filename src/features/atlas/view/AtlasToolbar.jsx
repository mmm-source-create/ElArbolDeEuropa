import TreeExport from '../../connections/TreeExport.jsx';
import {ChevronDown, PanelsTopLeft, GitCompare, Star, CircleHelp, SlidersHorizontal, Crosshair, Share2, BarChart3, Maximize2} from 'lucide-react';
import HoldButton from '../../../ui/HoldButton.jsx';
import {BY_ID} from '../../../domain/genealogy/relations.js';
import SegmentedControl from '../../../ui/SegmentedControl.jsx';

// Cabecera fija del Atlas: escena, vistas, paneles y herramientas.
export default function AtlasToolbar({vm, closeOtherToolbarMenus, guideButtonRef, mobileToolsOpen, onToolbarMenuToggle, panelsMenuRef, setGuideOpen, setMobileToolsOpen, toolsMenuRef, vistasAntesDeConectarRef}) {
  const {alternarFavorito, alternarPanelAuxiliar, atlasScene, centrarSeleccion, changeAtlasScene, compareMenuRef, compartirPersona, connectionIds, favoritos, favoritosMenuRef, favoritosOpen, getExportSelection, locale, mode, modoTrabajo, mostrarArbol, mostrarBiografia, mostrarCronologia, mostrarFiltros, mostrarMapa, seleccion, seleccionarPersonaPorId, setCompareMenuOpen, setConnectionIds, setFavoritos, setFavoritosOpen, setFocoMenuOpen, setInfoProyecto, setMode, setModoTrabajo, setSoloFavoritos, setVistasActivas, shareStatus, soloFavoritos} = vm;
  const en=locale==='en';
  const viewOptions=[{value:'arbol',label:en?'Tree':'Árbol'},{value:'mapa',label:en?'Map':'Mapa'},{value:'ambos',label:en?'Tree and map':'Árbol y mapa'}];
  const scenes=[{value:'atlas',label:'Atlas'},{value:'europa',label:en?'Europe in this year':'Europa en este año'}];
  return (
    <div className={`atlas-toolbar${atlasScene !== 'atlas' ? ' is-europa' : ''}`}>
        <div className="atlas-scene-switch"><SegmentedControl options={scenes} value={atlasScene} onChange={changeAtlasScene} label={en?'Exploration mode':'Modo de exploración'}/></div>
        {!modoTrabajo && <button type="button" className="atlas-tools-toggle" aria-expanded={mobileToolsOpen} aria-controls="atlas-secondary-tools" onClick={()=>setMobileToolsOpen(open=>!open)}>{en?'Views and tools':'Vistas y herramientas'} <ChevronDown size={12}/></button>}
        {!modoTrabajo && (
        <div id="atlas-secondary-tools" className={`workspace-topbar-secondary${mobileToolsOpen?' is-expanded':''}`} inert={atlasScene !== 'atlas' ? true : undefined}>
          <section className="workspace-topbar-section workspace-toolbar-view workspace-toolbar-panels">
            <SegmentedControl className="atlas-view-pills" label={en?'Main view':'Vista principal'} options={viewOptions} value={mostrarArbol && mostrarMapa ? 'ambos' : mostrarMapa ? 'mapa' : 'arbol'} onChange={value=>setVistasActivas({arbol:value!=='mapa',mapa:value!=='arbol'})}/>
            <details ref={panelsMenuRef} className="atlas-toolbar-menu atlas-panels-menu" onToggle={onToolbarMenuToggle}>
              <summary className="ui-tip" data-tip={en?'Panels':'Paneles'}><PanelsTopLeft size={14} aria-hidden="true" /><span className="ui-sr-only">{en?'Panels':'Paneles'}</span></summary>
              <div className="atlas-toolbar-menu-panel" role="group" aria-label={en?'Visible panels':'Paneles visibles'}>
                <button type="button" aria-pressed={mostrarFiltros && !vm.historiaActiva} disabled={Boolean(vm.historiaActiva)} title={vm.historiaActiva ? (en?'Close the story to open filters':"Cierra la historia para abrir los filtros") : undefined} onClick={() => alternarPanelAuxiliar('filtros')}>{en?'Filters':'Filtros'}</button>
                <button type="button" aria-pressed={mostrarBiografia} onClick={() => alternarPanelAuxiliar('biografia')}>{en?'Biography':'Biografía'}</button>
                <button type="button" aria-pressed={mostrarCronologia} onClick={() => alternarPanelAuxiliar('cronologia')}>{en?'Timeline':'Cronología'}</button>
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
                  data-tip={en?'Connect people':'Conectar personas'}
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
                  <GitCompare size={14} aria-hidden="true" /><span className="ui-sr-only">{en?'Connect people':'Conectar personas'}</span>
                </button>
              </div>
              <div className="favorites-control" ref={favoritosMenuRef}>
                <button type="button" className={`nav-btn favorites-trigger ui-tip${favoritosOpen || soloFavoritos ? " active" : ""}`} data-tip={en?'Favourites':'Favoritos'} onClick={() => { closeOtherToolbarMenus(); setCompareMenuOpen(false); setFavoritosOpen((actual) => !actual); }} aria-expanded={favoritosOpen}>
                  <Star size={14} aria-hidden="true" className="favorite-star-symbol"/><span className="ui-sr-only">{en?'Favourites':'Favoritos'}</span>{favoritos.length ? <span key={favoritos.length} className="favorites-count ui-count-bump" aria-label={`${favoritos.length} ${en?'saved':'guardados'}`}>{favoritos.length}</span> : null}
                </button>
                {favoritosOpen && (
                  <div className="favorites-menu" role="group">
                    <div className="favorites-menu-head"><strong>{en?'My favourites':'Mis favoritos'}</strong><span>{favoritos.length}</span></div>
                    <div className="favorites-menu-list">
                      {favoritos.length ? favoritos.map((id) => (
                        <div key={id} className="favorite-menu-row">
                          <button type="button" onClick={() => { seleccionarPersonaPorId(id); setFavoritosOpen(false); }}>{BY_ID[id]?.nombre || id}</button>
                          <button type="button" className="favorite-remove" onClick={() => alternarFavorito(id)} title={en?'Remove from favourites':'Quitar de favoritos'} aria-label={en?`Remove ${BY_ID[id]?.nombre || id} from favourites`:`Quitar ${BY_ID[id]?.nombre || id} de favoritos`}>×</button>
                        </div>
                      )) : <div className="favorites-empty">{en?'Mark a record with ★ to save it here.':'Marca una ficha con ★ para guardarla aquí.'}</div>}
                    </div>
                    {favoritos.length > 1 && <div className="favorites-clear"><HoldButton label={en?'Press and hold to clear all favourites':'Mantén pulsado para borrar todos los favoritos'} onConfirm={() => { setFavoritos([]); setSoloFavoritos(false); }}>{en?'Hold to clear all':'Mantén para borrar todos'}</HoldButton></div>}
                    <label className={`favorites-filter-toggle${favoritos.length ? "" : " is-disabled"}`}>
                      <input type="checkbox" checked={soloFavoritos} disabled={!favoritos.length} onChange={(event) => setSoloFavoritos(event.target.checked)} />
                      <span>{en?'Show favourites only':'Mostrar solo favoritos'}</span>
                    </label>
                  </div>
                )}
              </div>
              <button type="button" className="nav-btn ui-tip" data-tip={en?'Help and guide':'Ayuda y guía'} ref={guideButtonRef} onClick={() => { if (toolsMenuRef.current) toolsMenuRef.current.open = false; setGuideOpen(true); }}><CircleHelp size={14} aria-hidden="true" /><span className="ui-sr-only">{en?'Help':'Ayuda'}</span></button>
              <details ref={toolsMenuRef} className="atlas-toolbar-menu atlas-tools-menu" onToggle={onToolbarMenuToggle}>
                <summary className="ui-tip" data-tip={en?'Tools':'Herramientas'}><SlidersHorizontal size={14} aria-hidden="true" /><span className="ui-sr-only">{en?'Tools':'Herramientas'}</span></summary>
                <div className="atlas-toolbar-menu-panel" role="group" aria-label={en?'Atlas tools':'Herramientas del Atlas'}>
                  <strong>{en?'Selected person':'Persona seleccionada'}</strong>
                  <button type="button" disabled={!seleccion} onClick={centrarSeleccion}><Crosshair size={13} /> {en?'Centre person':'Centrar persona'}</button>
                  <button type="button" disabled={!seleccion} onClick={compartirPersona}><Share2 size={13} /> {en?'Share person':'Compartir persona'}</button>
                  {shareStatus && <span className="share-status" role="status">{shareStatus}</span>}
                  <strong>{en?'Output':'Salida'}</strong>
                  <TreeExport getSelection={getExportSelection} label={en?'Export tree':'Exportar árbol'} locale={locale} />
                  <button type="button" onClick={() => setInfoProyecto('cobertura')}><BarChart3 size={13} /> {en?'Documentary coverage':'Cobertura documental'}</button>
                  <button type="button" onClick={() => setModoTrabajo(true)}><Maximize2 size={13} /> {en?'Work screen':'Pantalla de trabajo'}</button>
                </div>
              </details>
            </div>
          </section>
        </div>
        )}
      </div>
  );
}
