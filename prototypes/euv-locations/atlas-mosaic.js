import {PERSONAS} from '../../src/personas.jsx';
import {idsDeGobiernoEnAño, listaReinados, reinadoEsEfectivo} from '../../src/Territorios.jsx';
import {personClaims} from '../../src/evidence/claims.js';
import {mapLocationsForGovernment, pilotJurisdictionsFor} from '../../src/data/locationMapPilot.js';
import {mosaicPalette, politicalMosaicAt} from './location-mosaic.js';

const entriesFor = data => [...(data?.territories || []), ...(data?.additionalTerritories || [])];
const evidenceByPerson = new Map(PERSONAS.map(person => [person.id, new Map(personClaims(person)
  .filter(claim => claim.field === 'Gobierno').map(claim => [claim.value, claim]))]));

export function atlasMosaicPalette(data, people = PERSONAS) {
  const approximateTerritories = [...new Set(people.flatMap(person =>
    listaReinados(person).map(government => government.territorio).filter(Boolean)))];
  return mosaicPalette(data, approximateTerritories);
}

function sourceList(claim) {
  return [...new Map((claim?.sources || []).filter(source => source?.url)
    .map(source => [source.url, source])).values()];
}

function approximateGovernmentLayers(data, people, year, directByLocation, palette) {
  const entriesByName = new Map(entriesFor(data).map(entry => [entry.name, entry]));
  const layersByTerritory = new Map();

  for (const person of people) {
    const claims = people === PERSONAS
      ? evidenceByPerson.get(person.id) || new Map()
      : new Map(personClaims(person).filter(claim => claim.field === 'Gobierno')
        .map(claim => [claim.value, claim]));
    for (const government of listaReinados(person)) {
      if (!reinadoEsEfectivo(government) || government.desde > year || government.hasta < year) continue;

      // Reviewed and dated layers take priority. If a title has a named layer,
      // an inactive layer stays empty instead of inheriting broad old geometry.
      const namedLayers = pilotJurisdictionsFor(government.territorio, year, person.id)
        .map(name => entriesByName.get(name)).filter(Boolean);
      if (namedLayers.length) continue;

      const oldIds = idsDeGobiernoEnAño(government, year, person.id);
      const mappedIds = mapLocationsForGovernment(data, government, year, person.id, oldIds)
        .filter(id => !directByLocation.has(id));
      if (!mappedIds.length) continue;

      const name = government.territorio;
      const key = `approximate\u0000${name}`;
      let layer = layersByTerritory.get(name);
      if (!layer) {
        layer = {
          key,
          name,
          corridor: 'Equivalencia geométrica aproximada',
          approximate: true,
          note: 'Proyección de un gobierno del Atlas mediante el solapamiento de regiones antiguas y locations modernas. No prueba una frontera histórica.',
          ids: new Set(),
          holders: new Set(),
          sources: new Map(),
          mosaicColor: palette.get(key),
        };
        layersByTerritory.set(name, layer);
      }
      mappedIds.forEach(id => layer.ids.add(id));
      layer.holders.add(`${person.nombre} · ${government.titulo || 'gobierno'}`);
      for (const source of sourceList(claims.get(government))) layer.sources.set(source.url, source);
    }
  }

  return [...layersByTerritory.values()]
    .map(layer => ({...layer, ids: [...layer.ids], holders: [...layer.holders], sources: [...layer.sources.values()]}))
    .filter(layer => layer.ids.length)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export function atlasPoliticalMosaicAt(data, year, palette = atlasMosaicPalette(data), people = PERSONAS) {
  const reviewed = politicalMosaicAt(data, year, palette);
  if (!data || !Number.isInteger(year) || year < data.from || year > data.through) {
    return {...reviewed, reviewedLayerCount: reviewed.layers.length, approximateLayerCount: 0, approximateLocationCount: 0};
  }

  const layers = [...reviewed.layers];
  const byLocation = new Map([...reviewed.byLocation].map(([id, matches]) => [id, [...matches]]));
  const approximate = approximateGovernmentLayers(data, people, year, byLocation, palette);
  for (const layer of approximate) {
    layers.push(layer);
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
    reviewedLayerCount: reviewed.layers.length,
    approximateLayerCount: approximate.length,
    approximateLocationCount: approximate.reduce((total, layer) => total + layer.ids.length, 0),
  };
}
