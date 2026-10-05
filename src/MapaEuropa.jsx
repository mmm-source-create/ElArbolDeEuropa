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
import { clampMapViewBox, clipMapToBounds, fittedMapViewBox, mapControlLimits, resizeMapViewBox, zoomMapViewBox } from "./mapViewport.js";
import { mapLocationsForGovernment, pilotImperialFrameFor, pilotLocationContext, pilotLocationsFor } from "./data/locationMapPilot.js";
import { buildPoliticalMapIndex, inspectMapRegion } from "./data/politicalMapIndex.js";
import { AUTHORITY_LABELS, mapAuthoritiesForPerson } from "./data/mapAuthorities.js";
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
const MAP_MIN_ZOOM = 0.015;
const MAP_PAN_STEP = 0.12;
const MAP_DRAG_THRESHOLD = 4;

function authorityFill(svg, color, kind) {
  if (!['delegated', 'disputed'].includes(kind)) return color;
  const namespace = 'http://www.w3.org/2000/svg';
  const id = `atlas-${kind}-${color.replace(/[^a-z0-9]/gi, '')}`;
  if (!svg.getElementById(id)) {
    const defs = svg.querySelector('#map defs') || svg.querySelector('defs');
    const pattern = document.createElementNS(namespace, 'pattern');
    pattern.setAttribute('id', id);
    pattern.setAttribute('width', '0.9');
    pattern.setAttribute('height', '0.9');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    const rect = document.createElementNS(namespace, 'rect');
    rect.setAttribute('width', '0.9'); rect.setAttribute('height', '0.9'); rect.setAttribute('fill', color);
    const line = document.createElementNS(namespace, 'path');
    line.setAttribute('d', kind === 'delegated' ? 'M0 0 L.9 .9' : 'M0 0 L.9 .9 M0 .9 L.9 0');
    line.setAttribute('stroke', '#fff'); line.setAttribute('stroke-opacity', '.5'); line.setAttribute('stroke-width', '.16');
    pattern.append(rect, line); defs?.append(pattern);
  }
  return `url(#${id})`;
}

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
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [viewBox, setViewBox] = useState(null);
  const [originalMapFrame, setOriginalMapFrame] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [pilotData, setPilotData] = useState(null);
  const controlLimits = mapControlLimits(viewBox, originalMapFrame, viewportRef.current, MAP_MIN_ZOOM);
  const mapAssetUrl = locationsSvgUrl;
  const politicalIndex = useMemo(() => selectedRegionId && Number.isInteger(anioGlobal)
    ? buildPoliticalMapIndex(PERSONAS, anioGlobal, pilotData, {includeClaims: true}) : new Map(), [selectedRegionId, anioGlobal, pilotData]);
  const inspectedRegion = selectedRegionId && Number.isInteger(anioGlobal)
    ? inspectMapRegion(selectedRegionId, anioGlobal, politicalIndex, pilotData) : null;
  const pilotContext = selectedRegionId && Number.isInteger(anioGlobal)
    ? pilotLocationContext(pilotData, selectedRegionId, anioGlobal, seleccion?.id) : [];
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
    originalViewBoxRef.current = null;
    initialViewBoxRef.current = null;
    viewportRef.current = null;
    setViewBox(null);
    setOriginalMapFrame(null);
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
    const bounds = containerRef.current.getBoundingClientRect();
    const viewport = { width: bounds.width || original.width, height: bounds.height || original.height };
    const fitted = fittedMapViewBox(original, viewport);
    const restored = savedViewFits
      ? clampMapViewBox(initialViewport, original, viewport, MAP_MIN_ZOOM)
      : fitted;
    originalViewBoxRef.current = original;
    setOriginalMapFrame(original);
    initialViewBoxRef.current = fitted;
    viewportRef.current = viewport;

    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.transform = "none";
    svg.style.backgroundColor = "var(--atlas-sea)";
    svg.querySelector("#svg-background")?.setAttribute("fill", "var(--atlas-sea)");
    svg.setAttribute("viewBox", viewBoxString(restored));
    clipMapToBounds(svg, original);
    setViewBox(restored);
    setPilotData(locationData ? { ...locationData, burgundy: burgundianData } : null);
    setMapReady(true);
    }).catch(() => { if (!cancelled) setMapError(true); });
    return () => { cancelled = true; };
  }, [mapAssetUrl, mapAttempt]);

  // The Atlas can resize when its panels, view mode, or viewport change. Keep
  // the same zoom and center while recalculating the outer zoom limit.
  useEffect(() => {
    const node = containerRef.current;
    const original = originalMapFrame;
    if (!mapReady || !node || !original) return;
    const update = rect => {
      if (!(rect.width > 0 && rect.height > 0)) return;
      const next = { width: rect.width, height: rect.height };
      const previous = viewportRef.current;
      viewportRef.current = next;
      if (!previous) {
        setViewBox(current => current ? clampMapViewBox(current, original, next, MAP_MIN_ZOOM) : fittedMapViewBox(original, next));
        initialViewBoxRef.current = fittedMapViewBox(original, next);
        return;
      }
      if (Math.abs(previous.width - next.width) < 1 && Math.abs(previous.height - next.height) < 1) return;
      const fitted = fittedMapViewBox(original, next);
      initialViewBoxRef.current = fitted;
      setViewBox(current => current
        ? resizeMapViewBox(current, original, previous, next, MAP_MIN_ZOOM)
        : fitted);
    };
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(entries => update(entries[0]?.contentRect || node.getBoundingClientRect()));
      observer.observe(node);
      return () => observer.disconnect();
    }
    const onResize = () => update(node.getBoundingClientRect());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mapReady, originalMapFrame]);

  useEffect(() => {
    if (viewBox) onViewportChange?.(viewBox);
  }, [viewBox, onViewportChange]);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg || !viewBox) return;
    svg.setAttribute("viewBox", viewBoxString(viewBox));
    clipMapToBounds(svg, originalViewBoxRef.current);
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

      if (seleccion && Number.isInteger(anioGlobal)) {
        for (const entry of mapAuthoritiesForPerson(seleccion, anioGlobal, pilotData)) {
          if (!entry.paint) continue;
          const color = entry.color || (entry.kind === 'delegated' ? '#907085'
            : colorTerritorioEnMapa(seleccion, entry.territory, anioGlobal));
          const fill = authorityFill(svg, color, entry.kind);
          for (const id of entry.ids) {
            const target = buscarElemento(id);
            if (!target) continue;
            target.style.setProperty('fill', fill, 'important');
            target.style.setProperty('stroke', color, 'important');
            pintadosRef.current.add(id);
          }
        }
      } else if (seleccion) {
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

      }
    } catch (error) {
      console.error("[MapaEuropa] Error al renderizar:", error);
    }
  }, [seleccion, anioGlobal, mapReady, imperialReferenceActive, pilotData]);

  const updateViewBox = useCallback((producer) => {
    setViewBox((current) => {
      if (!current || !originalViewBoxRef.current) return current;
      return clampMapViewBox(producer(current), originalViewBoxRef.current, viewportRef.current, MAP_MIN_ZOOM);
    });
  }, []);

  const zoomBy = useCallback((factor) => {
    setViewBox((current) => {
      const original = originalViewBoxRef.current;
      if (!current || !original) return current;
      return zoomMapViewBox(current, factor, original, viewportRef.current, MAP_MIN_ZOOM);
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
      scale: Math.min(rect.width / viewBox.width, rect.height / viewBox.height),
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
      x: drag.viewBox.x - deltaX / Math.max(0.0001, drag.scale),
      y: drag.viewBox.y - deltaY / Math.max(0.0001, drag.scale),
    };
    setViewBox(clampMapViewBox(next, originalViewBoxRef.current, viewportRef.current, MAP_MIN_ZOOM));
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

  const handleMapKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    const actions = {
      ArrowLeft: () => panBy(-MAP_PAN_STEP, 0), ArrowRight: () => panBy(MAP_PAN_STEP, 0),
      ArrowUp: () => panBy(0, -MAP_PAN_STEP), ArrowDown: () => panBy(0, MAP_PAN_STEP),
      '+': () => zoomBy(MAP_ZOOM_FACTOR), '=': () => zoomBy(MAP_ZOOM_FACTOR),
      '-': () => zoomBy(1 / MAP_ZOOM_FACTOR), Home: resetView,
      Escape: () => setSelectedRegionId(null),
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  };

  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    svg?.querySelectorAll('[data-atlas-selected]').forEach(path => path.removeAttribute('data-atlas-selected'));
    if (selectedRegionId) svg?.getElementById(selectedRegionId)?.setAttribute('data-atlas-selected', 'true');
  }, [selectedRegionId, mapReady]);

  return (
    <div className="mapa-stage">
      {!mapReady && <div role={mapError ? "alert" : "status"} style={{ position: "absolute", inset: "50% 0 auto", textAlign: "center", zIndex: 2 }}>
        {mapError ? <>No se ha podido cargar el mapa. <button className="nav-btn" onClick={() => setMapAttempt(n => n + 1)}>Reintentar</button></> : "Cargando mapa…"}
      </div>}
      <div className="mapa-toolbar" aria-label="Controles del mapa">
        <button type="button" className="nav-btn" disabled={!controlLimits.zoomOut} onClick={() => zoomBy(1 / MAP_ZOOM_FACTOR)} title={controlLimits.zoomOut ? 'Alejar mapa' : 'Límite del mapa de Europa'} aria-label="Alejar mapa"><ZoomOut size={13} /></button>
        <button type="button" className="nav-btn" onClick={resetView} title="Volver a Europa" aria-label="Volver a Europa"><RotateCcw size={12} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.zoomIn} onClick={() => zoomBy(MAP_ZOOM_FACTOR)} title="Acercar mapa" aria-label="Acercar mapa"><ZoomIn size={13} /></button>
        <span className="mapa-toolbar-separator" aria-hidden="true" />
        <button type="button" className="nav-btn" disabled={!controlLimits.left} onClick={() => panBy(-MAP_PAN_STEP, 0)} title="Mover mapa a la izquierda" aria-label="Mover mapa a la izquierda"><ArrowLeft size={13} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.up} onClick={() => panBy(0, -MAP_PAN_STEP)} title="Mover mapa hacia arriba" aria-label="Mover mapa hacia arriba"><ArrowUp size={13} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.down} onClick={() => panBy(0, MAP_PAN_STEP)} title="Mover mapa hacia abajo" aria-label="Mover mapa hacia abajo"><ArrowDown size={13} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.right} onClick={() => panBy(MAP_PAN_STEP, 0)} title="Mover mapa a la derecha" aria-label="Mover mapa a la derecha"><ArrowRight size={13} /></button>
      </div>
      {seleccion && <details className="mapa-color-legend">
        <summary>¿Por qué estos colores?</summary>
        <p><a href="/es/mapa-completo" target="_blank" rel="noopener noreferrer">Probar el mapa conjunto · 1400–1650</a></p>
        <div className="mapa-authority-key">
          <span><i className="mapa-key-solid" aria-hidden="true"/>Autoridad territorial</span>
          <span><i className="mapa-key-delegated" aria-hidden="true"/>Gobierno delegado</span>
          <span><i className="mapa-key-disputed" aria-hidden="true"/>Control disputado / ocupación</span>
        </div>
        <p>Los títulos sin control acreditado se consultan en el inspector y no colorean dominios.</p>
        <p>El mapa detallado destaca los gobiernos de la persona seleccionada. El gris no significa ausencia de gobierno: indica que esa región no tiene una atribución revisada para la persona y el año elegidos. Las regiones de esta cartografía aproximan territorios históricos y no prueban por sí solas una frontera.</p>
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
        onKeyDown={handleMapKeyDown}
        role="region"
        tabIndex={0}
        aria-label="Mapa histórico de Europa. Flechas para mover, más y menos para zoom, Inicio para volver a Europa"
      />
      {selectedRegionId && <aside className="mapa-region-inspector" aria-label={`Información histórica de ${selectedRegionId.replaceAll('_',' ')}`}>
        <div className="mapa-region-inspector-head"><div><small>Región del mapa · {Number.isInteger(anioGlobal) ? anioGlobal : 'sin año'}</small><h3>{selectedRegionId.replaceAll('_',' ')}</h3></div><button type="button" onClick={() => setSelectedRegionId(null)} aria-label="Cerrar información de la región"><X size={16}/></button></div>
        <p className="mapa-region-precision">{inspectedRegion?.precision || 'Las regiones de esta cartografía aproximan jurisdicciones históricas; no prueban por sí solas una frontera.'}</p>
        {!Number.isInteger(anioGlobal) ? <p>Elige un año para consultar quién gobernaba esta región y revisar las fuentes.</p> : <>
          {inspectedRegion?.entries.length > 0 && <ul>{inspectedRegion.entries.map((entry, index) => <li key={`${entry.territory}-${entry.person?.id || 'collective'}-${index}`}>
            <span className={`mapa-authority-badge mapa-authority-${entry.kind}`}>{AUTHORITY_LABELS[entry.kind]}</span>
            <strong>{entry.territory}</strong>
            <div>{entry.person ? <button type="button" className="mapa-region-person" onClick={() => onSelectPersona?.(entry.person.id)}>{entry.person.nombre}</button> : entry.collective?.nombre}</div>
            {entry.government?.soberano && <p>En nombre de {PERSONAS.find(p => p.id === entry.government.soberano)?.nombre || entry.government.soberano}. La soberanía se conserva en su ficha.</p>}
            {entry.government?.nota && <p>{entry.government.nota}</p>}
            {entry.mapNote && <p>{entry.mapNote}</p>}
            {entry.mapSources?.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}
            {entry.collective && <p>{entry.collective.nota}</p>}
            {entry.collective?.fuente && <a href={entry.collective.fuente.url} target="_blank" rel="noreferrer">{entry.collective.fuente.title}</a>}
            {entry.government && <small>{entry.government.titulo} · {entry.government.condicion} · {entry.government.desde}–{entry.government.hasta}</small>}
            {entry.claim?.sources?.length ? entry.claim.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}{source.locator ? ` · ${source.locator}` : ''}</a>) : <small className="mapa-region-unsourced">Sin fuente específica para esta afirmación.</small>}
          </li>)}</ul>}
          {inspectedRegion?.claims.length > 0 && <details className="mapa-title-claims"><summary>Títulos y pretensiones · sin color de dominio</summary><ul>{inspectedRegion.claims.map((entry, i) => <li key={`${entry.person.id}-${entry.territory}-${i}`}>
            <span className="mapa-authority-badge mapa-authority-titular">{AUTHORITY_LABELS[entry.kind]}</span>
            <strong>{entry.territory}</strong><button type="button" className="mapa-region-person" onClick={() => onSelectPersona?.(entry.person.id)}>{entry.person.nombre}</button>
            <small>{entry.government.titulo} · {entry.government.desde}–{entry.government.hasta}</small>
            <p>{entry.government.nota || 'Este registro no acredita control territorial para este año.'}</p>
            {entry.claim?.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}
          </li>)}</ul></details>}
          {pilotContext.length > 0 ? <ul>{pilotContext.map(entry => <li key={`${entry.name}-${entry.corridor}`}>
          <strong>{entry.name}</strong><div>{entry.corridor}</div>
          {entry.note && <p>{entry.note}</p>}
          {entry.activeReason && <p>{entry.activeReason}</p>}
          {entry.source && <a href={entry.source} target="_blank" rel="noreferrer">Fuente histórica de la capa</a>}
          {entry.correction && <><p>{entry.correction.reason}</p><a href={entry.correction.source} target="_blank" rel="noreferrer">Fuente de la corrección</a></>}
        </li>)}</ul> : inspectedRegion?.entries.length ? null : <p>Esta región no está atribuida a una jurisdicción revisada para este año. No se infiere por ello quién la gobernaba.</p>}
        </>}
      </aside>}
    </div>
  );
}
