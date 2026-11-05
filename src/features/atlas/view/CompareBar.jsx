import React from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {BY_ID} from '../../../domain/genealogy/relations.js';
import {MODOS_COMPARACION, tipoRelacionEntre} from '../../../domain/genealogy/relationshipGraph.js';

// Barra del modo comparación: origen, destino y rutas de parentesco.
export default function CompareBar({vm}) {
  const {comparePath, comparePaths, compareRouteIndex, destino, locale, modoComparacion, origen, setCompareRouteIndex, setDestino, setOrigen} = vm;
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const modeLabel={corto:'Shortest path',sangre:'Blood relations only',matrimonio:'Blood relations and marriages',rutas:'Relevant paths'};
  const relation=value=>en?({'padre':'father','madre':'mother','hijo':'child','hija':'child','cónyuge':'spouse','amante':'lover','pariente':'relative'}[value]||value):value;
  return (
    <div className="compare-bar workspace-mode-bar">
          <span className="compare-mode-label">
            {en?(modeLabel[modoComparacion]||'Comparison'):(MODOS_COMPARACION.find((opcion) => opcion.id === modoComparacion)?.label || "Comparación")}
          </span>
          <span>{tr('Origen','Start')}: <b>{origen ? BY_ID[origen]?.nombre : tr('haz clic en una persona','select a person')}</b></span>
          <span>{tr('Destino','End')}: <b>{destino ? BY_ID[destino]?.nombre : tr('luego en otra','then select another')}</b></span>
          {comparePath && (
            <span className="compare-path" style={{ marginLeft: "auto" }}>
              {comparePath.map((id, index) => (
                <React.Fragment key={`${id}-${index}`}>
                  {index > 0 && <span className="compare-edge"> —{relation(tipoRelacionEntre(comparePath[index - 1], id))}→ </span>}
                  <span>{BY_ID[id]?.nombre || id}</span>
                </React.Fragment>
              ))}
            </span>
          )}
          {comparePaths.length > 1 && (
            <div className="compare-route-switcher" aria-label={tr('Cambiar ruta de parentesco','Change kinship route')}>
              <button
                type="button"
                onClick={() => setCompareRouteIndex((actual) => (actual - 1 + comparePaths.length) % comparePaths.length)}
                aria-label={tr('Ruta anterior','Previous route')}
              >
                <ArrowLeft size={11} />
              </button>
              <span>{Math.min(compareRouteIndex, comparePaths.length - 1) + 1} / {comparePaths.length}</span>
              <button
                type="button"
                onClick={() => setCompareRouteIndex((actual) => (actual + 1) % comparePaths.length)}
                aria-label={tr('Ruta siguiente','Next route')}
              >
                <ArrowRight size={11} />
              </button>
            </div>
          )}
          {origen && destino && !comparePath && (
            <span style={{ marginLeft: "auto" }}>{tr('No hay un camino documentado con este criterio.','No documented path matches this criterion.')}</span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => { setOrigen(null); setDestino(null); setCompareRouteIndex(0); }}>{tr('reiniciar','reset')}</button>
        </div>
  );
}
