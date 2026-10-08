import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reviewedLayerLocations, reviewedAuthorityConditions} from '../src/data/locationMapPilot.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {politicalMosaicAt} from '../prototypes/euv-locations/location-mosaic.js';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const patch = read('../prototypes/euv-locations/balkan-expansion-locations.json');
const integrated = read('../prototypes/euv-locations/corridor-locations.json');
const data = {from:1200, through:1800, territories:patch.territories, overrides:[]};
const layer = name => patch.territories.find(entry => entry.name === name);
const ids = (name, year) => reviewedLayerLocations(data, layer(name), year);
const evidenceAt = (name, id, year, action = 'add') => patch.evidence.filter(group =>
  group.territory === name && (group.action || 'add') === action
  && group.from <= year && year <= group.through && group.ids.includes(id));

test('the two kings dispute documented Slavonian cores without colouring every Croatian cell', () => {
  const name = 'Eslavonia disputada (núcleos)';
  assert.equal(layer(name).authorityCondition, 'control disputado');
  assert.deepEqual(ids(name,1530), ['Kutina','Pakrac','Pozega']);
  assert(!ids(name,1530).includes('Bjelovar'));
  assert(!ids(name,1530).includes('Virovitica'));
  assert.deepEqual(ids(name,1535), ['Pozega']);
  assert.deepEqual(ids(name,1537), []);
  assert.equal(evidenceAt('Croacia habsbúrgica','Kutina',1530).length,0);
  assert.equal(evidenceAt('Croacia habsbúrgica','Pakrac',1531).length,0);
  assert.equal(evidenceAt('Croacia habsbúrgica','Pakrac',1532).length,1);
  assert.equal(evidenceAt('Croacia habsbúrgica','Kutina',1535).length,1);
  assert.equal(evidenceAt('Croacia habsbúrgica','Pozega',1530,'remove').length,1);
  const conditions = reviewedAuthorityConditions(data,name,1530,'SIMUNBAKACERDODY');
  assert.equal(conditions.get('Kutina').condition,'control disputado');
  assert(conditions.get('Kutina').sources.some(source => source.url.includes('hbl.lzmk.hr')));
});

test('the inspector gives the ban a delegated mandate and the disputed core a distinct regional condition', () => {
  const person={id:'SIMUNBAKACERDODY',nombre:'Šimun Bakač-Erdődy',gobiernos:[
    {territorio:'Eslavonia disputada (núcleos)',desde:1530,hasta:1534,titulo:'Ban',
      clase:'banato',condicion:'gobierno delegado',soberano:'JUAN1ZAPOLYA'}]};
  const entries = mapAuthoritiesForPerson(person,1530,data);
  assert(entries.some(entry => entry.kind === 'disputed' && entry.ids.includes('Kutina')));
  assert(entries.every(entry => entry.government.condicion === 'gobierno delegado'));
  assert(entries.every(entry => entry.government.soberano === 'JUAN1ZAPOLYA'));
  assert(!entries.some(entry => entry.ids.includes('Zagreb')));
});

test('Sibiu remains the Habsburg exception until the documented surrender of 1536', () => {
  assert.equal(evidenceAt('Hungría real','Sibiu',1535).length,1);
  assert.equal(evidenceAt('Núcleo oriental de Zápolya','Sibiu',1535).length,0);
  assert.equal(evidenceAt('Núcleo oriental de Zápolya','Sibiu',1535,'remove').length,1);
  assert.equal(evidenceAt('Hungría real','Sibiu',1536).length,0);
  assert.equal(evidenceAt('Núcleo oriental de Zápolya','Sibiu',1536).length,1);
});

test('Ermioni is Venetian before 1537 while the unresolved Damala cell stays outside the patch', () => {
  assert.equal(evidenceAt('Venecia','Ermioni',1530).length,1);
  assert.equal(evidenceAt('Balcanes meridionales otomanos','Ermioni',1530).length,0);
  assert.equal(evidenceAt('Balcanes meridionales otomanos','Ermioni',1538).length,1);
  assert(!patch.evidence.some(group => group.ids.includes('Damala')));
});

test('Morea follows the Venetian treaty and Ottoman reconquest without inheriting all of 1650', () => {
  const name='Morea veneciana (núcleos)';
  assert.deepEqual(ids(name,1698),[]);
  assert(ids(name,1700).includes('Nafplio'));
  assert.equal(ids(name,1700).length,6);
  assert.deepEqual(ids(name,1715),[]);
  const extension=patch.temporalExtensions.find(entry => entry.name==='Balcanes meridionales otomanos');
  const late={from:1200,through:1800,territories:[{...extension,coverage:{from:1651,through:1800}}],overrides:[]};
  const at = year => reviewedLayerLocations(late,late.territories[0],year);
  assert(at(1660).includes('Nafplio'));
  assert(!at(1660).includes('Peloponnesian_Mountains2'));
  assert(at(1671).includes('Peloponnesian_Mountains2'));
  assert(!at(1700).includes('Nafplio'));
  assert(at(1715).includes('Nafplio'));
  assert(at(1780).includes('Nafplio'));
  assert(!at(1780).includes('Peloponnesian_Mountains2'));
  assert(!at(1660).includes('Timisoara'));
  assert(!at(1660).includes('Podgorica'));
  assert(!at(1660).includes('Pindus_Mountains1'));
});

test('Athos retains its distinct monastic administration and no invented personal succession', () => {
  const name='Monte Athos autónomo bajo autoridad otomana';
  assert.equal(layer(name).authorityCondition,'autonomía tributaria');
  assert.deepEqual(ids(name,1429),[]);
  assert.deepEqual(ids(name,1530),['Mount_Athos']);
  assert.deepEqual(ids(name,1800),['Mount_Athos']);
  assert(!patch.evidence.some(group => group.territory === 'Balcanes meridionales otomanos'
    && group.ids.includes('Mount_Athos')));
});

test('the western Transylvanian Crasna is not assigned to Moldavia by its ambiguous name', () => {
  const geometry = read('../prototypes/euv-locations/balkan-spatial-cells.json');
  const crasna = geometry.cells.find(cell => cell.id === 'Crasna');
  const zalau = geometry.cells.find(cell => cell.id === 'Zalau');
  const huedin = geometry.cells.find(cell => cell.id === 'Huedin');
  assert(crasna.centroid[0] < zalau.centroid[0]);
  assert(crasna.centroid[1] > zalau.centroid[1]);
  assert(crasna.centroid[0] < huedin.centroid[0]);
  assert(evidenceAt('Principado de Moldavia','Crasna',1530,'remove').length === 1);
  for(const year of [1400,1500,1530,1538,1600]) {
    const owners = politicalMosaicAt(integrated,year).byLocation.get('Crasna') || [];
    assert(!owners.some(owner => owner.name === 'Principado de Moldavia'), String(year));
  }
  const owners = politicalMosaicAt(integrated,1530).byLocation.get('Crasna');
  assert.deepEqual(owners.map(owner => owner.entityId),['Hungría']);
  assert.deepEqual(owners[0].scopes.filter(scope=>scope.ids.includes('Crasna')).map(scope=>scope.name),
    ['Núcleo oriental de Zápolya']);
});

test('Venetian Dalmatia and the delegated Bihar core are not duplicated as different mosaic domains', () => {
  for(const [id,year] of [['Novigrad',1410],['Krk',1481],['Oradea',1530]]) {
    const owners = politicalMosaicAt(integrated,year).byLocation.get(id) || [];
    assert.equal(owners.length,1,`${id} in ${year}: ${owners.map(owner => owner.name).join(', ')}`);
  }
  assert.equal(politicalMosaicAt(integrated,1530).byLocation.get('Oradea')[0].name,
    'Gobierno de Bihar de Imre Czibak');
});
