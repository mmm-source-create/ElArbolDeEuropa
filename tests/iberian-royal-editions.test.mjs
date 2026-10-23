import test from 'node:test';
import {atlasSearch} from '../src/features/atlas/atlasSearch.js';
import {normalizarBusquedaPublica} from '../src/domain/people/personLabels.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {iberianRoyalRecords} from '../src/domain/people/iberianRulers.js';
import {IBERIAN_ENGLISH_PROFILES} from '../src/features/english/iberianProfiles.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {biografiaExtensaPersona} from '../src/content/biografias-extensas.js';
import {IBERIAN_NAME_REVIEWS} from '../src/data/iberianNameReviews.js';
import {registerHooks} from 'node:module';
import {resolverRuta} from '../src/app/routing.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {portraitSuggestions} from '../src/features/desafio/portraitSearch.js';

// CI runs tests before generating the site. Render the real home component
// with a small generated-data fixture rather than relying on ignored files.
registerHooks({resolve(specifier,context,nextResolve){
 if(/generated\/(home|siteMeta)\.json$/.test(specifier))return {url:'data:text/javascript,'+encodeURIComponent('export default '+JSON.stringify({buildVersion:'test',stats:{personas:2,dinastias:1,territorios:1,historias:1},personasDestacadas:[],historiasDestacadas:[]})),shortCircuit:true};
 return nextResolve(specifier,context);
}});
const {HomeContent}=await import('../src/features/public/HomePage.jsx');

test('every recorded Iberian royal holder has a complete English edition with its own offices and biography',()=>{
 const rulers=iberianRoyalRecords(PERSONAS);assert.equal(rulers.length,116);
 assert.equal(Object.keys(IBERIAN_ENGLISH_PROFILES).length,107);
 for(const p of rulers){
  const biography=biografiaExtensaPersona(p)||[];
  const source={...p,biografiaExtensa:biography,padres:[],conyuges:[],hijos:[],relacionadosDinastia:[],contemporaneos:[],historias:[]};
  const en=completeEnglishProfile(source),route=TRANSLATED_PEOPLE.find(r=>r.id===p.id);
  assert(en?.translationComplete,p.id);assert(en.role&&en.summary,p.id);assert(route,p.id);
  for(const field of ['id','nac','muer','gobiernos','documentacion'])assert.deepEqual(en[field],source[field],`${p.id}/${field}`);
  assert.equal(en.biografiaExtensa.length,biography.length,p.id);
  for(let i=0;i<biography.length;i++){assert.notEqual(en.biografiaExtensa[i].texto,biography[i].texto,p.id);assert.deepEqual(en.biografiaExtensa[i].fuentes,biography[i].fuentes);}
  assert.equal(translatedEquivalent(`/en/person/${route.en}`,'es'),`/es/persona/${route.es}`);
 }
});

test('Iberian name decisions retain published URLs and searchable ordinal and nickname variants',()=>{
 for(const review of IBERIAN_NAME_REVIEWS){const p=PERSONAS.find(p=>p.id===review.id);assert.equal(p.nombre,review.after.nombre);if(review.before.nombre!==review.after.nombre){assert.equal(p.slug,review.slug);assert(p.aliases.includes(review.before.nombre));}}
 const pool=Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,p])=>({id,nombre:p.name,sobrenombre:p.nickname,aliases:p.aliases}));
 for(const [query,id]of [['Philip of Évreux','FELIPEVREUX'],['Pedro IV of Portugal','PEDRO4PORT'],['Boabdil','MUHAMMAD12BOABDIL'],['Duarte','EDU1PORT'],['Henry III of Navarre','ENRIQ4FRA']])assert.equal(portraitSuggestions(pool,query,7,'en')[0]?.id,id,query);
 assert.equal(PERSONAS.find(p=>p.id==='MARIAPAD').nombre,'María de Padilla');
 assert.equal(PERSONAS.find(p=>p.id==='ISABMAL').gobiernos[0].titulo,'Reina');
 for(const [id,alias]of [['CARLOS5','Carlos I de España'],['FEL2ESP','Felipe I de Portugal'],['FERN2ARAG','Fernando V de Castilla']])assert(PERSONAS.find(p=>p.id===id).aliases.includes(alias));
 assert.equal(COMPLETE_ENGLISH_PROFILES.SEBAS1PORT.name,'Sebastian of Portugal');
 assert.equal(COMPLETE_ENGLISH_PROFILES.DION1.name,'Denis of Portugal');
 assert.equal(COMPLETE_ENGLISH_PROFILES.MUHAMMAD13ZAGAL.role,'Emir of Granada');
 assert.equal(atlasSearch('Charles V',{people:PERSONAS,dynasties:[],territories:[],stories:[],events:[],normalize:normalizarBusquedaPublica}).people[0]?.id,'CARLOS5','the English tutorial example must find the canonical person');
});

test('both homepages link straight to the tutorial in their language, preserving the Stories entry elsewhere',()=>{
 for(const locale of ['es','en']){
  const doc=new JSDOM(renderToStaticMarkup(React.createElement(HomeContent,{locale,prerendered:true}))).window.document;
  const links=doc.querySelectorAll('.public-hero-actions a');assert.equal(links.length,2);assert.equal(links[1].textContent.trim(),'Tutorial');
  const url=new URL(links[1].getAttribute('href'),'https://example.test');assert.equal(url.pathname,`/${locale}/`);assert.equal(url.searchParams.get('tutorial'),'1');
  const route=resolverRuta(url.pathname,url.search);assert.equal(route.view,'explorer');assert.equal(route.locale,locale);
  assert(doc.querySelector(`a[href="/${locale}/${locale==='en'?'stories':'historias'}"]`));
 }
 assert.equal(resolverRuta('/en/','').view,'english');
 assert.equal(resolverRuta('/en/unknown','?atlas=1').view,'not-found');
});

test('Sebastian’s requested portrait has a public-domain credit and working responsive assets',()=>{
 const image=IMAGENES_PERSONAS.SEBAS1PORT;assert.match(image.autor,/Cristóvão de Morais/);assert.match(image.institucion,/1165 Pint/);assert.match(image.derechos,/Dominio público/);
 assert(fs.existsSync('public'+image.archivo));const variants=IMAGE_VARIANTS[image.archivo];assert.equal(variants.variants.length,4);for(const v of variants.variants)assert(fs.existsSync('public'+v.src));
});
