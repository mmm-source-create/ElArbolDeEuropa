import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HISTORIAS} from '../src/data/historias.js';
import {V6_STORIES} from '../src/features/english/v6/index.js';
import {PROFILE_LABELS} from '../src/features/english/profileVocabulary.js';
import {PORTRAITS_604} from '../src/data/imagenesPersonas604.js';
import {PORTRAITS_604_EN} from '../src/features/english/portraits604.js';
import {readStoryProgress,saveStoryProgress,STORY_PROGRESS_KEY} from '../src/features/stories/storyModel.js';

test('the three imperial routes preserve every chapter once in both languages',()=>{
 const parts=HISTORIAS.filter(h=>h.id.startsWith('emperadores'));
 assert.equal(parts.length,3);assert.equal(parts.flatMap(h=>h.pasos).length,19);
 assert.equal(new Set(parts.flatMap(h=>h.pasos.map(p=>p.titulo))).size,19);
 for(const s of parts)assert.deepEqual(s.pasos.map(p=>p.anio),V6_STORIES[s.id].content.pasos.map(p=>p.anio));
});
test('old imperial progress moves to the appropriate new route exactly once',()=>{
 let data=JSON.stringify({emperadores:{last:15,read:[1,6,7,12,15,19]}});
 const storage={getItem:()=>data,setItem:(key,value)=>{assert.equal(key,STORY_PROGRESS_KEY);data=value;}};
 assert.deepEqual(readStoryProgress(storage,'emperadores-sucesion',7),{last:3,read:[3,7]});
 assert.deepEqual(readStoryProgress(storage,'emperadores-reforma',6),{last:1,read:[1,6]});
 saveStoryProgress(storage,'emperadores-sucesion',7,4);
 assert.deepEqual(readStoryProgress(storage,'emperadores-sucesion',7),{last:4,read:[3,7,4]});
});
test('expanded stories preserve old read chapters and align both editions',()=>{
 for(const id of ['balduino-saladino','republica-nobles']){
  const s=HISTORIAS.find(h=>h.id===id),en=V6_STORIES[id].content;
  assert.deepEqual(s.pasos.map(p=>p.anio),en.pasos.map(p=>p.anio));
 }
 const storage={getItem:()=>JSON.stringify({'republica-nobles':{last:13,read:[1,3,13]}})};
 assert.deepEqual(readStoryProgress(storage,'republica-nobles',16),{last:16,read:[2,4,16]});
});
test('reviewed portraits are local, credited and available in both languages',()=>{
 assert(Object.keys(PORTRAITS_604).length>=29);
 for(const [id,p] of Object.entries(PORTRAITS_604)){
  assert(fs.existsSync(new URL('../public'+p.archivo,import.meta.url)),id);
  assert(p.fuenteUrl.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert(p.autor&&p.derechos&&PORTRAITS_604_EN[id]?.obra,id);
  assert(IMAGE_VARIANTS[p.archivo]?.variants.length,id);
  for(const v of IMAGE_VARIANTS[p.archivo].variants)assert(fs.existsSync(new URL('../public'+v.src,import.meta.url)),v.src);
 }
 assert.equal(PROFILE_LABELS.Perche,'Perche');
 assert.equal(PROFILE_LABELS['Las dos Borgoñas'],'The two Burgundies');
 assert.equal(PROFILE_LABELS['Borgoña y Países Bajos'],'Burgundy and the Low Countries');
});
