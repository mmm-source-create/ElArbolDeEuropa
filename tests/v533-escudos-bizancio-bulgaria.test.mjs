import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {TRIBUTARY_RELATIONS} from '../src/cartography/tributaryRelations.js';
import {ESCUDOS, escudoDe, CREDITOS_ESCUDOS} from '../src/content/dinastias/escudos.js';
import {OG_FREE_LICENCE, ogArmsCreditFile} from '../src/features/public/ogImages.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(read('data/cartography/corridor-locations.json'));
data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
const mosaics = new Map();
const relationAt = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  return (mosaics.get(year).byLocation.get(id) || []).map(l => l.tributaryRelation?.id).find(Boolean) || null;
};
const person = id => PERSONAS.find(p => p.id === id);

test('el escudo del catálogo de dinastías se centra con el nombre', () => {
  const css = read('src/features/public/public.css');
  assert.match(css, /\.public-entity-heading \{ display: flex; align-items: center;/);
  assert.doesNotMatch(css, /\.public-entity-heading > \.dynasty-arms \{[^}]*margin-top/);
});

test('los escudos propuestos llegan a sus casas, con crédito y archivo', () => {
  const expected = {
    Borghese: 'Arms of the house of Borghese.svg', Farnesio: 'Arms of the House of Farnese.svg',
    'Casa de Aragón': 'Royal Coat and Shield of Majorca c.1276-14th Century.svg',
    Courtenay: 'Arms of the House of Courtenay (undifferencied arms).svg', 'Borbón-Orleans': 'Arms of the Dukes of Orléans.svg',
    Jimena: 'Armas de la Dinastia Jimena de Navarra.svg', 'Habsburgo-Lorena': 'Genealogical arms House of Habsburg-Lorraine 1806.svg',
    'Champaña': 'Blason Champagne primitif.svg', Orsini: 'Coat of arms of the house of Orsini (2).svg',
    'Della Rovere': 'Stemma della famiglia Della Rovere.svg', Hannover: 'Royal Hanover Inescutcheon.svg',
    Albret: 'Coat of arms of Charles dAlbret.svg', Lorena: 'Arms of Lorraine.svg',
    'Paleólogo-Monferrato': 'Arms of the house of Palaiologos-Montferrat (1).svg', Colonna: 'Stemma della famiglia Colonna.svg',
    Gonzaga: 'Arms of the house of Gonzaga (ancient).svg', Borja: 'Arms of the house of Borgia (1).svg',
    Mecklemburgo: 'Wappen Mecklenburg 2.svg', Romanov: 'House of Romanoff.svg', 'Württemberg': 'Wuerttemberg Arms.svg',
    'Barcelona-Sicilia': 'Arms of the Aragonese Kings of Sicily (Shape Variant).svg', 'Anjou-Tarento': 'Arms of Philippe de Tarente.svg',
    'Évreux': 'Arms of Louis dEvereux.svg', Sforza: 'CoA Sforza.svg',
  };
  for (const [house, title] of Object.entries(expected)) assert.equal(escudoDe(house)?.imagen?.titulo, title, house);
  // Tudor uses the royal arms the Lancastrians left them.
  assert.equal(escudoDe('Tudor').imagen.archivo, escudoDe('Plantagenet-Lancaster').imagen.archivo);
  assert.equal(escudoDe('Romanov').imagen.revision, '2025-09-27');
  assert.ok(Object.keys(ESCUDOS).length >= 65);
  const files = new Set(fs.readdirSync(new URL('../public/escudos/', import.meta.url)));
  for (const c of CREDITOS_ESCUDOS) {
    assert.ok(files.has(c.archivo.replace('/escudos/', '')), c.dinastia);
    assert.ok(c.autor && c.fuente.startsWith(c.procedencia==='Aportación del autor'?'https://heraldicon.org/arms/':'https://commons.wikimedia.org/wiki/File:'), c.dinastia);
    if (!OG_FREE_LICENCE.test(c.licencia)) assert.ok(fs.existsSync(new URL(`../${ogArmsCreditFile(c.archivo)}`, import.meta.url)), c.dinastia);
  }
  assert.equal(files.size, new Set(CREDITOS_ESCUDOS.map(c => c.archivo)).size);
});

test('Bizancio, Tarnovo, Morea y Trebisonda pagan tributo en los años documentados', () => {
  assert.equal(relationAt(1380, 'Catalca'), 'byzantium-ottoman');
  assert.equal(relationAt(1410, 'Catalca'), null);
  assert.equal(relationAt(1430, 'Catalca'), 'byzantium-ottoman');
  assert.equal(relationAt(1430, 'Patras'), 'byzantium-ottoman');
  assert.equal(relationAt(1450, 'Kalamata'), 'morea-ottoman');
  assert.equal(relationAt(1458, 'Kalamata'), null);
  assert.equal(relationAt(1391, 'Nikopol'), 'tarnovo-ottoman');
  assert.equal(relationAt(1370, 'Nikopol'), null);
  assert.equal(relationAt(1456, 'Khupati'), 'trebizond-ottoman');
  assert.equal(relationAt(1450, 'Khupati'), null);
  const murad = mapAuthoritiesForPerson(person('MURAD1OSM'), 1380, data, {includeDependencies: true});
  assert.equal(murad.find(e => e.territory === 'Zarato de Tarnovo')?.kind, 'tributary');
  assert.equal(murad.find(e => e.territory === 'Bizancio')?.kind, 'tributary');
  const mehmed = mapAuthoritiesForPerson(person('MEHMED2OSM'), 1456, data, {includeDependencies: true});
  assert.ok(['Morea', 'Trebisonda'].every(t => mehmed.some(e => e.territory === t && e.kind === 'tributary')));
  for (const id of ['byzantium-ottoman', 'tarnovo-ottoman', 'morea-ottoman', 'trebizond-ottoman']) {
    const r = TRIBUTARY_RELATIONS.find(x => x.id === id);
    assert.ok(r.sources.every(s => s.url.startsWith('https://islamansiklopedisi.org.tr/')), id);
  }
});
