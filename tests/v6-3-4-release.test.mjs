import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {gobiernosDe} from '../src/domain/genealogy/personAccessors.js';
import {TRIBUTARY_RELATIONS} from '../src/cartography/tributaryRelations.js';
import {territorialIdentity} from '../src/cartography/territorialIdentity.js';
import {governmentGroupsAt} from '../src/domain/government/governmentPresentation.js';
import {PROFILE_LABELS, PROFILE_NOTES} from '../src/features/english/profileVocabulary.js';

const person = id => PERSONAS.find(p => p.id === id);
const holds = (id, territory, year) => gobiernosDe(person(id)).some(g => g.territorio === territory && g.desde <= year && year <= g.hasta);

test('Fernando IV lleva los títulos de las coronas de Bohemia y de Hungría', () => {
  for (const territory of ['Bohemia', 'Moravia', 'Silesia', 'Hungría', 'Croacia', 'Eslavonia']) assert.ok(holds('FERN4BOH', territory, 1650), territory);
  const routes = fs.readFileSync('src/cartography/regions/atlasChronologyRoutes.js', 'utf8');
  assert.match(routes, /"personId": "FERN4BOH",\n    "territorio": "Silesia",\n    "desde": 1646,\n    "hasta": 1654/);
});

test('los reyes de Bohemia gobiernan las Lusacias hasta la paz de Praga, sin ámbito parcial', () => {
  for (const [id, year] of [['CARLOS4', 1370], ['WEN4LUX', 1400], ['MATIAS1HUN', 1485], ['FERN1EMP', 1550], ['RODOLFO2HRE', 1600], ['FED5PALBOH', 1620]]) {
    assert.ok(holds(id, 'Alta Lusacia', year), `${id} Alta Lusacia`);
    assert.ok(holds(id, 'Baja Lusacia', year), `${id} Baja Lusacia`);
  }
  assert.ok(holds('JUAN1B', 'Alta Lusacia', 1330) && !holds('JUAN1B', 'Baja Lusacia', 1330), 'la Baja Lusacia llega en 1367');
  for (const p of PERSONAS) for (const g of gobiernosDe(p)) if (/Lusacia$/.test(g.territorio)) {
    assert.ok(g.hasta <= 1634, `${p.id} ${g.territorio} después de 1635`);
    assert.equal(g.ambito, undefined, 'la fase de la cartografía alemana solo enlaza mandatos sin ámbito parcial');
  }
  assert.equal(TERRITORIOS['Baja Lusacia'].clase, 'margraviato');
});

test('cada rey de Hungría que reina en Croacia reina también en Eslavonia desde 1200', () => {
  for (const p of PERSONAS) {
    const gs = gobiernosDe(p);
    if (!gs.some(g => g.territorio === 'Hungría')) continue;
    for (const g of gs.filter(g => g.territorio === 'Croacia' && g.hasta >= 1200 && g.condicion !== 'gobierno delegado')) {
      assert.ok(gs.some(s => s.territorio === 'Eslavonia' && s.desde === Math.max(1200, g.desde) && s.hasta === g.hasta), `${p.id} ${g.desde}`);
    }
  }
  const bakac = gobiernosDe(person('SIMUNBAKACERDODY')).find(g => g.territorio === 'Eslavonia');
  assert.equal(bakac.clase, 'banato');
});

test('Provenza bajo los Anjou, Cromwell en los tres reinos y Saboya ocupada por Francia', () => {
  for (const [id, year] of [['BEATPROV', 1250], ['CARLOS1ANJ', 1275], ['CARLOS2NAP', 1300], ['ROB1NAP', 1330], ['JUANA1NAP', 1370]]) assert.ok(holds(id, 'Provenza', year), id);
  for (const territory of ['Inglaterra', 'Escocia', 'Irlanda']) assert.ok(holds('OLIVERCROMWELL', territory, 1655), territory);
  const occupation = gobiernosDe(person('ENRIQ2FRA')).find(g => g.territorio === 'Saboya');
  assert.equal(occupation.condicion, 'ocupación');
  const groups = governmentGroupsAt(person('ENRIQ2FRA'), 1550, {view: 'panorama'});
  const savoy = groups.find(g => g.mandates.some(m => m.territorio === 'Saboya'));
  const france = groups.find(g => g.mandates.some(m => m.territorio === 'Francia'));
  assert.equal(savoy.color, france.color, 'la ocupación se pinta con el color del ocupante');
  const scopes = fs.readFileSync('src/cartography/authorityMapScopes.js', 'utf8');
  assert.match(scopes, /personId:'ENRIQ2FRA',territory:'Saboya'/);
  const cells = scopes.match(/personId:'ENRIQ2FRA',territory:'Saboya'[^\n]*?ids:\[([^\]]*)\]/)[1];
  assert.match(cells, /'Chambery'/);
  assert.doesNotMatch(cells, /'Aosta'|'Nice'|'Evian'|'Gex'/, 'Aosta y Niza no fueron ocupadas; el Chablais y Gex pasan a Berna y al Valais');
});

test('Tremecén y Piombino aparecen como dependencias de la Monarquía Hispánica', () => {
  const tlemcen = TRIBUTARY_RELATIONS.find(r => r.id === 'tlemcen-zayyanid-spain');
  assert.deepEqual(tlemcen.periods, [[1518, 1528], [1543, 1550]]);
  const piombino = TRIBUTARY_RELATIONS.find(r => r.id === 'piombino-spain');
  assert.equal(piombino.type, 'feudo');
  assert.deepEqual(piombino.periods, [[1634, 1645], [1650, 1700]]);
  for (const relation of [tlemcen, piombino]) {
    assert.ok(relation.sources.every(source => source.url.startsWith('https://')));
    assert.ok(PROFILE_LABELS[relation.subjectLabel], 'etiqueta inglesa');
  }
});

test('las fichas duplicadas se fusionan con redirección y el formato de los nombres es uniforme', () => {
  const routes = JSON.parse(fs.readFileSync('routes.json', 'utf8'));
  for (const [duplicate, main, es, en, esMain, enMain] of [
    ['Principado de Beloózero', 'Beloózero', 'principado-de-beloozero', 'principality-of-beloozero', 'beloozero', 'beloozero'],
    ['Principado de Pólotsk', 'Pólotsk', 'principado-de-polotsk', 'principality-of-polotsk', 'polotsk', 'polotsk'],
    ['Principado de Antioquía', 'Antioquía', 'principado-de-antioquia', 'principality-of-antioch', 'antioquia', 'antioch'],
  ]) {
    assert.equal(TERRITORIOS[duplicate], undefined, duplicate);
    assert.ok(TERRITORIOS[main], main);
    assert.equal(territorialIdentity(duplicate), main);
    assert.ok(routes.redirects.some(r => r.source === `/es/territorio/${es}` && r.destination === `/es/territorio/${esMain}` && r.permanent));
    assert.ok(routes.redirects.some(r => r.source === `/en/territory/${en}` && r.destination === `/en/territory/${enMain}` && r.permanent));
  }
  assert.equal(TERRITORIOS['Morea veneciana (núcleos)'], undefined);
  assert.ok(TERRITORIOS['Morea veneciana · núcleos']);
  for (const name of Object.keys(TERRITORIOS)) {
    assert.equal(name, name.trim(), name);
    assert.doesNotMatch(name, /\s{2}|[()]/, name);
  }
  for (const note of ['Reino de Eslavonia, unido a Croacia bajo los banes dentro de la Corona húngara; banes y duques se registran aparte.'])
    assert.ok(PROFILE_NOTES[note], 'nota traducida');
});
