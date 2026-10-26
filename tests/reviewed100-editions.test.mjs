import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {REVIEWED_100_PROFILES} from '../src/features/english/reviewed100Profiles.js';
import {REVIEWED_100_NAMES} from '../src/data/reviewed100Names.js';
import {REVIEWED_HOUSES} from '../src/features/english/reviewedHouseTranslations.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE,translatedEquivalent} from '../src/features/english/routes.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {englishEntityPages} from '../scripts/generate/english-entities.mjs';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
const read=file=>JSON.parse(fs.readFileSync(new URL('../'+file,import.meta.url)));

test('the reviewed 100 are distinct complete editions with preserved records and published routes',()=>{
 assert.equal(Object.keys(REVIEWED_100_PROFILES).length,100);
 assert.equal(REVIEWED_100_NAMES.length,100);
 assert.equal(new Set(REVIEWED_100_NAMES.map(p=>p.id)).size,100);
 let sections=0;
 for(const review of REVIEWED_100_NAMES){
  const route=TRANSLATED_PEOPLE.find(p=>p.id===review.id),source=read(`public/personas-meta/${route.es}.json`),before=structuredClone(source),en=completeEnglishProfile(source);
  assert.deepEqual(source,before);
  for(const field of ['id','nac','muer','gobiernos','documentacion','accesosCoronas'])assert.deepEqual(en[field],source[field],review.id+'/'+field);
  for(const field of ['padres','conyuges','hijos','relacionadosDinastia','contemporaneos'])assert.deepEqual(en[field].map(p=>p.id),source[field].map(p=>p.id),review.id+'/'+field);
  assert(en.summary&&en.role&&en.translationComplete,review.id);
  assert.equal(en.biografiaExtensa.length,(source.biografiaExtensa||[]).length,review.id);
  sections+=en.biografiaExtensa.length;
  assert.equal(translatedEquivalent(`/en/person/${route.en}`,'es'),`/es/persona/${route.es}`);
  if(source.biografia!==source.resumen)assert(COMPLETE_ENGLISH_PROFILES[review.id].biography,review.id+' needs a separate full biography');
 }
 assert.equal(sections,45);
});

test('all seven houses retain their memberships, governments, branches, related houses and sources',async()=>{
 assert.equal(REVIEWED_HOUSES.length,7);
 const people=TRANSLATED_PEOPLE.map(r=>({...completeEnglishProfile(read(`public/personas-meta/${r.es}.json`)),path:`/en/person/${r.en}`}));
 const pages=await englishEntityPages(people);
 for(const t of REVIEWED_HOUSES){
  const source=read(`public/dinastias-meta/${t.es}.json`),en=pages.find(p=>p.key===t.key);
  for(const field of ['miembros','protagonistas','gobiernos','ramas','territorios','casasOrigen','casasDerivadas','casasConectadas','fuentes'])assert.equal(en[field].length,source[field].length,t.key+'/'+field);
  for(const field of ['resumen','origen','trayectoria','legado'])assert(en[field]&&en[field]!==source[field],t.key+'/'+field);
  assert(en.gobiernos.every(g=>!g.nota||g.englishNote));
  assert(en.arms.blazon&&en.arms.autor&&en.arms.licenciaUrl);
 }
});

test('new portraits distinguish workshop and posthumous works and publish every responsive asset',()=>{
 for(const id of ['ISABPORTBORG','GIOVBANDENERE']){
  const image=IMAGENES_PERSONAS[id],p=COMPLETE_ENGLISH_PROFILES[id];
  assert(image.fuenteUrl&&image.derechosUrl&&p.name);
  for(const variant of IMAGE_VARIANTS[image.archivo].variants)assert(fs.existsSync(new URL('../public'+variant.src,import.meta.url)));
 }
 assert.match(IMAGENES_PERSONAS.GIOVBANDENERE.tipo,/póstumo/);
 const p=PERSONAS.find(p=>p.id==='GIOVBANDENERE');assert.equal(p.nombre,'Juan de Médici');assert.equal(p.sobrenombre,'de las Bandas Negras');assert(p.aliases.includes('Giovanni dalle Bande Nere'));
});

test('Bretigny changes sovereignty without deleting local counties; 1429 does not recover Sens or Paris',()=>{
 const data=read('data/cartography/corridor-locations.json');
 const at=year=>europeMosaicAt(data,year,PERSONAS);
 const before=at(1359),treaty=at(1360),later=at(1373);
 for(const id of ['Angouleme','Limoges','Perigueux']){
  assert(!before.byLocation.get(id).some(l=>l.englishCrown),id);
  assert(treaty.byLocation.get(id).some(l=>l.englishCrown),id);
  assert(!later.byLocation.get(id).some(l=>l.englishCrown),id);
  assert.equal(treaty.byLocation.get(id)[0].entityId,before.byLocation.get(id)[0].entityId,id);
 }
 const campaign=at(1429);
 for(const id of ['Sens','Auxerre','Paris','Rouen','Le_Mans'])assert(campaign.byLocation.get(id).some(l=>l.englishCrown),id);
 for(const id of ['Reims','Troyes','Orleans','Laon'])assert(!campaign.byLocation.get(id).some(l=>l.englishCrown),id);
 assert(!at(1430).byLocation.get('Sens').some(l=>l.englishCrown));
});
