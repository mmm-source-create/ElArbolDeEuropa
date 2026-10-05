// Fill the panel with the largest rectangle contained in the Europe bounds.
// At the outer zoom limit the shorter axis can still pan across Europe.
export function fittedMapViewBox(original, viewport) {
  const aspect = viewport?.width > 0 && viewport?.height > 0
    ? viewport.width / viewport.height : original.width / original.height;
  const width = Math.min(original.width, original.height * aspect);
  const height = width / aspect;
  return {x: original.x + (original.width-width)/2,
    y: original.y + (original.height-height)/2, width, height};
}

// A viewBox positions content; it does not clip world paths in a nested SVG.
// Clip only to the fixed Europe bounds; the camera can then reveal the entire
// width of the panel at any zoom, without moving masks through visible land.
export function clipMapToBounds(svg, box) {
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

export function mapControlLimits(box, original, viewport, minZoom = 0.015) {
  if (!box || !original) return {};
  const frame = fittedMapViewBox(original, viewport);
  const epsilon = original.width * 1e-7;
  return {
    zoomOut: box.width < frame.width - epsilon,
    zoomIn: box.width > frame.width * minZoom + epsilon,
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
  const minX = original.x;
  const maxX = original.x + original.width - width;
  const minY = original.y;
  const maxY = original.y + original.height - height;
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
