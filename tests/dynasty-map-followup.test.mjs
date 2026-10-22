import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/data/personas.js';
import {buildDynastyPages} from '../src/domain/genealogy/dynastyModel.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {buildPoliticalMapIndex,mergeMapAuthorityEntries,mapAuthoritySources} from '../src/cartography/politicalMapIndex.js';
import {REINO_COLOR,colorTerritorioEnMapa} from '../src/cartography/kingdomMaps.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {personClaims} from '../src/evidence/claims.js';
import {DYNASTY_MAP_REVIEWS} from '../src/evidence/dynastyMapReviews.js';
import DynastyCard from '../src/features/public/DynastyCard.jsx';
import {ArmsCredit} from '../src/components/DynastyArms.jsx';

const by=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json'));
data.burgundy=JSON.parse(fs.readFileSync('data/cartography/burgundian-locations.json'));
const mosaics=new Map();
const colors=(year,id)=>{
  if(!mosaics.has(year))mosaics.set(year,europeMosaicAt(data,year,PERSONAS));
  return [...new Set((mosaics.get(year).byLocation.get(id)||[]).map(l=>l.mosaicColor))];
};
test('Danish exterior unity respects Schleswig 1721 and Holstein 1773 without changing personal colours',()=>{
  assert.notDeepEqual(colors(1720,'Slesvig'),colors(1720,'Ribe'));
  for(const year of[1721,1730,1746,1766,1789])assert.deepEqual(colors(year,'Slesvig'),[REINO_COLOR.Dinamarca]);
  assert.notDeepEqual(colors(1772,'Kiel'),colors(1772,'Ribe'));
  for(const id of['Kiel','Rendsburg','Pinneberg'])assert.deepEqual(colors(1773,id),[REINO_COLOR.Dinamarca]);
  for(const t of['Schleswig','Holstein'])assert.notEqual(colorTerritorioEnMapa(by.get('CHRISTIAN7DEN'),t,1789),REINO_COLOR.Dinamarca);
});
test('Britain has its own swatch and Hanover is not absorbed by a shared king',()=>{
  assert.notEqual(REINO_COLOR['Gran Bretaña'],REINO_COLOR.Inglaterra);
  for(const year of[1714,1720,1757,1789]){
    assert.deepEqual(colors(year,'London'),[REINO_COLOR['Gran Bretaña']]);
    assert.notDeepEqual(colors(year,'London'),colors(year,'Hanover'));
  }
  assert.notEqual(REINO_COLOR.Saboya,REINO_COLOR.Francia);
});
test('house pages link parents and direct branches with catalogue cards, excluding regional folders',()=>{
  const pages=new Map(buildDynastyPages(PERSONAS).map(p=>[p.nombre,p]));
  const names=refs=>refs.map(r=>r.nombre);
  assert(names(pages.get('Capeto').casasDerivadas).includes('Anjou'));
  assert(names(pages.get('Capeto').casasDerivadas).includes('Borbón'));
  assert(names(pages.get('Capeto').casasDerivadas).includes('Valois'));
  assert.deepEqual(names(pages.get('Borbón-Orleans').casasOrigen),['Borbón']);
  assert(names(pages.get('Valois').casasDerivadas).includes('Valois-Orleans'));
  assert(names(pages.get('Valois-Orleans').casasDerivadas).includes('Valois-Angulema'));
  assert.deepEqual(names(pages.get('Saboya-Carignano').casasOrigen),['Saboya']);
  assert(!names(pages.get('Avesnes').casasOrigen).some(n=>n.startsWith('Casas ')));
  const html=renderToStaticMarkup(React.createElement(DynastyCard,{item:pages.get('Borbón').casasDerivadas.find(r=>r.nombre==='Borbón-Orleans'),headingLevel:3}));
  assert.match(html,/<h3>Borbón-Orleans<\/h3>/);assert.match(html,/public-entity-members/);assert.match(html,/\/es\/dinastia\/borbon-orleans/);
});
test('Ascania keeps a documented family umbrella and gains five family members and its Orange connection',()=>{
  for(const id of['MAGNUS1SAJLAU','JOHANNGEORG2ANHALT','LEOPOLD1ANHALT','JOHANNLUDWIG1ANHALT','FRIEDRICHAUGUSTANHALT'])assert.equal(by.get(id).dinastia,'Ascania');
  assert.equal(by.get('CATALINASAJLAU').padre,by.get('DOROTHEALAUDEN').padre);
  assert.equal(by.get('HENRIETTEAMALIAANHALT').padre,by.get('LEOPOLD1ANHALT').padre);
  assert.equal(by.get('FRIEDRICHAUGUSTANHALT').padre,by.get('CATHERINE2RUS').padre);
  for(const [key,review] of Object.entries(DYNASTY_MAP_REVIEWS)){
    assert(personClaims(by.get(key.split(':')[1])).some(c=>c.id===key&&c.certainty==='documented'&&c.sources.length));
    assert(review.sources.every(s=>s.locator));
  }
  const idx=buildPoliticalMapIndex(PERSONAS,1750,data,{includeDependencies:true});
  assert(idx.get('Zerbst').some(e=>e.person?.id==='FRIEDRICHAUGUSTANHALT'));
  assert(idx.get('Zerbst').some(e=>e.person?.id==='JOHANNAELISAHOLST'&&e.kind==='delegated'));
  assert(!idx.get('Bernburg').some(e=>e.person?.id==='FRIEDRICHAUGUSTANHALT'));
});
test('the supplied Avesnes work is credited honestly and the Pallars derivative removes its outer crown',()=>{
  const credit=escudoDe('Avesnes').imagen;
  assert.equal(credit.autor,'Manuel Muriel Cagigal');assert.equal(credit.procedencia,'Aportación del autor');assert(!credit.licencia.startsWith('CC'));
  const html=renderToStaticMarkup(React.createElement(ArmsCredit,{dinastia:'Avesnes'}));
  assert.match(html,/Aportación del autor/);assert.doesNotMatch(html,/Wikimedia Commons/);
  assert(escudoDe('Pallars').imagen.modificaciones.includes('corona'));
  assert(!fs.readFileSync('public/escudos/pallars-sin-corona.svg','utf8').includes('id="layer1-7"'));
});
test('restorations within one annual frame show one holder and retain both mandates and citations',()=>{
  for(const [year,cell,person,territory] of[[1390,'Constantinople','JOHN5PALA','Bizancio'],[1724,'Madrid','FEL5ESP','Castilla'],[1746,'Zerbst','CHRISTIANANHALTZERBST','Anhalt-Zerbst']]){
    const entries=buildPoliticalMapIndex(PERSONAS,year,data).get(cell).filter(e=>e.person?.id===person&&e.territory===territory&&e.kind==='sovereign');
    assert.equal(entries.length,1,`${year} ${cell}`);assert.equal(entries[0].governments.length,2);
    assert.equal(entries[0].claims.length,2);
  }
  const original={person:{id:'p'},territory:'Bohemia',kind:'sovereign',government:{titulo:'Rey',desde:1400,hasta:1405},claim:{id:'first',sources:[{url:'https://example.org/a',locator:'first reign'}]}};
  const restored={...original,government:{titulo:'Rey',desde:1405,hasta:1410},claim:{id:'second',sources:[{url:'https://example.org/a',locator:'restored reign'}]}};
  const merged=mergeMapAuthorityEntries([original,restored]);
  assert.equal(merged.length,1);assert.equal(mapAuthoritySources(merged[0]).length,2);
  assert(!original.governments,'cached source rows are never mutated');
  assert.equal(mergeMapAuthorityEntries([original,{...restored,kind:'delegated'},{...restored,person:{id:'rival'}},{...restored,territory:'Moravia'}]).length,4);
});
