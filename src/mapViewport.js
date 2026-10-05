// Keep the overview on the map's actual SVG bounds. The SVG uses
// preserveAspectRatio="meet" to letterbox when the panel has another ratio;
// expanding this viewBox to the panel would expose empty space outside the map.
export function fittedMapViewBox(original, _viewport) {
  return { ...original };
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
