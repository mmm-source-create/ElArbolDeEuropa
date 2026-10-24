import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims} from '../src/evidence/claims.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {escudoDe, ESCUDOS} from '../src/content/dinastias/escudos.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {ogPortraitAvailable} from '../src/features/public/ogImages.js';
import {HISTORIA_DINASTIAS} from '../src/content/dinastias/index.js';
import {contenidoPersona} from '../src/content/personas/index.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const person = id => PERSONAS.find(p => p.id === id);
const gov = (id, t, d) => person(id).gobiernos.find(g => g.territorio === t && (d === undefined || g.desde === d));
const data = JSON.parse(read('data/cartography/corridor-locations.json'));
data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
const mosaics = new Map();
const layer = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  return (mosaics.get(year).byLocation.get(id) || [])[0] || null;
};

test('la cabecera de la dinastía centra título, resumen y blasón', () => {
  const css = read('src/features/public/dynasty.css');
  assert.match(css, /\.dynasty-hero > p \{ max-width: 640px; margin-inline: auto;/);
  assert.match(css, /\.dynasty-hero > \.dynasty-blazon \{ max-width: 640px; margin: 10px auto 0;/);
});

test('Gorizia y los Ludovingios tienen escudo, y las casas duplicadas se fusionan', () => {
  assert.equal(escudoDe('Gorizia').imagen.titulo, 'Arms of the house of Gorizia.svg');
  assert.equal(escudoDe('Ludovingios').imagen.archivo, escudoDe('Hesse').imagen.archivo);
  assert.equal(Object.keys(ESCUDOS).length, 115);
  const houses = new Set(PERSONAS.map(p => p.dinastia));
  for (const old of ['Ivrea', 'Lancaster', 'York', 'Armañac', 'Egmont', 'Folkung', 'Folkunga', 'Piasta', 'Wurtemberg', 'D’Avalos', 'Kantakouzenos', 'Roger', 'Douglas-Tudor', 'Tudor-Brandon', 'Salviati-Médici', 'Aragón-Urgel'])
    assert.ok(!houses.has(old), old);
  for (const id of ['ODONBORG', 'ADELBORG', 'MARGBORG', 'ISABBORG']) assert.equal(person(id).dinastia, 'Borgoña', id);
  for (const id of ['PED1PORT', 'FERN1PORT', 'JUANPORT', 'BEATPORT']) assert.equal(person(id).dinastia, 'Borgoña-Portugal', id);
  assert.equal(person('OTON4BORG').dinastia, 'Ivrea-Borgoña');
  assert.equal(person('KNUT2SUE').dinastia, 'Erik');
  const vercel = JSON.parse(read('vercel.json'));
  for (const slug of ['ivrea', 'lancaster', 'armanac', 'folkunga'])
    assert.ok(vercel.redirects.some(r => r.source === `/es/dinastia/${slug}`), slug);
});

test('los papas tienen retrato con procedencia y variantes publicadas', () => {
  const popes = PERSONAS.filter(p => /^PAPA_/.test(p.id) || ['GREG10', 'ALFONSOBORJA'].includes(p.id));
  const portrayed = popes.filter(p => IMAGENES_PERSONAS[p.id]);
  assert.ok(portrayed.length >= 61, String(portrayed.length));
  for (const p of portrayed) {
    const image = IMAGENES_PERSONAS[p.id];
    assert.ok(IMAGE_VARIANTS[image.archivo]?.variants.length, p.id);
    assert.ok(image.obra && image.autor && image.fuenteUrl.startsWith('https://commons.wikimedia.org/wiki/File:') && image.derechos, p.id);
  }
  assert.equal(ogPortraitAvailable(IMAGENES_PERSONAS.PAPA_INOCENCIO10), true);
  assert.equal(ogPortraitAvailable(IMAGENES_PERSONAS.PAPA_GREGORIO9), false);
  assert.ok(contenidoPersona(person('PAPA_CLEMENTE14')).resumen.includes('1773'));
});

test('Carlos V, Felipe II y sus antepasados quedan contrastados con fuentes', () => {
  assert.equal(gov('CARLOS5', 'Nápoles').hasta, 1554);
  assert.equal(gov('FEL2ESP', 'Nápoles').desde, 1554);
  assert.equal(gov('CARLOS5', 'Sacro Imperio', 1557).condicion, 'titular');
  assert.equal(gov('FERN1EMP', 'Sacro Imperio', 1556), undefined);
  assert.equal(gov('FERN1EMP', 'Sacro Imperio', 1558).condicion, 'efectivo');
  assert.equal(gov('JUAN2ARAG', 'Trinacria').hasta, 1479);
  assert.equal(gov('FERN2ARAG', 'Trinacria', 1468).condicion, 'corregente');
  assert.equal(gov('FEL2ESP', 'Zelanda', 1574).condicion, 'titular');
  assert.equal(person('BEATPORTVISEU').nac, 1429);
  assert.deepEqual([person('LEONORPOR').padre, person('LEONORPOR').madre], ['EDU1PORT', 'LEONARAGPORT']);
  const ids = ['CARLOS5', 'FEL2ESP', 'FEL1CAST', 'JUANA1CAST', 'ISABPORTEMP', 'MAXIM1', 'MARIABORG', 'FERN2ARAG', 'ISAB1CAST', 'MAN1PORT', 'MARIAARAGINF',
    'FED3HAB', 'LEONORPOR', 'CAR1BORG', 'ISABBORB', 'JUAN2ARAG', 'JUANAENR', 'JUAN2CAST', 'ISABPORT3', 'FERNPORTVISEU', 'BEATPORTVISEU'];
  const open = ids.flatMap(id => personClaims(person(id)).filter(c => c.certainty !== 'documented').map(c => c.id));
  // Seven claims keep a stated doubt (dates of transfer, two births, Tournai and Navarre).
  assert.equal(open.length, 7, open.join('\n'));
  assert.ok(personClaims(person('CARLOS5')).every(c => c.certainty === 'documented' || c.note));
});

test('Navarra recupera Foix, Bigorra, Albret y el Bearne de sus reyes', () => {
  for (const [id, t] of [['FRANCISCOFEBONAV', 'Foix'], ['CATALINA1NAV', 'Condado de Bigorra'], ['ENRIQ2NAV', 'Albret'], ['JUANA3NAV', 'Albret'], ['ENRIQ4FRA', 'Bearne'], ['LUIS13FRA', 'Bearne']]) {
    const claim = personClaims(person(id)).find(c => c.field === 'Gobierno' && c.value.territorio === t);
    assert.equal(claim?.certainty, 'documented', `${id} ${t}`);
  }
  assert.equal(gov('ENRIQ4FRA', 'Foix').hasta, 1607);
  assert.equal(gov('LUIS13FRA', 'Bearne').hasta, 1620);
});

test('Brandeburgo-Prusia se pinta completa y Silesia se integra en 1742', () => {
  for (const id of ['Berlin', 'Magdeburg', 'Halberstadt', 'Minden', 'Hamm', 'Bielefeld', 'Slupsk'])
    assert.ok(layer(1760, id), id);
  assert.equal(layer(1700, 'Berlin').mosaicColor, REINO_COLOR.Prusia);
  assert.equal(layer(1700, 'Konigsberg').politicalLabel, 'Brandeburgo-Prusia');
  for (const id of ['Berlin', 'Konigsberg', 'Wroclaw', 'Stettin', 'Kleve'])
    assert.equal(layer(1760, id).mosaicColor, REINO_COLOR.Prusia, id);
  assert.equal(layer(1700, 'Stettin').entityId, 'Pomerania sueca');
  assert.equal(layer(1700, 'Stuttgart').entityId, 'Núcleo de Württemberg');
  assert.equal(gov('FRED1PRUSSIA', 'Prusia', 1688).titulo, 'Duque');
});

test('las historias nuevas de casas y sus fuentes están registradas', () => {
  for (const house of ['Wettin', 'Nassau', 'Lusignan', 'Visconti', 'Braganza', 'Árpád', 'Ivrea-Borgoña'])
    assert.ok(HISTORIA_DINASTIAS[house]?.fuentes.length, house);
  assert.ok(Object.keys(HISTORIA_DINASTIAS).length >= 52);
});
