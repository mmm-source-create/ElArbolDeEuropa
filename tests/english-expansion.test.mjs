import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {portraitSuggestions,nextPortrait} from '../src/features/desafio/portraitSearch.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {englishPaths,englishRoute,translatedEquivalent} from '../src/features/english/routes.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {tributaryLayerRelation,TRIBUTARY_RELATIONS} from '../src/cartography/tributaryRelations.js';
import {ENGLISH_DYNASTIES,ENGLISH_TERRITORIES} from '../src/features/english/entityTranslations.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
const person=id=>PERSONAS.find(p=>p.id===id);
const dependencies=(year,id='LUIS1')=>mapAuthoritiesForPerson(person(id),year,data,{includeDependencies:true}).filter(e=>e.relationship);

test('English sections have real equivalent routes, including a playable Challenge',()=>{
 for(const [es,en]of [['/es/dinastias','/en/dynasties'],['/es/territorios','/en/territories'],['/es/desafio','/en/challenge'],['/es/dinastia/anjou-hungria','/en/dynasty/anjou-hungary'],['/es/territorio/normandia','/en/territory/normandy']]){assert.equal(translatedEquivalent(es,'en'),en);assert.equal(translatedEquivalent(en,'es'),es);assert(englishPaths().includes(en));assert.equal(englishRoute(en).kind,'english');}
 assert.equal(englishRoute('/en/territory/normandy/chapter/1'),null);
 assert.equal(ENGLISH_DYNASTIES.length,22);assert.equal(ENGLISH_TERRITORIES.length,1);
 for(const id of ['ISAB1CAST','CARLOS5','LEONARDODAVINCI','MARIABORG','MAXIM1'])assert(COMPLETE_ENGLISH_PROFILES[id]);
 assert.equal(COMPLETE_ENGLISH_PROFILES.MARIABORG.nickname,'the Rich');
});

test('portrait matching accepts English nicknames and historical title variants; rounds never repeat',()=>{
 const pool=Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,p])=>({id,nombre:p.name,sobrenombre:p.nickname,aliases:p.aliases||[]}));
 assert.equal(portraitSuggestions(pool,'Lionheart',7,'en')[0].id,'RICARDO1ING');
 assert.equal(portraitSuggestions(pool,'Charles II of Hungary',7,'en')[0].id,'CARLOS3NAP');
 assert.equal(portraitSuggestions(pool,'last knight',7,'en')[0].id,'MAXIM1');
 // Both Catholic Monarchs share the nickname since Ferdinand’s complete profile (V5.35).
 assert.deepEqual(new Set(portraitSuggestions(pool,'the Catholic',7,'en').slice(0,2).map(p=>p.id)),new Set(['ISAB1CAST','FERN2ARAG']));
 const used=[];for(let i=0;i<pool.length;i++){const next=nextPortrait(pool,used,()=>0);assert(next);assert(!used.includes(next.id));used.push(next.id);}assert.equal(nextPortrait(pool,used),null);
});

test('Chronica illustrations are identified and credited separately from the text author',()=>{
 for(const id of ['ESTEBV','CARLOS1','LADI4','WEN3','LADI3','OTON3','BELA3HUN','EMERICOHUN','LADISLAO3HUN','ANDRES2HUN','CARLOS3NAP']){
  const image=IMAGENES_PERSONAS[id];assert.equal(image.fecha,'1488');assert.match(image.autor,/Ilustrador anónimo/);assert.match(image.fuenteUrl,/Chronica_Hungarorum/);assert(IMAGE_VARIANTS[image.archivo]);
 }
 assert.equal(IMAGENES_PERSONAS.JUANA1NAP.autor,'Robinet Testard');
 assert.match(IMAGENES_PERSONAS.MATIAS1HUN.fuenteUrl,/arcm/,'the existing historical painting is retained');
});

test('Louis’s dependencies keep local governments, dated ruptures and limited geographic scopes',()=>{
 assert(!dependencies(1357).some(e=>e.territory==='República de Ragusa'));
 assert(dependencies(1358).some(e=>e.territory==='República de Ragusa'));
 assert(!dependencies(1363).some(e=>e.territory==='Bosnia'));
 assert(dependencies(1366).some(e=>e.territory==='Bosnia'));
 for(const year of [1368,1369,1374,1382])assert(!dependencies(year).some(e=>e.territory==='Principado de Valaquia'));
 assert.equal(dependencies(1370).find(e=>e.territory==='Principado de Valaquia').relationship.certainty,'inferred');
 assert(!dependencies(1366).find(e=>e.territory==='Principado de Valaquia').relationship.certainty);
 assert(dependencies(1369).some(e=>e.territory==='Zarato de Vidin'));
 assert(!dependencies(1371).some(e=>e.territory==='Zarato de Vidin'));
 const p=dependencies(1377).find(e=>e.territory==='Podolia');assert(p.ids.includes('Kamianets_Podilskyi'));assert(!p.ids.includes('Vilnius'));
 const m=dependencies(1377).find(e=>e.territory==='Principado de Moldavia');assert.equal(m.relationship.certainty,'inferred');assert.deepEqual(new Set(m.ids),new Set(['Siret','Suceava','Targu_Neamt']));
 assert(!dependencies(1385,'CARLOS3NAP').length);
 for(const entry of dependencies(1377))assert(entry.mapSources.length&&entry.mapNote);
});

test('a single Serbian identity can hold distinct vassal relationships without duplicate cells',()=>{
 const entries=dependencies(1375).filter(e=>e.territory==='Serbia');assert.equal(entries.length,2);
 assert(!entries[0].ids.some(id=>entries[1].ids.includes(id)));
 assert.equal(tributaryLayerRelation('Serbia',1375,TRIBUTARY_RELATIONS,'Branicevo').id,'serbia-rastislalic-louis-hungary');
 assert.equal(tributaryLayerRelation('Serbia',1375,TRIBUTARY_RELATIONS,'Krusevac').id,'serbia-lazar-louis-hungary');
 const map=europeMosaicAt(data,1377,PERSONAS);
 assert.equal(map.byLocation.get('Kamianets_Podilskyi').find(l=>l.tributaryRelation)?.tributaryRelation.subject,'Podolia');
 assert(!map.byLocation.get('Vilnius').some(l=>l.tributaryRelation?.overlord==='Hungría'));
});
