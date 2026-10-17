import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {buildPoliticalMapIndex, inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {territorialIdentity} from '../src/data/territorialIdentity.js';
import {atlasPoliticalMosaicAt} from '../src/data/atlasMosaic.js';
import {auditFranceLowCountriesContinuity, franceLowCountriesGeographicReview} from '../scripts/audits/audit-france-low-countries-continuity.mjs';
import {applyRegionalReview} from '../scripts/cartography/apply-regional-review.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/'+name, import.meta.url)));
const data=read('corridor-locations.json'), review=read('france-low-countries-full-review.json');
const geography=read('france-low-countries-geographic-cells.json'), inventory=read('location-inventory.json');
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const owners=(id,year)=>(atlasPoliticalMosaicAt(data,year).byLocation.get(id)||[]).map(l=>l.entityId).sort();
const entries=(id,year)=>mapAuthoritiesForPerson(people.get(id),year,data);
const controls=(person,id,year)=>entries(person,year).some(e=>e.paint&&e.ids.includes(id));

test('independent French/Low Countries geography is complete in all 601 years, with local evidence',()=>{
  const report=auditFranceLowCountriesContinuity(data,inventory,review,geography);
  assert.equal(report.summary.cells,640);assert.equal(report.summary.cellYears,384640);
  for(const key of ['missingCellYears','unexplainedCellYears','missingEvidenceYears'])assert.equal(report.summary[key],0);
  assert.deepEqual(report.summary.missingGeometry,[]);
  for(const id of ['Dore_Mountains','Massif_Central','Vivarais_Mountains','Jersey','Hoorn','Ferrette'])assert(review.scope.ids.includes(id));
});

test('an omitted whole cell, a single-year gap or a missing locator rejects the review',()=>{
  const narrow=structuredClone(review);narrow.scope.ids=narrow.scope.ids.filter(id=>id!=='Hoorn');
  assert.throws(()=>franceLowCountriesGeographicReview(narrow,geography),/omits/);
  const gap=structuredClone(review);gap.assignments=gap.assignments.map(p=>({...p,ids:p.ids.filter(id=>id!=='Nancy')})).filter(p=>p.ids.length);
  assert.throws(()=>applyRegionalReview(structuredClone(data),gap,'franceLowCountriesReview','test'),/replacement gap: Nancy/);
  const citation=structuredClone(review);delete citation.sources[citation.assignments[0].sourceKeys[0]].locator;
  assert.throws(()=>applyRegionalReview(structuredClone(data),citation,'franceLowCountriesReview','test'),/Missing regional evidence/);
});

test('real apanages retain identities and dated grants, without making the duchy of Dijon Spanish',()=>{
  assert.deepEqual(owners('Bourbon',1200),['Borbón']);assert.deepEqual(owners('Rennes',1350),['Bretaña']);
  assert(controls('LUISORLEANS','Orleans',1400));assert(!controls('LUISORLEANS','Lille',1400));
  assert(controls('FELIPE2ORLEANS','Orleans',1710));
  assert(controls('JUAN1BERRY','Riom',1400));assert(!controls('JUAN1BERRY','Clermont',1400));
  assert(!controls('CARLOS5','Dijon',1530));assert(!controls('FEL2ESP','Dijon',1560));
  assert(controls('CARLOS5','Dole',1530));
});

test('the northern rebellion changes Amsterdam, Groningen and Breda at different dates',()=>{
  assert(controls('FEL2ESP','Amsterdam',1575));assert(!controls('FEL2ESP','Amsterdam',1579));
  assert(controls('FEL2ESP','Groningen',1585));assert(!controls('FEL2ESP','Groningen',1595));
  assert.deepEqual(owners('Breda',1585),['Brabante']);assert.deepEqual(owners('Breda',1595),['Brabante de los Estados']);
  assert.deepEqual(owners('Breda',1630),['Brabante']);assert.deepEqual(owners('Breda',1640),['Brabante de los Estados']);
  assert.deepEqual(owners('Amsterdam',1705),['Holanda']);assert.deepEqual(owners('Groningen',1750),['Groninga']);
  assert.deepEqual(owners('Amsterdam',1800),['República Bátava']);
});

test('general governors do not acquire republican generality lands or ecclesiastical neighbours',()=>{
  assert(controls('MARGPARMA','Amsterdam',1560));assert(controls('MARGPARMA','Roermond',1560));
  assert(!controls('MARGPARMA','Liege',1560));assert(!controls('MARGPARMA','Dinant',1560));
  assert(controls('ISABCLARAEUG','Ghent',1600));assert(!controls('ISABCLARAEUG','Breda',1600));
  assert(controls('MARIAELISABGOV','Ghent',1730));assert(!controls('MARIAELISABGOV','Hulst',1730));
  assert(!controls('MARIAELISABGOV','Breda',1730));assert(!controls('MARIAELISABGOV','Liege',1730));
  assert(controls('DONJUANAUST','Namur',1577));assert(!controls('DONJUANAUST','Dinant',1577));
});

test('stadholder commissions and regencies are provincial delegated offices',()=>{
  assert(controls('MAURICEORANGE','Amsterdam',1600));assert(!controls('MAURICEORANGE','Groningen',1600));
  assert(controls('MAURICEORANGE','Groningen',1622));
  assert(!controls('FREDERICKHENRYORANGE','Assen',1630));assert(controls('FREDERICKHENRYORANGE','Assen',1642));
  assert(controls('WILLIAM3ORANGE','Assen',1700));assert(!controls('WILLIAM3ORANGE','Groningen',1700));
  assert(!controls('WILLIAM5ORANGE','Amsterdam',1760));assert(controls('ANNEGBORANGE','Amsterdam',1755));
  assert(controls('WILLIAM5ORANGE','Amsterdam',1770));
  assert(entries('WILLIAM5ORANGE',1770).filter(e=>e.territory==='Países Bajos').every(e=>e.kind==='delegated'));
});

test('southern Austrian succession does not revive lost provinces or repaint the Republic',()=>{
  assert(controls('CARLOS6HRE','Brussels',1730));assert(!controls('CARLOS6HRE','Amsterdam',1730));
  assert(controls('MARIATERESAHAB','Brussels',1750));assert(controls('MARIATERESAHAB','Roermond',1750));
  assert(!controls('MARIATERESAHAB','Venlo',1750));assert(!controls('MARIATERESAHAB','Dijon',1750));
  assert(!controls('FRAN1HRE','Brussels',1750));assert(!controls('FRAN2HRE','Brussels',1795));
  assert.deepEqual(owners('Luxembourg',1790),['Luxemburgo']);
  assert(owners('Brussels',1790).includes('Estados Belgas Unidos'));
});

test('Alsace, Lorraine and ecclesiastical temporals keep local acquisition dates',()=>{
  assert.deepEqual(owners('Strasbourg',1670),['Ciudad libre de Estrasburgo']);assert.deepEqual(owners('Strasbourg',1681),['Francia']);
  assert.deepEqual(owners('Mulhouse',1797),['República de Mulhouse']);assert.deepEqual(owners('Mulhouse',1798),['Francia']);
  assert(!controls('LEOPOLDLORENA','Nancy',1695));assert(controls('LEOPOLDLORENA','Nancy',1700));
  assert.deepEqual(owners('Nancy',1750),['Lorena']);assert.deepEqual(owners('Nancy',1770),['Lorena']);
  assert.deepEqual(owners('Hertogenbosch',1650),['Brabante de los Estados']);
  assert.deepEqual(owners('Maastricht',1750),['Brabante de los Estados','Principado de Lieja']);
  assert.deepEqual(owners('Maastricht',1675),['Maastricht']);
});

test('the institutional inspector gives its own local sources instead of inventing a prince',()=>{
  const index=buildPoliticalMapIndex(PERSONAS,1705,data);
  const amsterdam=inspectMapRegion('Amsterdam',1705,index,data);
  assert(amsterdam.entries.some(e=>e.collective||e.regionalEvidence));
  assert(!amsterdam.entries.some(e=>e.person?.id==='FEL2ESP'));
  assert(amsterdam.entries.some(e=>e.mapSources?.some(s=>s.url&&s.locator)||e.collective?.fuente?.locator));
  for(const phase of review.assignments)assert(TERRITORIOS[territorialIdentity(phase.name)],phase.name);
  for(const scope of review.authorityScopes)assert(people.has(scope.personId),scope.personId);
  const claims=personClaims(people.get('MARIAELISABGOV')).filter(c=>c.field==='Gobierno');
  assert.equal(claims.length,2);assert(claims.every(c=>c.certainty==='documented'&&c.sources.length));
});
