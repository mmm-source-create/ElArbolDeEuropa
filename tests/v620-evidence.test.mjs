import test from 'node:test';import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims,coverageReport,CLAIM_REVIEWS} from '../src/evidence/claims.js';
import {authorityParentReview} from '../src/evidence/authorityReviews.js';
import {REVIEWS_620,SOURCES_620} from '../src/evidence/reviews620.js';
import values from '../src/evidence/reviewValues620.json' with {type:'json'};
import {applyEnglishPersonPresentation} from '../src/features/english/v6/atlasPresentation.js';
const people=new Map(PERSONAS.map(p=>[p.id,p]));

test('147 previously pending claims are individually sourced, tied to their values and bilingual',()=>{
 assert.equal(Object.keys(REVIEWS_620).length,147);assert.equal(Object.keys(values).length,147);
 const previous={...CLAIM_REVIEWS};for(const id of Object.keys(REVIEWS_620))delete previous[id];
 const seen=new Set();for(const [id,review]of Object.entries(REVIEWS_620)){
  const p=people.get(id.split(':')[1]),suffix=id.split(':')[2];
  const before=personClaims(p,previous).find(c=>c.id===id),after=personClaims(p).find(c=>c.id===id);
  assert.equal(before?.certainty,'pending',id);
  if(['father','mother'].includes(suffix))assert.notEqual(authorityParentReview(p,suffix)?.certainty,'documented',id);
  assert.equal(after?.certainty,'documented',id);assert.deepEqual(after.value,values[id],id);
  assert.equal(review.reviewedAt,'2026-11-22');assert(review.note&&review.noteEn,id);
  assert(review.sources.every(s=>s.locator&&s.locatorEn&&s.url.startsWith('https://')),id);
  seen.add(p.id);
 }
 assert.equal(seen.size,97);assert.equal(SOURCES_620.length,31);
 assert.deepEqual(coverageReport(PERSONAS).totals,{documented:6994,approximate:458,disputed:59,inferred:175,pending:5448});
});

test('documentation remains confined to the named crowns and leaves unresolved dates pending',()=>{
 for(const [person,territory]of [['CARLOS1','Croacia'],['ENRIQ14BAV','Baviera'],['ESTEBAN1BAV','Baviera'],['LUIS3BAV','Baviera'],['MARGARITA1NORD','Suecia'],['BIRGERJARL','Suecia']])assert(personClaims(people.get(person)).some(c=>c.field==='Gobierno'&&c.value.territorio===territory&&c.certainty==='pending'),person);
 const original=personClaims(people.get('JUANAGREY')).find(c=>c.field==='Gobierno');assert.equal(original.certainty,'disputed');
 assert(!Object.keys(REVIEWS_620).some(id=>id.includes(':accession:')||id.includes(':succession:')));
});

test('English evidence uses the reviewed English note and locator, including marriage and reign records',()=>{
 for(const id of ['OTON3','JUDITASWIBAV','ALEXANDER3SCOT','PAPA_GREGORIO12']){
  const [translated]=applyEnglishPersonPresentation([{...people.get(id)}]);
  const claims=translated.localizeClaims().filter(c=>Object.hasOwn(REVIEWS_620,c.id));assert(claims.length,id);
  for(const claim of claims){const r=REVIEWS_620[claim.id];assert.equal(claim.note,r.noteEn);assert.equal(claim.sources[0].locator,r.sources[0].locatorEn);}
 }
});
