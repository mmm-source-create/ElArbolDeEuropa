const FRAME_ONLY_LAYERS = new Set(['Marco jurídico del Sacro Imperio']);

function entriesFor(data) {
  return [...(data?.territories || []), ...(data?.additionalTerritories || [])];
}

function isActive(entry, year, data) {
  if (entry.periods) return entry.periods.some(period => period.from <= year
    && year <= (period.through ?? data.through));
  return !entry.active || (entry.active.from ?? data.from) <= year
    && year <= (entry.active.through ?? data.through);
}

function idsFor(entry, data, year) {
  const version = [...(entry.versions || [])].reverse().find(candidate => candidate.from <= year);
  const ids = new Set(version?.ids || []);
  for (const correction of data.overrides || []) {
    if (correction.territory !== entry.name || correction.from > year || correction.through < year) continue;
    if (correction.action === 'add') ids.add(correction.id);
    if (correction.action === 'remove') ids.delete(correction.id);
  }
  return [...ids];
}

function layerKey(entry) {
  return `${entry.corridor || ''}\u0000${entry.name}`;
}

export function mosaicPalette(data, approximateTerritories = []) {
  const keys = [...new Set([
    ...entriesFor(data).map(layerKey),
    ...approximateTerritories.map(name => `approximate\u0000${name}`),
  ])].sort((a, b) => a.localeCompare(b, 'es'));
  return new Map(keys.map((key, index) => {
    const hue = (17 + index * 137.507764) % 360;
    const saturation = index % 2 ? 67 : 58;
    const lightness = index % 3 ? 46 : 41;
    return [key, `hsl(${hue.toFixed(1)} ${saturation}% ${lightness}%)`];
  }));
}

export function politicalMosaicAt(data, year, palette = mosaicPalette(data)) {
  if (!data || !Number.isInteger(year) || year < data.from || year > data.through) {
    return {year, layers: [], byLocation: new Map(), overlapCount: 0};
  }
  const layers = entriesFor(data)
    .filter(entry => !FRAME_ONLY_LAYERS.has(entry.name) && isActive(entry, year, data))
    .map(entry => ({...entry, key: layerKey(entry), mosaicColor: palette.get(layerKey(entry)), approximate: false, ids: idsFor(entry, data, year)}))
    .sort((a, b) => a.name.localeCompare(b.name, 'es') || a.corridor.localeCompare(b.corridor, 'es'));
  const byLocation = new Map();
  for (const layer of layers) {
    for (const id of layer.ids) {
      if (!byLocation.has(id)) byLocation.set(id, []);
      byLocation.get(id).push(layer);
    }
  }
  return {
    year,
    layers,
    byLocation,
    overlapCount: [...byLocation.values()].filter(matches => matches.length > 1).length,
  };
}
