import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {buildPoliticalMapIndex, inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {auditLocationMap, atlasLocationIds} from '../src/data/locationMapAudit.js';
import {pilotLocationContext, pilotLocationsFor} from '../src/data/locationMapPilot.js';

const data = JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json', import.meta.url)));
data.burgundy = JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/burgundian-locations.json', import.meta.url)));
const people = new Map(PERSONAS.map(p => [p.id, p]));
const inspect = (id, year) => inspectMapRegion(id, year,
  buildPoliticalMapIndex(PERSONAS, year, data, {includeClaims: true}), data);

test('a delegated governor coexists with Philip II and has individually sourced authority', () => {
  const region = inspect('Brussels', 1560);
  assert(region.entries.some(e => e.person?.id === 'FEL2ESP' && e.kind === 'sovereign'));
  const governor = region.entries.find(e => e.person?.id === 'MARGPARMA');
  assert.equal(governor.kind, 'delegated');
  assert.equal(governor.government.soberano, 'FEL2ESP');
  assert(governor.claim.sources.length);
  assert(!inspect('Brussels', 1568).entries.some(e => e.person?.id === 'MARGPARMA'));
});

test('titular Burgundy and abjured Holland are inspectable without painting Philip II', () => {
  const duchy = inspect('Dijon', 1560);
  assert(!duchy.entries.some(e => e.person?.id === 'FEL2ESP'));
  assert(duchy.claims.some(e => e.person?.id === 'FEL2ESP' && e.kind === 'titular'));
  assert(inspect('Amsterdam', 1582).claims.some(e => e.person?.id === 'FEL2ESP'));
  assert(!mapAuthoritiesForPerson(people.get('FEL2ESP'), 1582, data)
    .some(e => e.paint && e.ids.includes('Amsterdam')));
  assert(inspect('Brussels', 1582).entries.some(e => e.person?.id === 'FEL2ESP'));
});

test('the inspector includes each painted Burgundian supplement and dated Hungarian core', () => {
  assert(inspect('Cuijk', 1548).entries.some(e => e.person?.id === 'CARLOS5' && e.cartographicSupplement));
  const disputed = mapAuthoritiesForPerson(people.get('JUAN1ZAPOLYA'), 1530, data);
  assert(disputed.some(e => e.kind === 'disputed' && e.paint));
  const index = buildPoliticalMapIndex(PERSONAS, 1530, data);
  for (const entry of disputed) for (const id of entry.ids) {
    assert(index.get(id)?.some(e => e.person?.id === 'JUAN1ZAPOLYA' && e.kind === entry.kind));
  }
});

test('Scania, Vyborg and Baltic possessions are connected to their dated authorities', () => {
  for (const id of ['Helsingborg', 'Malmo', 'Lund', 'Osby', 'Gladsax']) {
    assert(pilotLocationsFor(data, 'Dinamarca', 1630).includes(id));
    assert(inspect(id, 1630).entries.some(e => e.person?.id === 'CHRISTIAN4DEN'));
    assert(pilotLocationContext(data, id, 1630).some(e => e.correction?.source));
  }
  assert(pilotLocationsFor(data, 'Suecia', 1500).includes('Vyborg'));
  assert(!pilotLocationsFor(data, 'Suecia', 1560).includes('Riga'));
  assert(pilotLocationsFor(data, 'Suecia', 1621).includes('Riga'));
  assert(!pilotLocationsFor(data, 'Suecia', 1644).includes('Kuressaare'));
  assert(pilotLocationsFor(data, 'Suecia', 1645).includes('Kuressaare'));
  assert(mapAuthoritiesForPerson(people.get('GUSTAV2ADOLFO'), 1630, data)
    .some(e => e.kind === 'disputed' && e.territory === 'Pomerania bajo ocupación sueca'));
});

test('Jajce follows Hungarian authority before its year-end Ottoman conquest in 1527', () => {
  assert(pilotLocationsFor(data, 'Hungría', 1500).includes('Jajce'));
  assert(!pilotLocationsFor(data, 'Imperio otomano', 1526).includes('Jajce'));
  assert(pilotLocationsFor(data, 'Imperio otomano', 1527).includes('Jajce'));
  assert(!pilotLocationsFor(data, 'Imperio otomano', 1560).includes('Bucharest'));
  assert(!pilotLocationsFor(data, 'Imperio otomano', 1560).includes('Suceava'));
});

test('all-year audit detects internal gaps, transitions and missing geometry without mistaking delegation for a rival', () => {
  const layer = {name: 'Tirol', versions: [{from: 1600, ids: ['TestRegion']}]};
  const fixture = {from: 1600, through: 1604, territories: [layer], overrides: []};
  const person = (id, from, through, titulo = 'Conde') => ({id, nombre: id,
    gobiernos: [{territorio: 'Tirol', desde: from, hasta: through, titulo, condicion: 'efectivo'}]});
  const report = auditLocationMap([person('A', 1600, 1601), person('B', 1603, 1604),
    person('G', 1600, 1601, 'Gobernador')], fixture, new Set(['TestRegion']));
  assert.deepEqual(report.authorityGaps.map(g => [g.from, g.through]), [[1602, 1602]]);
  assert.deepEqual(report.overlapCandidates, []);
  assert(report.authorityChanges.some(c => c.year === 1603 && c.after.includes('B')));
  const broken = auditLocationMap([], fixture, new Set());
  assert(broken.geometry.missingGeometry.some(r => r.id === 'TestRegion'));
});

test('the audit inventories the actual Locations SVG and sourced added cells', () => {
  const ids = atlasLocationIds(fs.readFileSync(new URL('../prototypes/euv-locations/euv-locations-crop.svg', import.meta.url), 'utf8'));
  assert(ids.has('Lund') && ids.has('Jajce') && ids.has('Brussels'));
  assert(!ids.has('pattern0'));
  const report = auditLocationMap([], data, ids, {from: 1630, through: 1630});
  assert.equal(report.geometry.missingGeometry.length, 0);
  assert(report.authorityGaps.some(g => g.regionId === 'Lund'));
});
