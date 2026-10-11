import fs from 'node:fs/promises';
import path from 'node:path';
import {canonicalJson, digest} from './canonical.mjs';
import {personClaims} from '../../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../../src/data/mapAuthorities.js';
import {atlasMosaicPalette, atlasPoliticalMosaicAt} from '../../prototypes/euv-locations/atlas-mosaic.js';
import {STATIC_FOLDERS} from '../../src/public/staticData.js';
import {routesFromSitemap} from '../lib/ssg-utils.mjs';

const sorted = values => [...values].sort((a, b) => canonicalJson(a) < canonicalJson(b) ? -1 : canonicalJson(a) > canonicalJson(b) ? 1 : 0);
const unique = values => [...new Set(values.filter(Boolean))].sort();

// Test projection only. Production continues to read its existing source model.
// A format migration can preserve meaning without preserving raw JSON bytes.
export function semanticValue(value) {
  if (Array.isArray(value)) return value.map(semanticValue);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .map(([key, entry]) => [key, key === 'controlDisputado' ? [].concat(entry || []).map(semanticValue) : semanticValue(entry)]));
  return value;
}

export function personSnapshot(person) {
  const {conyuge, conyuge2, conyuges, reinados, gobiernos, ...details} = person;
  return digest({details, spouses: unique([conyuge, conyuge2, ...(conyuges || [])]),
    governments: sorted((gobiernos || []).map(semanticValue)),
    claims: sorted(personClaims(person).map(semanticValue))});
}

export function mosaicSnapshot(mosaic) {
  return digest({layers: sorted(mosaic.layers.map(layer => ({
    identity: layer.entityId, key: layer.key, label: layer.displayName,
    color: layer.mosaicColor, approximate: layer.approximate,
    ids: unique(layer.ids), note: layer.note, precision: layer.precision,
    limitedCore: layer.limitedCore, condition: layer.authorityCondition,
    sources: sorted(layer.sources || []), holders: unique(layer.holders || []),
    scopes: sorted((layer.scopes || []).map(scope => ({...scope, ids: unique(scope.ids), sources: sorted(scope.sources || [])}))),
  }))),
  // Preserve overlap precedence even when the set of coloured IDs is unchanged.
  cells: sorted([...mosaic.byLocation].map(([id, matches]) => [id, matches.map(layer => layer.key)]))});
}

export function personalSnapshot(entries) {
  return digest(sorted(entries.map(entry => ({
    person: entry.person.id, territory: entry.territory, government: semanticValue(entry.government),
    kind: entry.kind, paint: entry.paint, ids: unique(entry.ids),
    color: entry.color, claim: entry.claim ? semanticValue(entry.claim) : null,
    sources: sorted(entry.mapSources || []), note: entry.mapNote,
    supplement: entry.cartographicSupplement,
  }))));
}

export async function dataSnapshot({people, territories, mapData, root, onProgress = () => {}}) {
  const palette = atlasMosaicPalette(mapData, people);
  const years = {};
  for (let year = 1200; year <= 1800; year++) {
    const mosaic = atlasPoliticalMosaicAt(mapData, year, palette, people);
    const entries = people.filter(person => person.gobiernos?.some(government => government.desde <= year && year <= government.hasta))
      .flatMap(person => mapAuthoritiesForPerson(person, year, mapData, {includeClaims: true}));
    years[year] = {mosaic: mosaicSnapshot(mosaic), personal: personalSnapshot(entries),
      locations: mosaic.byLocation.size, layers: mosaic.layers.length,
      overlaps: mosaic.overlapCount, authorities: entries.length};
    if ((year - 1200) % 100 === 0) onProgress(year);
  }
  return {
    counts: {people: people.length, governments: people.reduce((total, person) => total + (person.gobiernos?.length || 0), 0), territories: Object.keys(territories).length},
    people: Object.fromEntries(people.map(person => [person.id, personSnapshot(person)])),
    territories: Object.fromEntries(Object.entries(territories).map(([name, territory]) => [name, digest(territory)])),
    geometry: {svg: digest(await fs.readFile(path.join(root, 'prototypes/euv-locations/euv-locations-crop.svg'), 'utf8')),
      inventory: digest(JSON.parse(await fs.readFile(path.join(root, 'prototypes/euv-locations/location-inventory.json'), 'utf8'))),
      range: [mapData.from, mapData.through]},
    years,
  };
}

// Read generated files, rather than reimplementing the route generators.
export async function publicSnapshot(root) {
  const dist = path.join(root, 'dist');
  const xml = await fs.readFile(path.join(dist, 'sitemap-full.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
  if (!urls.length) throw new Error('Sitemap vacío');
  const paths = urls.map(url => url.pathname).sort();
  if (new Set(paths).size !== paths.length) throw new Error('Rutas duplicadas');
  const routes = routesFromSitemap(xml, urls[0].origin);
  const counts = {persona: 0, dinastia: 0, territorio: 0, historia: 0, english: 0};
  const pages = {};
  for (const route of routes) {
    const file = `${route.slug}${route.chapter ? `/capitulo/${route.chapter}` : ''}.json`;
    const data = JSON.parse(await fs.readFile(path.join(dist, STATIC_FOLDERS[route.kind], file), 'utf8'));
    const projected = {...data};
    // Public spouses are already expanded by the generator into IDs and cards.
    if (route.kind === 'persona') {delete projected.conyuge; delete projected.conyuge2;}
    pages[route.path] = digest(semanticValue(projected));
    counts[route.kind]++;
  }
  const tree = JSON.parse(await fs.readFile(path.join(root, 'src/generated/treeBase.json'), 'utf8'));
  const meta = JSON.parse(await fs.readFile(path.join(root, 'src/generated/siteMeta.json'), 'utf8'));
  delete meta.buildVersion;
  return {paths, counts, pages, tree: digest({rows: tree.rows, layout: tree.layout}), meta};
}

export function snapshotDifferences(expected, actual, prefix = '') {
  if (canonicalJson(expected) === canonicalJson(actual)) return [];
  if (expected && actual && typeof expected === 'object' && typeof actual === 'object' && !Array.isArray(expected) && !Array.isArray(actual)) {
    return unique([...Object.keys(expected), ...Object.keys(actual)])
      .flatMap(key => snapshotDifferences(expected[key], actual[key], prefix ? `${prefix}.${key}` : key));
  }
  return [prefix || '$'];
}
