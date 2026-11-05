import {renderImperialOverlay} from '../../cartography/imperialOverlay.js';
import {IMPERIAL_FRAME_RANGE} from '../../cartography/imperialFrame.js';
import {MAP_READING_GUIDE} from '../../content/mapReadingGuide.js';
import './atlas-skeleton.css';
import {authorityColor} from '../../cartography/mapColors.js';
import {locationLabel} from '../../cartography/locationLabels.js';
import {territoriosDe} from '../../domain/genealogy/personAccessors.js';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import locationsSvgUrl from "../../../data/cartography/euv-locations-crop.svg?url";
import locationsDataUrl from "../../../data/cartography/corridor-locations.json?url";
import burgundianDataUrl from "../../../data/cartography/burgundian-locations.json?url";
import { loadTextAsset, loadJsonAsset, forgetTextAsset } from "../../utils/loadAsset.js";
import { clampMapViewBox, clipMapToBounds, fittedMapViewBox, mapControlLimits, resizeMapViewBox, zoomMapViewBox } from "./mapViewport.js";
import { pilotImperialFrameFor, pilotLocationContext, mapSourceReference } from "../../cartography/locationMapPilot.js";
import { buildPoliticalMapIndex, inspectMapRegion, mapAuthoritySources } from "../../cartography/politicalMapIndex.js";
import { AUTHORITY_LABELS, mapAuthoritiesForPerson, mapAuthoritiesAcrossLife } from "../../cartography/mapAuthorities.js";
import { PERSONAS } from "../../data/personas.js";
import {europeMosaicAt} from '../../cartography/europePanorama.js';
import {
  agrupacionesPoliticasEnMapa,
  colorTerritorioEnMapa,
} from "../../cartography/kingdomMaps.js";
import { reinadosActivos } from "../../domain/government/reigns.js";
import {englishLabel,englishNote} from '../english/v6/atlasPresentation.js';

const MAP_ZOOM_FACTOR = 0.82;
const MAP_MIN_ZOOM = 0.015;
const MAP_PAN_STEP = 0.12;
const MAP_DRAG_THRESHOLD = 4;

function authorityFill(svg, color, kind) {
  if (!['delegated', 'disputed', 'mixed', 'tributary','apanage','feudal','vassal','fief'].includes(kind)) return color;
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
    line.setAttribute('d', kind === 'mixed' ? 'M0 .45 L.9 .45' : ['apanage','feudal','vassal','fief'].includes(kind)?'M.45 0 L.45 .9':kind === 'delegated' ? 'M0 0 L.9 .9' : 'M0 0 L.9 .9 M0 .9 L.9 0');
    line.setAttribute('stroke', '#fff'); line.setAttribute('stroke-opacity', '.5'); line.setAttribute('stroke-width', '.16');
    if (kind === 'tributary') {
      const veil = document.createElementNS(namespace, 'rect');
      veil.setAttribute('width', '.9'); veil.setAttribute('height', '.9');
      veil.setAttribute('fill', '#fff'); veil.setAttribute('fill-opacity', '.66');
      const dot = document.createElementNS(namespace, 'circle');
      dot.setAttribute('cx', '.45'); dot.setAttribute('cy', '.45'); dot.setAttribute('r', '.13');
      dot.setAttribute('fill', color); pattern.append(rect, veil, dot);
    } else pattern.append(rect, line);
    defs?.append(pattern);
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

// Index every addressable map element once. Repainting a year looks up
// thousands of locations; a selector scan per id made each redraw O(n²).
function indexMapElements(svg) {
  const byId = new Map(), byTitle = new Map(), byName = new Map();
  for (const element of svg.querySelectorAll("[id],[title],[data-name]")) {
    for (const [index, attribute] of [[byId, "id"], [byTitle, "title"], [byName, "data-name"]]) {
      const value = element.getAttribute(attribute);
      if (value !== null && !index.has(value)) index.set(value, element);
    }
  }
  return (id) => id
    ? byId.get(id) || byId.get(id.toLowerCase()) || byTitle.get(id) || byName.get(id) || null
    : null;
}

function viewBoxString(box) {
  return `${box.x} ${box.y} ${box.width} ${box.height}`;
}

// El mapa solo reacciona al CLIC (a `seleccion`), no al hover. El movimiento
// y el zoom alteran únicamente el viewBox del SVG: no interfieren con el
// coloreado imperativo de los territorios.
export function MapaEuropa({ seleccion, anioGlobal = null, onSelectTerritorio, onSelectPersona, initialViewport = null, onViewportChange, panorama = false, locale = 'es' }) {
  const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value,note=value=>en?englishNote(value):value;
  // EU V Locations is the Atlas map. The old Provinces SVG remains only as
  // the geometric source for the migration crosswalk.
  const containerRef = useRef(null);
  const svgInyectadoRef = useRef(false);
  const pintadosRef = useRef(new Set());
  const buscarElementoRef = useRef(null);
  const originalViewBoxRef = useRef(null);
  const initialViewBoxRef = useRef(null);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [viewBox, setViewBox] = useState(null);
  const [originalMapFrame, setOriginalMapFrame] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [paintingLife, setPaintingLife] = useState(false);
  const [showDependencies, setShowDependencies] = useState(true);
  const [showEmpire, setShowEmpire] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [pilotData, setPilotData] = useState(null);
  const mosaic = useMemo(()=>panorama && pilotData && Number.isInteger(anioGlobal)
    ? europeMosaicAt(pilotData,anioGlobal,PERSONAS) : null,[panorama,pilotData,anioGlobal]);
  const controlLimits = mapControlLimits(viewBox, originalMapFrame, viewportRef.current, MAP_MIN_ZOOM);
  const mapAssetUrl = locationsSvgUrl;
  const politicalIndex = useMemo(() => selectedRegionId && Number.isInteger(anioGlobal)
    ? buildPoliticalMapIndex(PERSONAS, anioGlobal, pilotData, {includeClaims: true, includeDependencies: true}) : new Map(), [selectedRegionId, anioGlobal, pilotData]);
  const inspectedRegion = useMemo(() => selectedRegionId && Number.isInteger(anioGlobal)
    ? inspectMapRegion(selectedRegionId, anioGlobal, politicalIndex, pilotData) : null,
  [selectedRegionId, anioGlobal, politicalIndex, pilotData]);
  // Dragging re-renders on every pointer move; keep the region context stable.
  const pilotContext = useMemo(() => selectedRegionId && Number.isInteger(anioGlobal)
    ? pilotLocationContext(pilotData, selectedRegionId, anioGlobal, seleccion?.id) : [],
  [selectedRegionId, anioGlobal, pilotData, seleccion?.id]);
  const activeGroups = seleccion && Number.isFinite(anioGlobal)
    ? agrupacionesPoliticasEnMapa(seleccion, anioGlobal) : [];
  const hasImperialOffice = Boolean(seleccion && Number.isFinite(anioGlobal)
    && reinadosActivos(seleccion, anioGlobal, { soloEfectivos: true })
      .some((gobierno) => gobierno.territorio === 'Sacro Imperio'));
  const imperialOverlayIds = useMemo(()=>panorama && pilotData && Number.isInteger(anioGlobal)
    ? pilotImperialFrameFor(pilotData,anioGlobal) : [],[panorama,pilotData,anioGlobal]);
  const imperialReferenceActive = hasImperialOffice && Number.isInteger(anioGlobal)
    && pilotImperialFrameFor(pilotData, anioGlobal).length > 0;

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    svgInyectadoRef.current = false;
    buscarElementoRef.current = null;
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
    for (const region of svg.querySelectorAll('[fill="#d8d6ce"]')) {
      region.setAttribute('fill', 'var(--atlas-land)');
      region.setAttribute('stroke', 'var(--atlas-land)');
      region.style.removeProperty('fill');
      region.style.removeProperty('stroke');
    }
    svg.querySelector('#credit-text-svg')?.setAttribute('fill', 'var(--atlas-credit)');
    buscarElementoRef.current = indexMapElements(svg);

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

    const buscarElemento = buscarElementoRef.current || indexMapElements(svg);

    let cancelled = false;
    const controller = new AbortController();
    setPaintingLife(false);
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

      if (panorama && mosaic) {
        for(const [id,layers] of mosaic.byLocation) {
          const target=buscarElemento(id);if(!target)continue;
          const colors=[...new Set(layers.map(layer=>layer.mosaicColor))];
          const scopes=layers.flatMap(layer=>(layer.scopes||[]).filter(scope=>scope.ids.includes(id)));
          const disputed=scopes.some(s=>/disput|ocupaci/i.test(s.condition||''));
          let fill=authorityFill(svg,colors[0],disputed?'disputed':layers.some(l=>l.crownRelation||l.tributaryRelation)?'apanage':'sovereign');
          if(colors.length>1) {
            const namespace='http://www.w3.org/2000/svg';
            const patternId='europe-mosaic-'+colors.join('-').replace(/[^a-z0-9]/gi,'');
            if(!svg.getElementById(patternId)) {
              const pattern=document.createElementNS(namespace,'pattern');
              pattern.setAttribute('id',patternId);pattern.setAttribute('patternUnits','userSpaceOnUse');
              pattern.setAttribute('width','1.2');pattern.setAttribute('height','1.2');pattern.setAttribute('patternTransform','rotate(45)');
              colors.forEach((color,i)=>{const rect=document.createElementNS(namespace,'rect');rect.setAttribute('x',String(i*1.2/colors.length));rect.setAttribute('width',String(1.2/colors.length+.005));rect.setAttribute('height','1.2');rect.setAttribute('fill',color);pattern.append(rect);});
              svg.querySelector('defs')?.append(pattern);
            }
            fill=`url(#${patternId})`;
          }
          target.style.setProperty('fill',fill,'important');target.style.setProperty('stroke',colors[0],'important');
          pintadosRef.current.add(id);
        }
      } else if (seleccion && Number.isInteger(anioGlobal)) {
        for (const entry of mapAuthoritiesForPerson(seleccion, anioGlobal, pilotData, {includeDependencies: showDependencies})) {
          if (!entry.paint) continue;
          const color = authorityColor(entry, colorTerritorioEnMapa(seleccion, entry.colorTerritory || entry.territory, anioGlobal));
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
        setPaintingLife(true);
        mapAuthoritiesAcrossLife(seleccion, pilotData, {includeDependencies:showDependencies, signal:controller.signal})
          .then(entries => {
            if (cancelled) return;
            for (const entry of entries) {
              const fill = authorityFill(svg, entry.color, entry.kind);
              for (const id of entry.ids) {
                const target = buscarElemento(id);
                if (!target) continue;
                target.style.setProperty('fill', fill, 'important');
                target.style.setProperty('stroke', entry.color, 'important');
                pintadosRef.current.add(id);
              }
            }
            setPaintingLife(false);
          }).catch(error => {
            if (cancelled || error.name === 'AbortError') return;
            setPaintingLife(false);
            console.error('[MapaEuropa] Error al reunir ámbitos:', error);
          });
      }

    } catch (error) {
      console.error("[MapaEuropa] Error al renderizar:", error);
    }
    return () => { cancelled = true; controller.abort(); };
  }, [seleccion, anioGlobal, mapReady, imperialReferenceActive, pilotData, showDependencies,panorama,mosaic]);

  useEffect(()=>{
    const svg=containerRef.current?.querySelector('svg');if(!svg)return;
    renderImperialOverlay(svg,panorama&&showEmpire?imperialOverlayIds:[],buscarElementoRef.current||indexMapElements(svg));
    return ()=>svg.querySelector('[data-imperial-overlay]')?.remove();
  },[mapReady,panorama,showEmpire,imperialOverlayIds,mosaic]);

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
    <div className={`mapa-stage atlas-loading ${(!mapReady || paintingLife) && !mapError ? "loading" : "loaded"}`} aria-busy={(!mapReady || paintingLife) && !mapError}>
      {(!mapReady || paintingLife) && !mapError && <span className="atlas-loading-bar" aria-hidden="true"/>}
      {(!mapReady || paintingLife) && <div role={mapError ? "alert" : "status"} style={{ position: "absolute", inset: "50% 0 auto", textAlign: "center", zIndex: 2 }}>
        {mapError ? <>{tr('No se ha podido cargar el mapa.','The map could not be loaded.')} <button className="nav-btn" onClick={() => setMapAttempt(n => n + 1)}>{tr('Reintentar','Try again')}</button></> : paintingLife ? tr('Reuniendo los territorios de esta vida…','Gathering territories across this lifetime…') : tr('Cargando mapa…','Loading map…')}
      </div>}
      <div className="mapa-toolbar" inert={!mapReady || paintingLife} aria-label={tr('Controles del mapa','Map controls')}>
        {panorama && imperialOverlayIds.length>0 && <label className="mapa-dependency-toggle mapa-imperial-control"><input type="checkbox" checked={showEmpire}
          disabled={!mapReady} onChange={event=>setShowEmpire(event.target.checked)}/> {tr('Mostrar Sacro Imperio','Show Holy Roman Empire')}</label>}
        <button type="button" className="nav-btn" disabled={!controlLimits.zoomOut} onClick={() => zoomBy(1 / MAP_ZOOM_FACTOR)} title={controlLimits.zoomOut ? tr('Alejar mapa','Zoom out') : tr('Límite del mapa de Europa','Europe map limit')} aria-label={tr('Alejar mapa','Zoom out')}><ZoomOut size={13} /></button>
        <button type="button" className="nav-btn" onClick={resetView} title={tr('Volver a Europa','Return to Europe')} aria-label={tr('Volver a Europa','Return to Europe')}><RotateCcw size={12} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.zoomIn} onClick={() => zoomBy(MAP_ZOOM_FACTOR)} title={tr('Acercar mapa','Zoom in')} aria-label={tr('Acercar mapa','Zoom in')}><ZoomIn size={13} /></button>
        <span className="mapa-toolbar-separator" aria-hidden="true" />
        <button type="button" className="nav-btn" disabled={!controlLimits.left} onClick={() => panBy(-MAP_PAN_STEP, 0)} title={tr('Mover mapa a la izquierda','Pan map left')} aria-label={tr('Mover mapa a la izquierda','Pan map left')}><ArrowLeft size={13} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.up} onClick={() => panBy(0, -MAP_PAN_STEP)} title={tr('Mover mapa hacia arriba','Pan map up')} aria-label={tr('Mover mapa hacia arriba','Pan map up')}><ArrowUp size={13} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.down} onClick={() => panBy(0, MAP_PAN_STEP)} title={tr('Mover mapa hacia abajo','Pan map down')} aria-label={tr('Mover mapa hacia abajo','Pan map down')}><ArrowDown size={13} /></button>
        <button type="button" className="nav-btn" disabled={!controlLimits.right} onClick={() => panBy(MAP_PAN_STEP, 0)} title={tr('Mover mapa a la derecha','Pan map right')} aria-label={tr('Mover mapa a la derecha','Pan map right')}><ArrowRight size={13} /></button>
      </div>
      {panorama && <details className="mapa-color-legend" inert={!mapReady}>
        <summary>{tr('Cómo leer el mapa','How to read the map')}</summary>
        {showEmpire && <p>{tr('Superposición dorada: ámbito jurídico aproximado, reconstruido para','Gold overlay: approximate legal extent, reconstructed for')} {IMPERIAL_FRAME_RANGE.from}–{IMPERIAL_FRAME_RANGE.through}. {tr('Los gobiernos territoriales siguen debajo y se pueden consultar.','Territorial governments remain underneath and can still be inspected.')} <a href="https://www.ieg-maps.uni-mainz.de/mapsp/mapp792d.htm" target="_blank" rel="noreferrer">{tr('Fuente del Sacro Imperio','Holy Roman Empire source')}</a></p>}
        {en ? <>
          <p>This map is a historical reconstruction. Its regions approximate changing jurisdictions and do not by themselves prove exact borders.</p>
          <p>Colours identify documented authorities for the selected year. They do not imply that every territory formed a single centralised state.</p>
        </> : <>{MAP_READING_GUIDE.paragraphs.map(text=><p key={text}>{text}</p>)}{MAP_READING_GUIDE.examples.map(text=><p key={text}>{text}</p>)}</>}
        <p><a href={en?'/en/methodology':'/es/proyecto#como-leer-el-mapa'}>{tr('Criterios y referencias históricas','Historical criteria and references')}</a></p>
        <p>{tr('El rayado claro indica disputa u ocupación. Varios colores señalan atribuciones diferentes en una misma celda. Pulsa una región para consultar autoridades y fuentes.','Light hatching indicates dispute or occupation. Multiple colours show different attributions within one cell. Select a region to inspect authorities and sources.')}</p>
        <p>{tr('Las líneas verticales marcan dependencias con gobierno propio, en un tono del color de su soberano: feudos y apanages dentro de Francia (azul real, granate borgoñón o color inglés según quién los tenga), vasallos de la Corona de Aragón, tributarios otomanos como Valaquia, Moldavia o Transilvania y feudos como la Prusia ducal o Curlandia. Solo se marcan los años en que la dependencia está documentada. Las tierras del rey de Inglaterra llevan su color; hasta 1336 se tenían en feudo del rey francés.','Vertical lines mark dependencies with their own government, tinted with the overlord’s colour: fiefs and appanages within France, vassals of the Crown of Aragon, Ottoman tributaries such as Wallachia, Moldavia or Transylvania, and fiefs such as Ducal Prussia or Courland. They appear only for years in which the dependency is documented.')}</p>
        <p>{mosaic?.reviewedLayerCount||0} {tr('jurisdicciones revisadas','reviewed jurisdictions')} · {mosaic?.approximateLayerCount||0} {tr('equivalencias aproximadas. El gris indica que falta una atribución para este año.','approximate matches. Grey indicates that no attribution is available for this year.')}</p>
      </details>}
      {!panorama && seleccion && <details className="mapa-color-legend" inert={!mapReady || paintingLife}>
        <summary>{tr('Cómo leer el mapa personal','How to read the personal map')}</summary>
        <p>{en?'Colours identify the selected person’s documented governments. These historical regions approximate changing jurisdictions and do not prove exact borders.':MAP_READING_GUIDE.paragraphs[1]}</p>
        <p><a href={en?'/en/methodology':'/es/proyecto#como-leer-el-mapa'}>{tr('Criterios comunes, fronteras y ejemplos históricos','Shared criteria, borders and historical examples')}</a></p>
        <p><a href={en?'/en/?atlas=1&escena=europa&anio=1500':'/es/mapa-completo'} target="_blank" rel="noopener noreferrer">{tr('Probar el mapa conjunto','Open the complete map')} · 1106–1800</a></p>
        <div className="mapa-authority-key">
          <span><i className="mapa-key-solid" aria-hidden="true"/>{tr('Autoridad territorial','Territorial authority')}</span>
          <span><i className="mapa-key-delegated" aria-hidden="true"/>{tr('Gobierno delegado','Delegated government')}</span>
          <span><i className="mapa-key-disputed" aria-hidden="true"/>{tr('Control disputado / ocupación','Disputed control / occupation')}</span>
          <span><i className="mapa-key-apanage" aria-hidden="true"/>{tr('Feudo, apanage o vasallo · gobierno propio','Fief, appanage or vassal · own government')}</span>
          <span><i className="mapa-key-tributary" aria-hidden="true"/>{tr('Estado tributario · gobierno propio','Tributary state · own government')}</span>
          <span><i className="mapa-key-mixed" aria-hidden="true"/>{Number.isInteger(anioGlobal) ? tr('Varias jurisdicciones en una celda','Several jurisdictions in one cell') : tr('Varias jurisdicciones o condiciones a lo largo de la vida','Several jurisdictions or conditions across a lifetime')}</span>
        </div>
        <label className="mapa-dependency-toggle"><input type="checkbox" checked={showDependencies} onChange={event => setShowDependencies(event.target.checked)}/> {tr('Mostrar tributarios y feudos','Show tributaries and fiefs')}</label>
        <p>{tr('Las líneas verticales muestran feudos, apanages y vasallos con gobierno propio, en tonos del color de su señor: el azul real en Francia, el rojo aragonés en la Corona de Aragón y el color de cada soberano en feudos como la Prusia ducal, Curlandia o la Bretaña angevina. No son Estados tributarios.','Vertical lines show fiefs, appanages and vassals with their own government, tinted with their overlord’s colour. They are not tributary states.')}</p>
        <p>{tr('Los puntos relacionan un Estado tributario con el soberano seleccionado. Conserva su título y gobierno; las superficies de administración directa tienen color sólido.','Dots link a tributary state to the selected sovereign. The state retains its title and government; directly administered areas use a solid colour.')}</p>
        <p>{tr('Los títulos sin control acreditado se consultan en el inspector y no colorean dominios.','Titles without documented control appear in the inspector and do not colour territories.')}</p>
        <p>{tr('El mapa detallado destaca los gobiernos de la persona seleccionada. El gris no significa ausencia de gobierno: indica que esa región no tiene una atribución revisada para la persona y el año elegidos. Las regiones de esta cartografía aproximan territorios históricos y no prueban por sí solas una frontera.','The detailed map highlights the selected person’s governments. Grey does not mean an absence of government: it indicates that the region has no reviewed attribution for this person and year. These map regions approximate historical territories and do not by themselves prove a border.')}</p>
        {imperialReferenceActive && <p>{tr('El gris medio señala una aproximación al ámbito jurídico del Sacro Imperio, no tierras gobernadas directamente por el emperador ni todos los círculos imperiales.','Medium grey approximates the legal extent of the Holy Roman Empire, not lands directly governed by the emperor or every imperial circle.')} <a href="https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:map-2809" target="_blank" rel="noreferrer">{tr('Fuente cartográfica','Map source')}</a>.</p>}
        {hasImperialOffice && !imperialReferenceActive && <p>{tr('El marco imperial no está reconstruido para este año. Solo se colorean los gobiernos territoriales documentados de la persona.','The imperial framework has not been reconstructed for this year. Only the person’s documented territorial governments are coloured.')}</p>}
        {Number.isFinite(anioGlobal) ? (
          activeGroups.length ? activeGroups.map(grupo => <div className="mapa-color-legend-item" key={grupo.id}>
            <span className="mapa-color-swatch" style={{ backgroundColor: grupo.color }} aria-hidden="true" />
            <div><strong>{term(grupo.nombre)}</strong><p>{note(grupo.nota)} {grupo.fuente && <a href={grupo.fuente} target="_blank" rel="noreferrer">{tr('Fuente','Source')}</a>}</p></div>
          </div>) : <p>{tr('Los colores corresponden a los territorios gobernados por esta persona en','Colours correspond to the territories governed by this person in')} {anioGlobal}; {tr('no indican que todos formasen un único Estado.','they do not indicate that all of them formed a single state.')}</p>
        ) : <p>{tr('Elige un año para distinguir los conjuntos políticos de cada etapa. Sin año, el mapa reúne las superficies de distintas etapas de esta vida, que no coexistieron necesariamente. El color sigue el último conjunto político registrado de cada título.','Choose a year to distinguish the political groupings of each period. Without a year, the map combines areas from different stages of this life that did not necessarily coexist. The colour follows the latest recorded political grouping for each title.')}</p>}
      </details>}

      <div
        ref={containerRef}
        className="mapa-wrapper sk dim"
        inert={!mapReady || paintingLife}
        onKeyDown={handleMapKeyDown}
        role="region"
        tabIndex={0}
        aria-label={tr('Mapa histórico de Europa. Flechas para mover, más y menos para zoom, Inicio para volver a Europa','Historical map of Europe. Arrow keys pan, plus and minus zoom, Home returns to Europe')}
      />
      {selectedRegionId && <aside className="mapa-region-inspector" aria-label={`${tr('Información histórica de','Historical information for')} ${term(locationLabel(selectedRegionId))}`}>
        <div className="mapa-region-inspector-head"><div><small>{tr('Región del mapa','Map region')} · {Number.isInteger(anioGlobal) ? anioGlobal : tr('sin año','no year selected')}</small><h3>{term(locationLabel(selectedRegionId))}</h3></div><button type="button" onClick={() => setSelectedRegionId(null)} aria-label={tr('Cerrar información de la región','Close region information')}><X size={16}/></button></div>
        <p className="mapa-region-precision">{inspectedRegion?.precision ? note(inspectedRegion.precision) : tr('Las regiones de esta cartografía aproximan jurisdicciones históricas; no prueban por sí solas una frontera.','The regions in this map approximate historical jurisdictions; they do not by themselves prove a border.')}</p>
        {!Number.isInteger(anioGlobal) ? <p>{tr('Elige un año para consultar quién gobernaba esta región y revisar las fuentes.','Choose a year to see who governed this region and review the sources.')}</p> : <>
          {inspectedRegion?.entries.length > 0 && <ul>{inspectedRegion.entries.map((entry, index) => <li key={`${entry.territory}-${entry.person?.id || 'collective'}-${index}`}>
            <span className={`mapa-authority-badge mapa-authority-${entry.kind}`}>{term(AUTHORITY_LABELS[entry.kind])}</span>
            <strong>{term(entry.territory)}</strong>
            {entry.crownRelation&&<p>{entry.crownRelation.summary?note(entry.crownRelation.summary):`${tr(entry.crownRelation.type==='feudo'?'Feudo':'Apanage',entry.crownRelation.type==='feudo'?'Fief':'Appanage')} ${tr('dentro del reino · autoridad superior de Francia','within the kingdom · higher authority of France')}`} · {entry.crownRelation.from}–{entry.crownRelation.through}.</p>}
            {entry.relationship && <p>{term(entry.relationship.subjectLabel)} · {tr('vínculo','relationship')} {entry.relationship.type === 'feudo' ? tr('feudal','feudal') : tr('tributario','tributary')} {tr('con','with')} {term(entry.relationship.overlordLabel || entry.relationship.overlord)}, {entry.relationship.from}–{entry.relationship.through}.</p>}
            <div>{entry.relationship ? (entry.relationship.type === 'feudo' ? tr('Soberano del que depende el feudo: ','Sovereign on whom the fief depends: ') : tr('Soberano al que se debe el tributo: ','Sovereign to whom tribute is owed: ')) : entry.crownRelation?tr('Autoridad superior: ','Higher authority: '):null}{entry.person ? <button type="button" className="mapa-region-person" onClick={() => onSelectPersona?.(entry.person.id)}>{entry.person.nombre}</button> : term(entry.collective?.nombre)}</div>
            {entry.government?.soberano && <p>{tr('En nombre de','On behalf of')} {PERSONAS.find(p => p.id === entry.government.soberano)?.nombre || entry.government.soberano}. {tr('El gobierno superior se consulta en su ficha.','The higher government is available in that profile.')}</p>}
            {entry.kind === 'regional' && <small>{tr('La jurisdicción tiene fuentes territoriales; el mandato de su gobernante en este año sigue pendiente de documentar.','The jurisdiction has territorial sources; its ruler’s mandate for this year still awaits documentation.')}</small>}
            {[...new Set((entry.governments||[entry.government]).map(g=>g?.nota).filter(Boolean))].map(text=><p key={text}>{note(text)}</p>)}
            {entry.mapNote && <p>{note(entry.mapNote)}</p>}
            {[...new Map((entry.mapSources || []).map(mapSourceReference).map(source => [source.url, source])).values()].map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{term(source.title || source.label || tr('Fuente territorial','Territorial source'))}{source.locator ? ` · ${source.locator}` : ''}</a>)}
            {entry.collective && <p>{note(entry.collective.nota)}</p>}
            {entry.collective?.fuente && <a href={entry.collective.fuente.url} target="_blank" rel="noreferrer">{term(entry.collective.fuente.title)}</a>}
            {(entry.governments||[entry.government]).filter(Boolean).map((government,i)=><small key={i}>{term(government.titulo)} · {term(government.condicion)} · {government.desde}–{government.hasta}</small>)}
            {mapAuthoritySources(entry).length ? mapAuthoritySources(entry).map(source => <a key={source.url+'|'+source.locator} href={source.url} target="_blank" rel="noreferrer">{term(source.title)}{source.locator ? ` · ${source.locator}` : ''}</a>) : entry.relationship?.sources.length || entry.crownRelation || entry.regionalEvidence ? null : <small className="mapa-region-unsourced">{tr('Sin fuente específica para esta afirmación.','No specific source for this statement.')}</small>}
          </li>)}</ul>}
          {inspectedRegion?.claims.length > 0 && <details className="mapa-title-claims"><summary>{tr('Títulos y pretensiones · sin color de dominio','Titles and claims · no territorial colour')}</summary><ul>{inspectedRegion.claims.map((entry, i) => <li key={`${entry.person.id}-${entry.territory}-${i}`}>
            <span className="mapa-authority-badge mapa-authority-titular">{term(AUTHORITY_LABELS[entry.kind])}</span>
            <strong>{term(entry.territory)}</strong><button type="button" className="mapa-region-person" onClick={() => onSelectPersona?.(entry.person.id)}>{entry.person.nombre}</button>
            {(entry.governments||[entry.government]).map((government,i)=><div key={i}><small>{term(government.titulo)} · {government.desde}–{government.hasta}</small><p>{government.nota ? note(government.nota) : tr('Este registro no acredita control territorial para este año.','This record does not document territorial control for this year.')}</p></div>)}
            {mapAuthoritySources(entry).map(source => <a key={source.url+'|'+source.locator} href={source.url} target="_blank" rel="noreferrer">{term(source.title)}{source.locator ? ` · ${source.locator}` : ''}</a>)}
          </li>)}</ul></details>}
          {pilotContext.length > 0 ? <ul>{pilotContext.map(entry => <li key={`${entry.name}-${entry.corridor}`}>
          <strong>{term(entry.name)}</strong><div>{term(entry.corridor)}</div>
          {entry.note && <p>{note(entry.note)}</p>}
          {entry.activeReason && <p>{note(entry.activeReason)}</p>}
          {entry.source && <a href={entry.source} target="_blank" rel="noreferrer">{tr('Fuente histórica de la capa','Historical layer source')}</a>}
          {entry.correction && <><p>{note(entry.correction.reason)}</p><a href={entry.correction.source} target="_blank" rel="noreferrer">{tr('Fuente de la corrección','Correction source')}</a>{entry.correction.supportingSources?.map(mapSourceReference).map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{term(source.title || source.label || tr('Fuente complementaria','Supporting source'))}</a>)}</>}
        </li>)}</ul> : inspectedRegion?.entries.length ? null : <p>{tr('Esta región no está atribuida a una jurisdicción revisada para este año. No se infiere por ello quién la gobernaba.','This region has no reviewed jurisdictional attribution for this year. No inference is made about who governed it.')}</p>}
        </>}
      </aside>}
    </div>
  );
}
