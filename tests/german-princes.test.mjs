import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';
import {personClaims} from '../src/evidence/claims.js';
import {GERMAN_PRINCES_REVIEWS} from '../src/evidence/germanPrincesReviews.js';
import {gobiernosDe} from '../src/domain/genealogy/personAccessors.js';
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
data.burgundy=JSON.parse(fs.readFileSync(new URL('../data/cartography/burgundian-locations.json',import.meta.url)));
const indexes=new Map();
const inspect=(id,year)=>{
 if(!indexes.has(year))indexes.set(year,buildPoliticalMapIndex(PERSONAS,year,data,{includeClaims:true,includeDependencies:true}));
 return inspectMapRegion(id,year,indexes.get(year),data).entries;
};
const holders=(id,year,kind='sovereign')=>inspect(id,year).filter(e=>e.kind===kind).map(e=>e.person?.id);

test('the completion cells of 1789 name their elector, duke, landgrave or margrave',()=>{
 for(const [id,person] of [['Munich','CARLOSTEODOROPAL'],['Heidelberg','CARLOSTEODOROPAL'],['Dusseldorf','CARLOSTEODOROPAL'],
  ['Calw','KARLEUGENWURTT'],['Marburg','WILHELM9HESSEKASS'],['Giessen','LUDWIG9HESSEDARM'],['Rostock','FREDFRANZ1MECK'],
  ['Hachberg','KARLFRIEDRICHBADEN'],['Rendsburg','CHRISTIAN7DEN']]){
  assert.deepEqual(holders(id,1789),[person],id);
  assert(!inspect(id,1789).some(e=>e.kind==='regional'),id);
 }
 assert.deepEqual(holders('Munich',1760),['MAX3JOSEBAV']);
 assert.deepEqual(holders('Munich',1800),['MAX4JOSEBAV']);
 assert.deepEqual(holders('Kassel',1740),['FEDERICO1SUE']);
 assert.deepEqual(holders('Kassel',1740,'delegated'),['WILHELM8HESSEKASS']);
});

test('a regency or a reign within one year does not leave the jurisdiction pending',()=>{
 // Mecklenburg under the imperial administrator while Charles Leopold keeps only the title.
 assert.deepEqual(holders('Rostock',1735),[]);
 assert.deepEqual(holders('Rostock',1735,'delegated'),['CHRISTIANLUDWIG2MECK']);
 assert.deepEqual(holders('Rostock',1750),['CHRISTIANLUDWIG2MECK']);
 // Louis VI, Louis VII and Ernest Louis of Hesse-Darmstadt all ruled in 1678.
 assert.deepEqual(holders('Giessen',1678).sort(),['ERNSTLUDWIGHESSEDARM','LUDWIG6HESSEDARM','LUDWIG7HESSEDARM']);
 assert(!inspect('Giessen',1678).some(e=>e.kind==='regional'));
});

test('Holstein-Gottorp keeps its Kiel core and the whole duchy passes to Denmark in 1773',()=>{
 assert.deepEqual(holders('Kiel',1750),['PETER3RUS']);
 assert.deepEqual(holders('Kiel',1770),['PAUL1RUS']);
 assert(!holders('Pinneberg',1770).includes('PAUL1RUS'),'the royal share is not Gottorp’s');
 for(const id of ['Kiel','Pinneberg','Plon','Rendsburg'])assert.deepEqual(holders(id,1780),['CHRISTIAN7DEN'],id);
});

test('Philip V is sovereign of the Spanish Netherlands until 1711, with the allied conquest as contested control',()=>{
 for(const id of ['Brussels','Namur','Luxembourg'])
  assert(inspect(id,1705).some(e=>e.person?.id==='FEL5ESP'),id);
 assert(inspect('Brussels',1710).some(e=>e.person?.id==='FEL5ESP'&&e.kind==='disputed'));
 assert(!inspect('Brussels',1712).some(e=>e.person?.id==='FEL5ESP'));
 const provinces=gobiernosDe(by.get('FEL5ESP')).filter(g=>g.desde===1700&&g.hasta===1711).map(g=>g.territorio).sort();
 assert.deepEqual(provinces,['Brabante','Flandes','Güeldres','Henao','Limburgo','Luxemburgo','Namur','Señorío de Malinas']);
});

test('every added mandate, date and parent has a documented source',()=>{
 const people=new Set(Object.keys(GERMAN_PRINCES_REVIEWS).map(key=>key.split(':')[1]));
 for(const id of people)for(const claim of personClaims(by.get(id))){
  if(!GERMAN_PRINCES_REVIEWS[claim.id])continue;
  assert.equal(claim.certainty,'documented',claim.id);
  assert(claim.sources.every(source=>source.url.startsWith('https://')&&source.locator),claim.id);
 }
 for(const id of ['MAX3JOSEBAV','KARLEUGENWURTT','WILHELM8HESSEKASS','LUDWIG7HESSEDARM','CHRISTIANLUDWIG2MECK','KARLFRIEDRICHBADEN'])
  for(const claim of personClaims(by.get(id)))assert.equal(claim.certainty,'documented',claim.id);
 assert.equal(by.get('SOPHIADOROTHEAWURTT').padre,'FREDEUGENWURTT');
});
