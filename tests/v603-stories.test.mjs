import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {HISTORIAS} from '../src/data/historias.js';
import {STORIES_603_ES,STORIES_603_EN} from '../src/data/historias603.js';
import {PERSONAS} from '../src/data/personas.js';
import {TRANSLATED_STORIES,TRANSLATED_PEOPLE,TRANSLATED_DYNASTIES,translatedEquivalent} from '../src/features/english/routes.js';
import {slugPublico} from '../src/domain/people/personLabels.js';
import {collectionLabels} from '../src/features/stories/storyThemes.js';
import StoryCollectionTags from '../src/features/stories/StoryCollectionTags.jsx';
import {homeSearchResults} from '../src/features/public/homeSearch.js';
import {normalizeStoryProgress,saveStoryProgress,readStoryProgress} from '../src/features/stories/storyModel.js';
import {V603_PROFILES,V603_BIOGRAPHIES,V603_REFERENCES} from '../src/content/v603People.js';

test('Every new story has matching English chapters, known cast, live links and sources',()=>{
 const people=new Set(PERSONAS.map(p=>p.id));
 assert.equal(STORIES_603_ES.length,9);
 for(const story of STORIES_603_ES){
  const en=STORIES_603_EN[story.id].content,route=TRANSLATED_STORIES.find(s=>s.id===story.id);
  assert.equal(story.pasos.length,en.pasos.length,story.id);
  assert(story.pasos.length>=6);assert(story.fuentes.length>=2);
  assert.equal(route.es,slugPublico(story.titulo));assert.equal(route.chapters,story.pasos.length);
  assert.equal(translatedEquivalent(`/es/historia/${route.es}/capitulo/2`,'en'),`/en/story/${route.en}/chapter/2`);
  for(let i=0;i<story.pasos.length;i++){
   assert(story.pasos[i].texto.length>200);assert(en.pasos[i].texto.length>200);
   assert.deepEqual(story.pasos[i].personas,en.pasos[i].personas);
   assert.equal(story.pasos[i].anio,en.pasos[i].anio);
   for(const id of story.pasos[i].personas)assert(people.has(id),id);
  }
 }
 assert.equal(HISTORIAS.filter(s=>s.id==='reino-partido-dos').length,1);
});

test('All English story switches resolve to the actual Spanish title route',()=>{
 for(const route of TRANSLATED_STORIES){const story=HISTORIAS.find(s=>s.id===route.id);assert(story,route.id);assert.equal(route.es,slugPublico(story.titulo),route.id);}
});

test('New personal profiles are bilingual without duplicating existing people or URLs',()=>{
 assert.equal(new Set(TRANSLATED_PEOPLE.map(p=>p.id)).size,PERSONAS.length);
 for(const [id,profile] of Object.entries(V603_PROFILES)){
  assert.equal(profile.sections.length,V603_BIOGRAPHIES[id].length,id);
  assert(V603_REFERENCES[id].length);assert(TRANSLATED_PEOPLE.some(p=>p.id===id));
 }
 assert.equal(PERSONAS.find(p=>p.id==='ALEJFARNESIO').sobrenombre,'el Rayo de la Guerra');
 assert.equal(TRANSLATED_PEOPLE.find(p=>p.id==='FRANLERMA').es,'francisco-gomez-de-sandoval-y-zuniga-franlerma');
 assert.equal(TRANSLATED_PEOPLE.find(p=>p.id==='FRANSANDZUN').es,'francisco-gomez-de-sandoval-y-zuniga-fransandzun');
});

test('Collection labels can be read and searched in each language',()=>{
 const story=HISTORIAS.find(s=>s.id==='federico-emperador-excomulgado');
 const html=renderToStaticMarkup(React.createElement(StoryCollectionTags,{story,locale:'en'}));
 assert(html.includes('Contested Inheritances'));assert(html.includes('Crusades'));assert(!html.includes('Cruzadas'));
 const index=[{name:'Frederick II',path:'/en/story/frederick-ii-the-excommunicated-emperor',context:collectionLabels(story,'en').join(' ')}];
 assert.equal(homeSearchResults(index,'contested inheritances').length,1);
});

test('Legacy split progress follows matching passages and is not migrated twice',()=>{
 assert.deepEqual(normalizeStoryProgress({last:7,read:[1,2,3,4,7,15,18]},'reino-partido-dos',7),{last:6,read:[1,3,6]});
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 saveStoryProgress(storage,'reino-partido-dos',7,4);
 assert.deepEqual(readStoryProgress(storage,'reino-partido-dos',7),{last:4,read:[4]});
});

test('Every old chapter URL redirects to an existing new passage in both languages',()=>{
 const {redirects}=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 for(const [prefix,segment,lang] of [['/es/historia/el-reino-partido-en-dos','capitulo','es'],['/en/story/the-kingdom-divided-in-two','chapter','en']]){
  for(let i=1;i<=18;i++){
   const redirect=redirects.find(r=>r.source===`${prefix}/${segment}/${i}`);assert(redirect,i);
   const target=redirect.destination.match(/\/(?:historia|story)\/([^/]+)\/(?:capitulo|chapter)\/(\d+)$/);assert(target);
   const route=TRANSLATED_STORIES.find(s=>s[lang]===target[1]);assert(route,redirect.destination);assert(+target[2]<=route.chapters);
  }
 }
});

test('Generated catalogues share dynasty ranking and expose translated collections in search',()=>{
 const read=file=>JSON.parse(fs.readFileSync(`public/${file}`,'utf8'));
 const es=read('catalogos/dinastias.json').items,en=read('english-meta/dynasties.json').dynasties;
 const routes=new Map(TRANSLATED_DYNASTIES.map(d=>[d.es,d.en]));
 assert.deepEqual(en.map(p=>p.path),es.map(p=>`/en/dynasty/${routes.get(p.slug)}`));
 for(const [locale,query,label] of [['es','Herencias conflictivas','Herencias conflictivas'],['en','Contested Inheritances','Contested Inheritances']]){
  const index=read(`catalogos/search-${locale}.json`).items;
  const result=homeSearchResults(index,query,100).find(item=>item.path.includes('excomulgado')||item.path.includes('excommunicated'));
  assert(result);assert(result.collections.includes(label));
 }
 for(const story of STORIES_603_ES){
  const route=TRANSLATED_STORIES.find(s=>s.id===story.id),source=read(`historias-meta/${route.es}.json`),translated=read(`english-meta/story-${route.en}.json`);
  assert.equal(translated.title,STORIES_603_EN[story.id].content.titulo);
  assert.deepEqual(translated.protagonists.map(p=>p.id),source.protagonists.map(p=>p.id));
  assert(translated.protagonists.every(p=>p.summary&&p.enPath?.startsWith('/en/person/')));
  assert.deepEqual(translated.colecciones,source.colecciones);
 }
 const cast=read('english-meta/story-frederick-ii-the-excommunicated-emperor.json').protagonists;
 assert.equal(cast.find(p=>p.id==='PAPA_GREGORIO9').nombre,'Gregory IX');
});
