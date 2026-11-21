import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {governmentGroupsAt} from '../src/domain/government/governmentPresentation.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {V615_RECORDS} from '../src/content/v615People.js';
import {contenidoPersona} from '../src/content/personas/index.js';
import {HISTORIA_DINASTIAS} from '../src/content/dinastias/index.js';
import {CASAS_V615, CASAS_V615_EN} from '../src/content/dinastias/casas-v615.js';
import {PORTRAITS_615} from '../src/data/imagenesPersonas615.js';
import {PORTRAITS_615_EN} from '../src/features/english/portraits615.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const person = id => PERSONAS.find(p => p.id === id);

test('the home search dropdown opens under the field and above the rest of the page', () => {
  const css = read('src/features/public/home-atlas.css');
  assert.match(css, /\.home-atlas-hero\{z-index:2\}/);
  assert.match(css, /\.home-atlas-copy\{position:relative;z-index:3\}/);
  assert.match(read('src/features/public/home-search.css'), /\.home-search\.is-active \.home-search-hint\{visibility:hidden/);
  assert.match(read('src/features/public/HomeSearch.jsx'), /home-search\$\{active \? ' is-active' : ''\}/);
});

test('in 1554–1555 Philip II’s realms keep the Spanish colour and England stays English', () => {
  const philip = person('FEL2ESP');
  for (const year of [1554, 1555]) {
    const groups = governmentGroupsAt(philip, year, {view: 'panorama'});
    assert.ok(groups.length && groups.every(g => g.color === '#C5A62B' && g.inheritedFrom === 'CARLOS5'), String(year));
  }
  const data = JSON.parse(read('data/cartography/corridor-locations.json'));
  data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
  for (const year of [1554, 1555]) {
    const mosaic = europeMosaicAt(data, year, PERSONAS);
    assert.equal(mosaic.byLocation.get('Naples')[0].mosaicColor, '#C5A62B', `Naples ${year}`);
    assert.equal(new Set(mosaic.byLocation.get('Brussels').map(l => l.mosaicColor)).size, 1, `Brussels ${year}`);
    assert.notEqual(mosaic.byLocation.get('London')[0].mosaicColor, '#C5A62B', `London ${year}`);
  }
  // Charles V keeps his own colours, and a child succeeding a dead parent inherits nothing.
  assert.equal(governmentGroupsAt(person('CARLOS5'), 1520, {view: 'panorama'}).find(g => g.id === 'tierras-austriacas').color, '#C5A62B');
  assert.ok(!governmentGroupsAt(person('FEL2ESP'), 1556, {view: 'panorama'}).some(g => g.inheritedFrom));
});

test('the renamed Gustavus Adolphus story keeps its old Spanish addresses', () => {
  const redirects = JSON.parse(read('routes.json')).redirects;
  const target = source => redirects.find(rule => rule.source === source)?.destination;
  assert.equal(target('/es/historia/gustavo-adolfo-campanas-y-muerte'), '/es/historia/el-leon-del-norte');
  assert.equal(target('/es/historia/gustavo-adolfo-campanas-y-muerte/capitulo/9'), '/es/historia/el-leon-del-norte/capitulo/9');
});

test('ten rulers without any editorial content receive a biography and a short summary in both languages', () => {
  assert.equal(Object.keys(V615_RECORDS).length, 10);
  assert.ok(['MURAD1OSM', 'BAYEZID1OSM', 'SELIM3OSM', 'SVERRERENOR', 'VASILI4RUS'].every(id => V615_RECORDS[id]));
  for (const [id, record] of Object.entries(V615_RECORDS)) {
    assert.ok(person(id), id);
    assert.ok(contenidoPersona(id)?.resumen && contenidoPersona(id)?.biografia, id);
    assert.ok(record.summary && record.parts.length >= 3 && record.parts.every(part => part.length === 4 && part.every(Boolean)), id);
    assert.ok(record.refs.every(ref => ref.url.startsWith('https://')), id);
  }
});

test('ten houses have a history in Spanish and English', () => {
  assert.equal(Object.keys(CASAS_V615).length, 10);
  const batches = [1, 2, 3, 4, 5, 6].flatMap(n => JSON.parse(read(`src/features/english/v6/batch-${n}/dynasties.json`)));
  for (const [name, house] of Object.entries(CASAS_V615)) {
    assert.equal(HISTORIA_DINASTIAS[name], house, name);
    for (const field of ['resumen', 'origen', 'trayectoria', 'legado']) assert.ok(house[field].length > 80, `${name}.${field}`);
    for (const id of house.protagonistas) assert.equal(person(id)?.dinastia, name, `${name}: ${id}`);
    const english = batches.find(entry => entry.key === name);
    assert.equal(english.summary, CASAS_V615_EN[name].summary, name);
    assert.ok(english.editorial && english.history && english.legacy, name);
  }
  // The guided-story drafts written by mistake are kept for review, not published.
  assert.ok(fs.existsSync(new URL('../docs/borradores-historias-dinastias-615.md', import.meta.url)));
  assert.ok(!fs.existsSync(new URL('../src/data/stories615', import.meta.url)));
});

test('Kościuszko and 99 rulers receive a credited portrait', () => {
  const ids = Object.keys(PORTRAITS_615);
  assert.equal(ids.length, 100);
  assert.ok(ids.includes('TADEUSZKOSCIUSZKO'));
  for (const id of ids) {
    const portrait = PORTRAITS_615[id];
    assert.ok(person(id), id);
    assert.ok(fs.existsSync(new URL(`../public${portrait.archivo}`, import.meta.url)), id);
    assert.ok(portrait.tipo && portrait.obra && portrait.autor && !/label QS|date QS/.test(JSON.stringify(portrait)), id);
    assert.match(portrait.derechos, /^(Dominio público|CC)/, id);
    assert.ok(PORTRAITS_615_EN[id]?.tipo, id);
  }
});

test('English texts no longer mix Spanish given names and places', () => {
  const names = [1, 2, 3, 4, 5, 6].map(n => JSON.parse(read(`src/features/english/v6/batch-${n}/names.json`)));
  const all = names.flatMap(Object.values).join('\n');
  for (const bad of ['Beatrice de Saboya', 'Carlos Alberto de Savoy', 'Isabel de Burgundy', 'Alberto Federico de Prussia', 'Valois-Borgoña']) assert.ok(!all.includes(bad), bad);
  const notes = [1, 2, 3, 4, 5, 6].flatMap(n => Object.values(JSON.parse(read(`src/features/english/v6/batch-${n}/notes.json`)))).join('\n');
  assert.ok(!notes.includes('He ruled alongside Fernando de Aragón'));
  assert.ok(!notes.includes('dolphinry'));
});
