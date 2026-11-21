import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {governmentGroupsAt} from '../src/domain/government/governmentPresentation.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {tributaryColor} from '../src/cartography/mapColors.js';
import {TRIBUTARY_RELATIONS, subjectRulers} from '../src/cartography/tributaryRelations.js';
import gustavus from '../src/data/stories607/gustavusAdolphus.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = name => JSON.parse(read(`data/cartography/${name}.json`));
const person = id => PERSONAS.find(p => p.id === id);
const data = json('corridor-locations');
data.burgundy = json('burgundian-locations');
const mosaics = new Map();
const mosaic = year => { if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS)); return mosaics.get(year); };
const at = (year, id) => mosaic(year).byLocation.get(id)?.[0];

test('the Gustavus Adolphus story is “The Lion of the North”', () => {
  assert.equal(gustavus.esTitle, 'El León del norte');
  assert.equal(gustavus.enTitle, 'The Lion of the North');
});

test('the home page has one atlas button named after the year, and search results float over the map', () => {
  const home = read('src/features/public/HomePage.jsx');
  assert.match(home, /<a className="home-atlas-open" href=\{atlasYear\(year\)\}>\{copy\.allRulers\(year\)\}/);
  assert.doesNotMatch(home, /home-text-link" href=\{atlasYear/);
  assert.doesNotMatch(home, /openAtlas/);
  assert.match(read('src/features/public/home-search.css'), /\.home-search-results\{position:absolute/);
});

test('Ferdinand I keeps Austrian red, also in 1526; Carlos V keeps Castile', () => {
  const red = governmentGroupsAt(person('FERN1EMP'), 1526, {view: 'panorama'});
  assert.ok(red.length > 1 && red.every(group => group.color === '#8E293C'));
  const charles = governmentGroupsAt(person('CARLOS5'), 1520, {view: 'panorama'});
  assert.equal(charles.find(group => group.id === 'tierras-austriacas').color, '#C5A62B');
  // The Croatian bans of the Zrinski were royal viceroys.
  assert.equal(governmentGroupsAt(person('NIKOLA4ZRIN'), 1550, {view: 'panorama'})[0].kind, 'delegated');
});

test('Poland and Lithuania share the union colour in the same years', () => {
  for (const year of [1387, 1410, 1520]) {
    const colours = new Set([...mosaic(year).byLocation.values()].flat().filter(entry => ['Polonia', 'Lituania'].includes(entry.entityId) && !entry.tributaryRelation).map(entry => entry.mosaicColor));
    assert.equal(colours.size, 1, `${year}`);
  }
  // Ducal Prussia takes a tint of the union, not of Poland alone.
  assert.equal(tributaryColor({id: 'prussia-order-poland'}, 1480), tributaryColor({id: 'prussia-poland'}, 1560));
});

test('tributary states name their own ruler beside the overlord', () => {
  const wallachia = TRIBUTARY_RELATIONS.find(relation => relation.id === 'wallachia-ottoman');
  assert.deepEqual(subjectRulers(wallachia, 1458, PERSONAS).map(p => p.id).length, 1);
  assert.match(read('src/features/atlas/MapaEuropa.jsx'), /tr\('gobierno propio de','own government of'\)/);
  // Stripes are dark, so they do not glare on the dark map.
  assert.doesNotMatch(read('src/features/atlas/MapaEuropa.jsx'), /line\.setAttribute\('stroke', '#fff'\)/);
});

test('Irish lordships are shades of green and unorganised lands are muted', () => {
  const hue = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255); const max = Math.max(r, g, b), min = Math.min(r, g, b); if (max === min) return 0; const d = max - min; const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
  for (const id of ['Galway', 'Donegal', 'Dungannon', 'Ennis', 'Killarney', 'Cavan']) {
    const colour = at(1500, id).mosaicColor;
    assert.ok(hue(colour) >= 70 && hue(colour) <= 170, `${id} ${colour}`);
  }
  for (const id of ['Abisko', 'Eiriksfjord']) {
    const colour = at(1500, id).mosaicColor;
    const [r, g, b] = [1, 3, 5].map(i => parseInt(colour.slice(i, i + 2), 16));
    assert.ok(Math.max(r, g, b) - Math.min(r, g, b) < 40, `${id} ${colour}`);
  }
});

test('the Middle East review fills Mesopotamia, Persia, Arabia, the Caucasus and Turan', () => {
  const review = json('middle-east-review');
  assert.equal(data.middleEastReview.layerNames.length, review.assignments.length);
  for (const assignment of review.assignments) for (const key of assignment.sourceKeys) assert.match(review.sources[key].url, /^https:\/\//, key);
  const inventory = json('location-inventory').cells.filter(cell => cell.visible && cell.centroid);
  for (const year of [1200, 1300, 1400, 1500, 1600, 1700, 1800]) {
    const empty = inventory.filter(cell => !mosaic(year).byLocation.has(cell.id)).map(cell => cell.id);
    assert.deepEqual(empty, [], `${year}`);
  }
  assert.equal(at(1250, 'Baghdad').politicalLabel, 'Califato abasí');
  assert.equal(at(1600, 'Isfahan').politicalLabel, 'Persia');
  assert.equal(at(1700, 'Baghdad').politicalLabel, 'Imperio otomano');
  assert.equal(at(1600, 'Samarkand').politicalLabel, 'Kanato de Bujará');
  assert.equal(at(1500, 'Tbilisi').politicalLabel, 'Reino de Kartli');
  assert.equal(at(1500, 'Hail').politicalLabel, 'Arabia · tribus beduinas');
  assert.equal(at(1500, 'Dasht_Lut1').mosaicColor, '#D3C4A1');
});
