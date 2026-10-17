import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mosaicPalette, politicalMosaicAt} from '../src/cartography/locationMosaic.js';
import {atlasMosaicPalette, atlasPoliticalMosaicAt} from '../src/cartography/atlasMosaic.js';

const data = JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json', import.meta.url)));
const palette = mosaicPalette(data);
const layer = (snapshot, name) => snapshot.layers.find(entry => entry.name === name);

function assertColorsHaveAnIdentity(layers) {
  const groups = new Map();
  for (const layer of layers) {
    const key = layer.politicalColorGroup || layer.entityId || layer.name;
    if (groups.has(layer.mosaicColor)) assert.equal(groups.get(layer.mosaicColor),key);
    else groups.set(layer.mosaicColor,key);
  }
}
test('the full-year mosaic gives identities stable colors and integrates documented political groups', () => {
  const at1500 = politicalMosaicAt(data, 1500, palette);
  const at1600 = politicalMosaicAt(data, 1600, palette);
  const colors = new Set(at1500.layers.map(entry => entry.mosaicColor));

  assert.ok(at1500.layers.length > 60);
  assert(colors.size > 60);
  assertColorsHaveAnIdentity(at1500.layers);
  assert.equal(layer(at1500, 'Marco jurídico del Sacro Imperio'), undefined);
  assert.equal(layer(at1500, 'Ducado de Pomerania').mosaicColor, layer(at1600, 'Ducado de Pomerania').mosaicColor);
  assert.ok(at1500.byLocation.size > 500);
});

test('the mosaic follows dated transfers and marks corrections with sources', () => {
  const at1569 = politicalMosaicAt(data, 1569, palette);
  const at1629 = politicalMosaicAt(data, 1629, palette);
  const at1500 = politicalMosaicAt(data, 1500, palette);

  assert.ok(layer(at1569, 'Corona de Polonia').ids.includes('Kyiv'));
  assert.ok(!layer(at1569, 'Gran Ducado de Lituania').ids.includes('Kyiv'));
  assert(at1569.byLocation.get('Riga').some(l=>l.entityId==='Ciudad libre de Riga'));
  assert(at1569.byLocation.get('Daugavpils').some(l=>l.entityId==='Livonia polaca'));
  assert(at1629.byLocation.get('Riga').some(l=>l.entityId==='Suecia'));
  assert(at1629.byLocation.get('Daugavpils').some(l=>l.entityId==='Livonia polaca'));
  assert.ok(layer(at1500, 'Islas Feroe bajo la Corona noruega').ids.includes('Torshavn'));
  assert(at1629.byLocation.get('Riga').every(l=>l.scopes.some(s=>s.sources.some(v=>v.url.startsWith('https://')&&v.locator))));
});

test('out-of-range years produce an empty mosaic instead of projecting a future map', () => {
  assert.equal(politicalMosaicAt(data, data.through + 1, palette).layers.length, 0);
});

test('the Atlas mosaic adds every mappable active government with a distinct approximate color', () => {
  const fullPalette = atlasMosaicPalette(data);
  const direct = politicalMosaicAt(data, 1500, fullPalette);
  const complete = atlasPoliticalMosaicAt(data, 1500, fullPalette);
  const approximate = complete.layers.filter(entry => entry.approximate);
  const directLocations = new Set(direct.byLocation.keys());

  assert.ok(approximate.length > 0);
  assert.ok(complete.layers.length > direct.layers.length);
  assertColorsHaveAnIdentity(complete.layers);
  assert.equal(complete.reviewedLayerCount, direct.layers.length);
  assert.equal(complete.approximateLayerCount, approximate.length);
  assert.ok(approximate.every(layer => layer.ids.length && layer.note.includes('No prueba')));
  assert.ok(approximate.every(layer => layer.ids.every(id => !directLocations.has(id))),
    'directly reviewed locations take precedence over approximate crosswalk claims');
});

test('the full Atlas mosaic preserves source links for government claims without implying sourced borders', () => {
  const complete = atlasPoliticalMosaicAt(data, 1548, atlasMosaicPalette(data));
  const cited = complete.layers.find(layer => layer.approximate && layer.sources.length);

  assert.ok(cited, 'at least some approximate governments retain their claim sources');
  assert.ok(cited.sources.every(source => /^https?:\/\//.test(source.url)));
  assert.match(cited.note, /No prueba una frontera/);
});
