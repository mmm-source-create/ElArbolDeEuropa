// Merge researched chronological and regional additions. The base dataset
// remains bounded: a later timeline does not extend every historical border.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {applyRegionalExtents} from './apply-regional-extents.mjs';
const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const correctionKey = item => [item.territory,item.id,item.action,item.from,item.through].join('|');

export function mergeMapExpansions(data) {
  const chronology = read('extended-corridors-locations.json');
  const central = read('central-expansion-locations.json');
  const balkans = read('balkan-expansion-locations.json');
  const period = chronology.scope || {from:1200,through:1800};
  data.basePeriod = {from:1400,through:1650};
  data.from = period.from;
  data.through = period.through;
  const additions = [...(chronology.territories || []), ...central.territories, ...balkans.territories]
    .map(entry=>({...entry,precision:entry.precision || 'documented_core',limitedCore:true}));
  if (new Set(additions.map(entry=>entry.name)).size !== additions.length)
    throw new Error('Duplicate researched layer names');
  const addedNames = new Set([...additions.map(entry => entry.name),...(data.expansion?.layerNames || [])]);
  data.additionalTerritories = [...data.additionalTerritories.filter(entry => !addedNames.has(entry.name)), ...additions];
  let layers = [...data.territories,...data.additionalTerritories];
  const byName = new Map(layers.map(entry => [entry.name,entry]));
  for (const entry of layers) delete entry.temporalExtensions;
  const temporalExtensions=[...chronology.temporalExtensions,...(central.temporalExtensions || []),...(balkans.temporalExtensions || [])];
  for (const extension of temporalExtensions) {
    const entry = byName.get(extension.name);
    if (!entry) throw new Error(`Unknown extended jurisdiction: ${extension.name}`);
    if (extension.periods.some(period => period.from <= 1650 && period.through >= 1400))
      throw new Error(`Temporal extension overlaps the base period: ${extension.name}`);
    for (const period of extension.periods) {
      if (!extension.versions.some(version=>version.from === period.from))
        throw new Error(`Missing independent period anchor: ${extension.name}, ${period.from}`);
    }
    (entry.temporalExtensions ||= []).push(extension);
  }
  const corrections = [...(chronology.overrides || []),...(central.overrides || []), ...(balkans.overrides || []),
    ...[...(chronology.evidence || []),...(central.evidence || []),...(balkans.evidence || [])].flatMap(group => group.ids.map(id => ({
      territory:group.territory,id,action:group.action || 'add',from:group.from,through:group.through,
      reason:group.reason,source:typeof group.source==='string'?group.source:group.source.url,
      ...(group.authorityCondition ? {authorityCondition:group.authorityCondition} : {}),
      ...(group.supportingSources?.length ? {supportingSources:group.supportingSources} : {})})))].map(item=>({...item,supplement:'map-expansion'}));
  data.overrides = [...new Map([...(data.overrides || []).filter(item=>item.supplement !== 'map-expansion'),...corrections].map(item => [correctionKey(item),item])).values()];
  applyRegionalExtents(data, read('regional-extent-review.json'));
  layers = [...data.territories, ...data.additionalTerritories];
  const svg = fs.readFileSync(new URL('euv-locations-crop.svg',import.meta.url),'utf8');
  const ids = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
  for (const layer of layers) {
    const series = [layer,...(layer.temporalExtensions || [])];
    for (const entry of series) for (const version of entry.versions) {
      if (!Number.isInteger(version.from)) throw new Error(`Invalid date: ${layer.name}`);
      version.oldIds ||= [];
      version.borderline ||= [];
      for (const id of version.ids) if (!ids.has(id)) throw new Error(`Missing SVG region: ${id}`);
    }
  }
  for (const layer of layers.filter(entry => entry.corridor === 'Revisión de superficies regionales')) {
    if (!layer.sources?.length || !layer.coverage || layer.coverage.from < data.from || layer.coverage.through > data.through)
      throw new Error(`Invalid regional evidence: ${layer.name}`);
  }
  for (const item of data.overrides.filter(item => item.supplement === 'regional-extent'))
    if (!layers.some(layer => layer.name === item.territory) || !ids.has(item.id) || !item.source)
      throw new Error(`Invalid regional exclusion: ${item.id}`);
  for (const layer of additions) if (!layer.coverage || layer.coverage.from < data.from
    || layer.coverage.through > data.through || layer.coverage.from > layer.coverage.through)
    throw new Error(`Missing or invalid layer coverage: ${layer.name}`);
  for (const correction of corrections) {
    if (!byName.has(correction.territory) || !ids.has(correction.id)
        || correction.from < data.from || correction.through > data.through
        || correction.from > correction.through || !correction.source || !correction.reason)
      throw new Error(`Invalid researched correction: ${JSON.stringify(correction)}`);
  }
  data.expansion = {from:data.from,through:data.through,extendedLayers:temporalExtensions.length,
    layerNames:additions.map(entry=>entry.name),
    westernLayers:(chronology.territories || []).length,centralLayers:central.territories.length,balkanLayers:balkans.territories.length,
    sourcedCorrections:corrections.length};
  return data;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = mergeMapExpansions(read('corridor-locations.json'));
  fs.writeFileSync(new URL('corridor-locations.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
  console.log(`Expanded map ${data.from}–${data.through}: ${data.expansion.extendedLayers} chronological series, ${data.expansion.centralLayers + data.expansion.balkanLayers} new regional layers`);
}
