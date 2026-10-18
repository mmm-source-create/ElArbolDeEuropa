export function layoutRows(rows, measured = new Map()) {
  let total = 0;
  const items = rows.map(row => {
    const size = measured.get(row.key) || row.estimatedSize;
    const entry = { ...row, start: total, size };
    total += size;
    return entry;
  });
  return { items, total, byKey: new Map(items.map(row => [row.key, row])) };
}

export function visibleRowRange(items, top, height, overscan = 240) {
  const lower = Math.max(0, top - overscan), upper = top + height + overscan;
  let left = 0, right = items.length;
  while (left < right) {
    const middle = (left + right) >>> 1;
    if (items[middle].start + items[middle].size < lower) left = middle + 1;
    else right = middle;
  }
  const start = left;
  while (left < items.length && items[left].start <= upper) left++;
  return [start, left];
}

export function centeredScroll(position, zoom, viewport) {
  return {
    left: Math.max(0, (position.x + position.w / 2) * zoom - viewport.clientWidth / 2),
    top: Math.max(0, (position.y + position.h / 2) * zoom - viewport.clientHeight / 2),
  };
}
