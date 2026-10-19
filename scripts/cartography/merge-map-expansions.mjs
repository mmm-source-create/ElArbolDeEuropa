import {mapDataFile} from '../lib/project-paths.mjs';
// Merge researched chronological and regional additions. The base dataset
// remains bounded: a later timeline does not extend every historical border.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {applyRegionalExtents} from './apply-regional-extents.mjs';
import {applyContinuityReview} from './apply-continuity-review.mjs';
import {applyMedievalBalkans} from './apply-medieval-balkans.mjs';
import {applyRegionalReview} from './apply-regional-review.mjs';
const read = name => JSON.parse(fs.readFileSync(mapDataFile(name), 'utf8'));
const correctionKey = item => [item.territory,item.id,item.action,item.from,item.through].join('|');

export function mergeMapExpansions(data) {
  const chronology = read('extended-corridors-locations.json');
  const central = read('central-expansion-locations.json');
  const balkans = read('balkan-expansion-locations.json');
  const period = chronology.scope || {from:1200,through:1800};
  data.basePeriod = {from:1400,through:1650};
  const early=read('early-medieval-review.json');
  data.from = Math.min(period.from,early.scope.from);
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
  applyContinuityReview(data, read('continuity-review.json'));
  const continuity = data.continuityReview;
  const frontier = read('frontier-review.json');
  applyContinuityReview(data, frontier);
  data.frontierReview = data.continuityReview;
  data.continuityReview = continuity;
  const succession = read('succession-review.json');
  applyContinuityReview(data, succession);
  data.successionReview = data.continuityReview;
  data.continuityReview = continuity;
  data.overrides = [...data.overrides.filter(item => item.supplement !== 'succession-review'),
    ...succession.overrides.map(item => ({...item, supplement:'succession-review'}))];
  data.overrides = [...data.overrides.filter(item => item.supplement !== 'frontier-review'),
    ...frontier.overrides.map(item => ({...item, supplement:'frontier-review'}))];
  const referenceGaps = read('reference-gap-review.json');
  applyContinuityReview(data, referenceGaps);
  data.referenceGapReview = data.continuityReview;
  data.continuityReview = continuity;
  applyMedievalBalkans(data, read('medieval-balkans-review.json'));
  applyRegionalReview(data, read('bosnia-hum-review.json'), 'bosniaHumReview', 'Bosnia y Hum · revisión regional');
  applyRegionalReview(data, read('posavina-ragusa-review.json'), 'posavinaRagusaReview', 'Kozara–Glaž y costa ragusea · revisión regional');
  applyRegionalReview(data, read('balkans-full-review.json'), 'balkansFullReview', 'Balcanes y Egeo · continuidad geográfica completa');
  applyRegionalReview(data, read('iberia-italy-full-review.json'), 'iberiaItalyReview', 'Iberia e Italia · continuidad geográfica completa');
  applyRegionalReview(data, read('france-low-countries-full-review.json'), 'franceLowCountriesReview', 'Francia y Países Bajos · continuidad geográfica completa');
  applyRegionalReview(data,early,'earlyMedievalReview','Atlas medieval · gobiernos anteriores a 1200');
  const polishContinuity=read('poland-lithuania-continuity-review.json');
  applyContinuityReview(data,polishContinuity);
  data.polandLithuaniaContinuityReview=data.continuityReview;
  data.continuityReview=continuity;
  // V5.34: German dynastic cores of the initial 1400–1650 survey continued to 1800.
  applyContinuityReview(data,read('german-cores-continuity-review.json'));
  data.germanCoresContinuityReview=data.continuityReview;
  data.continuityReview=continuity;
  applyRegionalReview(data,read('poland-lithuania-medieval-review.json'),'polandLithuaniaMedievalReview','Polonia-Lituania · principados y continuidad de las regiones orientales');
  applyRegionalReview(data,read('poland-lithuania-full-review.json'),'polandLithuaniaReview','Polonia-Lituania · tres repartos y continuidad de los estados receptores');
  applyRegionalReview(data,read('poland-lithuania-frontier-review.json'),'polandLithuaniaFrontierReview','Polonia-Lituania · Smolensk, Chernigov y margen izquierda');
  applyRegionalReview(data,read('eastern-europe-full-review.json'),'easternEuropeReview','Polonia-Lituania, Rusia y Báltico · continuidad geográfica completa');
  applyRegionalReview(data,read('north-africa-levant-review.json'),'northAfricaLevantReview','Norte de África, Levante y Chipre · continuidad geográfica completa');
  for(const [name,evidence] of Object.entries(read('eastern-europe-full-review.json').retainedLayerEvidence || {})){
    const layer=[...data.territories,...data.additionalTerritories].find(t=>t.name===name);
    if(!layer)throw Error('Missing retained eastern layer: '+name);
    Object.assign(layer,evidence);
  }
  const germanSwiss = read('german-swiss-expansion-review.json');
  applyRegionalReview(data,germanSwiss,'germanSwissReview','Alemania y Suiza · ampliación de núcleos documentados');
  data.overrides = [...data.overrides.filter(item => item.supplement !== 'german-swiss-review'),
    ...(germanSwiss.overrides || []).map(item => ({...item,supplement:'german-swiss-review'}))];
  applyRegionalReview(data,read('germany-completion-review.json'),'germanyCompletionReview','Alemania · cobertura de intervalos vacíos 1200–1800');
  layers = [...data.territories, ...data.additionalTerritories];
  const svg = fs.readFileSync(mapDataFile('euv-locations-crop.svg'),'utf8');
  const ids = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
  for (const layer of referenceGaps.territories) {
    if (!layer.sources?.length || layer.sources.some(source => !source.url?.startsWith('https://') || !source.locator)
      || !layer.coverage || layer.coverage.from < data.from || layer.coverage.through > data.through
      || layer.coverage.from > layer.coverage.through || layer.versions[0]?.from !== layer.coverage.from)
      throw new Error(`Invalid reference-gap evidence or period: ${layer.name}`);
  }
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
  for (const item of data.overrides.filter(item => ['regional-extent','frontier-review','succession-review'].includes(item.supplement)))
    if (!layers.some(layer => layer.name === item.territory) || !ids.has(item.id)
        || !item.source || !item.reason || !Number.isInteger(item.from) || !Number.isInteger(item.through)
        || item.from < data.from || item.through > data.through || item.from > item.through)
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
  fs.writeFileSync(mapDataFile('corridor-locations.json'),JSON.stringify(data,null,2)+'\n');
  console.log(`Expanded map ${data.from}–${data.through}: ${data.expansion.extendedLayers} chronological series, ${data.expansion.centralLayers + data.expansion.balkanLayers} new regional layers`);
}
