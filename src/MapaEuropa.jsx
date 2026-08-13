import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import mapSvgContent from "./MapChart_Map.svg?raw";
import {
  REINO_COLOR,
  REINO_COLOR_DEFAULT,
  esGobernante,
  idsDeReinoEnAño,
  añoReferenciaTerritorial,
  listaReinados,
  reinadoEsEfectivo,
  reinadosActivos,
} from "./Territorios";

const MAP_ZOOM_FACTOR = 0.82;
const MAP_MIN_VISIBLE_RATIO = 0.06;
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

function initialViewBox(original) {
  // Reproduce aproximadamente el encuadre que antes generaba scale(1.9)
  // con transform-origin 47% 8%, pero mediante viewBox para que el drag y
  // el zoom sean precisos y el SVG permanezca nítido.
  const scale = 1.9;
  const originX = original.x + original.width * 0.47;
  const originY = original.y + original.height * 0.08;
  return {
    x: originX + (original.x - originX) / scale,
    y: originY + (original.y - originY) / scale,
    width: original.width / scale,
    height: original.height / scale,
  };
}

function clampViewBox(box, original) {
  if (!original) return box;
  const aspect = original.width / original.height;
  const minWidth = original.width * MAP_MIN_VISIBLE_RATIO;
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
export function MapaEuropa({ seleccion, anioGlobal = null, onSelectTerritorio }) {
  const containerRef = useRef(null);
  const svgInyectadoRef = useRef(false);
  const pintadosRef = useRef(new Set());
  const originalViewBoxRef = useRef(null);
  const initialViewBoxRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [viewBox, setViewBox] = useState(null);

  useEffect(() => {
    if (!containerRef.current || svgInyectadoRef.current) return;

    containerRef.current.innerHTML = mapSvgContent;
    svgInyectadoRef.current = true;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    const original = parseViewBox(svg);
    const initial = clampViewBox(initialViewBox(original), original);
    originalViewBoxRef.current = original;
    initialViewBoxRef.current = initial;

    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.transform = "none";
    svg.setAttribute("viewBox", viewBoxString(initial));
    setViewBox(initial);
  }, []);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg || !viewBox) return;
    svg.setAttribute("viewBox", viewBoxString(viewBox));
  }, [viewBox]);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

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

      if (seleccion && esGobernante(seleccion)) {
        const reinadosDetallados = listaReinados(seleccion).filter(reinadoEsEfectivo);
        const entradas = reinadosDetallados.length
          ? (Number.isFinite(anioGlobal)
              ? reinadosActivos(seleccion, anioGlobal, { soloEfectivos: true })
              : reinadosDetallados)
          : (seleccion.reinos || []).map((territorio) => ({
              territorio,
              desde: añoReferenciaTerritorial(seleccion, territorio),
              hasta: añoReferenciaTerritorial(seleccion, territorio),
            }));

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
          const color = REINO_COLOR[reino] || REINO_COLOR_DEFAULT;
          idsDeReinoEnAño(reino, año).forEach((id) => {
            const target = buscarElemento(id);
            if (!target) return;
            target.style.setProperty("fill", color, "important");
            target.style.setProperty("stroke", color, "important");
            target.style.setProperty("stroke-width", "0.6px", "important");
            pintadosRef.current.add(id);
          });
        });
      }
    } catch (error) {
      console.error("[MapaEuropa] Error al renderizar:", error);
    }
  }, [seleccion, anioGlobal]);

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
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !originalViewBoxRef.current) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) >= MAP_DRAG_THRESHOLD) drag.moved = true;
    if (!drag.moved) return;

    const next = {
      ...drag.viewBox,
      x: drag.viewBox.x - deltaX * (drag.viewBox.width / Math.max(1, drag.rect.width)),
      y: drag.viewBox.y - deltaY * (drag.viewBox.height / Math.max(1, drag.rect.height)),
    };
    setViewBox(clampViewBox(next, originalViewBoxRef.current));
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleClick = (event) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const target = event.target.closest("path, polygon, g[id]");
    if (!target) return;
    const idDetectado = target.id || target.getAttribute("title") || target.getAttribute("data-name");
    if (idDetectado && onSelectTerritorio) onSelectTerritorio(idDetectado);
  };

  return (
    <div className="mapa-stage">
      <div className="mapa-toolbar" aria-label="Controles del mapa">
        <button type="button" className="nav-btn" onClick={() => zoomBy(1 / MAP_ZOOM_FACTOR)} title="Alejar mapa" aria-label="Alejar mapa"><ZoomOut size={13} /></button>
        <button type="button" className="nav-btn" onClick={resetView} title="Restablecer mapa" aria-label="Restablecer mapa"><RotateCcw size={12} /></button>
        <button type="button" className="nav-btn" onClick={() => zoomBy(MAP_ZOOM_FACTOR)} title="Acercar mapa" aria-label="Acercar mapa"><ZoomIn size={13} /></button>
        <span className="mapa-toolbar-separator" aria-hidden="true" />
        <button type="button" className="nav-btn" onClick={() => panBy(-MAP_PAN_STEP, 0)} title="Mover mapa a la izquierda" aria-label="Mover mapa a la izquierda"><ArrowLeft size={13} /></button>
        <button type="button" className="nav-btn" onClick={() => panBy(0, -MAP_PAN_STEP)} title="Mover mapa hacia arriba" aria-label="Mover mapa hacia arriba"><ArrowUp size={13} /></button>
        <button type="button" className="nav-btn" onClick={() => panBy(0, MAP_PAN_STEP)} title="Mover mapa hacia abajo" aria-label="Mover mapa hacia abajo"><ArrowDown size={13} /></button>
        <button type="button" className="nav-btn" onClick={() => panBy(MAP_PAN_STEP, 0)} title="Mover mapa a la derecha" aria-label="Mover mapa a la derecha"><ArrowRight size={13} /></button>
      </div>

      <div
        ref={containerRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        className="mapa-wrapper"
        role="application"
        tabIndex={0}
        aria-label="Mapa histórico interactivo de territorios europeos; arrastra para moverlo"
      />
    </div>
  );
}
