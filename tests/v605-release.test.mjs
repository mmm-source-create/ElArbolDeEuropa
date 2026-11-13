import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {V6_STORIES} from '../src/features/english/v6/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {englishLabel} from '../src/features/english/v6/atlasPresentation.js';
import {buildDinastleModel} from '../src/features/desafio/dinastleEngine.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';

test('Frederick is connected to both existing Wettin parents and has paired chapters',()=>{
 const p=PERSONAS.find(p=>p.id==='FREDSAXTEUTONIC');
 assert.equal(p.padre,'ALBERTSAX');assert.equal(p.madre,'SIDONIEBOH');
 assert(PERSONAS.some(x=>x.id===p.padre));assert(PERSONAS.some(x=>x.id===p.madre));
 assert.equal(COMPLETE_ENGLISH_PROFILES[p.id].sections.length,3);
 assert.equal(new Set(TRANSLATED_PEOPLE.map(p=>p.id)).size,PERSONAS.length);
 assert.equal(TRANSLATED_PEOPLE.length,PERSONAS.length);
});
test('Maximilian’s Austrian mandate is delegated and his Prussian claim is not effective sovereignty',()=>{
 const p=PERSONAS.find(p=>p.id==='MAXIM3TIROL');
 const g=p.gobiernos.find(g=>g.territorio==='Austria Interior');assert.equal(g.condicion,'regencia');assert.equal(g.soberano,'FERN2EMP');
 assert.equal(p.gobiernos.find(g=>g.territorio==='Prusia').condicion,'titular');
 const story=HISTORIAS.find(h=>h.id==='orden-teutonica-maestrazgo-sin-prusia');
 assert.deepEqual(story.pasos.map(p=>p.anio),V6_STORIES[story.id].content.pasos.map(p=>p.anio));
 for(const id of new Set(story.pasos.flatMap(p=>p.personas)))assert(PERSONAS.some(p=>p.id===id),id);
});
test('every Dinastle role has an English presentation label',()=>{
 for(const role of new Set(buildDinastleModel(PERSONAS,HISTORIAS).entries.flatMap(p=>p.roles)))assert.notEqual(englishLabel(role),role,role);
});
test('every recorded king of Aragon has a credited, published image',()=>{
 for(const p of PERSONAS.filter(p=>p.gobiernos?.some(g=>g.territorio==='Aragón'&&g.titulo==='Rey'))){
  const image=IMAGENES_PERSONAS[p.id];assert(image,p.id);assert(image.fuenteUrl&&image.derechos,p.id);
  assert(IMAGE_VARIANTS[image.archivo]?.variants.length,p.id);
 }
 assert(IMAGENES_PERSONAS.GIORGI7GEO.fuenteUrl.includes('1393-1400'));
 assert(!IMAGENES_PERSONAS.GIORGI7IMER?.fuenteUrl.includes('1393-1400'));
});
test('English dynasty pages retain canonical armorial identifiers',()=>{
 for(const slug of ['ivrea-borgona','lorena']){
  const d=JSON.parse(fs.readFileSync(`public/english-meta/dynasty-${slug}.json`));assert(escudoDe(d.key)?.imagen,`${slug}: ${d.key}`);
 }
});

test('the Order’s nominal Prussian office never permits effective territorial rule',async()=>{
 const {auditarTerritorios}=await import('../scripts/audits/lib/auditTerritorios.js');
 const claim=PERSONAS.find(p=>p.id==='MAXIM3TIROL').gobiernos.find(g=>g.territorio==='Prusia');
 assert(!auditarTerritorios([{id:'TEST',gobiernos:[claim]}]).some(i=>i.severity==='ERROR'));
 assert(auditarTerritorios([{id:'TEST',gobiernos:[{...claim,condicion:'efectivo'}]}]).some(i=>i.code==='TERRITORY_CLASS_MISMATCH'));
});

test('English evidence preserves the alternative birth year and each source passage',async()=>{
 const {completeEnglishProfile}=await import('../scripts/generate/complete-english-profile.mjs');
 const source=JSON.parse(fs.readFileSync('public/personas-meta/federico-de-sajonia-gran-maestre.json'));
 const claims=completeEnglishProfile(source).localizedClaims;
 const birth=claims.find(c=>c.field==='Nacimiento');assert(birth.alternatives.includes('1474 (Sächsische Biografie)'));
 for(const claim of claims){assert(!claim.note.includes('Source passage supporting'));for(const source of claim.sources)assert(!source.locator.includes('Source passage supporting'));}
});
