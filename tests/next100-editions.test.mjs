import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {build} from 'vite';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {REVIEWED_NEXT_100_NAMES} from '../src/data/reviewedNext100Names.js';
import {REVIEWED_100_NAMES} from '../src/data/reviewed100Names.js';
import {NEXT_HOUSES} from '../src/features/english/nextHouseTranslations.js';
import {REVIEWED_HOUSES} from '../src/features/english/reviewedHouseTranslations.js';
import {TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {englishEntityPages} from '../scripts/generate/english-entities.mjs';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {HISTORIAS} from '../src/data/historias.js';
import {chapterArtworks} from '../src/features/stories/storyArtworks.js';
let EnglishEntity,renderDir;
before(async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));renderDir=fs.mkdtempSync(path.join(root,'.ssg-build-test-'));
 await build({root,configFile:false,publicDir:false,logLevel:'error',build:{ssr:'src/features/english/EnglishEntity.jsx',outDir:renderDir,emptyOutDir:false,minify:false,rolldownOptions:{output:{entryFileNames:'entry.mjs'}}}});
 EnglishEntity=(await import(pathToFileURL(path.join(renderDir,'entry.mjs')).href)).default;
});
after(()=>{if(renderDir)fs.rmSync(renderDir,{recursive:true,force:true});});
const read=file=>JSON.parse(fs.readFileSync(new URL('../public/'+file,import.meta.url)));
test('second 100 editions are disjoint and preserve every record, relation, biography section and route',()=>{
 assert.equal(REVIEWED_NEXT_100_NAMES.length,100);const previous=new Set(REVIEWED_100_NAMES.map(p=>p.id));let sections=0;
 for(const review of REVIEWED_NEXT_100_NAMES){assert(!previous.has(review.id));const r=TRANSLATED_PEOPLE.find(r=>r.id===review.id),s=read(`personas-meta/${r.es}.json`),en=completeEnglishProfile(s);
 for(const key of ['id','nac','muer','gobiernos','documentacion','accesosCoronas'])assert.deepEqual(en[key],s[key],review.id+'/'+key);
 for(const key of ['padres','conyuges','hijos','relacionadosDinastia','contemporaneos'])assert.deepEqual(en[key].map(p=>p.id),s[key].map(p=>p.id));
 assert(en.translationComplete&&en.summary&&en.role);assert.equal(en.biografiaExtensa.length,(s.biografiaExtensa||[]).length);sections+=en.biografiaExtensa.length;assert.equal(s.nombre,review.after.nombre);
 assert.equal(translatedEquivalent(`/en/person/${r.en}`,'es'),`/es/persona/${r.es}`);
 }assert.equal(sections,30);
});
test('seven further houses retain all memberships, governments, related houses, branches and sources',async()=>{
 assert.equal(NEXT_HOUSES.length,7);const previous=new Set(REVIEWED_HOUSES.map(h=>h.key));
 const people=TRANSLATED_PEOPLE.map(r=>({...completeEnglishProfile(read(`personas-meta/${r.es}.json`)),path:`/en/person/${r.en}`}));const pages=await englishEntityPages(people);
 for(const t of NEXT_HOUSES){assert(!previous.has(t.key));const s=read(`dinastias-meta/${t.es}.json`),en=pages.find(p=>p.key===t.key);
 for(const key of ['miembros','protagonistas','gobiernos','ramas','territorios','casasOrigen','casasDerivadas','casasConectadas','fuentes'])assert.equal(en[key].length,s[key].length,t.key+'/'+key);
 for(const key of ['resumen','origen','trayectoria','legado'])assert(en[key]&&en[key]!==s[key]);assert(en.arms.autor&&en.arms.licenciaUrl&&en.arms.blazon);
 const rendered=renderToStaticMarkup(React.createElement(EnglishEntity,{data:en}));
 for(const branch of en.ramas)assert(rendered.includes(`id="${branch.id}"`),t.key+'/'+branch.id+' must be visible');
 }
});
test('artworks belong only to the chapter containing their scene, with bilingual captions and local images',()=>{
 for(const [story,chapter,year]of [['borgona',14,1477],['cien-anos',3,1346]]){const works=chapterArtworks(story,chapter);assert.equal(works.length,1);assert.equal(HISTORIAS.find(s=>s.id===story).pasos[chapter-1].anio,year);assert.equal(chapterArtworks(story,chapter+1).length,0);for(const w of works){assert(w.es.title&&w.en.title&&w.es.caption&&w.en.caption&&w.artist&&w.collection&&w.date>year);assert(fs.existsSync(new URL(`../public/obras/${w.id}.webp`,import.meta.url)));}}
});
test('new arms carry source, artist and licence; Dampierre uses the requested lion and Almohad attribution is explicit',()=>{
 for(const key of ['Šubić','Movilă','Aldobrandini','Jülich','Dampierre','Almohade']){const a=escudoDe(key);assert(a.blason&&a.nota&&a.imagen.autor&&a.imagen.fuente&&a.imagen.licenciaUrl,key);const svg=fs.readFileSync(new URL('../public'+a.imagen.archivo,import.meta.url),'utf8');assert(!/<(?:script|foreignObject)|\son\w+=|<!ENTITY/i.test(svg));assert(/viewBox=/.test(svg));}
 assert.equal(escudoDe('Dampierre').imagen.archivo,escudoDe('Jülich').imagen.archivo);assert.match(escudoDe('Almohade').nota,/atribuido/);
});
