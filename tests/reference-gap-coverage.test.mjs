import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {atlasPoliticalMosaicAt} from '../prototypes/euv-locations/atlas-mosaic.js';
import {territorialColor} from '../src/data/territorialIdentity.js';
import {mergeMapExpansions} from '../prototypes/euv-locations/merge-map-expansions.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const data = read('../prototypes/euv-locations/corridor-locations.json');
const review = read('../prototypes/euv-locations/reference-gap-review.json');
const people = new Map(PERSONAS.map(person => [person.id, person]));
const authority = (id, year, territory) => mapAuthoritiesForPerson(people.get(id), year, data)
  .find(entry => entry.territory === territory);
const owners = (id, year) => atlasPoliticalMosaicAt(data, year).byLocation.get(id) || [];

test('Iceland follows Norwegian royal authority from the conventional 1264 cut, including physical areas', () => {
  const island = review.territories.find(layer => layer.name === 'Islandia bajo la Corona noruega');
  for (const id of island.versions[0].ids) {
    assert.equal(owners(id, 1263).length, 0, id);
    assert(authority('MAGNUS6NOR', 1264, 'Noruega').ids.includes(id), id);
    assert(authority('CHRISTIAN7DEN', 1800, 'Noruega').ids.includes(id), id);
  }
  const layer = owners('Icelandic_Highlands', 1530)[0];
  assert.equal(layer.entityId, 'Islandia');
  assert.equal(layer.mosaicColor, territorialColor('Islandia'));
  assert(layer.sources.some(source => source.url === 'https://www.althingi.is/pdf/enska.pdf'));
  assert.match(layer.note, /1281/);
});

test('Buzet changes authority in 1797 without colouring Pazin as Venetian or creating a gap', () => {
  assert.equal(owners('Buzet', 1420).length, 0);
  assert(authority('TOMMOCENIGODOGE', 1421, 'Venecia').ids.includes('Buzet'));
  assert(!authority('ANDGRITTIDOGE', 1530, 'Venecia').ids.includes('Pazin'));
  for (const year of [1796, 1797, 1798, 1800]) {
    const matches = owners('Buzet', year);
    assert.equal(matches.length, 1, year);
    assert.equal(matches[0].entityId, year < 1797 ? 'Venecia' : 'Austria');
  }
  const austrian = authority('FRAN2HRE', 1797, 'Austria');
  assert(austrian.ids.includes('Buzet'));
  assert(austrian.mapSources.some(source => source.url.endsWith('/istra-poluotok')));
});

test('southern Moldavian areas remain princely and do not swallow the ports or Bucovina', () => {
  const ids = ['Adjud', 'Barlad', 'Targu_Trotus', 'Tutova'];
  for (const id of ids) {
    assert.equal(owners(id, 1456).length, 0);
    assert(authority('STEPHEN3MOLD', 1458, 'Moldavia').ids.includes(id));
    assert(authority('PETRURARESMOLD', 1530, 'Moldavia').ids.includes(id));
    for (const year of [1458, 1530, 1776, 1800]) {
      assert.deepEqual(owners(id, year).map(layer => layer.entityId), ['Principado de Moldavia']);
    }
    assert(!authority('SULEIMAN1OSM', 1530, 'Imperio otomano').ids.includes(id));
  }
  const moldavia = owners('Tutova', 1776)[0];
  assert(!moldavia.ids.includes('Suceava'));
  assert(!moldavia.ids.includes('Chilia'));
  assert(!moldavia.ids.includes('Tighina'));
  assert(moldavia.scopes.some(scope => scope.name === 'Moldavia · comarcas meridionales' && scope.sources.length));
});

test('the additions are reproducible, measured SVG surfaces with independent dated evidence', () => {
  const inventory = read('../prototypes/euv-locations/location-inventory.json');
  const measured = read('../prototypes/euv-locations/regional-extent-cells.json');
  const newIds = new Set(review.territories.flatMap(layer => layer.versions.flatMap(version => version.ids)));
  assert.equal(newIds.size, 31);
  for (const id of newIds) {
    assert(inventory.cells.some(cell => cell.id === id && cell.visible && cell.area > 0), id);
    assert(measured.cells.some(cell => cell.id === id && cell.area > 0), id);
  }
  const regenerated = mergeMapExpansions(structuredClone(data));
  for (const layer of review.territories) {
    assert.deepEqual(regenerated.additionalTerritories.find(entry => entry.name === layer.name), layer);
    assert(layer.sources.every(source => source.url.startsWith('https://') && source.locator));
  }
  assert(!newIds.has('Novigrad'));
});
