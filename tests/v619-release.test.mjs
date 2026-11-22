import test from 'node:test';
import assert from 'node:assert/strict';
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims, CLAIM_REVIEWS, citationText} from '../src/evidence/claims.js';
import {SUCCESSION_DATES_619, RELATIONSHIP_REVIEWS_619, datedGovernmentClaimId} from '../src/evidence/successionDates619.js';
import {governmentDateRange, validGovernmentDate} from '../src/domain/time/governmentDates.js';
import {reinadosActivos} from '../src/domain/government/reigns.js';
import {validateContracts} from '../scripts/schema/data-contract.mjs';
import {readContractData, readJson} from '../scripts/schema/read-contract-data.mjs';
import {useAtlasLayout} from '../src/features/atlas/useAtlasLayout.js';
import {PANELES_STORAGE_KEY} from '../src/features/atlas/atlasModel.js';
import SiteHeader from '../src/components/SiteHeader.jsx';
import EvidencePanel from '../src/components/EvidencePanel.jsx';
import {applyEnglishPersonPresentation} from '../src/features/english/v6/atlasPresentation.js';

test('precise dates retain their historical calendar, including Julian leap days', () => {
  assert(validGovernmentDate('1500-02-29','juliano'));
  assert(!validGovernmentDate('1500-02-29','gregoriano'));
  for (const bad of ['1556-02-30','1556-13-01','1556-00-12','1556-1-16','0000-01-01']) assert(!validGovernmentDate(bad,'juliano'));
  assert(!validGovernmentDate('1556-01-16',undefined));
  assert.equal(governmentDateRange({desde:1500,hasta:1501,desdeFecha:'1500-02-29',calendarioFechas:'juliano'}),'29 de febrero de 1500 – 1501');
  assert.equal(governmentDateRange({desde:1500,hasta:1501,desdeFecha:'1500-02-29',calendarioFechas:'juliano'},'en'),'29 February 1500 – 1501');
});

test('the new family sources identify the declared relationship individually in both languages',()=>{
  for(const [id,record] of Object.entries(RELATIONSHIP_REVIEWS_619)) {
    const person=PERSONAS.find(p=>p.id===id.split(':')[1]),claim=personClaims(person).find(c=>c.id===id);
    assert(claim,id);assert.equal(claim.certainty,'documented');assert.equal(claim.noteEn,record.noteEn);
    assert(claim.sources.every(s=>s.locator&&s.locatorEn));
  }
});

test('14 dated mandates have located bilingual evidence; uncertain and rival accessions keep their qualifications', () => {
  assert.equal(SUCCESSION_DATES_619.length,14);
  for (const record of SUCCESSION_DATES_619) {
    const person=PERSONAS.find(p=>p.id===record.person), id=datedGovernmentClaimId(record);
    const claim=personClaims(person).find(c=>c.id===id);
    assert(claim,id);assert.equal(claim.noteEn,record.noteEn);
    for (const [field,date] of Object.entries(record.dates)) {
      assert.equal(claim.value[field],date);
      assert(CLAIM_REVIEWS[id].dateSources[field].every(s=>s.url&&s.locator&&s.locatorEn));
    }
    // All-year browsing still includes brief reigns and the shared succession year.
    assert(reinadosActivos(person,record.desde).includes(claim.value));
    assert(reinadosActivos(person,record.hasta).includes(claim.value));
    assert(!reinadosActivos(person,record.hasta+1).includes(claim.value));
  }
  const henry=personClaims(PERSONAS.find(p=>p.id==='ENRIQ8ING')).find(c=>c.field==='Gobierno'&&c.value.territorio==='Inglaterra');
  assert(!henry.value.desdeFecha);assert.deepEqual(henry.alternatives,['1509-04-21','1509-04-22']);
  const jane=personClaims(PERSONAS.find(p=>p.id==='JUANAGREY')).find(c=>c.field==='Gobierno');
  assert.equal(jane.certainty,'disputed');assert.equal(jane.value.condicion,'disputado');
});

test('date validation rejects impossible dates, annual mismatches and unsourced exact boundaries', async () => {
  const data=await readContractData();data.legacy=await readJson('tests/baselines/v5-legacy-formats.json');
  const run=(government,claimReviews=CLAIM_REVIEWS)=>{
    const people=structuredClone(data.people),p=people.find(p=>p.id==='LUIS14FRA');
    Object.assign(p.gobiernos.find(g=>g.territorio==='Francia'),government);
    return validateContracts({...data,people,claimReviews}).map(i=>i.code);
  };
  assert(run({desdeFecha:'1643-02-30'}).includes('GOVERNMENT_DATE'));
  assert(run({desdeFecha:'1644-05-14'}).includes('GOVERNMENT_DATE_YEAR'));
  const reviews={...CLAIM_REVIEWS};delete reviews['person:LUIS14FRA:government:Francia:1643:1715:Rey'];
  assert(run({},reviews).includes('GOVERNMENT_DATE_EVIDENCE'));
});

test('dates, calendar and new evidence read correctly in both languages and copied citations', () => {
  const es=PERSONAS.find(p=>p.id==='JUANAGREY'), [en]=applyEnglishPersonPresentation([{...es}]);
  for (const [person,locale,day,calendar] of [[es,'es','10 de julio de 1553','Calendario juliano'],[en,'en','10 July 1553','Julian calendar']]) {
    const html=renderToStaticMarkup(React.createElement(EvidencePanel,{person,locale}));
    assert(html.includes(day));assert(html.includes(calendar));
    const claim=(person.localizeClaims?.()||personClaims(person)).find(c=>c.field==='Gobierno');
    assert(citationText(claim,person.nombre,locale).includes(day));
    if(locale==='en') {assert(html.includes('Council recognition'));assert(!html.includes('Reconocimiento del Consejo'));assert(html.includes('The Council recognised Jane'));}
  }
});

test('mobile panel choices survive resizing and remounting without overwriting desktop choices', async () => {
  const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test'});
  const previous={window:global.window,document:global.document,IS_REACT_ACT_ENVIRONMENT:global.IS_REACT_ACT_ENVIRONMENT};
  global.window=dom.window;global.document=dom.window.document;global.IS_REACT_ACT_ENVIRONMENT=true;
  let mobile=true, root;const listeners=new Set();
  window.matchMedia=()=>({get matches(){return mobile;},addEventListener:(_,f)=>listeners.add(f),removeEventListener:(_,f)=>listeners.delete(f)});
  function Harness(){const state=useAtlasLayout({panelesVisibles:{filtros:true,biografia:true,cronologia:true}},null);return React.createElement('button',{onClick:()=>state.alternarPanelAuxiliar('filtros')},JSON.stringify(state.panelesVisibles));}
  const panels=()=>JSON.parse(document.querySelector('button').textContent);
  const resize=async value=>{mobile=value;await act(()=>listeners.forEach(f=>f()));};
  try {
    window.localStorage.setItem(PANELES_STORAGE_KEY,JSON.stringify({filtros:true,biografia:true,cronologia:true}));
    root=createRoot(document.getElementById('root'));await act(()=>root.render(React.createElement(Harness)));
    assert.equal(panels().filtros,false);assert.equal(panels().cronologia,false);
    await act(()=>document.querySelector('button').click());assert.equal(panels().filtros,true);
    await resize(false);assert.equal(panels().cronologia,true);
    await act(()=>document.querySelector('button').click());assert.equal(panels().filtros,false);
    await resize(true);assert.equal(panels().filtros,true);
    await act(()=>root.unmount());root=createRoot(document.getElementById('root'));await act(()=>root.render(React.createElement(Harness)));
    assert.equal(panels().filtros,true);
    await resize(false);assert.equal(panels().filtros,false);
  } finally {if(root)await act(()=>root.unmount());dom.window.close();Object.assign(global,previous);}
});

test('reading pages do not show a larger-screen warning; Atlas advice is collapsed',()=>{
  for(const locale of ['es','en']) {
    const publicHtml=renderToStaticMarkup(React.createElement(SiteHeader,{variant:'public',locale,prerendered:true}));
    assert(!publicHtml.includes('site-screen-notice'));
    const doc=new JSDOM(renderToStaticMarkup(React.createElement(SiteHeader,{variant:'atlas',locale,prerendered:true}))).window.document;
    assert(doc.querySelector('.site-screen-notice details'));assert(!doc.querySelector('.site-screen-notice details').open);
  }
});
