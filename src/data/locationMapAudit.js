import {buildPoliticalMapIndex} from './politicalMapIndex.js';
import {reviewedMapLayers, reviewedLayerLocations} from './locationMapPilot.js';

// The exported SVG retains world paths outside its European viewBox. Coverage
// is assessed for mapped locations; other paths are inventoried, not assigned.
export function atlasLocationIds(svg) {
  const map = svg.slice(svg.indexOf('</defs>') + 7);
  return new Set([...map.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
}

function extendInterval(target, key, year, detail) {
  const previous = target.get(key);
  if (previous?.at(-1)?.through === year - 1) previous.at(-1).through = year;
  else {
    if (!previous) target.set(key, []);
    target.get(key).push({from: year, through: year, ...detail});
  }
}

export function auditLocationMap(personas, data, svgIds, {from = data.from, through = data.through} = {}) {
  const layers = reviewedMapLayers(data).filter(layer => layer.name !== 'Marco jurídico del Sacro Imperio');
  const references = layers.flatMap(layer => [layer,...(layer.temporalExtensions || [])].flatMap(entry => entry.versions.flatMap(version =>
    version.ids.map(id => ({layer: layer.name, id})))));
  const crosswalkIds = Object.values(data.locationCrosswalk?.newIdsByOldId || {}).flatMap(match => match.ids);
  const supplementIds = (data.burgundy?.people || []).flatMap(person => person.governments
    .flatMap(g => g.versions.flatMap(v => v.ids)));
  const corrections = (data.overrides || []).map(o => ({layer: o.territory, id: o.id}));
  const mappedIds = new Set([...references.map(r => r.id), ...crosswalkIds, ...supplementIds, ...corrections.map(o => o.id)]);
  const missingGeometry = [...new Map(references.concat(crosswalkIds.map(id => ({layer: 'Crosswalk', id})),
    supplementIds.map(id => ({layer: 'Sucesión borgoñona', id})), corrections)
    .filter(r => !svgIds.has(r.id)).map(r => [`${r.layer}:${r.id}`, r])).values()];
  const gaps = new Map(), conflicts = new Map(), unreviewed = new Map();
  const transitions = new Map(), unsourced = new Map();
  let previous = new Map();
  const cuts = [];
  for (let year = from; year <= through; year++) {
    const expected = new Map();
    for (const layer of layers) for (const id of reviewedLayerLocations(data, layer, year)) {
      if (!expected.has(id)) expected.set(id, []);
      expected.get(id).push(layer.name);
    }
    const index = buildPoliticalMapIndex(personas, year, data);
    const current = new Map();
    let coloredRegions = 0;
    for (const id of mappedIds) {
      const entries = (index.get(id) || []).filter(e => e.paint !== false);
      const authorities = [...new Set(entries.map(e => e.person?.id || e.collective?.nombre))].sort();
      const signature = authorities.join('|');
      current.set(id, signature);
      if (entries.length) coloredRegions++;
      if (expected.has(id) && !entries.length) extendInterval(gaps, `${id}:${expected.get(id).join('|')}`, year, {regionId: id, jurisdictions: expected.get(id)});
      if (!expected.has(id) && !entries.length) extendInterval(unreviewed, id, year, {regionId: id});
      const sovereigns = [...new Set(entries.filter(e => e.kind === 'sovereign').map(e => e.person?.id).filter(Boolean))].sort();
      if (sovereigns.length > 1) extendInterval(conflicts, `${id}:${sovereigns.join('|')}`, year,
        {regionId: id, people: sovereigns, interpretation: 'Revisar relevo anual, autoridad superior o atribución superpuesta; no es automáticamente un error histórico.'});
      if (year > from && previous.get(id) !== signature) {
        const key = `${year}:${previous.get(id)}:${signature}`;
        if (!transitions.has(key)) transitions.set(key, {year, before: previous.get(id)?.split('|').filter(Boolean) || [], after: authorities, regions: []});
        transitions.get(key).regions.push(id);
      }
      for (const entry of entries) {
        if (!entry.person || entry.claim?.sources?.length) continue;
        const key = `${entry.person.id}:${entry.territory}:${entry.government.desde}:${entry.government.hasta}`;
        if (!unsourced.has(key)) unsourced.set(key, {personId: entry.person.id, territory: entry.territory,
          from: entry.government.desde, through: entry.government.hasta, firstObserved: year, regions: new Set()});
        unsourced.get(key).regions.add(id);
      }
    }
    if ([from,1200,1300,1400,1459,1527,1530,1560,1581,1629,1648,1700,1800,through].includes(year)) cuts.push({year, coloredRegions, reviewedRegions: expected.size});
    previous = current;
  }
  const flatten = map => [...map.values()].flat();
  const grouped = new Map();
  const corridorFor = new Map(layers.map(l => [l.name, l.corridor]));
  for (const interval of flatten(gaps)) {
    const jurisdictions = [...interval.jurisdictions].sort();
    const key = `${interval.from}:${interval.through}:${jurisdictions.join('|')}`;
    if (!grouped.has(key)) grouped.set(key, {from: interval.from, through: interval.through,
      jurisdictions, corridors: [...new Set(jurisdictions.map(name => corridorFor.get(name)).filter(Boolean))], regions: []});
    grouped.get(key).regions.push(interval.regionId);
  }
  const priority = task => task.corridors.includes('Hungría y Balcanes') ? 0
    : task.corridors.includes('Europa septentrional y oriental') ? 1 : 2;
  const reviewTasks = [...grouped.values()].sort((a,b) => priority(a) - priority(b)
    || b.regions.length - a.regions.length || a.from - b.from);
  return {
    scope: `EU V Locations, ${from}–${through}, todos los años y todas las locations vinculadas al Atlas`,
    method: 'Las capas fechadas definen dónde esperar autoridad. El gris puede indicar falta de una ficha o falta de revisión cartográfica. Regencias y títulos no se cuentan como soberanos rivales.',
    geometry: {svgLocations: svgIds.size, mappedLocations: mappedIds.size,
      pathsOutsideMappedScope: [...svgIds].filter(id => !mappedIds.has(id)).length, missingGeometry},
    authorityGaps: flatten(gaps), overlapCandidates: flatten(conflicts),
    withoutReviewedJurisdiction: flatten(unreviewed), authorityChanges: [...transitions.values()],
    governmentsWithoutClaimSource: [...unsourced.values()].map(g => ({...g, regions: [...g.regions]})), cuts,
    reviewTasks,
  };
}
