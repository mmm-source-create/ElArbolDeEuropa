import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {dynastyOrderCounts} from '../src/domain/genealogy/dynastyOrder.js';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {ENGLISH_STORIES} from '../src/features/english/content.js';
import {TRANSLATED_STORIES,englishPaths} from '../src/features/english/routes.js';
import {normalizeStoryProgress,saveStoryProgress,readStoryProgress} from '../src/features/stories/storyModel.js';
import {storyRecommendations} from '../src/features/stories/storyRecommendations.js';
import StoryRecommendations from '../src/features/stories/StoryRecommendations.jsx';

test('el orden dinástico incluye descendientes, excluye ascendientes y alianzas, y no duplica diamantes',()=>{
 const people=['Root','Anjou','Bourbon','Orleans','Grandchild'].map((dinastia,i)=>({id:String(i),dinastia}));
 const counts=dynastyOrderCounts(people,{parents:{Anjou:['Root'],Bourbon:['Root'],Orleans:['Bourbon'],Grandchild:['Orleans','Bourbon']},branches:[{tipo:'matrimonio',origen:'Bourbon',destino:'Anjou'},{tipo:'rama_cadete',origen:'Root',destino:'Bourbon'}]});
 assert.equal(counts.get('Root'),5);assert.equal(counts.get('Bourbon'),3);assert.equal(counts.get('Anjou'),1);assert.equal(counts.get('Grandchild'),1);
 const cyclic=dynastyOrderCounts(people,{parents:{Root:['Grandchild'],Grandchild:['Root']},branches:[]});assert.equal(cyclic.get('Root'),2);
});
test('Capeto cuenta sus ramas para ordenar sin alterar las personas asignadas a Borbón',()=>{
 const counts=dynastyOrderCounts(PERSONAS),direct=name=>PERSONAS.filter(p=>p.dinastia===name).length;
 assert.ok(counts.get('Capeto')>counts.get('Borbón'));assert.ok(counts.get('Borbón')>direct('Borbón'));assert.ok(counts.get('Anjou')>direct('Anjou'));assert.equal(direct('Capeto'),21);
});
test('Borgoña centra ocho capítulos en Carlos y termina en su biznieto; ambos relatos aprobados tienen seis capítulos',()=>{
 const story=HISTORIAS.find(s=>s.id==='borgona');assert.equal(story.pasos.length,17);assert.equal(story.pasos.filter(p=>p.persona==='CAR1BORG').length,8);assert.equal(story.pasos.at(-1).persona,'CARLOS5');assert.equal(story.pasos.find(p=>p.figura)?.anio,1473);assert.match(story.pasos.find(p=>p.anio===1477).texto,/cuerpo/);
 const people=new Set(PERSONAS.map(p=>p.id));
 for(const id of ['dos-coronas-dos-hijas','corona-demasiado-grande']){const s=HISTORIAS.find(s=>s.id===id);assert.equal(s.disponible,true);assert.equal(s.pasos.length,6);assert.ok(s.fuentes.length>=4);for(const p of s.pasos){assert.ok(p.texto.length>500);assert.ok(p.personas.every(id=>people.has(id)));}}
 for(const route of TRANSLATED_STORIES){const s=HISTORIAS.find(s=>s.id===route.id);assert.equal(s.pasos.length,route.chapters);assert.equal(ENGLISH_STORIES[s.id].chapters.length,s.pasos.length);assert.ok(englishPaths().includes(`/en/story/${route.en}/chapter/${route.chapters}`));}
});
test('la lectura guardada de Borgoña sigue apuntando a Nancy y las nuevas visitas no se vuelven a desplazar',()=>{
 assert.deepEqual(normalizeStoryProgress({last:8,read:[7,8,9,10,11]},'borgona',17),{last:14,read:[7,14,15,16,17]});
 const data=new Map(),storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)};
 saveStoryProgress(storage,'borgona',17,12);assert.equal(readStoryProgress(storage,'borgona',17).last,12);saveStoryProgress(storage,'borgona',17,17);assert.deepEqual(readStoryProgress(storage,'borgona',17).read,[12,17]);
});
test('las recomendaciones muestran la futura historia neerlandesa sin enlazar una página inexistente',()=>{
 const items=storyRecommendations(HISTORIAS.find(s=>s.id==='borgona'),HISTORIAS);assert.deepEqual(items.map(s=>s.id),['ochenta-anos','emperadores']);
 const dom=new JSDOM(renderToStaticMarkup(React.createElement(StoryRecommendations,{items})));const document=dom.window.document;
 assert.equal(document.querySelectorAll('a.story-follow-card').length,1);assert.equal(document.querySelectorAll('article.is-coming').length,1);assert.match(document.querySelector('article').textContent,/En preparación/);assert.ok(document.querySelector('#seguir-leyendo'));dom.window.close();
});
