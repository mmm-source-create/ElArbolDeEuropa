import {reviewedLayerLocations, reviewedLayerActive, reviewedLayerEvidence} from '../../src/data/locationMapPilot.js';
import {supersededRegionalLayers} from '../../src/data/regionalExtentRoutes.js';
import {territorialColor, coalesceTerritorialLayers} from '../../src/data/territorialIdentity.js';
const FRAME_ONLY_LAYERS = new Set(['Marco jurídico del Sacro Imperio']);

function entriesFor(data) {
  return [...(data?.territories || []), ...(data?.additionalTerritories || [])];
}

function idsFor(entry, data, year) {
  return reviewedLayerLocations(data, entry, year);
}

function layerKey(entry) {
  return `${entry.corridor || ''}\u0000${entry.name}`;
}

export function mosaicPalette(data, approximateTerritories = []) {
  const keys = [...new Set([
    ...entriesFor(data).map(layerKey),
    ...approximateTerritories.map(name => `approximate\u0000${name}`),
  ])].sort((a, b) => a.localeCompare(b, 'es'));
  return new Map(keys.map(key => [key, territorialColor(key.split('\u0000')[1])]));
}

export function politicalMosaicAt(data, year, palette = mosaicPalette(data)) {
  if (!data || !Number.isInteger(year) || year < data.from || year > data.through) {
    return {year, layers: [], byLocation: new Map(), overlapCount: 0};
  }
  const superseded = supersededRegionalLayers(data, year);
  const rawLayers = entriesFor(data)
    .filter(entry => !FRAME_ONLY_LAYERS.has(entry.name) && !superseded.has(entry.name) && reviewedLayerActive(data, entry, year))
    .map(entry => {
      const evidence = reviewedLayerEvidence(entry, year);
      return {...entry, note: evidence.note, sources: evidence.sources,
        precision:evidence.precision, limitedCore:evidence.limitedCore,
        active:{...entry.active,reason:evidence.activeReason,source:evidence.sources[0]?.url},
        key: layerKey(entry), mosaicColor: palette.get(layerKey(entry)), approximate: false,
        ids: idsFor(entry, data, year)};
    }).filter(layer => layer.ids.length)
    .sort((a, b) => a.name.localeCompare(b.name, 'es') || a.corridor.localeCompare(b.corridor, 'es'));
  // Preserve the provinces inside a government grouping. The grouping keeps
  // its additional coastal jurisdictions, without repainting the provinces.
  const provinces = new Set(rawLayers.filter(layer => ['Estiria', 'Carintia', 'Carniola'].includes(layer.name)).flatMap(layer => layer.ids));
  const layers = coalesceTerritorialLayers(rawLayers.map(layer => layer.name === 'Austria Interior'
    ? {...layer, ids: layer.ids.filter(id => !provinces.has(id)), note: 'Agrupación de gobierno de Austria Interior. Estiria, Carintia y Carniola figuran por separado; aquí se conservan sus jurisdicciones adicionales del litoral. '+layer.note}
    : layer).filter(layer => layer.ids.length), year);
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
