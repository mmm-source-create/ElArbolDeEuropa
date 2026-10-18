import AtlasGrowth from '../AtlasGrowth.jsx';
import TreeExport from '../../connections/TreeExport.jsx';
import {List, ZoomOut, RotateCcw, ZoomIn} from 'lucide-react';
import {PERSONAS} from '../../../data/personas.js';
import {ACCENTS} from '../atlasModel.js';
import {getCategoriaDinastía} from '../../../domain/genealogy/dynasties.js';
import TreeAccessibleList from '../TreeAccessibleList.jsx';

// Lienzo del árbol con minimapa, zoom y lista accesible.
export default function AtlasTreeStage({vm, setGuideOpen, setTreeListOpen, treeListOpen}) {
  const {anioGlobal, cambiarZoomArbol, canvasSize, collapsedIds, connectorLayerKey, connectors, endDrag, getExportSelection, hiddenByCollapse, historiaActiva, miniScaleX, miniScaleY, mode, modoTrabajo, mostrarMapa, onMinimapClick, onPointerDown, onPointerMove, positions, renderPersonBox, renderedTreeUnits, scrollBy, scrollRef, seleccion, seleccionarPersonaPorId, setCollapsedIds, visiblePeople, zoom} = vm;
  return (
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
  );
}
