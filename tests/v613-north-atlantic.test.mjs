import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {NORTH_ATLANTIC_IDENTITIES} from '../src/cartography/regions/northAtlanticRoutes.js';

const read = name => JSON.parse(fs.readFileSync(new URL(`../data/cartography/${name}.json`, import.meta.url)));
const review = read('north-atlantic-review');
const data = read('corridor-locations');
data.burgundy = read('burgundian-locations');
const mosaics = new Map();
const at = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  return mosaics.get(year).byLocation.get(id)?.[0];
};

test('the North Atlantic review only fills uncoloured cells and cites its sources', () => {
  assert.equal(data.northAtlanticReview.layerNames.length, review.assignments.length);
  assert.deepEqual(review.precedenceIds, []);
  for (const assignment of review.assignments) {
    assert.ok(assignment.from >= 1200 && assignment.through <= 1800 && assignment.from <= assignment.through, assignment.name);
    assert.ok(assignment.sourceKeys.length, assignment.name);
    for (const key of assignment.sourceKeys) assert.match(review.sources[key].url, /^https:\/\//, key);
  }
  for (const id of ['Galway', 'Donegal', 'Cork', 'Reikjavik', 'Visby', 'Abisko', 'Kajana', 'Eiriksfjord']) assert.ok(review.scope.ids.includes(id), id);
});

test('Ireland, Lapland, Kola and Greenland are coloured in every century', () => {
  const ids = review.scope.ids;
  for (let year = 1200; year <= 1800; year += 25) {
    const empty = ids.filter(id => !at(year, id)?.mosaicColor);
    assert.deepEqual(empty, [], `${year}`);
  }
});

test('the new territories show their period names and one colour per identity', () => {
  assert.equal(at(1250, 'Reikjavik').politicalLabel, 'Mancomunidad islandesa');
  assert.equal(at(1500, 'Donegal').politicalLabel, 'Tír Chonaill');
  assert.equal(at(1500, 'Eiriksfjord').politicalLabel, 'Groenlandia inuit');
  assert.equal(at(1500, 'Abisko').politicalLabel, 'Laponia');
  assert.equal(at(1789, 'Abisko').politicalLabel, 'Suecia');
  assert.equal(at(1789, 'Eiriksfjord').politicalLabel, 'Reino de Dinamarca');
  // Every cell of an identity shares its colour in a given year.
  for (const [year, a, b] of [[1500, 'Cavan', 'Belfast'], [1500, 'Abisko', 'Arjeplog'], [1789, 'Kajana', 'Bjorneborg']])
    assert.equal(at(year, a).mosaicColor, at(year, b).mosaicColor, `${a}/${b} ${year}`);
  assert.ok(Object.keys(NORTH_ATLANTIC_IDENTITIES).length > 0);
});
