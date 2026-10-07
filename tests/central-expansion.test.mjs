import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reviewedLayerLocations, reviewedMapLayers, mapSourceReference} from '../src/data/locationMapPilot.js';
import {politicalMosaicAt} from '../prototypes/euv-locations/location-mosaic.js';
import {PERSONAS} from '../src/personas.jsx';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {CHRONOLOGY_ROUTES, chronologyJurisdictionsFor} from '../src/data/atlasChronologyRoutes.js';

const central = JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/central-expansion-locations.json', import.meta.url)));
const data = {from: 1200, through: 1800, territories: central.territories, overrides: []};
const layers = new Map(central.territories.map(layer => [layer.name, layer]));
const ids = (name, year) => reviewedLayerLocations(data, layers.get(name), year);
const svg = fs.readFileSync(new URL('../prototypes/euv-locations/euv-locations-crop.svg', import.meta.url), 'utf8');
const pathIds = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
const runtimeData = JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json', import.meta.url)));
const runtimeLayers = new Set(reviewedMapLayers(runtimeData).map(layer => layer.name));
const people = new Map(PERSONAS.map(person => [person.id, person]));
const authorities = (personId, year) => mapAuthoritiesForPerson(people.get(personId), year, runtimeData);
const personalIds = (personId, year) => authorities(personId, year).flatMap(entry => entry.ids);

test('central cores use real SVG cells, explicit date limits, and linked evidence', () => {
  for (const layer of central.territories) {
    assert.equal(layer.precision, 'documented_core', layer.name);
    assert(Number.isInteger(layer.coverage.from) && Number.isInteger(layer.coverage.through), layer.name);
    assert.match(layer.color, /^#[a-f0-9]{6}$/i);
    assert(layer.note.length > 40, layer.name);
    assert(layer.sources.every(source => source.locator && new URL(source.url).protocol === 'https:'), layer.name);
    for (const version of layer.versions) {
      assert(Number.isInteger(version.from), layer.name);
      assert(version.ids.every(id => pathIds.has(id)), layer.name);
    }
    assert.deepEqual(ids(layer.name, layer.coverage.from - 1), [], layer.name);
    assert.deepEqual(ids(layer.name, layer.coverage.through + 1), [], layer.name);
  }
});

test('Bavarian branches retain their own cores before the reunification of 1505', () => {
  assert.deepEqual(ids('Baviera-Múnich (núcleos)', 1400), ['Munich', 'Pfaffenhofen']);
  assert.deepEqual(ids('Baviera-Landshut (núcleos)', 1400), ['Landshut', 'Burghausen']);
  assert(ids('Baviera-Ingolstadt (núcleos)', 1400).includes('Kufstein'));
  assert(!ids('Baviera-Ingolstadt (núcleos)', 1400).includes('Munich'));
  assert.deepEqual(ids('Baviera-Straubing (núcleos)', 1426), []);
  assert(!ids('Baviera-Múnich (núcleos)', 1428).includes('Straubing'));
  assert(ids('Baviera-Múnich (núcleos)', 1429).includes('Straubing'));
  assert.deepEqual(ids('Baviera-Ingolstadt (núcleos)', 1446), []);
  assert(ids('Baviera-Landshut (núcleos)', 1446).includes('Ingolstadt'));
  assert(!ids('Baviera-Landshut (núcleos)', 1446).includes('Munich'));
  assert.deepEqual(ids('Baviera-Landshut (núcleos)', 1504), []);
});

test('Neuburg is absent before 1505 and distinguishes the imperial occupation from the ducal core', () => {
  assert.deepEqual(ids('Palatinado-Neoburgo (Danubio)', 1504), []);
  assert.deepEqual(ids('Palatinado-Neoburgo (Danubio)', 1536), ['Neuburg_an_der_Donau']);
  assert.deepEqual(ids('Palatinado-Neoburgo (Burglengenfeld)', 1536), ['Burglengenfeld']);
  for (const year of [1546, 1548, 1551]) {
    assert.deepEqual(ids('Palatinado-Neoburgo (Danubio)', year), []);
    assert.deepEqual(ids('Palatinado-Neoburgo (Burglengenfeld)', year), []);
    assert.deepEqual(ids('Neoburgo (ocupación imperial)', year), ['Neuburg_an_der_Donau', 'Burglengenfeld']);
  }
  assert.deepEqual(ids('Neoburgo (ocupación imperial)', 1552), []);
  assert(ids('Palatinado-Neoburgo (Danubio)', 1552).includes('Neuburg_an_der_Donau'));
  assert(!ids('Palatinado-Neoburgo (Danubio)', 1628).includes('Dillingen'));
});

test('Croatian and Slavonian nuclei respect the local privilege and conquest dates', () => {
  assert.deepEqual(ids('Croacia anterior a 1527 (Knin)', 1388), []);
  assert.deepEqual(ids('Croacia anterior a 1527 (Knin)', 1393), ['Knin']);
  assert.deepEqual(ids('Croacia anterior a 1527 (Knin)', 1522), []);
  assert.deepEqual(ids('Croacia anterior a 1527 (Bihać)', 1261), []);
  assert.deepEqual(ids('Croacia anterior a 1527 (Bihać)', 1262), ['Bihac']);
  assert.deepEqual(ids('Croacia anterior a 1527 (Senj)', 1468), []);
  assert.deepEqual(ids('Croacia anterior a 1527 (Senj)', 1469), ['Senj']);
  assert.deepEqual(ids('Eslavonia anterior a 1527 (núcleos)', 1209), ['Varazdin']);
  assert(!ids('Eslavonia anterior a 1527 (núcleos)', 1355).includes('Koprivnica'));
  assert(ids('Eslavonia anterior a 1527 (núcleos)', 1356).includes('Koprivnica'));
  assert.deepEqual(ids('Croacia anterior a 1527 (Bihać)', 1527), []);
});

test('Olomouc has its own documented charter and separate Swedish and Prussian occupations', () => {
  assert.deepEqual(ids('Moravia (núcleo de Olomouc)', 1377), []);
  assert.deepEqual(ids('Moravia (núcleo de Olomouc)', 1378), ['Olomouc']);
  assert.deepEqual(ids('Moravia (núcleo de Olomouc)', 1445), []);
  for (const year of [1642, 1648, 1650]) {
    assert.deepEqual(ids('Moravia (núcleo de Olomouc)', year), []);
    assert.deepEqual(ids('Olomouc (ocupación sueca)', year), ['Olomouc']);
    assert.deepEqual(ids('Moravia (núcleo de Brno)', year), ['Brno']);
  }
  assert.deepEqual(ids('Moravia (núcleo de Olomouc)', 1651), ['Olomouc']);
  for (const year of [1741, 1742]) {
    assert.deepEqual(ids('Moravia (núcleo de Olomouc)', year), []);
    assert.deepEqual(ids('Olomouc (ocupación prusiana)', year), ['Olomouc']);
  }
  assert.deepEqual(ids('Moravia (núcleo de Olomouc)', 1743), ['Olomouc']);
  assert.deepEqual(ids('Olomouc (ocupación prusiana)', 1758), []);
});

test('Trebizond includes the documented eastern coast and ends before the conquest year', () => {
  const name = 'Trebisonda (núcleo de Trabzon, Sürmene y Rize)';
  assert.deepEqual(ids(name, 1203), []);
  assert.deepEqual(ids(name, 1450), ['Trebizond', 'Surmene', 'Rize']);
  assert(!ids(name, 1450).includes('Giresun'));
  assert(!ids(name, 1450).some(id => id.startsWith('East_Pontus_Mountains')));
  assert.deepEqual(ids(name, 1461), []);
});

test('the Silesian transition distinguishes conquest, ceded nuclei, and the Austrian remainder', () => {
  assert.deepEqual(ids('Silesia real (Wrocław y Środa)', 1741), []);
  assert.deepEqual(ids('Silesia (ocupación prusiana de 1741)', 1741), ['Wroclaw', 'Sroda_Slaska', 'Glogow']);
  assert.deepEqual(ids('Silesia (ocupación prusiana de 1741)', 1742), []);
  assert.deepEqual(ids('Silesia prusiana (núcleos)', 1750), ['Wroclaw', 'Sroda_Slaska', 'Glogow']);
  assert.deepEqual(ids('Silesia austríaca (núcleo de Teschen)', 1750), ['Tesin']);
  assert.deepEqual(ids('Silesia real (Głogów)', 1507), []);
  assert.deepEqual(ids('Silesia real (Głogów)', 1508), ['Glogow']);
  assert.equal(politicalMosaicAt(data, 1750).byLocation.get('Wroclaw').length, 1);
  assert.equal(politicalMosaicAt(data, 1750).byLocation.get('Tesin').length, 1);
});

test('dated personal routes select the correct branch and suppress unmatched regional titles', () => {
  assert(CHRONOLOGY_ROUTES.length >= 153);
  for (const route of CHRONOLOGY_ROUTES) {
    assert(people.has(route.personId), route.personId);
    for (const alias of route.atlasAliases) assert(runtimeLayers.has(alias), alias);
  }
  assert.deepEqual(chronologyJurisdictionsFor('Palatinado-Neoburgo', 1536, 'PHILIPNEUBURG'), ['Palatinado-Neoburgo (Burglengenfeld)']);
  assert.deepEqual(chronologyJurisdictionsFor('Palatinado-Neoburgo', 1536, 'OTTHEINRICHPAL'), ['Palatinado-Neoburgo (Danubio)']);
  assert.deepEqual(chronologyJurisdictionsFor('Moravia', 1618, 'FERN2EMP'), []);
  assert.deepEqual(chronologyJurisdictionsFor('Croacia', 1526, 'FERN1EMP'), []);
  assert.deepEqual(chronologyJurisdictionsFor('Baviera', 1505, 'ALB4BAV'), null);
});

test('selected Bavarian maps change at the partition and reunification rather than following the generic title', () => {
  const landshut1440 = personalIds('ENRIQ16BAV', 1440);
  assert(landshut1440.includes('Landshut') && landshut1440.includes('Burghausen'));
  assert(!landshut1440.includes('Munich') && !landshut1440.includes('Ingolstadt'));
  assert(personalIds('ENRIQ16BAV', 1446).includes('Ingolstadt'));
  const albrecht1470 = personalIds('ALB4BAV', 1470);
  assert(albrecht1470.includes('Munich') && albrecht1470.includes('Straubing'));
  assert(!albrecht1470.includes('Landshut') && !albrecht1470.includes('Burghausen'));
  const albrecht1505 = personalIds('ALB4BAV', 1505);
  for (const id of ['Munich', 'Landshut', 'Ingolstadt', 'Burghausen']) assert(albrecht1505.includes(id), id);
  for (const id of ['Neuburg_an_der_Donau', 'Burglengenfeld', 'Kufstein']) assert(!albrecht1505.includes(id), id);
});

test('the princes of Neuburg have their own shares and Carlos V has only the dated occupation', () => {
  assert(personalIds('PHILIPNEUBURG', 1536).includes('Burglengenfeld'));
  assert(!personalIds('PHILIPNEUBURG', 1536).includes('Neuburg_an_der_Donau'));
  assert(personalIds('OTTHEINRICHPAL', 1536).includes('Neuburg_an_der_Donau'));
  assert(!personalIds('OTTHEINRICHPAL', 1536).includes('Burglengenfeld'));
  assert(!personalIds('OTTHEINRICHPAL', 1548).includes('Neuburg_an_der_Donau'));
  const occupation = authorities('CARLOS5', 1548).find(entry => entry.territory === 'Palatinado-Neoburgo');
  assert.equal(occupation?.kind, 'disputed');
  assert(occupation.ids.includes('Neuburg_an_der_Donau') && occupation.ids.includes('Burglengenfeld'));
  assert(!personalIds('CARLOS5', 1510).includes('Neuburg_an_der_Donau'));
});

test('Croatian authority begins with the regional succession and respects the conquest of Knin', () => {
  assert.equal(authorities('FERN1EMP', 1526).filter(entry => entry.territory === 'Croacia').length, 0);
  assert(authorities('FERN1EMP', 1527).some(entry => entry.territory === 'Croacia' && entry.ids.includes('Senj')));
  const louis1523 = personalIds('LUIS2HUN', 1523);
  assert(louis1523.includes('Bihac') && louis1523.includes('Senj'));
  assert(!louis1523.includes('Knin'));
});

test('Moravian maps follow their regional rulers and preserve the actual ruler during a designated succession', () => {
  assert(personalIds('ALB2HABS', 1425).includes('Brno'));
  assert(personalIds('MATIAS1HUN', 1480).includes('Brno'));
  assert(!personalIds('LADISLAO7HUN', 1480).includes('Brno'));
  assert(personalIds('MATIAS1EMP', 1609).includes('Brno'));
  assert(!personalIds('RODOLFO2HRE', 1610).includes('Brno'));
  const matthias1618 = personalIds('MATIAS1EMP', 1618);
  assert(matthias1618.includes('Brno') && matthias1618.includes('Olomouc'));
  assert(people.get('FERN2EMP').gobiernos.some(government => government.territorio === 'Moravia'
    && government.desde === 1617 && government.hasta === 1618 && government.condicion === 'titular'));
  const ferdinand1618 = personalIds('FERN2EMP', 1618);
  assert(!ferdinand1618.includes('Brno') && !ferdinand1618.includes('Olomouc'));
});

test('occupation entries paint Olomouc alone and the Austrian and Prussian Silesian nuclei stay separate', () => {
  const swedish = authorities('CRISTINASUE', 1648).find(entry => entry.territory === 'Moravia');
  assert.equal(swedish?.kind, 'disputed');
  assert.deepEqual(swedish.ids, ['Olomouc']);
  assert(!personalIds('FERN3HRE', 1648).includes('Olomouc'));
  const prussian = authorities('FRED2PRUSSIA', 1742);
  assert(prussian.some(entry => entry.territory === 'Moravia' && entry.kind === 'disputed' && entry.ids.includes('Olomouc')));
  assert(prussian.some(entry => entry.territory === 'Silesia' && entry.kind === 'sovereign' && entry.ids.includes('Wroclaw')));
  assert(!personalIds('FRED2PRUSSIA', 1750).includes('Olomouc'));
  assert(!personalIds('FRED2PRUSSIA', 1750).includes('Tesin'));
  const mariaTheresa1750 = personalIds('MARIATERESAHAB', 1750);
  assert(mariaTheresa1750.includes('Tesin') && mariaTheresa1750.includes('Olomouc'));
  assert(!mariaTheresa1750.includes('Wroclaw') && !mariaTheresa1750.includes('Glogow'));
});

test('the 1504 Tyrolean acquisition marks only the contested frontier cells until the 1505 settlement', () => {
  const tyrol = year => authorities('MAXIM1', year).filter(entry => entry.territory === 'Tirol');
  assert(!tyrol(1503).some(entry => entry.ids.includes('Kufstein') || entry.ids.includes('Kitzbuhel')));
  const occupation1504 = tyrol(1504).find(entry => entry.kind === 'disputed');
  assert.deepEqual([...occupation1504.ids].sort(), ['Kitzbuhel', 'Kufstein']);
  assert(tyrol(1504).some(entry => entry.kind === 'sovereign' && entry.ids.includes('Innsbruck')));
  assert(!occupation1504.ids.includes('Innsbruck'));
  assert(tyrol(1505).some(entry => entry.kind === 'sovereign'
    && entry.ids.includes('Kufstein') && entry.ids.includes('Kitzbuhel')));
  assert(!tyrol(1505).some(entry => entry.kind === 'disputed'));
});

test('real correction sources retain usable links and labels in both string and structured formats', () => {
  const rawSources = runtimeData.overrides.flatMap(correction => correction.supportingSources || []);
  assert(rawSources.some(source => typeof source === 'string'));
  assert(rawSources.some(source => typeof source === 'object'));
  for (const raw of rawSources) {
    const source = mapSourceReference(raw);
    assert(['https:', 'http:'].includes(new URL(source.url).protocol), source.url);
    assert(source.title || source.label, source.url);
    if (typeof raw === 'object') assert.equal(source.locator, raw.locator, source.url);
  }
  const nominal = mapAuthoritiesForPerson(people.get('FERN2EMP'), 1618, runtimeData, {includeClaims: true})
    .find(entry => entry.territory === 'Moravia');
  assert.equal(nominal.kind, 'titular');
  assert.equal(nominal.paint, false);
  assert.deepEqual([...nominal.ids].sort(), ['Brno', 'Olomouc']);
  assert(nominal.claim.sources.every(source => source.url && source.title));
});

test('personal map evidence excludes sources belonging only to an inactive later expansion', () => {
  const medievalVenice = authorities('ENRICO_DANDOLO_DOGE', 1200).find(entry => entry.territory === 'Venecia');
  assert(medievalVenice);
  assert(!medievalVenice.mapSources.some(source => /islamansiklopedisi\.org\.tr\/(karlofca|mora)/.test(source.url)));
});
