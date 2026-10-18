import React from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {BY_ID} from '../../../domain/genealogy/relations.js';
import {MODOS_COMPARACION, tipoRelacionEntre} from '../../../domain/genealogy/relationshipGraph.js';

// Barra del modo comparación: origen, destino y rutas de parentesco.
export default function CompareBar({vm}) {
  const {comparePath, comparePaths, compareRouteIndex, destino, modoComparacion, origen, setCompareRouteIndex, setDestino, setOrigen} = vm;
  return (
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
  );
}
