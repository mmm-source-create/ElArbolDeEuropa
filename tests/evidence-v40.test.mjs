import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {EVENTOS_HISTORICOS,HISTORIAS} from '../src/historiaData.jsx';
import {buildEntityIndex,entityId} from '../src/evidence/entities.js';
import {CERTAINTY,CLAIM_REVIEWS,EDITORIAL_HISTORY,citationText,coverageReport,personClaims} from '../src/evidence/claims.js';

test('cada dato personal registrado conserva una afirmación estable sin fuente atribuida por proximidad',()=>{
  const carlos=PERSONAS.find(person=>person.id==='CARLOS5');
  const claims=personClaims(carlos);
  assert.ok(claims.some(claim=>claim.field==='Nacimiento'));
  assert.ok(claims.some(claim=>claim.field==='Gobierno'&&claim.value.territorio==='Castilla'));
  assert.ok(claims.some(claim=>claim.field==='Sucesión'));
  assert.equal(new Set(claims.map(claim=>claim.id)).size,claims.length);
  assert.ok(claims.every(claim=>claim.sources.length===0&&claim.certainty in CERTAINTY));
  assert.match(citationText(claims[0],carlos.nombre),/Sin fuente específica/);
  assert.match(citationText(claims[0],carlos.nombre,'en'),/No claim-specific source/);
});

test('una fuente precisa solo respalda las afirmaciones revisadas y conserva el historial',()=>{
  const gerald=PERSONAS.find(person=>person.id==='GERALD8KILDARE');
  const claims=personClaims(gerald);
  assert.equal(claims.find(claim=>claim.field==='Nacimiento').certainty,'approximate');
  assert.equal(claims.find(claim=>claim.field==='Fallecimiento').certainty,'documented');
  assert.equal(claims.find(claim=>claim.field==='Padre').sources[0].url,CLAIM_REVIEWS['person:GERALD8KILDARE:father'].sources[0].url);
  assert.ok(EDITORIAL_HISTORY.some(entry=>entry.scope===gerald.id&&entry.reason));
});

test('entidades homónimas conservan identidad formal y la cobertura cuenta pendientes reales',()=>{
  const index=buildEntityIndex(PERSONAS,TERRITORIOS,EVENTOS_HISTORICOS);
  assert.ok(index.has(entityId('territory','Castilla')));
  assert.ok(index.has(entityId('politicalEntity','Castilla')));
  assert.ok(index.has(entityId('crown','Corona de Castilla')));
  assert.notEqual(index.get(entityId('territory','Castilla')).id,index.get(entityId('politicalEntity','Castilla')).id);
  const report=coverageReport(PERSONAS,TERRITORIOS,HISTORIAS);
  assert.equal(report.total,Object.values(report.totals).reduce((sum,count)=>sum+count,0));
  assert.ok(report.governmentsWithoutSource>0);
  assert.ok(report.storiesToReview>0);
});
