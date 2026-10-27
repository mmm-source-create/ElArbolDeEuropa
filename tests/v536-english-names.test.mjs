import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {biografiaExtensaPersona} from '../src/content/biografias-extensas.js';
import {V536_ENGLISH_PROFILES} from '../src/features/english/v536Profiles.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {nameReviewIssues,displayedNickname} from '../src/domain/people/personNaming.js';
import {PERSON_NAME_REVIEWS} from '../src/data/personNameReviews.js';
import {TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {portraitSuggestions} from '../src/features/desafio/portraitSearch.js';
import DynastyCard from '../src/features/public/DynastyCard.jsx';

test('the twenty additional editions preserve every canonical government and biography section',()=>{
 assert.equal(Object.keys(V536_ENGLISH_PROFILES).length,20);
 assert.equal(Object.keys(COMPLETE_ENGLISH_PROFILES).length,467);
 assert.equal(TRANSLATED_PEOPLE.length,467);
 for(const id of Object.keys(V536_ENGLISH_PROFILES)){
  const p=PERSONAS.find(p=>p.id===id),bio=biografiaExtensaPersona(p)||[];
  const source={...p,biografiaExtensa:bio,padres:[],conyuges:[],hijos:[],relacionadosDinastia:[],contemporaneos:[],historias:[]};
  const en=completeEnglishProfile(source),route=TRANSLATED_PEOPLE.find(r=>r.id===id);
  assert.equal(en.translationComplete,true,id);assert.equal(en.biografiaExtensa.length,bio.length,id);
  for(const field of ['id','nac','muer','gobiernos','documentacion'])assert.deepEqual(en[field],source[field],`${id}/${field}`);
  assert.equal(translatedEquivalent(`/es/persona/${route.es}`,'en'),`/en/person/${route.en}`);
  for(let i=0;i<bio.length;i++)assert.notEqual(en.biografiaExtensa[i].texto,bio[i].texto,id);
 }
});

test('the naming review covers the Spanish database and retains former names and published URLs',()=>{
 assert.deepEqual(PERSONAS.flatMap(p=>nameReviewIssues(p).map(issue=>[p.id,issue])),[]);
 for(const r of PERSON_NAME_REVIEWS){const p=PERSONAS.find(p=>p.id===r.id);if(r.before.nombre!==r.after.nombre){assert(p.aliases.includes(r.before.nombre),r.id);assert.equal(p.slug,r.slug,r.id);}}
 assert.equal(PERSONAS.find(p=>p.id==='WEN3').nombre,'Wenceslao III de Bohemia','do not take his first Hungarian office as the meaning of ordinal III');
 assert.equal(PERSONAS.find(p=>p.id==='JAIME2AR').nombre,'Jaime II de Aragón','the Sicilian and Aragonese regnal numbers are different');
 assert.equal(displayedNickname({nombre:'Enrique el Joven',sobrenombre:'el Joven'}),'');
 assert.equal(displayedNickname(PERSONAS.find(p=>p.id==='JUANAARCO')),'la Doncella de Orleans');
});

test('separate nicknames and former familiar names remain searchable in English',()=>{
 const pool=Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,p])=>({id,nombre:p.name,sobrenombre:p.nickname,aliases:p.aliases||[]}));
 for(const [id,name,query]of [['PETER1RUS','Peter I of Russia','Peter the Great'],['CATHERINE2RUS','Catherine II of Russia','Catherine the Great'],['FRED2PRUSSIA','Frederick II of Prussia','Frederick the Great'],['SULEIMAN1OSM','Suleiman I','Lawgiver'],['JUANSINTIERRA','John of England','Lackland'],['MARIAESTUARDO','Mary I of Scotland','Mary Queen of Scots']]){
  assert.equal(COMPLETE_ENGLISH_PROFILES[id].name,name);assert.equal(portraitSuggestions(pool,query,7,'en')[0]?.id,id,query);
 }
});

test('English and Spanish dynasty cards share the same layout elements and classes',()=>{
 const item={nombre:'Anjou',slug:'anjou',total:4,resumen:'A house',miembros:[{id:'a',nombre:'A',slug:'a'}]};
 const render=locale=>new JSDOM(renderToStaticMarkup(React.createElement(DynastyCard,{item,locale}))).window.document;
 const es=render('es'),en=render('en');
 assert.deepEqual([...en.querySelectorAll('[class]')].map(n=>n.getAttribute('class')),[...es.querySelectorAll('[class]')].map(n=>n.getAttribute('class')));
 assert(en.querySelector('.public-entity-card-head h2'));assert.equal(en.querySelector('strong small').textContent,'people');
 assert.match(en.querySelector('.public-entity-action').textContent,/Read the record · ES/);
});
