import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {territorialIdentity} from '../src/cartography/territorialIdentity.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {DISTINCT_TERRITORY_NAMES, territoryNameKey} from '../src/data/territoryNameCollisions.js';
import {governmentTableAt} from '../src/cartography/europePanorama.js';
import {COLLECTIVE_AUTHORITIES} from '../src/cartography/politicalMapIndex.js';
import {conciseMapNote} from '../src/cartography/mapNotes.js';

const read = name => JSON.parse(fs.readFileSync(`data/cartography/${name}.json`, 'utf8'));
const data = read('corridor-locations');
data.burgundy = read('burgundian-locations');
const mosaics = new Map();
const at = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  const layers = mosaics.get(year).byLocation.get(id) || [];
  return {
    rulers: [...new Set(layers.flatMap(layer => (layer.candidates || []).filter(c => c.ids.has(id)).map(c => c.personId)))].sort(),
    english: layers.some(layer => layer.english.size > 0),
    fief: layers.map(layer => layer.crownRelation?.type).find(Boolean) || null,
    colors: [...new Set(layers.map(layer => layer.mosaicColor))],
  };
};

test('Aquitania es una sola entidad y la corona francesa la sigue tratando igual', () => {
  assert.equal(TERRITORIOS['Ducado de Aquitania'], undefined);
  assert.equal(territorialIdentity('Ducado de Aquitania'), 'Aquitania');
  assert.deepEqual(TERRITORIOS.Aquitania.etapas.map(e => [e.clase, e.desde, e.hasta]), [['principado', 1362, 1372]]);
  // Bajo los Plantagenet: feudo del rey de Francia, tierras de la corona inglesa, un solo color.
  for (const id of ['Bordeaux', 'Bayonne', 'Mauleon', 'Tosse']) {
    const plantagenet = at(1250, id);
    assert.deepEqual(plantagenet.rulers, ['ENRIQ3ING'], id);
    assert.ok(plantagenet.english, `${id}: tierras de la corona inglesa`);
    assert.equal(plantagenet.fief, 'feudo', `${id}: feudo del rey de Francia`);
    assert.equal(plantagenet.colors.length, 1, `${id}: una sola capa`);
  }
  // Brétigny (1360) cede Bigorra en plena soberanía; la Guyena es francesa desde 1453.
  assert.ok(at(1365, 'Tarbes').english);
  assert.ok(!at(1460, 'Bordeaux').english);
});

test('cambios de rango de una misma entidad: una ficha con etapas y redirecciones', () => {
  const routes = JSON.parse(fs.readFileSync('routes.json', 'utf8')).redirects;
  for (const [gone, main, es, en, esMain, enMain] of [
    ['Ducado de Aquitania', 'Aquitania', 'ducado-de-aquitania', 'duchy-of-aquitaine', 'aquitania', 'aquitaine'],
    ['Obispado de Riga', 'Arzobispado de Riga', 'obispado-de-riga', 'bishopric-of-riga', 'arzobispado-de-riga', 'archbishopric-of-riga'],
    ['Principado de Leiningen', 'Condado de Leiningen', 'principado-de-leiningen', 'principality-of-leiningen', 'condado-de-leiningen', 'county-of-leiningen'],
    ['República de Venecia', 'Venecia', 'republica-de-venecia', 'republic-of-venice', 'venecia', 'venice'],
    ['Señorío de Ioannina', 'Despotado de Ioannina', 'senorio-de-ioannina', 'lordship-of-ioannina', 'despotado-de-ioannina', 'despotate-of-ioannina'],
  ]) {
    assert.equal(TERRITORIOS[gone], undefined, gone);
    assert.ok(TERRITORIOS[main], main);
    assert.equal(territorialIdentity(gone), main);
    assert.ok(routes.some(r => r.source === `/es/territorio/${es}` && r.destination === `/es/territorio/${esMain}` && r.permanent), es);
    assert.ok(routes.some(r => r.source === `/en/territory/${en}` && r.destination === `/en/territory/${enMain}` && r.permanent), en);
  }
  assert.deepEqual(TERRITORIOS['Arzobispado de Riga'].etapas.map(e => [e.desde, e.hasta]), [[1201, 1254]]);
  assert.deepEqual(TERRITORIOS['Condado de Leiningen'].etapas.map(e => [e.clase, e.desde, e.hasta]), [['principado', 1779, 1793]]);
  // El color de Riga ya no cambia en 1255: la misma identidad antes y después.
  assert.deepEqual(at(1240, 'Riga').colors, at(1300, 'Riga').colors);
});

test('ninguna ficha nueva coincide con otra sin una razón histórica documentada', () => {
  const groups = new Map();
  for (const name of Object.keys(TERRITORIOS)) {
    const key = territoryNameKey(name);
    groups.set(key, [...(groups.get(key) || []), name]);
  }
  const documented = new Map(DISTINCT_TERRITORY_NAMES.map(entry => [territoryNameKey(entry.names[0]), entry]));
  for (const [key, names] of groups) {
    if (names.length < 2) continue;
    const entry = documented.get(key);
    assert.ok(entry, `Fichas que coinciden sin justificar: ${names.join(' | ')}. Fusiónalas con etapas o documenta por qué son entidades distintas.`);
    assert.ok(!entry.merged, `${names.join(' | ')} figura como fusionada`);
    for (const name of names) assert.ok(entry.names.includes(name), `${name} no está en su grupo documentado`);
    assert.ok(entry.reason.length > 40, `${names.join(' | ')}: razón demasiado breve`);
  }
  for (const entry of DISTINCT_TERRITORY_NAMES.filter(e => e.merged)) {
    assert.equal(entry.names.filter(name => TERRITORIOS[name]).length, 1, `${entry.names.join(' | ')}: debe quedar una sola ficha`);
  }
});

test('la República de Venecia y sus dogos son una sola entidad en el cuadro de gobiernos', () => {
  const venice = COLLECTIVE_AUTHORITIES.find(c => c.nombre === 'República de Venecia');
  assert.equal(venice.territorio, 'Venecia');
  const rows = governmentTableAt(PERSONAS, 1700, COLLECTIVE_AUTHORITIES).filter(row => (row.collectives || []).includes(venice) || row.governments.some(g => g.mandates.some(m => m.territorio === 'Venecia')));
  assert.equal(rows.length, 1, 'una sola fila para Venecia');
  assert.ok(rows[0].collectives.includes(venice));
});

test('las notas del mapa común se quedan con lo que importa en el año elegido', () => {
  assert.equal(conciseMapNote('Comuna, señorío y ducado estenses; intervalo comunal de 1306–1336. La muerte de Alfonso IV de 1662 o Francesco I de 1658 no extingue el territorio.', 1594), 'Comuna, señorío y ducado estenses.');
  assert.equal(conciseMapNote('Ducado de Parma y Piacenza, con sucesiones Farnese, Borbón y austríaca antes del retorno borbónico de 1748. Conserva la jurisdicción durante las sucesiones y no desaparece desde 1695.', 1594), 'Ducado de Parma y Piacenza.');
  assert.equal(conciseMapNote('Carmagnola conquistada por Saboya en 1588. El tratado de Lyon de 1601 no retrasa trece años su incorporación efectiva.', 1600), 'Carmagnola conquistada por Saboya en 1588.');
  assert.equal(conciseMapNote('Arzobispado de Riga: Obispado de Riga, 1201–1254.  Contornos comarcales aproximados; la datación regional no acredita la fundación de cada localidad ni una frontera municipal exacta.', 1230), null);
  const map = fs.readFileSync('src/features/atlas/MapaEuropa.jsx', 'utf8');
  assert.match(map, /mapNote\(entry\.mapNote\)/);
  assert.match(map, /if\(en&&text===value\)return null/, 'una nota sin traducir no aparece en español en el mapa inglés');
});

test('Google encuentra un favicon de lado múltiplo de 48 px y /favicon.ico', () => {
  const shell = fs.readFileSync('index.html', 'utf8');
  for (const size of [48, 96, 192]) {
    assert.match(shell, new RegExp(`rel="icon" type="image/png" sizes="${size}x${size}" href="/brand/favicon-${size}.png"`));
    const png = fs.readFileSync(`public/brand/favicon-${size}.png`);
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
  const ico = fs.readFileSync('public/favicon.ico');
  assert.equal(ico.readUInt16LE(2), 1, 'icono');
  assert.equal(ico.readUInt8(6), 48, 'la primera imagen mide 48 px');
});
