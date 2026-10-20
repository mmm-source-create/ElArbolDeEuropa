import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {IMPERIAL_FRAME_BLOCKS, IMPERIAL_FRAME_RANGE, imperialFrameCellChanges, imperialFrameIds,
  imperialFrameReference} from '../src/cartography/imperialFrame.js';
import {pilotImperialFrameFor, pilotLocationContext, reviewedLayerLocations} from '../src/cartography/locationMapPilot.js';

const read = name => fs.readFileSync(new URL(`../data/cartography/${name}`, import.meta.url), 'utf8');
const data = JSON.parse(read('corridor-locations.json'));
const oldSvgIds = new Set([...read('MapChart_Map.svg').matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
const cellIds = new Set([...read('euv-locations-crop.svg').matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
const frame = year => new Set(pilotImperialFrameFor(data, year));
const has = (year, ...ids) => ids.forEach(id => assert(frame(year).has(id), `${id} debe figurar en ${year}`));
const lacks = (year, ...ids) => ids.forEach(id => assert(!frame(year).has(id), `${id} no debe figurar en ${year}`));

test('el marco cubre todos los años del mapa con regiones y celdas existentes', () => {
  assert.deepEqual(IMPERIAL_FRAME_RANGE, {from: data.from, through: data.through});
  for (let year = IMPERIAL_FRAME_RANGE.from; year <= IMPERIAL_FRAME_RANGE.through; year++) {
    assert(pilotImperialFrameFor(data, year).length > 600, `marco vacío o mínimo en ${year}`);
    assert.deepEqual(imperialFrameIds(year).filter(id => !oldSvgIds.has(id)), [], `${year}`);
    const {add, remove} = imperialFrameCellChanges(year);
    assert.deepEqual([...add, ...remove].filter(id => !cellIds.has(id)), [], `${year}`);
    assert(imperialFrameReference(year)?.url.startsWith('https://'), `${year}`);
  }
  for (const year of [IMPERIAL_FRAME_RANGE.from - 1, IMPERIAL_FRAME_RANGE.through + 1]) {
    assert.deepEqual(imperialFrameIds(year), []);
    assert.deepEqual(pilotImperialFrameFor(data, year), []);
    assert.equal(imperialFrameReference(year), null);
  }
});

test('el siglo XII incorpora las tierras al este del Elba con la investidura de Pomerania', () => {
  has(1150, 'Prague', 'Vienna', 'Aachen', 'Milano', 'Stendal', 'Kiel', 'Grenoble', 'Aix_En_Provence');
  lacks(1150, 'Berlin', 'Stettin', 'Lubeck', 'Schwerin', 'Plon', 'Wroclaw', 'Buda', 'Venice', 'Florence');
  has(1181, 'Berlin', 'Stettin', 'Lubeck', 'Schwerin', 'Plon');
  lacks(1181, 'Rugen', 'Gorzow', 'Lebus');
});

test('la cesión danesa de 1214 se deshace con Lübeck en 1226 y Bornhöved en 1227', () => {
  has(1213, 'Kiel', 'Hamburg', 'Lubeck', 'Schwerin');
  lacks(1220, 'Kiel', 'Hamburg', 'Lubeck', 'Schwerin', 'Stettin', 'Ratzeburg');
  has(1220, 'Bremen', 'Stade', 'Luneburg');
  has(1226, 'Lubeck');
  lacks(1226, 'Kiel');
  has(1227, 'Kiel', 'Hamburg', 'Schwerin', 'Stettin');
});

test('Silesia entra en 1335 y Świdnica-Jawor en 1392; la Nueva Marca hacia 1250', () => {
  lacks(1334, 'Wroclaw', 'Opole');
  has(1335, 'Wroclaw', 'Opole', 'Legnica');
  lacks(1391, 'Swidnica', 'Jawor');
  has(1392, 'Swidnica', 'Jawor');
  lacks(1249, 'Gorzow', 'Lebus');
  has(1250, 'Gorzow', 'Lebus');
  lacks(1259, 'Santok');
  has(1260, 'Santok');
  lacks(1324, 'Rugen', 'Stralsund');
  has(1325, 'Rugen', 'Stralsund');
});

test('el reino de Arlés y la Italia imperial medieval salen en sus fechas propias', () => {
  has(1311, 'Lyon');
  lacks(1312, 'Lyon');
  has(1347, 'Avignon');
  lacks(1348, 'Avignon');
  has(1348, 'Grenoble', 'Vienne', 'Valence', 'Faucigny');
  lacks(1349, 'Grenoble', 'Vienne', 'Valence', 'Faucigny');
  has(1355, 'Faucigny');
  has(1404, 'Verona', 'Padova');
  lacks(1404, 'Vicenza');
  lacks(1405, 'Verona', 'Padova');
  has(1419, 'Udine');
  lacks(1420, 'Udine', 'Tolmin');
  has(1420, 'Pordenone');
  has(1427, 'Brescia');
  lacks(1428, 'Brescia', 'Bergamo');
  has(1447, 'Vienna', 'Aix_En_Provence', 'Milano');
  lacks(1447, 'Verona', 'Buda');
  lacks(1481, 'Aix_En_Provence', 'Marseille', 'Orange');
  has(1500, 'Parma', 'Piacenza');
  lacks(1500, 'Cremona', 'Lodi');
  lacks(1512, 'Parma', 'Piacenza');
  has(1512, 'Cremona', 'Milano');
});

test('1512–1647 reproduce la capa aceptada del corredor salvo el ducado de Siewierz', () => {
  const layer = data.territories.find(item => item.name === 'Marco jurídico del Sacro Imperio');
  for (const year of [1512, 1550, 1600, 1647]) {
    const accepted = new Set(reviewedLayerLocations(data, layer, year));
    const current = frame(year);
    assert.deepEqual([...current].filter(id => !accepted.has(id)), [], `${year}`);
    assert.deepEqual([...accepted].filter(id => !current.has(id)), ['Siewierz'], `${year}`);
  }
});

test('después de 1650 el marco no pierde las celdas que tienen una revisión política regional', () => {
  for (const year of [1651, 1700, 1750, 1792]) {
    has(year, 'Vienna', 'Prague', 'Cologne', 'Frankfurt', 'Hamburg', 'Munich', 'Brussels', 'Milano', 'Turin', 'Wroclaw', 'Innsbruck');
    lacks(year, 'Amsterdam', 'Arnhem', 'Hertogenbosch', 'Bern', 'Schaffhausen', 'Strasbourg', 'Venice', 'Konigsberg');
  }
  has(1658, 'Thionville');
  lacks(1659, 'Thionville', 'Montmedy');
  lacks(1678, 'Valenciennes', 'Maubeuge', 'Besancon');
  has(1678, 'Mons', 'Luxembourg');
  has(1679, 'Landau_Rhineland');
  lacks(1680, 'Landau_Rhineland');
  has(1765, 'Bitche');
  lacks(1766, 'Bitche', 'Sarreguemines');
  has(1792, 'Saarwerden');
  lacks(1793, 'Saarwerden');
  lacks(1648, 'Breda', 'Bergen_Zoom');
  has(1648, 'Antwerp', 'Maastricht', 'Venlo');
  lacks(1713, 'Venlo');
  has(1713, 'Roermond', 'Geldern');
  has(1678, 'Freiburg');
  lacks(1679, 'Freiburg');
  has(1697, 'Freiburg');
});

test('las anexiones revolucionarias salen del marco; la margen izquierda del Rin espera a Lunéville', () => {
  has(1792, 'Chambery', 'Brussels');
  lacks(1793, 'Chambery', 'Annecy');
  has(1793, 'Turin', 'Aosta', 'Brussels');
  lacks(1795, 'Brussels', 'Liege', 'Luxembourg', 'Namur');
  has(1795, 'Cologne', 'Aachen', 'Trier', 'Mainz', 'Milano');
  lacks(1797, 'Milano', 'Mantova', 'Modena', 'Pavia');
  has(1797, 'Turin', 'Novara', 'Alessandria');
  has(1800, 'Vienna', 'Prague', 'Cologne', 'Trier', 'Wroclaw', 'Hamburg');
  lacks(1800, 'Brussels', 'Milano', 'Chambery', 'Amsterdam', 'Bern', 'Venice');
});

test('el inspector describe el marco con la fuente del periodo, sin convertirlo en un gobierno', () => {
  const [cologne1250] = pilotLocationContext(data, 'Cologne', 1250).filter(item => item.layerName === 'Marco jurídico del Sacro Imperio');
  assert.equal(cologne1250.source, imperialFrameReference(1250).url);
  assert(cologne1250.note.includes('no un Estado unificado'));
  assert(pilotLocationContext(data, 'Cologne', 1700).some(item => item.layerName === 'Marco jurídico del Sacro Imperio'));
  assert(!pilotLocationContext(data, 'Arnhem', 1649).some(item => item.layerName === 'Marco jurídico del Sacro Imperio'));
  assert(!pilotLocationContext(data, 'Paris', 1700).some(item => item.layerName === 'Marco jurídico del Sacro Imperio'));
  assert.equal(imperialFrameReference(1512).url, 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:map-2809');
});

test('los bloques exportados conservan el orden con que se generó la capa del corredor', () => {
  const layer = data.territories.find(item => item.name === 'Marco jurídico del Sacro Imperio');
  const b = IMPERIAL_FRAME_BLOCKS;
  const v1512 = [...b.germanCore, ...b.bohemianCrown, ...b.burgundianCircle, ...b.imperialItaly, ...b.silesia,
    ...b.northernNetherlands, ...b.swissConfederation, ...b.alsaceAndMetz, ...b.countyOfBurgundy];
  assert.deepEqual(layer.versions.find(version => version.from === 1512).oldIds, v1512);
});
