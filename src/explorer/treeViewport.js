export function intersectsViewport(rect, viewport) {
  return !viewport || (rect.x + rect.width >= viewport.x && rect.x <= viewport.x + viewport.width
    && rect.y + rect.height >= viewport.y && rect.y <= viewport.y + viewport.height);
}

export function treeViewport(element, zoom, margin = 350) {
  return {
    x: element.scrollLeft / zoom - margin,
    y: element.scrollTop / zoom - margin,
    width: element.clientWidth / zoom + margin * 2,
    height: element.clientHeight / zoom + margin * 2,
  };
}
