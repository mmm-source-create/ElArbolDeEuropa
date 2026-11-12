import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {PORTRAITS_602} from '../src/data/imagenesPersonas602.js';
import {PORTRAITS_602_EN} from '../src/features/english/portraits602.js';
import {V602_PROFILES} from '../src/features/english/v602Profiles.js';
import {V602_BIOGRAPHIES} from '../src/content/v602Biographies.js';
import {V602_REFERENCES} from '../src/content/v602References.js';
import {ARMS_602,ARMS_IMAGES_602} from '../src/content/dinastias/escudos602.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {slugBasePersona} from '../src/domain/people/personLabels.js';

test('Every added or expanded person has a complete bilingual record, sources and a working language switch',()=>{
 assert.equal(Object.keys(V602_PROFILES).length,9);
 assert.equal(PERSONAS.filter(p=>p.nombre==='Luis IV de Turingia').length,1);
 assert.equal(PERSONAS.find(p=>p.id==='ISABELHUNSANTA').conyuges[0],'LUDWIG4THUR');
 for(const [id,translation] of Object.entries(V602_PROFILES)){
  const person=PERSONAS.find(p=>p.id===id);assert(person,id);
  assert.equal(translation.sections.length,V602_BIOGRAPHIES[id].length,id);
  assert(V602_REFERENCES[id].every(s=>s.url.startsWith('https://')),id);
  const route=TRANSLATED_PEOPLE.find(p=>p.id===id);assert(route,id);
  assert.equal(translatedEquivalent(`/es/persona/${route.es}`,'en'),`/en/person/${route.en}`,id);
  const source=JSON.parse(fs.readFileSync(`public/personas-meta/${route.es}.json`));
  assert.equal(completeEnglishProfile(source).translationComplete,true,id);
 }
});
test('New namesakes keep the established Spanish records and distinguish their own URLs',()=>{
 assert.equal(slugBasePersona(PERSONAS.find(p=>p.id==='ISABELH'),'es'),'isabel-de-hungria');
 assert.equal(slugBasePersona(PERSONAS.find(p=>p.id==='ISABELHUNSANTA'),'es'),'isabel-de-hungria-santa');
 assert.equal(slugBasePersona(PERSONAS.find(p=>p.id==='LEONORGONZAGAURBINO'),'es'),'leonor-gonzaga-duquesa-de-urbino');
});
test('The younger Livio retains Voet and the withdrawn Morandi alternative is absent',()=>{
 assert(!PORTRAITS_602.LIVIOODESCALCHI_SR);
 assert.match(PORTRAITS_602.LIVIOODESCALCHI.autor,/Voet/);
 assert.equal(PORTRAITS_602.LIVIOODESCALCHI.alternativas,undefined);
 assert.equal(PORTRAITS_602_EN.LIVIOODESCALCHI.alternativas,undefined);
});
test('All selected works have files, rights and English captions; source dates are artwork dates',()=>{
 for(const [id,p]of Object.entries(PORTRAITS_602)){
  assert(fs.existsSync(`public${p.archivo}`),id);assert(p.fuenteUrl&&p.derechosUrl,id);
  assert(PORTRAITS_602_EN[id].obra&&PORTRAITS_602_EN[id].autor,id);
 }
 assert.equal(PORTRAITS_602.GOTZBERLICHINGEN.fecha,'');
 assert.equal(PORTRAITS_602.JOSEFERNANDOBAV.fecha,'1698');
});
test('New shields retain bilingual context and provenance, including the later Lithuanian symbol',()=>{
 assert.equal(Object.keys(ARMS_IMAGES_602).length,17);
 for(const [house,m]of Object.entries(ARMS_IMAGES_602)){
  assert.equal(escudoDe(house).imagen.archivo,m.archivo,house);
  assert(fs.existsSync(`public${m.archivo}`),house);assert(ARMS_602[house].en.blazon,house);assert(m.autor&&m.fuente&&m.licencia,house);
 }
 assert.match(ARMS_602.Mindaugas.en.note,/fourteenth century/);
 const svg=fs.readFileSync('scripts/assets/sources/v602-medina-sidonia.svg','utf8');
 assert(!svg.includes('id="g9989"'));assert(!svg.includes('id="g20173"'));assert(svg.includes('id="g20316"'));
 assert(!fs.readFileSync('public/escudos/v602-sandoval.svg','utf8').includes('<metadata'));
});
