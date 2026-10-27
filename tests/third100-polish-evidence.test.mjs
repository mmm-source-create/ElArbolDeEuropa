import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {REVIEWED_THIRD_100_NAMES} from '../src/data/reviewedThird100Names.js';
import {REVIEWED_100_NAMES} from '../src/data/reviewed100Names.js';
import {REVIEWED_NEXT_100_NAMES} from '../src/data/reviewedNext100Names.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {POLISH_PROFILES} from '../src/features/english/polishProfiles.js';
import {POLISH_HOUSES} from '../src/features/english/polishHouseTranslations.js';
import {englishEntityPages} from '../scripts/generate/english-entities.mjs';
import {personClaims,coverageReport,CLAIM_REVIEWS} from '../src/evidence/claims.js';
import {OCTOBER_50_REVIEWS} from '../src/evidence/october50Reviews.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {VISCONTI_SFORZA_IMAGES} from '../src/data/imagenesPersonasViscontiSforza.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../src/features/english/profilePortraits.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/'+p,import.meta.url)));
const translated=r=>({...completeEnglishProfile(read('personas-meta/'+r.es+'.json')),path:'/en/person/'+r.en});
test('third batch reviews and translates 100 different existing people, retaining every date, government, relation and evidence',()=>{
 const prior=new Set([...REVIEWED_100_NAMES,...REVIEWED_NEXT_100_NAMES].map(p=>p.id));assert.equal(REVIEWED_THIRD_100_NAMES.length,100);
 for(const review of REVIEWED_THIRD_100_NAMES){assert(!prior.has(review.id),review.id);const r=TRANSLATED_PEOPLE.find(p=>p.id===review.id),es=read('personas-meta/'+r.es+'.json'),en=completeEnglishProfile(es);assert(en.translationComplete&&en.resumen&&en.role,review.id);assert.equal(es.nombre,review.after.nombre);assert.equal(es.slug,review.slug);
 for(const key of ['id','nac','muer','gobiernos','documentacion','accesosCoronas'])assert.deepEqual(en[key],es[key],review.id+'/'+key);
 for(const key of ['padres','conyuges','hijos','relacionadosDinastia','contemporaneos'])assert.deepEqual(en[key].map(p=>p.id),es[key].map(p=>p.id),review.id+'/'+key);
 assert.equal(en.biografiaExtensa.length,(es.biografiaExtensa||[]).length);assert.equal(en.localizedClaims.length,personClaims(es).length);
 for(const claim of en.localizedClaims){const original=personClaims(es).find(p=>p.id===claim.id);assert.deepEqual(claim.sources.map(s=>s.url),original.sources.map(s=>s.url));}
 }
 assert.equal(COMPLETE_ENGLISH_PROFILES.CARLOS8SUE.biography.includes('separated'),true);
});
test('new Polish people have both complete editions and all four house histories have complete English routes',async()=>{
 assert.equal(Object.keys(POLISH_PROFILES).length,10);for(const id of Object.keys(POLISH_PROFILES)){const route=TRANSLATED_PEOPLE.find(p=>p.id===id),source=read('personas-meta/'+route.es+'.json'),en=completeEnglishProfile(source);assert.equal(en.biografiaExtensa.length,2);assert.equal(en.biografiaExtensa.length,source.biografiaExtensa.length);for(const [i,s] of en.biografiaExtensa.entries())assert(s.texto!==source.biografiaExtensa[i].texto);assert(!personClaims(PERSONAS.find(p=>p.id===id)).some(c=>c.certainty==='pending'));}
 const pages=await englishEntityPages(TRANSLATED_PEOPLE.map(translated));for(const t of POLISH_HOUSES){const es=read('dinastias-meta/'+t.es+'.json'),en=pages.find(p=>p.key===t.key);assert(en);assert.equal(translatedEquivalent('/es/dinastia/'+t.es,'en'),en.path);for(const f of ['resumen','origen','trayectoria','legado'])assert(en[f]&&en[f]!==es[f]);assert.deepEqual(en.miembros.map(p=>p.id),es.miembros.map(p=>p.id));if(t.key==='Kościuszko')assert.equal(en.arms,null);else assert(en.arms?.archivo&&en.arms?.note);}
 const juan=PERSONAS.find(p=>p.id==='JANAMORTARNOWSKI');assert.equal(juan.nombre,'Juan Amor Tarnowski');assert(juan.aliases.includes('Jan Amor Tarnowski'));assert.equal(PERSONAS.find(p=>p.id==='KONSTCZART').padre,'KAZIMIERZCZARTORYSKI');
});
test('50 previous pending claims have individual citations, separate from new records; 7014 remain pending',()=>{
 const ledger=JSON.parse(fs.readFileSync(new URL('../docs/audits/2026-10-27-evidence-50.json',import.meta.url)));assert.equal(ledger.length,50);assert.equal(Object.keys(OCTOBER_50_REVIEWS).length,50);assert.equal(new Set(ledger.map(c=>c.id)).size,50);const previous={...CLAIM_REVIEWS};for(const id of Object.keys(OCTOBER_50_REVIEWS))delete previous[id];
 for(const row of ledger){assert.equal(row.before,'pending');const p=PERSONAS.find(p=>p.id===row.id.split(':')[1]),old=personClaims(p,previous).find(c=>c.id===row.id),claim=personClaims(p).find(c=>c.id===row.id);assert.equal(old.certainty,'pending',row.id);assert.equal(claim.certainty,'documented');assert.equal(claim.value,row.value);assert(claim.sources.every(s=>s.url.startsWith('https:')&&s.locator));assert(!Object.hasOwn(POLISH_PROFILES,p.id));}
 assert.equal(coverageReport(PERSONAS).totals.pending,7014);
});
test('Visconti and Sforza portraits retain identity, artwork dates and bilingual rights; later user selections retain explicit attribution',()=>{
 assert.equal(Object.keys(VISCONTI_SFORZA_IMAGES).length,19);for(const [id,p] of Object.entries(VISCONTI_SFORZA_IMAGES)){assert(PERSONAS.some(p=>p.id===id));assert(fs.existsSync(new URL('../public'+p.archivo,import.meta.url)));assert(p.fuenteUrl&&p.derechosUrl&&p.autor&&p.fecha);const en=ENGLISH_PROFILE_PORTRAITS[id];assert(en?.obra&&en?.tipo&&en?.autor&&en?.fecha,id);}
 for(const id of ['TEOBVISC','BOS1SFOR','ANASFOR','HIPMARSFOR','MAGDVISBAV','CESARESFORZAGALLERANI','VALENTINAVISCONTCYP'])assert(!VISCONTI_SFORZA_IMAGES[id],id);
 assert.match(IMAGENES_PERSONAS.CATASFOR.obra,/jazmín/);assert.match(IMAGENES_PERSONAS.BIANSFOR.tipo,/discutidas/);assert.equal(VISCONTI_SFORZA_IMAGES.BATTISTASFORZA.fecha,'c. 1473–1475');assert.match(VISCONTI_SFORZA_IMAGES.GAL2VISC.fecha,/1556.*2011/);
});
