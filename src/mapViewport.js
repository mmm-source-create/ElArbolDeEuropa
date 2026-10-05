// Keep the overview on the map's actual SVG bounds. The SVG uses
// preserveAspectRatio="meet" to letterbox when the panel has another ratio;
// expanding this viewBox to the panel would expose empty space outside the map.
export function fittedMapViewBox(original, _viewport) {
  return { ...original };
}

// A viewBox positions content; it does not clip world paths in a nested SVG.
// Clip the map group to the current, bounded view so letterboxing cannot reveal
// either the original world map or regions outside the zoomed viewport.
export function clipMapToViewBox(svg, box) {
  const group = svg.querySelector('#map-group');
  if (!group || !box) return;
  const ns = 'http://www.w3.org/2000/svg';
  let clip = svg.querySelector('#atlas-viewport-clip');
  if (!clip) {
    const defs = svg.ownerDocument.createElementNS(ns, 'defs');
    clip = svg.ownerDocument.createElementNS(ns, 'clipPath');
    clip.id = 'atlas-viewport-clip';
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    clip.append(svg.ownerDocument.createElementNS(ns, 'rect'));
    defs.append(clip);
    svg.prepend(defs);
  }
  for (const key of ['x', 'y', 'width', 'height']) clip.firstElementChild.setAttribute(key, box[key]);
  group.setAttribute('clip-path', 'url(#atlas-viewport-clip)');
}

export function mapControlLimits(box, original, minZoom = 0.015) {
  if (!box || !original) return {};
  const epsilon = original.width * 1e-7;
  return {
    zoomOut: box.width < original.width - epsilon,
    zoomIn: box.width > original.width * minZoom + epsilon,
    left: box.x > original.x + epsilon,
    right: box.x + box.width < original.x + original.width - epsilon,
    up: box.y > original.y + epsilon,
    down: box.y + box.height < original.y + original.height - epsilon,
  };
}

export function clampMapViewBox(box, original, viewport, minZoom = 0.015) {
  if (!original) return box;
  const frame = fittedMapViewBox(original, viewport);
  const aspect = frame.width / frame.height;
  const minWidth = frame.width * minZoom;
  const width = Math.max(minWidth, Math.min(frame.width, box.width));
  const height = width / aspect;
  const minX = frame.x;
  const maxX = frame.x + frame.width - width;
  const minY = frame.y;
  const maxY = frame.y + frame.height - height;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  return {
    x: Math.max(minX, Math.min(maxX, centerX - width / 2)),
    y: Math.max(minY, Math.min(maxY, centerY - height / 2)),
    width,
    height,
  };
}

export function resizeMapViewBox(box, original, previousViewport, nextViewport, minZoom = 0.015) {
  const previousFit = fittedMapViewBox(original, previousViewport);
  const nextFit = fittedMapViewBox(original, nextViewport);
  const zoom = previousFit.width / box.width;
  const width = nextFit.width / zoom;
  const height = width / (nextFit.width / nextFit.height);
  const relativeCenterX = (box.x + box.width / 2 - original.x) / original.width;
  const relativeCenterY = (box.y + box.height / 2 - original.y) / original.height;
  const centerX = original.x + relativeCenterX * original.width;
  const centerY = original.y + relativeCenterY * original.height;
  return clampMapViewBox({
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  }, original, nextViewport, minZoom);
}

export function zoomMapViewBox(box, factor, original, viewport, minZoom = 0.015) {
  if (!box || !original || !Number.isFinite(factor) || factor <= 0) return box;
  const current = clampMapViewBox(box, original, viewport, minZoom);
  const fitted = fittedMapViewBox(original, viewport);
  const minWidth = fitted.width * minZoom;
  const width = Math.max(minWidth, Math.min(fitted.width, current.width * factor));
  if (Math.abs(width - current.width) < 0.0001) return current;
  const height = width / (fitted.width / fitted.height);
  const centerX = current.x + current.width / 2;
  const centerY = current.y + current.height / 2;
  return clampMapViewBox({
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  }, original, viewport, minZoom);
}
