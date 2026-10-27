import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims} from '../src/evidence/claims.js';
import {biografiaExtensaPersona} from '../src/content/biografias-extensas.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {englishPaths,TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {auditarTerritorios} from '../scripts/audits/lib/auditTerritorios.js';
import {originalPreservationMap,preservationHash} from '../scripts/audits/audit-germany-completion.mjs';
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
const charles=people.get('CARLOS3NAP');
const entries=(year,includeClaims=false)=>mapAuthoritiesForPerson(charles,year,data,{includeClaims,includeDependencies:true});
const painted=year=>new Set(entries(year).filter(e=>e.paint).flatMap(e=>e.ids));

test('Durazzo distinguishes delegated Croatian government, Naples, occupation and nominal eastern titles',()=>{
  assert.equal(entries(1372).find(e=>e.territory==='Croacia').kind,'delegated');
  assert.equal(charles.gobiernos.find(g=>g.desde===1369).soberano,'LUIS1');
  assert(!painted(1372).has('Buda'));
  assert(painted(1380).has('Arezzo'));
  assert(!painted(1380).has('Naples'));
  assert(painted(1381).has('Naples'));
  assert(!painted(1381).has('Corfu'));
  for(const year of [1382,1385])for(const id of ['Naples','Corfu','Butrint'])assert(painted(year).has(id),`${year}/${id}`);
  for(const id of ['Buda','Zagreb','Zadar'])assert(painted(1385).has(id));
  for(const id of ['Andravida','Mystras','Dubrovnik','Krakow','Jerusalem'])assert(!painted(1385).has(id),id);
  assert(entries(1385,true).some(e=>e.territory==='Acaya'&&!e.paint&&e.kind==='titular'));
  for(const territory of ['Acaya','Jerusalén'])assert.equal(charles.gobiernos.find(g=>g.territorio===territory).condicion,'titular');
  assert(!painted(1386).has('Butrint'));
  for(const claim of personClaims(charles).filter(c=>c.field==='Gobierno'))assert(claim.sources.length,claim.id);
});

test('complete English editions preserve canonical governments, biography sections and claim certainty',()=>{
  assert.equal(Object.keys(COMPLETE_ENGLISH_PROFILES).length,667);
  for(const id of Object.keys(COMPLETE_ENGLISH_PROFILES)){
    const person=people.get(id);
    const source={...person,biografiaExtensa:biografiaExtensaPersona(person)||[],padres:[],conyuges:[],hijos:[],relacionadosDinastia:[],contemporaneos:[],historias:[]};
    const original=structuredClone(source),translated=completeEnglishProfile(source);
    assert.deepEqual(source,original,'translation must not mutate the Spanish record');
    assert(translated.translationComplete);
    assert.deepEqual(translated.gobiernos,source.gobiernos);
    assert.equal(translated.biografiaExtensa.length,source.biografiaExtensa.length,id);
    translated.biografiaExtensa.forEach((section,i)=>{assert.notEqual(section.texto,source.biografiaExtensa[i].texto);assert.deepEqual(section.fuentes,source.biografiaExtensa[i].fuentes);});
    const claims=personClaims(source);
    assert.deepEqual(translated.localizedClaims.map(c=>[c.id,c.certainty,c.value,c.interval,c.exactDate,c.sources.map(s=>s.url)]),claims.map(c=>[c.id,c.certainty,c.value,c.interval,c.exactDate,c.sources.map(s=>s.url)]));
    for(const claim of translated.localizedClaims)if(claim.note)assert(!/La ficha de autoridad|Coronación|Gobernó|Título nominal/.test(claim.note),claim.note);
    const route=TRANSLATED_PEOPLE.find(p=>p.id===id),path=`/en/person/${route.en}`;
    assert(englishPaths().includes(path));assert.equal(translatedEquivalent(path,'es'),`/es/persona/${route.es}`);
  }
  const richard=completeEnglishProfile({...people.get('RICARDO1ING'),padres:[],conyuges:[],hijos:[],relacionadosDinastia:[],contemporaneos:[],historias:[],biografiaExtensa:biografiaExtensaPersona('RICARDO1ING')});
  assert.equal(richard.biografiaExtensa.length,4);
  assert.match(richard.biografiaExtensa[2].texto,/150,000 marks/);
  assert.equal(richard.portrait.autor,'Matthew Paris');
});

test('untranslated editorial changes fail generation instead of silently leaking Spanish',()=>{
  const source={...charles,documentacion:{notas:[{campo:'Gobiernos',texto:'Una nota nueva sin traducción.'}]},padres:[],conyuges:[],hijos:[],relacionadosDinastia:[],contemporaneos:[],historias:[]};
  assert.throws(()=>completeEnglishProfile(source),/Missing complete-profile translation/);
});

test('a delegated duke does not change Croatia into a sovereign duchy',()=>{
  assert(!auditarTerritorios([charles]).some(issue=>issue.severity==='ERROR'));
  const changed=structuredClone(charles);
  const mandate=changed.gobiernos.find(g=>g.desde===1369);
  mandate.condicion='efectivo';delete mandate.soberano;
  assert(auditarTerritorios([changed]).some(issue=>issue.code==='TERRITORY_CLASS_MISMATCH'));
});

test('the German preservation check permits only the reviewed Butrint change and keeps its original baseline',()=>{
  const current=new Map([['Butrint',[{entityId:'Nápoles'}]],['Other',[{entityId:'Other'}]]]);
  const before=originalPreservationMap(current,1384);
  assert.equal(current.get('Butrint')[0].entityId,'Nápoles');
  assert.equal(before.get('Butrint')[0].entityId,'Epiro');
  assert.deepEqual(originalPreservationMap(current,1381),current);
  assert.throws(()=>originalPreservationMap(new Map([['Butrint',[{entityId:'Venecia'}]]]),1384),/Unexpected preservation correction/);
  const unexpected=new Map(current);unexpected.set('Other',[{entityId:'Changed'}]);
  assert.notEqual(preservationHash(originalPreservationMap(unexpected,1384)),preservationHash(before));
});

test('requested heraldry keeps credited source drawings and correct Nasrid dates',()=>{
  assert.match(escudoDe('Anjou-Hungría').imagen.fuente,/Arms_of_Charles_Robert_of_Hungary/);
  const nasrid=escudoDe('Nazarí');assert.match(nasrid.imagen.fuente,/Arms_of_the_Emirate_of_Granada/);
  assert.match(nasrid.blason,/plata/);assert.match(nasrid.nota,/1232–1492/);
});
