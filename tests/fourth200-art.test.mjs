import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {REVIEWED_FOURTH_200_NAMES as reviews} from '../src/data/reviewedFourth200Names.js';
import {REVIEWED_100_NAMES} from '../src/data/reviewed100Names.js';
import {REVIEWED_NEXT_100_NAMES} from '../src/data/reviewedNext100Names.js';
import {REVIEWED_THIRD_100_NAMES} from '../src/data/reviewedThird100Names.js';
import {REVIEWED_FOURTH_200_PROFILES as profiles} from '../src/features/english/reviewedFourth200Profiles.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {personClaims} from '../src/evidence/claims.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../src/features/english/profilePortraits.js';
import {ESCUDOS} from '../src/content/dinastias/escudos.js';
import {ESCUDOS_COMMONS} from '../src/content/dinastias/escudosCommons.js';
const ledger=JSON.parse(fs.readFileSync(new URL('../docs/audits/2026-10-27-review-200-art.json',import.meta.url)));
const read=r=>JSON.parse(fs.readFileSync(new URL('../public/personas-meta/'+r.es+'.json',import.meta.url)));
test('200 distinct additional profiles retain every government, relative, source and full biography',()=>{
 const prior=new Set([...REVIEWED_100_NAMES,...REVIEWED_NEXT_100_NAMES,...REVIEWED_THIRD_100_NAMES].map(p=>p.id));assert.equal(reviews.length,200);assert.equal(new Set(reviews.map(p=>p.id)).size,200);assert.equal(Object.keys(profiles).length,200);
 for(const review of reviews){assert(!prior.has(review.id),review.id);const r=TRANSLATED_PEOPLE.find(p=>p.id===review.id),es=read(r),en=completeEnglishProfile(es);assert.equal(es.slug,review.slug);assert.equal(es.nombre,review.after.nombre);assert.equal(en.translationComplete,true);assert(en.resumen&&en.role);assert.notEqual(en.resumen,es.resumen);
 for(const k of ['id','nac','muer','gobiernos','documentacion','accesosCoronas'])assert.deepEqual(en[k],es[k],review.id+'/'+k);
 for(const k of ['padres','conyuges','hijos','relacionadosDinastia','contemporaneos'])assert.deepEqual(en[k].map(p=>p.id),es[k].map(p=>p.id));
 assert.equal(en.biografiaExtensa.length,(es.biografiaExtensa||[]).length);if(es.biografia&&es.biografia!==es.resumen)assert(profiles[es.id].biography,'Preserve full biography '+es.id);
 assert.equal(en.localizedClaims.length,personClaims(es).length);for(const c of en.localizedClaims){const original=personClaims(es).find(p=>p.id===c.id);assert.deepEqual(c.sources.map(s=>s.url),original.sources.map(s=>s.url));}
 if(review.before.nombre!==review.after.nombre)assert(PERSONAS.find(p=>p.id===review.id).aliases.includes(review.before.nombre));
 }
 assert.equal(Object.values(profiles).filter(p=>p.biography).length,16);
});
test('40 additional monarch and consort portraits are separate from the seven requested person selections',()=>{
 assert.equal(ledger.additional40.length,40);assert.equal(new Set(ledger.additional40).size,40);assert.equal(ledger.portraits.filter(p=>p.group==='requested').length,7);
 for(const p of ledger.portraits){const image=IMAGENES_PERSONAS[p.id],en=ENGLISH_PROFILE_PORTRAITS[p.id];assert(image&&en,p.id);assert(image.fuenteUrl&&image.derechosUrl&&en.autor&&en.obra&&en.fecha);assert(fs.existsSync(new URL('../public'+image.archivo,import.meta.url)));if(p.crop){assert(p.crop.width>0&&p.crop.height>0);assert(p.crop.left+p.crop.width<=p.original.width);assert(p.crop.top+p.crop.height<=p.original.height);}}
 assert.match(IMAGENES_PERSONAS.BERNVISC.tipo,/identificación tradicional/);assert.match(IMAGENES_PERSONAS.BEATSCALA.obra,/Beatrice/);assert.match(IMAGENES_PERSONAS.GIANGALSFOR.autor,/Briosco/);assert.match(IMAGENES_PERSONAS.GIANGALSFOR.tipo,/Relieve/);assert.match(IMAGENES_PERSONAS.CATAVISC.autor,/Carracci/);
 for(const p of ledger.existingFrameCrops)assert.match(IMAGENES_PERSONAS[p.id].modificaciones,/marco/);
});
test('five credited arms retain bilingual descriptions and valid licence links',()=>{
 assert.equal(ledger.arms.length,5);for(const house of ledger.arms){const a=ESCUDOS[house],c=ESCUDOS_COMMONS[house];assert(a.en.blazon&&a.en.note&&c.en.autor&&c.en.modifications,house);assert.match(c.licenciaUrl,/^https:\/\/creativecommons.org\//);const svg=fs.readFileSync(new URL('../public'+c.archivo,import.meta.url),'utf8');assert.match(svg,/viewBox=/);assert.doesNotMatch(svg,/<script|<foreignObject|onload=/);}
});
test('Charles V retains the established imperial name and Spanish ordinal as a searchable variant',()=>{
 const p=PERSONAS.find(p=>p.id==='CARLOS5');assert.equal(p.nombre,'Carlos V');assert(p.aliases.includes('Carlos I de España'));assert(ledger.carlosV.sources.every(s=>s.startsWith('https://')));
});
