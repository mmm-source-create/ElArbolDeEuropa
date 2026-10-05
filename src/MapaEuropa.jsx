import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import locationsSvgUrl from "../prototypes/euv-locations/euv-locations-crop.svg?url";
import locationsDataUrl from "../prototypes/euv-locations/corridor-locations.json?url";
import burgundianDataUrl from "../prototypes/euv-locations/burgundian-locations.json?url";
import { loadTextAsset, loadJsonAsset, forgetTextAsset } from "./utils/loadAsset.js";
import { mapLocationsForGovernment, pilotBurgundianGovernmentsFor, pilotDisputedHungarianClaimsFor, pilotImperialFrameFor, pilotLocationContext, pilotLocationsFor } from "./data/locationMapPilot.js";
import { buildPoliticalMapIndex, inspectMapRegion } from "./data/politicalMapIndex.js";
import { PERSONAS } from "./personas.jsx";
import {
  agrupacionesPoliticasEnMapa,
  colorTerritorioEnMapa,
  idsDeGobiernoEnAño,
  añoReferenciaTerritorial,
  listaReinados,
  reinadoEsEfectivo,
  reinadosActivos,
} from "./Territorios";

const MAP_ZOOM_FACTOR = 0.82;
const MAP_MIN_VISIBLE_RATIO = 0.015;
const MAP_PAN_STEP = 0.12;
const MAP_DRAG_THRESHOLD = 4;

function parseViewBox(svg) {
  const values = String(svg.getAttribute("viewBox") || "")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (values.length === 4 && values.every(Number.isFinite) && values[2] > 0 && values[3] > 0) {
    return { x: values[0], y: values[1], width: values[2], height: values[3] };
  }

  const width = Number.parseFloat(svg.getAttribute("width")) || 1200;
  const height = Number.parseFloat(svg.getAttribute("height")) || 680;
  return { x: 0, y: 0, width, height };
}

function clampViewBox(box, original, minVisibleRatio = MAP_MIN_VISIBLE_RATIO) {
  if (!original) return box;
  const aspect = original.width / original.height;
  const minWidth = original.width * minVisibleRatio;
  const requestedCenterX = box.x + box.width / 2;
  const requestedCenterY = box.y + box.height / 2;
  let width = Math.max(minWidth, Math.min(original.width, box.width));
  let height = width / aspect;

  if (height > original.height) {
    height = original.height;
    width = height * aspect;
  }

  const minX = original.x;
  const maxX = original.x + original.width - width;
  const minY = original.y;
  const maxY = original.y + original.height - height;
  const centeredX = requestedCenterX - width / 2;
  const centeredY = requestedCenterY - height / 2;

  return {
    x: Math.max(minX, Math.min(maxX, centeredX)),
    y: Math.max(minY, Math.min(maxY, centeredY)),
    width,
    height,
  };
}

function viewBoxString(box) {
  return `${box.x} ${box.y} ${box.width} ${box.height}`;
}

// El mapa solo reacciona al CLIC (a `seleccion`), no al hover. El movimiento
// y el zoom alteran únicamente el viewBox del SVG: no interfieren con el
// coloreado imperativo de los territorios.
export function MapaEuropa({ seleccion, anioGlobal = null, onSelectTerritorio, onSelectPersona, initialViewport = null, onViewportChange }) {
  // EU V Locations is the Atlas map. The old Provinces SVG remains only as
  // the geometric source for the migration crosswalk.
  const containerRef = useRef(null);
  const svgInyectadoRef = useRef(false);
  const pintadosRef = useRef(new Set());
  const originalViewBoxRef = useRef(null);
  const initialViewBoxRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [viewBox, setViewBox] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [pilotData, setPilotData] = useState(null);
  const mapAssetUrl = locationsSvgUrl;
  const politicalIndex = useMemo(() => selectedRegionId && Number.isInteger(anioGlobal)
    ? buildPoliticalMapIndex(PERSONAS, anioGlobal, pilotData) : new Map(), [selectedRegionId, anioGlobal, pilotData]);
  const inspectedRegion = selectedRegionId && Number.isInteger(anioGlobal)
    ? inspectMapRegion(selectedRegionId, anioGlobal, politicalIndex, pilotData) : null;
  const pilotContext = selectedRegionId && Number.isInteger(anioGlobal)
    ? pilotLocationContext(pilotData, selectedRegionId, anioGlobal, seleccion?.id) : [];
  const selectedPersonEntries = inspectedRegion?.entries.filter(entry => entry.person?.id === seleccion?.id) || [];
  const otherRegionEntries = inspectedRegion?.entries.filter(entry => entry.person?.id !== seleccion?.id) || [];
  const activeGroups = seleccion && Number.isFinite(anioGlobal)
    ? agrupacionesPoliticasEnMapa(seleccion, anioGlobal) : [];
  const hasImperialOffice = Boolean(seleccion && Number.isFinite(anioGlobal)
    && reinadosActivos(seleccion, anioGlobal, { soloEfectivos: true })
      .some((gobierno) => gobierno.territorio === 'Sacro Imperio'));
  const imperialReferenceActive = hasImperialOffice && Number.isInteger(anioGlobal)
    && pilotImperialFrameFor(pilotData, anioGlobal).length > 0;

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    svgInyectadoRef.current = false;
    setMapReady(false);
    setMapError(false);
    setPilotData(null);
    setSelectedRegionId(null);
    Promise.all([loadTextAsset(mapAssetUrl), loadJsonAsset(locationsDataUrl),
      loadJsonAsset(burgundianDataUrl)]).then(([mapSvgContent, locationData, burgundianData]) => {
    if (cancelled || !containerRef.current) return;
    containerRef.current.innerHTML = mapSvgContent;
    svgInyectadoRef.current = true;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) {
      svgInyectadoRef.current = false;
      forgetTextAsset(mapAssetUrl);
      throw new Error("Mapa no válido");
    }

    const original = parseViewBox(svg);
    // Reuse saved views only when their coordinates belong to the cropped map;
    // old world-map viewports fall back to the new Europe-first framing.
    const paddingX = original.width * 0.05;
    const paddingY = original.height * 0.05;
    const savedViewFits = initialViewport
      && Number.isFinite(initialViewport.x) && Number.isFinite(initialViewport.y)
      && Number.isFinite(initialViewport.width) && Number.isFinite(initialViewport.height)
      && initialViewport.width > 0 && initialViewport.height > 0
      && initialViewport.x >= original.x - paddingX
      && initialViewport.y >= original.y - paddingY
      && initialViewport.x + initialViewport.width <= original.x + original.width + paddingX
      && initialViewport.y + initialViewport.height <= original.y + original.height + paddingY;
    const restored = savedViewFits ? clampViewBox(initialViewport, original) : original;
    originalViewBoxRef.current = original;
    initialViewBoxRef.current = original;

    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.transform = "none";
    svg.setAttribute("viewBox", viewBoxString(restored));
    setViewBox(restored);
    setPilotData(locationData ? { ...locationData, burgundy: burgundianData } : null);
    setMapReady(true);
    }).catch(() => { if (!cancelled) setMapError(true); });
    return () => { cancelled = true; };
  }, [mapAssetUrl, mapAttempt]);

  useEffect(() => {
    if (viewBox) onViewportChange?.(viewBox);
  }, [viewBox, onViewportChange]);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg || !viewBox) return;
    svg.setAttribute("viewBox", viewBoxString(viewBox));
  }, [viewBox]);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg || !pilotData) return;

    const buscarElemento = (id) => {
      if (!id) return null;
      try {
        return svg.querySelector(`[id="${CSS.escape(id)}"]`) ||
               svg.querySelector(`[id="${id.toLowerCase()}"]`) ||
               svg.querySelector(`[title="${id}"]`) ||
               svg.querySelector(`[data-name="${id}"]`);
      } catch {
        return svg.getElementById(id);
      }
    };

    try {
      pintadosRef.current.forEach((id) => {
        const target = buscarElemento(id);
        if (!target) return;
        target.style.removeProperty("fill");
        target.style.removeProperty("stroke");
        target.style.removeProperty("stroke-width");
      });
      pintadosRef.current = new Set();

      if (imperialReferenceActive) {
        pilotImperialFrameFor(pilotData, anioGlobal).forEach((id) => {
          const target = buscarElemento(id);
          if (!target) return;
          target.style.setProperty('fill', '#a49b8e', 'important');
          target.style.setProperty('stroke', '#a49b8e', 'important');
          pintadosRef.current.add(id);
        });
      }

      if (seleccion) {
        const reinadosDetallados = listaReinados(seleccion).filter(reinadoEsEfectivo);
        const entradas = reinadosDetallados.length
          ? (Number.isFinite(anioGlobal)
              ? reinadosActivos(seleccion, anioGlobal, { soloEfectivos: true })
              : reinadosDetallados)
          : (seleccion.gobernante === true
              ? (seleccion.reinos || []).map((territorio) => ({
                  territorio,
                  desde: añoReferenciaTerritorial(seleccion, territorio),
                  hasta: añoReferenciaTerritorial(seleccion, territorio),
                }))
              : []);

        const porTerritorio = new Map();
        entradas.forEach((entrada) => {
          if (!entrada?.territorio) return;
          const anterior = porTerritorio.get(entrada.territorio);
          if (!anterior || entrada.hasta >= anterior.hasta) porTerritorio.set(entrada.territorio, entrada);
        });

        porTerritorio.forEach((entrada, reino) => {
          const año = Number.isFinite(anioGlobal)
            ? anioGlobal
            : añoReferenciaTerritorial(seleccion, reino);
          const color = colorTerritorioEnMapa(seleccion, reino, año);
          // Una ficha con ámbito de rama no colorea todo el archiducado.
          const legacyIds = idsDeGobiernoEnAño(entrada, año, seleccion.id);
          const ids = reino === 'Austria' && entrada.ambito?.includes('Austria Interior')
            ? [...pilotLocationsFor(pilotData, 'Austria Interior', año, seleccion.id),
              ...(año >= 1619 ? pilotLocationsFor(pilotData, 'Austria', año, seleccion.id) : [])]
            : mapLocationsForGovernment(pilotData, entrada, año, seleccion.id, legacyIds);
          ids.forEach((id) => {
            const target = buscarElemento(id);
            if (!target) return;
            target.style.setProperty("fill", color, "important");
            target.style.setProperty("stroke", color, "important");
            pintadosRef.current.add(id);
          });
        });
        pilotDisputedHungarianClaimsFor(pilotData, seleccion.id, anioGlobal).forEach(claim => {
          claim.ids.forEach(id => {
            const target = buscarElemento(id);
            if (!target) return;
            target.style.setProperty('fill', claim.color, 'important');
            target.style.setProperty('stroke', claim.color, 'important');
            pintadosRef.current.add(id);
          });
        });
        pilotBurgundianGovernmentsFor(pilotData, seleccion.id, anioGlobal).forEach(government => {
          const color = government.condition === 'regencia' ? '#907085'
            : colorTerritorioEnMapa(seleccion, 'Flandes', anioGlobal);
          government.ids.forEach(id => {
            const target = buscarElemento(id);
            if (!target) return;
            target.style.setProperty('fill', color, 'important');
            target.style.setProperty('stroke', color, 'important');
            pintadosRef.current.add(id);
          });
        });
      }
    } catch (error) {
      console.error("[MapaEuropa] Error al renderizar:", error);
    }
  }, [seleccion, anioGlobal, mapReady, imperialReferenceActive, pilotData]);

  const updateViewBox = useCallback((producer) => {
    setViewBox((current) => {
      if (!current || !originalViewBoxRef.current) return current;
      return clampViewBox(producer(current), originalViewBoxRef.current);
    });
  }, []);

  const zoomBy = useCallback((factor) => {
    setViewBox((current) => {
      const original = originalViewBoxRef.current;
      if (!current || !original) return current;
      const minWidth = original.width * MAP_MIN_VISIBLE_RATIO;
      const targetWidth = Math.max(minWidth, Math.min(original.width, current.width * factor));
      if (Math.abs(targetWidth - current.width) < 0.0001) return current;
      const aspect = original.width / original.height;
      const targetHeight = targetWidth / aspect;
      const centerX = current.x + current.width / 2;
      const centerY = current.y + current.height / 2;
      return clampViewBox({
        x: centerX - targetWidth / 2,
        y: centerY - targetHeight / 2,
        width: targetWidth,
        height: targetHeight,
      }, original);
    });
  }, []);

  const panBy = useCallback((xRatio, yRatio) => {
    updateViewBox((current) => ({
      ...current,
      x: current.x + current.width * xRatio,
      y: current.y + current.height * yRatio,
    }));
  }, [updateViewBox]);

  const resetView = useCallback(() => {
    if (initialViewBoxRef.current) setViewBox({ ...initialViewBoxRef.current });
  }, []);

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.target.closest(".mapa-toolbar")) return;
    if (!viewBox) return;

    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect,
      viewBox: { ...viewBox },
      moved: false,
    };
    suppressClickRef.current = false;
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !originalViewBoxRef.current) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) >= MAP_DRAG_THRESHOLD) {
      drag.moved = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    if (!drag.moved) return;

    const next = {
      ...drag.viewBox,
      x: drag.viewBox.x - deltaX * (drag.viewBox.width / Math.max(1, drag.rect.width)),
      y: drag.viewBox.y - deltaY * (drag.viewBox.height / Math.max(1, drag.rect.height)),
    };
    setViewBox(clampViewBox(next, originalViewBoxRef.current));
  };

  const selectRegionAt = (target) => {
    const path = target?.closest?.("path[id], polygon[id]");
    if (!path || !containerRef.current?.contains(path)) return;
    setSelectedRegionId(path.id);
    onSelectTerritorio?.(path.id);
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClick = (event) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    selectRegionAt(event.target);
  };

  // El SVG se inserta como contenido externo. Sus paths no son elementos
  // creados por React, así que los gestos se escuchan en el DOM nativo.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.addEventListener('pointerdown', handlePointerDown);
    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerup', finishPointer);
    node.addEventListener('pointercancel', finishPointer);
    node.addEventListener('click', handleClick);
    return () => {
      node.removeEventListener('pointerdown', handlePointerDown);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerup', finishPointer);
      node.removeEventListener('pointercancel', finishPointer);
      node.removeEventListener('click', handleClick);
    };
  }, [viewBox, onSelectTerritorio]);

  return (
    <div className="mapa-stage">
      {!mapReady && <div role={mapError ? "alert" : "status"} style={{ position: "absolute", inset: "50% 0 auto", textAlign: "center", zIndex: 2 }}>
        {mapError ? <>No se ha podido cargar el mapa. <button className="nav-btn" onClick={() => setMapAttempt(n => n + 1)}>Reintentar</button></> : "Cargando mapa…"}
      </div>}
      <div className="mapa-toolbar" aria-label="Controles del mapa">
        <button type="button" className="nav-btn" onClick={() => zoomBy(1 / MAP_ZOOM_FACTOR)} title="Alejar mapa" aria-label="Alejar mapa"><ZoomOut size={13} /></button>
        <button type="button" className="nav-btn" onClick={resetView} title="Volver a Europa" aria-label="Volver a Europa"><RotateCcw size={12} /></button>
        <button type="button" className="nav-btn" onClick={() => zoomBy(MAP_ZOOM_FACTOR)} title="Acercar mapa" aria-label="Acercar mapa"><ZoomIn size={13} /></button>
        <span className="mapa-toolbar-separator" aria-hidden="true" />
        <button type="button" className="nav-btn" onClick={() => panBy(-MAP_PAN_STEP, 0)} title="Mover mapa a la izquierda" aria-label="Mover mapa a la izquierda"><ArrowLeft size={13} /></button>
        <button type="button" className="nav-btn" onClick={() => panBy(0, -MAP_PAN_STEP)} title="Mover mapa hacia arriba" aria-label="Mover mapa hacia arriba"><ArrowUp size={13} /></button>
        <button type="button" className="nav-btn" onClick={() => panBy(0, MAP_PAN_STEP)} title="Mover mapa hacia abajo" aria-label="Mover mapa hacia abajo"><ArrowDown size={13} /></button>
        <button type="button" className="nav-btn" onClick={() => panBy(MAP_PAN_STEP, 0)} title="Mover mapa a la derecha" aria-label="Mover mapa a la derecha"><ArrowRight size={13} /></button>
      </div>
      {seleccion && <details className="mapa-color-legend">
        <summary>¿Por qué estos colores?</summary>
        <p>El mapa detallado destaca los gobiernos de la persona seleccionada. El gris no significa ausencia de gobierno: indica que esa región no tiene una atribución revisada para la persona y el año elegidos. Las locations modernas aproximan territorios históricos y no prueban por sí solas una frontera.</p>
        {imperialReferenceActive && <p>El gris medio señala una aproximación al ámbito jurídico del Sacro Imperio, no tierras gobernadas directamente por el emperador ni todos los círculos imperiales. <a href="https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:map-2809" target="_blank" rel="noreferrer">Fuente cartográfica</a>.</p>}
        {hasImperialOffice && !imperialReferenceActive && <p>El marco imperial no está reconstruido para este año. Solo se colorean los gobiernos territoriales documentados de la persona.</p>}
        {Number.isFinite(anioGlobal) ? (
          activeGroups.length ? activeGroups.map(grupo => <div className="mapa-color-legend-item" key={grupo.id}>
            <span className="mapa-color-swatch" style={{ backgroundColor: grupo.color }} aria-hidden="true" />
            <div><strong>{grupo.nombre}</strong><p>{grupo.nota} {grupo.fuente && <a href={grupo.fuente} target="_blank" rel="noreferrer">Fuente</a>}</p></div>
          </div>) : <p>Los colores corresponden a los territorios gobernados por esta persona en {anioGlobal}; no indican que todos formasen un único Estado.</p>
        ) : <p>Elige un año para distinguir los conjuntos políticos de cada etapa. Sin año, el mapa reúne los gobiernos de toda la vida de esta persona.</p>}
      </details>}

      <div
        ref={containerRef}
        className="mapa-wrapper"
        role="application"
        tabIndex={0}
        aria-label="Mapa histórico interactivo de territorios europeos; arrastra para moverlo"
      />
      {selectedRegionId && <aside className="mapa-region-inspector" aria-label={`Información histórica de ${selectedRegionId.replaceAll('_',' ')}`}>
        <div className="mapa-region-inspector-head"><div><small>Location del mapa · {Number.isInteger(anioGlobal) ? anioGlobal : 'sin año'}</small><h3>{selectedRegionId.replaceAll('_',' ')}</h3></div><button type="button" onClick={() => setSelectedRegionId(null)} aria-label="Cerrar información de la location"><X size={16}/></button></div>
        <p className="mapa-region-precision">{inspectedRegion?.precision || 'Las locations modernas aproximan regiones históricas; no prueban por sí solas una frontera.'}</p>
        {!Number.isInteger(anioGlobal) ? <p>Elige un año para consultar quién gobernaba esta región y revisar las fuentes.</p> : <>
          {inspectedRegion?.entries.length > 0 && <ul>{inspectedRegion.entries.map((entry, index) => <li key={`${entry.territory}-${entry.person?.id || 'collective'}-${index}`}>
            <strong>{entry.territory}</strong>
            <div>{entry.person ? <button type="button" className="mapa-region-person" onClick={() => onSelectPersona?.(entry.person.id)}>{entry.person.nombre}</button> : entry.collective?.nombre}</div>
            {entry.government && <small>{entry.government.titulo} · {entry.government.condicion} · {entry.government.desde}–{entry.government.hasta}</small>}
            {entry.claim?.sources?.length ? entry.claim.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}{source.locator ? ` · ${source.locator}` : ''}</a>) : <small className="mapa-region-unsourced">Sin fuente específica para esta afirmación.</small>}
          </li>)}</ul>}
          {pilotContext.length > 0 ? <ul>{pilotContext.map(entry => <li key={`${entry.name}-${entry.corridor}`}>
          <strong>{entry.name}</strong><div>{entry.corridor}</div>
          {entry.note && <p>{entry.note}</p>}
          {entry.activeReason && <p>{entry.activeReason}</p>}
          {entry.source && <a href={entry.source} target="_blank" rel="noreferrer">Fuente histórica de la capa</a>}
          {entry.correction && <><p>{entry.correction.reason}</p><a href={entry.correction.source} target="_blank" rel="noreferrer">Fuente de la corrección</a></>}
        </li>)}</ul> : inspectedRegion?.entries.length ? null : <p>Esta location no está atribuida a una jurisdicción revisada para este año. No se infiere por ello quién la gobernaba.</p>}
        </>}
      </aside>}
    </div>
  );
}
