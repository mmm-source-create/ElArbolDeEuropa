import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims} from '../src/evidence/claims.js';
import {buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';
import {auditMapContinuity,HISTORICAL_CUTS} from '../scripts/audits/lib/mapContinuityAudit.js';
import {imperialFrameIds} from '../src/cartography/imperialFrame.js';
import {colorTerritorioEnMapa, REINO_COLOR} from '../src/cartography/kingdomMaps.js';

const people=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
const inspect=(id,year)=>inspectMapRegion(id,year,buildPoliticalMapIndex(PERSONAS,year));
const names=(id,year)=>inspect(id,year).entries.map(e=>e.person?.id || e.collective?.nombre);

test('Tirol conserva autoridad registrada entre 1490 y 1705 sin solapamiento no explicado',()=>{
  const result=auditMapContinuity(PERSONAS);
  assert.deepEqual(result.yearsWithoutAuthority,[]);
  assert.deepEqual(result.unexplainedOverlaps,[]);
  assert.deepEqual(result.snapshots.map(s=>s.year),HISTORICAL_CUTS);
  assert.ok(result.snapshots.every(s=>s.coloredRegions>0));
});

test('el inspector distingue autoridad colectiva, gobernador, regente y titular de Tirol',()=>{
  assert.ok(names('Oberinntal',1598).includes('Comunidad de herederos Habsburgo'));
  assert.ok(names('Oberinntal',1605).includes('MAXIM3TIROL'));
  assert.ok(names('Oberinntal',1625).includes('FERN2EMP'));
  assert.ok(names('Oberinntal',1625).includes('LEOP5TIROL'));
  assert.ok(names('Oberinntal',1640).includes('CLAUDIA_MEDICI'));
  assert.ok(names('Oberinntal',1640).includes('FERNKARLTIROL'));
  assert.ok(names('Oberinntal',1664).includes('SIGFRANZTIROL'));
  assert.ok(names('Oberinntal',1666).includes('LEOP1HRE'));
  assert.ok(!names('Oberinntal',1666).includes('SIGFRANZTIROL'));
});

test('los nuevos gobiernos tiroleses tienen una revisión individual y una fuente localizable',()=>{
  for(const id of ['MAXIM3TIROL','LEOP5TIROL','CLAUDIA_MEDICI','FERNKARLTIROL','SIGFRANZTIROL']) {
    const claims=personClaims(people[id]).filter(c=>c.field==='Gobierno'&&c.value.territorio==='Tirol');
    assert.ok(claims.length,id);
    assert.ok(claims.every(c=>c.sources.length&&c.reviewedAt),id);
  }
});

test('los cinco cortes mantienen separados los territorios austríacos, Bohemia y el marco imperial',()=>{
  assert.ok(names('Oberinntal',1522).includes('CARLOS5'));
  assert.ok(names('Oberinntal',1522).includes('FERN1EMP'));
  assert.ok(names('Oberinntal',1564).includes('FERN2TIROL'));
  assert.ok(names('Oberinntal',1619).includes('LEOP5TIROL'));
  assert.ok(names('Oberinntal',1648).includes('FERNKARLTIROL'));
  assert.ok(names('Oberinntal',1665).includes('LEOP1HRE'));
  assert.ok(imperialFrameIds(1647).includes('Friesland'));
  assert.ok(!imperialFrameIds(1648).includes('Friesland'));
  assert.ok(inspect('Oberinntal',1648).imperialLegalFrame);
  // Personal maps join the reunited Austrian monarchy; the panorama and titles keep each land.
  for(const realm of ['Tirol','Bohemia','Hungría'])assert.equal(colorTerritorioEnMapa(people.LEOP1HRE,realm,1666),REINO_COLOR.Austria,realm);
  assert.equal(colorTerritorioEnMapa(people.FERN2TIROL,'Tirol',1580),REINO_COLOR.Tirol);
});

test('el auditor señala una región coloreada cuyo gobierno carece de fuente específica',()=>{
  const sample=[{id:'EXAMPLE',nombre:'Ejemplo',gobiernos:[{territorio:'Tirol',desde:1600,hasta:1601,titulo:'Conde',clase:'condado',condicion:'efectivo'}]}];
  const report=auditMapContinuity(sample,{cuts:[1600],range:{from:1600,to:1601}});
  assert.ok(report.snapshots[0].governmentsWithoutClaimSource.some(g=>g.personId==='EXAMPLE'&&g.regions.includes('Oberinntal')));
});
