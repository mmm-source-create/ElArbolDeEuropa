import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {buildPoliticalMapIndex, inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {TRIBUTARY_RELATIONS, tributaryEntriesFor} from '../src/data/tributaryRelations.js';
import {territorialIdentity, territorialColor} from '../src/data/territorialIdentity.js';
import {atlasPoliticalMosaicAt} from '../prototypes/euv-locations/atlas-mosaic.js';
import {auditIberiaItalyContinuity, iberiaItalyGeographicReview} from '../scripts/audits/audit-iberia-italy-continuity.mjs';
import {applyRegionalReview} from '../scripts/cartography/apply-regional-review.mjs';
import {compactBalkanRoutes} from '../scripts/cartography/build-balkans-routes.mjs';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const data = read('../prototypes/euv-locations/corridor-locations.json');
const review = read('../prototypes/euv-locations/iberia-italy-full-review.json');
const geography = read('../prototypes/euv-locations/iberia-italy-geographic-cells.json');
const inventory = read('../prototypes/euv-locations/location-inventory.json');
const people = new Map(PERSONAS.map(person => [person.id, person]));
const years = new Map();
const owners = (id, year) => {
  if (!years.has(year)) years.set(year, atlasPoliticalMosaicAt(data, year));
  return (years.get(year).byLocation.get(id) || []).map(layer => layer.entityId).sort();
};
const entries = (id, year, dependencies = false) => mapAuthoritiesForPerson(people.get(id), year, data, {includeDependencies: dependencies});
const ids = (id, year) => new Set(entries(id, year).filter(entry => entry.paint).flatMap(entry => entry.ids));

test('all independent geographic candidates retain annual coverage and local evidence', () => {
  assert.equal(geography.cells.length, 931);
  assert(geography.cells.some(cell => cell.id === 'Gennargentu_Mountains'));
  assert(geography.cells.some(cell => cell.id === 'Picos_de_Europa'));
  assert(geography.cells.some(cell => cell.id === 'Hipalan'));
  const result = auditIberiaItalyContinuity(data, inventory, review, geography);
  assert.equal(result.summary.cellYears, 559531);
  assert.equal(result.summary.missingCellYears, 0);
  assert.equal(result.summary.unexplainedCellYears, 0);
  assert.equal(result.summary.missingEvidenceYears, 0);
  assert.deepEqual(result.summary.missingGeometry, []);
});

test('dropping a candidate, a local citation or an annual replacement fails validation', () => {
  const narrower = structuredClone(review); narrower.scope.ids.pop();
  assert.throws(() => iberiaItalyGeographicReview(narrower, geography), /omits a geographic candidate/);
  const unsupported = structuredClone(review);
  delete unsupported.sources[unsupported.assignments[0].sourceKeys[0]].locator;
  assert.throws(() => applyRegionalReview(structuredClone(data), unsupported, 'iberiaItalyReview', 'test'), /Missing regional evidence/);
  const broken = structuredClone(review);
  broken.assignments = broken.assignments.map(phase => ({...phase, ids: phase.ids.filter(id => id !== 'Funchal')})).filter(phase => phase.ids.length);
  assert.throws(() => applyRegionalReview(structuredClone(data), broken, 'iberiaItalyReview', 'test'), /Regional replacement gap: Funchal/);
});

test('conquests and local successions preserve whole regional surfaces before 1400', () => {
  assert.deepEqual(owners('Evora', 1200), ['Portugal']);
  assert.deepEqual(owners('Alcacer_do_Sal', 1216), ['Califato almohade']);
  assert.deepEqual(owners('Alcacer_do_Sal', 1217), ['Portugal']);
  assert.deepEqual(owners('Murcia', 1250), ['Emirato de Murcia']);
  assert.deepEqual(owners('Murcia', 1266), ['Castilla']);
  assert.deepEqual(owners('Treviso', 1330), ['Verona']);
  assert.deepEqual(owners('Cortenuova', 1427), ['Milán']);
  assert.deepEqual(owners('Cortenuova', 1428), ['Venecia']);
  assert.deepEqual(owners('Pisa', 1495), ['República de Pisa']);
  assert.deepEqual(owners('Pisa', 1509), ['Florencia']);
  assert.deepEqual(owners('Imola', 1505), ['Estados Pontificios']);
  assert.deepEqual(owners('Cesena', 1505), ['Estados Pontificios']);
  assert.deepEqual(owners('Rimini', 1505), ['Venecia']);
});

test('Sardinian partitions and residual judicates do not inherit neighboring dates', () => {
  assert.deepEqual(owners('Cagliari', 1260), ['República de Pisa']);
  assert.deepEqual(owners('Cagliari', 1325), ['República de Pisa']);
  assert.deepEqual(owners('Cagliari', 1326), ['Cerdeña']);
  assert.deepEqual(owners('Muravera', 1260), ['Judicado de Gallura']);
  assert.deepEqual(owners('Macomer', 1300), ['Judicado de Arborea']);
  assert.deepEqual(owners('Macomer', 1415), ['Cerdeña', 'Judicado de Arborea']);
  assert.deepEqual(owners('Oristano', 1415), ['Marquesado de Oristano']);
  assert.deepEqual(owners('Oristano', 1478), ['Cerdeña']);
  assert.deepEqual(owners('Grosseto', 1600), ['Estado de los Presidios', 'Toscana']);
  assert.deepEqual(owners('Piombino', 1610), ['Estado de los Presidios', 'Piombino', 'Toscana']);
});

test('personal scopes exclude another branch while preserving delegated authority', () => {
  assert(ids('CARLOS5', 1530).has('Puigcerda'));
  assert(!ids('CARLOS5', 1530).has('Saint_Jean_Pied_de_Port'));
  assert(ids('ENRIQ2NAV', 1530).has('Saint_Jean_Pied_de_Port'));
  assert(!ids('ENRIQ2NAV', 1530).has('Pamplona'));
  assert(!ids('BERNVISC', 1360).has('Pavia'));
  assert(ids('GAL2VISC', 1360).has('Pavia'));
  assert(!ids('GAL2VISC', 1360).has('Brescia'));
  const wali = entries('ABUYAHYAMALL', 1210);
  assert.equal(wali.flatMap(entry => entry.ids).length, 5);
  assert(wali.every(entry => entry.kind === 'delegated'));
  assert(entries('GIOVANNIBOCCANE', 1360).every(entry => entry.kind === 'delegated'));
});

test('tributary entries are dated relationships and never fabricated personal offices', () => {
  assert.equal(new Set(TRIBUTARY_RELATIONS.map(r=>r.id)).size,TRIBUTARY_RELATIONS.length);
  assert(TRIBUTARY_RELATIONS.some(r=>r.id==='crimea-ottoman'));
  assert(TRIBUTARY_RELATIONS.some(r=>r.id==='granada-castile-jaen'));
  const person = people.get('SULEYMAN1') || PERSONAS.find(person => person.nombre.includes('Solimán') && person.gobiernos?.some(g => g.desde <= 1530 && g.hasta >= 1530));
  assert(person);
  const own = mapAuthoritiesForPerson(person, 1530, data);
  const dependencies = tributaryEntriesFor(person, 1530, data, own);
  assert(dependencies.some(entry => entry.territory === 'Principado de Moldavia'));
  assert(dependencies.some(entry => entry.territory === 'Principado de Valaquia'));
  assert(dependencies.every(entry => entry.government === null && entry.claim === null));
  const ownIds = new Set(own.filter(entry => entry.paint).flatMap(entry => entry.ids));
  assert(dependencies.every(entry => entry.ids.every(id => !ownIds.has(id))));
  assert(dependencies.every(entry => entry.mapSources.every(source => source.url && source.locator)));
  assert.deepEqual(owners('Iasi', 1530), ['Principado de Moldavia']);
  const pretender = {...person, gobiernos: person.gobiernos.map(g => ({...g, condicion:'titular'}))};
  assert.deepEqual(tributaryEntriesFor(pretender, 1530, data), []);
  assert.deepEqual(tributaryEntriesFor(people.get('GIOVANNIBOCCANE'), 1360, data), []);
});

test('Jaén, Alcaraz and Capdepera do not survive their ruptures or annexations', () => {
  const castile = entries('ALF10', 1255, true);
  assert(castile.some(entry => entry.kind === 'tributary' && entry.territory === 'Granada'));
  assert(castile.some(entry => entry.kind === 'tributary' && entry.territory === 'Emirato de Murcia'));
  assert(!entries('ALF10', 1264, true).some(entry => entry.kind === 'tributary'));
  assert(entries('JAIME1AR', 1250, true).some(entry => entry.kind === 'tributary' && entry.ids.includes('Ciudadela_de_Menorca')));
  assert(!entries('JAIME1AR', 1230, true).some(entry => entry.kind === 'tributary'));
  assert(!entries('JAIME2MAL', 1287, true).some(entry => entry.kind === 'tributary'));
  assert.deepEqual(entries('ALF10', 1255).filter(entry => entry.kind === 'tributary'), []);
});

test('the inspector keeps local evidence and does not invent a ruler for an unresolved office', () => {
  const index = buildPoliticalMapIndex(PERSONAS, 1250, data, {includeDependencies:true});
  const menorca = inspectMapRegion('Ciudadela_de_Menorca', 1250, index, data);
  assert(menorca.entries.some(entry => entry.kind === 'tributary'));
  assert(menorca.entries.some(entry => entry.kind === 'regional' || entry.territory === 'Emirato de Menorca' && !entry.relationship));
  const doc = inspectMapRegion('Macomer', 1300, buildPoliticalMapIndex(PERSONAS, 1300, data), data);
  assert(doc.entries.length);
  assert(doc.entries.every(entry => entry.person === null));
  assert(doc.entries.every(entry => entry.regionalEvidence && entry.mapSources.every(source => source.locator)));
  const alcacer = inspectMapRegion('Alcacer_do_Sal', 1250, index, data);
  assert(alcacer.entries.every(entry => !entry.mapSources?.some(source => source.url.includes('castelsardo'))));
});

test('islands without documented settlement are a geographic condition, and identities never use an owner name', () => {
  assert.equal(TERRITORIOS['Islas sin autoridad política documentada'].naturaleza, 'agrupacion');
  assert.deepEqual(owners('Funchal', 1200), ['Islas sin autoridad política documentada']);
  assert.deepEqual(owners('Funchal', 1500), ['Portugal']);
  assert.equal(territorialColor('Islas sin autoridad política documentada'), '#8d9da0');
  for (const phase of review.assignments) assert(TERRITORIOS[phase.identity], phase.identity);
  assert(!review.assignments.some(phase => ['Gibraltar meriní','Menorca británica','Menorca francesa'].includes(phase.identity)));
  assert.equal(owners('Ciudadela_de_Menorca', 1715)[0], owners('Ciudadela_de_Menorca', 1758)[0]);
});

test('new mandates have their own localized sources and the compact routes reproduce the review', () => {
  for (const id of ['ALNASIRALMOH','ABUYAHYAMALL','ADELASIATORRES','MARIANO4ARBOREA','ELEONORAARBOREA','LEONARDOALAGON','SIMONEBOCCANE','GIOVANNIBOCCANE','GAL2VISC']) {
    assert(people.has(id), id);
    assert(personClaims(people.get(id)).filter(claim => claim.field === 'Gobierno').every(claim => claim.sources.length && claim.sources.every(source => source.locator)), id);
  }
  assert.deepEqual(read('../src/data/iberiaItalyRouteData.json'), compactBalkanRoutes(review));
});
