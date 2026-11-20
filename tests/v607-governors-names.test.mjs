import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {ENGLISH_DYNASTIES} from '../src/features/english/entityTranslations.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {englishNameText} from '../src/features/english/nameCorrections.js';
import {PROFILE_NOTES} from '../src/features/english/profileVocabulary.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';

const byId = new Map(PERSONAS.map(p => [p.id, p]));
const read = name => JSON.parse(fs.readFileSync(new URL(`../data/cartography/${name}`, import.meta.url)));
const mapData = read('corridor-locations.json'); mapData.burgundy = read('burgundian-locations.json');

test('the second review of English names corrects houses 101–200 and people 101–200 without changing URLs', () => {
  const house = key => ENGLISH_DYNASTIES.find(d => d.key === key);
  for (const [key, name] of [['Báthory','Báthory'],['Almohade','Almohad'],['Borbón-Orleans','Bourbon-Orléans'],['Gerulfinga','Gerulfing'],
    ['Meneses','Meneses'],['Comminges','Comminges'],['Smilets','Smilets'],['Láscaris','Laskaris'],['Cantacuceno','Kantakouzenos'],
    ['Ángelo','Angelos'],['Jimena','Jiménez'],['Burgh','de Burgh'],['Clare','de Clare']]) assert.equal(house(key).name, name, key);
  const person = id => COMPLETE_ENGLISH_PROFILES[id], route = id => TRANSLATED_PEOPLE.find(p => p.id === id).en;
  assert.equal(person('LADI1').name, 'Władysław I of Poland');
  assert.equal(person('LADI1').nickname, 'the Elbow-high');
  assert.equal(route('LADI1'), 'ladislao-i-of-poland');
  assert.equal(person('LADI3').nickname, 'of Varna');
  assert.equal(person('LADI4').nickname, 'the Cuman');
  assert.equal(person('ALB3AUST').nickname, 'with the Pigtail');
  assert.equal(person('ALEXIOS3ANGELOS').name, 'Alexios III Angelos');
  assert.equal(route('ALEXIOS3ANGELOS'), 'allejo-iii');
  for (const [bad, good] of [["Poland's Kadislav I",'Władysław I of Poland'],['Federico II de Saxony','Frederick II of Saxony'],
    ['House Menese','House of Meneses'],['Tsar of the Smits dynasty.','Tsar of the Smilets dynasty.']]) assert.equal(englishNameText(bad), good);
});

test('Mehmed IV and every child and grandchild of Joanna of Castile in the Atlas have a portrait', () => {
  assert.equal(IMAGENES_PERSONAS.MEHMED4OSM.archivo, '/personas-img/MEHMED4OSM_607.webp');
  const children = PERSONAS.filter(p => p.madre === 'JUANA1CAST' || p.padre === 'JUANA1CAST');
  const grandchildren = PERSONAS.filter(p => children.some(c => p.padre === c.id || p.madre === c.id));
  assert.equal(children.length, 6);
  assert(grandchildren.length >= 16);
  for (const p of [...children, ...grandchildren]) {
    const portrait = IMAGENES_PERSONAS[p.id];
    assert(portrait?.archivo, p.id);
    const served = IMAGE_VARIANTS[portrait.archivo]?.variants.map(v => v.src) || [portrait.archivo];
    assert(served.every(src => fs.existsSync(new URL(`../public${src}`, import.meta.url))), p.id);
  }
});

const GOVERNORS = [['ENGELBERT2NASSAU',1501],['GUILLERMOCROY',1506],['MARGAUST',1507],['MARIAAUST',1531],['EMANUELFILIBERTOSAB',1555],
  ['MARGPARMA',1559],['FERN2ALBA',1567],['LUISREQUESENS',1573],['DONJUANAUST',1576],['ALEJFARNESIO',1578],['MANSFELDPETER',1592],
  ['ERNESTOAUST',1594],['FUENTESCONDE',1595],['ALB7AUST',1596],['ISABCLARAEUG',1621],['FERNCARDINFANTE',1634],['FRANCISCOMELO',1641],
  ['MANUELMOURA',1644],['LEOPGUILLERMO',1647],['JUANJOSEAUST',1656],['CARACENA',1659],['FRANCISCOMOURA',1664],['INIGOMELCHORVELASCO',1668],
  ['MONTERREY',1670],['VILLAHERMOSA',1675],['ALEJFARNESIOPR',1678],['GRANA',1682],['GASTANAGA',1685],['MAX2EMANBAV',1692],
  ['ISIDOROCUEVA',1701],['EUGENIOSABOYA',1716],['DAUNWIRICH',1725],['MARIAELISABGOV',1725],['HARRACH',1741],['MARIAANAGOV',1744],
  ['CHARLESALEXLOR',1744],['MARIACRISTINATESCHEN',1781],['ALBERTTESCHEN',1781],['CARLOSTESCHEN',1793]];

test('every governor-general of the Habsburg Netherlands has a dated, translated, delegated mandate', () => {
  for (const [id, from] of GOVERNORS) {
    const person = byId.get(id);
    assert(person, id);
    const mandate = person.gobiernos.find(g => g.territorio === 'Países Bajos' && g.desde === from);
    assert(mandate, `${id} ${from}`);
    assert.equal(mandate.clase, 'gobierno');
    if (mandate.nota) assert(PROFILE_NOTES[mandate.nota], `${id}: nota sin traducir`);
    assert(COMPLETE_ENGLISH_PROFILES[id]?.name, id);
    assert(TRANSLATED_PEOPLE.some(p => p.id === id), id);
  }
});

test('a governor-general paints only the provinces his sovereign holds, never the United Provinces', () => {
  const cells = (id, year) => new Set(mapAuthoritiesForPerson(byId.get(id), year, mapData)
    .filter(e => e.paint && e.territory === 'Países Bajos').flatMap(e => e.ids));
  for (const [id, year] of [['EUGENIOSABOYA',1720],['CHARLESALEXLOR',1760],['MAX2EMANBAV',1695],['FERNCARDINFANTE',1638],['LEOPGUILLERMO',1650]]) {
    const ids = cells(id, year);
    assert(ids.size > 20, `${id} ${year}`);
    for (const dutch of ['Amsterdam','Utrecht','Leeuwarden','Groningen','Middelburg']) assert(!ids.has(dutch), `${id} ${year}: ${dutch}`);
    assert(ids.has('Brussels'), `${id} ${year}`);
  }
  assert(cells('MARGAUST', 1520).has('Amsterdam'));
  assert(!cells('EUGENIOSABOYA', 1720).has('Liege'));
});
