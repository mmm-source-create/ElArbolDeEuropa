import test from 'node:test';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {ROSES_HOUSES} from '../src/features/english/rosesHouseTranslations.js';
import {NEXT_HOUSES} from '../src/features/english/nextHouseTranslations.js';
import {REVIEWED_HOUSES} from '../src/features/english/reviewedHouseTranslations.js';
import {englishEntityPages} from '../scripts/generate/english-entities.mjs';
import {translatedEquivalent} from '../src/features/english/routes.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const parent=(id,key,expected)=>assert.equal(people.get(id)?.[key],expected,id);
test('Roses claims have complete maternal and paternal chains, with distinct Somerset and Neville generations',()=>{
 for(const [id,key,value] of [
 ['RICARDOYORK','madre','ANAMORTIMER'],['ANAMORTIMER','padre','ROGERMORTIMER4'],['ROGERMORTIMER4','madre','PHILIPPACLARENCE'],['PHILIPPACLARENCE','padre','LIONELANTWERP'],['LIONELANTWERP','padre','EDUARDO3ING'],
 ['ENRIQ7ING','madre','MARGARETBEAUFORT'],['MARGARETBEAUFORT','padre','JOHNBEAUFORTSOMERSET'],['JOHNBEAUFORTSOMERSET','padre','JOHNBEAUFORT1'],['JOHNBEAUFORT1','padre','JUANGASTE'],['JUANGASTE','padre','EDUARDO3ING'],
 ['ANANEVILLE','padre','RICHARDNEVILLEWARWICK'],['ISABELNEVILLE','padre','RICHARDNEVILLEWARWICK'],['RICHARDNEVILLEWARWICK','padre','RICHARDNEVILLESALISBURY'],['EDWARDWARWICK','padre','GEORGECLARENCE']])parent(id,key,value);
 assert.equal(people.get('LIONELANTWERP').nac,1338);
 assert.equal(people.get('ANAMORTIMER').nac,1388);
 assert.equal(people.get('PHILIPPACLARENCE').muerAprox,true);
 const routes=JSON.parse(fs.readFileSync(new URL('../public/personas-meta/index.json',import.meta.url)));
 assert.equal(routes.JOANBEAUFORTSCOT,'juana-beaufort');
 assert.equal(routes.JOANBEAUFORT,'juana-beaufort-condesa-de-westmorland');
 assert.equal(people.get('RICHARDSHREWSBURY').muer,undefined);
});
test('Roses story is available once, follows the battles through Stoke and has valid tree protagonists',()=>{
 const stories=HISTORIAS.filter(h=>h.id==='dos-rosas');assert.equal(stories.length,1);const s=stories[0];assert(s.disponible);assert.equal(s.pasos.length,21);
 let year=0;for(const p of s.pasos){assert(p.anio>=year);year=p.anio;assert(p.texto.length>300);for(const id of p.personas)assert(people.has(id),id);}
 for(const battle of ['Saint Albans','Wakefield','Towton','Barnet','Tewkesbury','Bosworth','Stoke'])assert(s.pasos.some(p=>p.titulo.includes(battle)),battle);
 assert.equal(s.pasos.at(-1).anio,1487);assert.match(s.pasos[16].texto,/desconocidos/);
 const crecy=HISTORIAS.find(h=>h.id==='cien-anos').pasos.find(p=>p.anio===1346);assert(crecy.personas.includes('JUAN1B'));assert.match(crecy.texto,/perdido la vista/);
});
test('seven further English houses preserve all source sections, people and branches',async()=>{
 const previous=new Set([...NEXT_HOUSES,...REVIEWED_HOUSES].map(h=>h.key));assert.equal(ROSES_HOUSES.length,7);const pages=await englishEntityPages(TRANSLATED_PEOPLE.map(r=>({...completeEnglishProfile(JSON.parse(fs.readFileSync(new URL(`../public/personas-meta/${r.es}.json`,import.meta.url)))),path:`/en/person/${r.en}`})));
 for(const t of ROSES_HOUSES){assert(!previous.has(t.key));const en=pages.find(p=>p.key===t.key),es=JSON.parse(fs.readFileSync(new URL(`../public/dinastias-meta/${t.es}.json`,import.meta.url)));
 for(const key of ['miembros','protagonistas','gobiernos','ramas','territorios','casasOrigen','casasDerivadas','casasConectadas','fuentes'])assert.equal(en[key].length,es[key].length,t.key+'/'+key);
 for(const field of ['resumen','origen','trayectoria','legado'])assert(en[field]&&en[field]!==es[field],t.key+'/'+field);
 assert.equal(translatedEquivalent(`/es/dinastia/${t.es}`,'en'),en.path);
 assert.deepEqual(en.miembros.map(p=>p.id),es.miembros.map(p=>p.id));
 for(const key of ['casasOrigen','casasDerivadas','casasConectadas'])for(const original of es[key])if(original.resumen){const translated=en[key].find(h=>h.key===original.nombre);assert(translated.resumen&&translated.resumen!==original.resumen,t.key+'/'+original.nombre);}
 for(const [i,g] of es.gobiernos.entries())if(g.nota)assert(en.gobiernos[i].englishNote&&en.gobiernos[i].englishNote!==g.nota,t.key+'/'+g.persona.id);
 for(const r of en.ramas){assert(!/[áéíóúñ]/i.test(r.etiqueta));assert(r.texto!==es.ramas.find(s=>s.id===r.id).texto,r.id);}
 }
});
test('requested heraldic variants retain attribution and safe local assets',()=>{
 for(const key of ['Aleramici','Lorena-Guisa','Ibelin','Asen','Poitiers','Armagnac','Poitiers-Antioquía','Almohade']){const a=escudoDe(key);assert(a.blason&&a.nota&&a.imagen.autor&&a.imagen.fuente&&a.imagen.licencia,key);const svg=fs.readFileSync(new URL('../public'+a.imagen.archivo,import.meta.url),'utf8');assert(!/<(?:script|foreignObject)|\son\w+=|<!ENTITY/i.test(svg));assert(/viewBox=/.test(svg));}
 assert.equal(escudoDe('Poitiers').imagen.archivo,escudoDe('Armagnac').imagen.archivo);assert.equal(escudoDe('Poitiers').imagen.licencia,'CC BY 3.0');assert.match(escudoDe('Šubić').nota,/Pavao/);assert.match(escudoDe('Asen').nota,/1307/);assert.match(escudoDe('Almohade').blason,/plata y sable/);
});
