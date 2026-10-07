import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mosaicPalette, politicalMosaicAt} from '../prototypes/euv-locations/location-mosaic.js';
import {atlasMosaicPalette, atlasPoliticalMosaicAt} from '../prototypes/euv-locations/atlas-mosaic.js';

const data = JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json', import.meta.url)));
const palette = mosaicPalette(data);
const layer = (snapshot, name) => snapshot.layers.find(entry => entry.name === name);

test('the full-year mosaic gives every active jurisdiction its own stable color', () => {
  const at1500 = politicalMosaicAt(data, 1500, palette);
  const at1600 = politicalMosaicAt(data, 1600, palette);
  const colors = new Set(at1500.layers.map(entry => entry.mosaicColor));

  assert.ok(at1500.layers.length > 60);
  assert.equal(colors.size, at1500.layers.length);
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
  assert.ok(layer(at1569, 'Livonia del Commonwealth').ids.length > 0);
  assert.equal(layer(at1629, 'Livonia del Commonwealth'), undefined);
  assert.ok(layer(at1629, 'Livonia sueca').ids.length > 0);
  assert.ok(layer(at1500, 'Islas Feroe bajo la Corona noruega').ids.includes('Torshavn'));
  assert.match(layer(at1629, 'Livonia sueca').active.source, /^https:\/\//);
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
  assert.equal(new Set(complete.layers.map(entry => entry.mosaicColor)).size, complete.layers.length);
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
