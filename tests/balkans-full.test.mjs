import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {territorialIdentity} from '../src/data/territorialIdentity.js';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {colorTerritorioEnMapa} from '../src/Territorios.jsx';
import {atlasPoliticalMosaicAt} from '../src/data/atlasMosaic.js';
import {auditRegionalContinuity} from '../scripts/audits/audit-regional-continuity.mjs';
import {auditBalkansContinuity, balkanGeographicReview} from '../scripts/audits/audit-balkans-continuity.mjs';
import {applyRegionalReview} from '../scripts/cartography/apply-regional-review.mjs';
import {compactBalkanRoutes} from '../scripts/cartography/build-balkans-routes.mjs';
const read = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url)));
const review = read('../prototypes/euv-locations/balkans-full-review.json');
const data = read('../prototypes/euv-locations/corridor-locations.json');
const inventory = read('../prototypes/euv-locations/location-inventory.json');
const geography = read('../prototypes/euv-locations/balkans-geographic-cells.json');
const people = new Map(PERSONAS.map(p => [p.id, p]));
const owners = (id, year) => (atlasPoliticalMosaicAt(data, year).byLocation.get(id) || []).map(l => l.entityId).sort();
const personal = (id, year) => mapAuthoritiesForPerson(people.get(id), year, data);
const ids = (id, year) => new Set(personal(id, year).flatMap(e => e.ids));

test('all independently selected Balkan and adjacent surfaces have local evidence for all 601 years', () => {
  const result = auditBalkansContinuity(data, inventory, review, geography);
  assert.deepEqual(result.summary, {cells: 1124, years: 601, cellYears: 675524,
    missingCellYears: 0, unexplainedCellYears: 0, missingEvidenceYears: 0, missingGeometry: []});
  for (const row of result.cells) assert.equal(row.coloredYears, 601, row.id);
  assert.equal(balkanGeographicReview(review, geography, {coreOnly: true}).scope.ids.length, 731);
  const shrunk = structuredClone(review); shrunk.scope.ids.pop();
  assert.throws(() => balkanGeographicReview(shrunk, geography), /omits a geographic candidate/);
  const expanded = structuredClone(geography); expanded.cells.push({id: 'UNREVIEWED_GEOGRAPHY', scopeAreas: {balkans: 1}});
  assert.throws(() => balkanGeographicReview(review, expanded), /omits a geographic candidate/);
});

test('a single-year hole and missing local citation cannot pass as complete coverage', () => {
  const tiny = {...review, scope: {...review.scope, from: 1390, through: 1390, ids: ['Tinos']}};
  const broken = structuredClone(data);
  broken.additionalTerritories.find(l => l.name.startsWith('Tinos · 1390')).coverage.from = 1391;
  assert.equal(auditRegionalContinuity(broken, inventory, tiny).summary.missingCellYears, 1);
  const uncited = structuredClone(data);
  uncited.additionalTerritories.find(l => l.name.startsWith('Tinos · 1200')).sources[0].locator = '';
  assert.equal(auditRegionalContinuity(uncited, inventory,
    {...tiny, scope: {...tiny.scope, from: 1200, through: 1200}}).summary.missingEvidenceYears, 1);
  const phaseGap = structuredClone(review);
  phaseGap.assignments.find(p => p.name.startsWith('Tinos · 1390')).from = 1391;
  assert.throws(() => applyRegionalReview(structuredClone(data), phaseGap, 'balkansFullReview', 'Balcanes'), /replacement gap: Tinos\/1390/);
});

test('Tinos does not inherit the earlier conquest of Mykonos and Delos', () => {
  assert.deepEqual(owners('Tinos', 1500), ['Venecia']);
  assert.deepEqual(owners('Tinos', 1600), ['Venecia']);
  assert.deepEqual(owners('Mykonos', 1600), ['Imperio otomano']);
  assert.deepEqual(owners('Tinos', 1715), ['Imperio otomano']);
});

test('mountains, the Serbian expansion and frontier recoveries have dated authorities', () => {
  for (const id of ['Ioannina', 'Trikala', 'Pindus_Mountains5', 'Pindus_Mountains10'])
    assert.deepEqual(owners(id, 1350), ['Serbia'], id);
  assert.deepEqual(owners('Tarnovo', 1394), ['Imperio otomano']);
  assert.deepEqual(owners('Nis', 1415), ['Serbia']);
  assert.deepEqual(owners('Nis', 1430), ['Imperio otomano']);
  assert.deepEqual(owners('Vranje', 1206), ['Bizancio']);
  assert.deepEqual(owners('Vranje', 1207), ['Serbia']);
  assert.deepEqual(owners('Branicevo', 1300), ['Sirmia']);
  assert.deepEqual(owners('Drastar', 1380), ['Principado de Valaquia', 'Zarato de Tarnovo']);
  assert.deepEqual(owners('Drastar', 1405), ['Principado de Valaquia']);
  assert.deepEqual(owners('Drastar', 1420), ['Imperio otomano']);
});

test('direct Ottoman provinces coalesce while tributary governments retain their own identity', () => {
  for (const id of ['Tarnovo', 'Athens', 'Ioannina']) {
    assert.deepEqual(owners(id, 1530), ['Imperio otomano'], id);
  }
  assert.deepEqual(owners('Vrhbosna', 1530), ['Imperio otomano']);
  assert.deepEqual(owners('Prilep', 1380), ['Prilep']);
  assert.deepEqual(owners('Naxos', 1568), ['Ducado del Archipiélago']);
  assert(!ids('SULEIMAN1OSM', 1530).has('Naxos'));
  assert(!ids('SULEIMAN1OSM', 1530).has('Tinos'));
  assert(ids('SULEIMAN1OSM', 1530).has('Athens'));
});

test('the imperial title and tributary office do not give a regional ruler all Serbia', () => {
  assert(ids('STEFANDUSAN', 1350).has('Ioannina'));
  assert(ids('STEFANDUSAN', 1350).has('Trikala'));
  assert(!ids('STEFANDUSAN', 1350).has('Thessaloniki'));
  assert(!ids('STEFANUROS5SER', 1360).has('Ioannina'));
  assert(!ids('STEFANUROS5SER', 1360).has('Trikala'));
  assert(ids('MARKOMRNJAVCEVIC', 1380).has('Prilep'));
  assert(!ids('MARKOMRNJAVCEVIC', 1380).has('Smederevo'));
  assert(!ids('SKANDERBEG', 1450).has('Lezhe'));
  assert(!ids('SKANDERBEG', 1450).has('Shkoder'));
  assert(!ids('SULEYMANCELEBI', 1405).has('Manisa'));
  assert(!ids('SULEYMANCELEBI', 1405).has('Thessaloniki'));
  assert(!ids('MUSACELEBI', 1412).has('Bursa'));
  assert.deepEqual(personal('IVANSHISHMANBUL', 1394).flatMap(e => e.ids), ['Nikopol']);
});

test('integrated titles share a personal color and remain separate documented offices', () => {
  const tocco = people.get('CARLO1TOCCO');
  assert.equal(colorTerritorioEnMapa(tocco, 'Epiro de los Tocco', 1420), colorTerritorioEnMapa(tocco, 'Condado palatino de Cefalonia y Zacinto', 1420));
  assert(personal(tocco.id, 1420).some(e => e.government.titulo === 'Déspota'));
  assert(personal(tocco.id, 1420).some(e => e.government.titulo === 'Conde palatino'));
  const hab = people.get('CARLOS6HRE');
  assert.equal(colorTerritorioEnMapa(hab, 'Austria', 1720), colorTerritorioEnMapa(hab, 'Norte de Serbia habsbúrgico', 1720));
  assert.equal(colorTerritorioEnMapa(hab, 'Austria', 1720), colorTerritorioEnMapa(hab, 'Oltenia habsbúrgica', 1720));
  assert(ids(hab.id, 1720).has('Belgrad'));
  assert(!ids(hab.id, 1740).has('Belgrad'));
});

test('new offices cite their own mandate, and rank changes keep the existing person identity', () => {
  for (const id of ['OSMAN1OSM','ORHANOSM','MURAD1OSM','MARKOMRNJAVCEVIC','KONSTANTINDEJANOVIC','SKANDERBEG','BALSA3BALSIC','SELIM3OSM','ESAUBUONDELMONTI']) {
    const p = people.get(id); assert(p, id);
    for (const claim of personClaims(p).filter(c => c.field === 'Gobierno'))
      assert(claim.sources.length && claim.sources.every(s => s.locator), claim.id);
  }
  assert.equal(people.get('STEFANLAZAREVIC').gobiernos.find(g => g.desde === 1402).titulo, 'Déspota');
  assert.equal(people.get('STEFANDUSAN').gobiernos.filter(g => g.titulo === 'Emperador').length, 1);
  const compact = read('../src/data/balkansFullRouteData.json');
  assert.deepEqual(compact, compactBalkanRoutes(review));
  assert(compact.assignments.every(p => !p.ids && !p.note && !p.sourceKeys));
});

test('full surfaces do not give brothers, rival kings or exiled claimants each other’s territories', () => {
  assert(ids('CONSTANTINE11PALA', 1430).has('Andravida'));
  assert(!ids('CONSTANTINE11PALA', 1430).has('Kyparissia'));
  assert(ids('THOMASPALA', 1450).has('Kyparissia'));
  assert(!ids('THOMASPALA', 1450).has('Mystras'));
  assert(ids('DEMETRIOSMOREA', 1450).has('Mystras'));
  assert(!ids('DEMETRIOSMOREA', 1450).has('Kyparissia'));
  assert(ids('FERN1EMP', 1530).has('Sibiu'));
  assert(!ids('JUAN1ZAPOLYA', 1530).has('Sibiu'));
  assert(ids('JUAN1ZAPOLYA', 1530).has('Cluj'));
  assert(!ids('FERN1EMP', 1530).has('Cluj'));
  assert.equal(ids('CHARLOTTECYPRUS', 1462).size, 0);
  assert(ids('JAMES2CYPRUS', 1464).has('Nicosia_Cyp'));
});

test('Galicia has a dated royal title and integrated color without inheriting the imperial office', () => {
  const p = people.get('MARIATERESAHAB');
  const office = p.gobiernos.find(g => g.territorio === 'Reino de Galicia y Lodomeria');
  assert.equal(office.titulo, 'Reina');
  assert.equal(office.desde, 1772);
  assert(personClaims(p).find(c => c.field === 'Gobierno' && c.value === office).sources.every(s => s.locator));
  assert(ids(p.id, 1775).has('Stryi'));
  assert(!ids(p.id, 1770).has('Stryi'));
  assert.equal(colorTerritorioEnMapa(p, office.territorio, 1775), colorTerritorioEnMapa(p, 'Austria', 1775));
});

test('local conquests and legal acquisitions do not inherit a neighboring region’s chronology', () => {
  assert.deepEqual(owners('Tamsweg', 1200), ['Carintia']);
  assert.deepEqual(owners('Tamsweg', 1300), ['Salzburg']);
  assert.deepEqual(owners('Giresun', 1350), ['Trebisonda']);
  assert.deepEqual(owners('Giresun', 1400), ['Beylicato de Hacıemir']);
  assert.deepEqual(owners('Besni', 1280), ['Armenia cilicia']);
  assert.deepEqual(owners('Ayntab', 1350), ['Sultanato mameluco']);
  assert.deepEqual(owners('Ayntab', 1515), ['Sultanato mameluco']);
  assert.deepEqual(owners('Ayntab', 1516), ['Imperio otomano']);
  assert.deepEqual(owners('Khoy', 1800), ['Kanato de Khoy']);
  assert.deepEqual(owners('Maku', 1800), ['Kanato de Maku']);
});

test('every surveyed political identity resolves to a real territorial catalogue entry', () => {
  const known = new Set(Object.keys(TERRITORIOS).map(territorialIdentity));
  for (const phase of review.assignments) assert(known.has(territorialIdentity(phase.identity)), phase.identity);
});
