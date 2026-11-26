import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {V636_RECORDS} from '../src/content/v636/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {contenidoPersona} from '../src/content/personas/index.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {PORTRAITS_636} from '../src/data/imagenesPersonas636.js';
import {PORTRAITS_636_EN} from '../src/features/english/portraits636.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {RELEASE_636_REVIEWS} from '../src/evidence/release636Reviews.js';
import {personClaims} from '../src/evidence/claims.js';
import {familyGaps} from '../scripts/audits/audit-family-gaps.mjs';
import {resolveHostingRoute} from '../cloudflare/routing.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const manifest=read('src/content/v636/manifest.json'),people=new Map(PERSONAS.map(p=>[p.id,p]));

test('6.3.6 publishes every new person and the revised biographies in both languages',()=>{
 assert.equal(manifest.newIds.length,12);
 for(const [id,r] of Object.entries(V636_RECORDS)){
  const es=contenidoPersona(id),en=COMPLETE_ENGLISH_PROFILES[id];
  assert(people.has(id)&&es?.resumen&&en?.summary,id);
  assert(r.resumen.length>70&&r.summary.length>70,id);
  assert.equal(en.sections.length,r.parts.length,id);
  assert(r.parts.every(p=>p.length===4&&p.every(s=>typeof s==='string'&&s.length>2)),id);
  assert(r.refs.every(f=>/^https:\/\//.test(f.url)),id);
  assert(TRANSLATED_PEOPLE.some(p=>p.id===id),id);
  if(manifest.newIds.includes(id)||['ALFONSO1ESTE','ALFONSO2NAP','ALFONSOBISCEGLIE','SANCIABORGIA','TAMARGEO','DAVID6GEO','DEMETRIO2GEO','GIORGI12GEO'].includes(id))assert(r.parts.length>=3,id);
 }
});

test('the bounded first batch connects nine existing children to their missing parent',()=>{
 const expected={TAMARGEO:['madre','BURDUKHANALANIA'],DAVID6GEO:['padre','GHIASADDINRUSUDAN'],DEMETRIO2GEO:['madre','GVANTSAKAKHABERIDZE'],VAKHTANG6KARTLI:['madre','TUTAGURIELI'],TAMARKARTLI:['madre','RUSUDANCIRCASIA'],GIORGI12GEO:['madre','ANNAABASHIDZE'],HELENAEREKLE:['madre','DAREJANDADIANI'],ALFONSOMONTECCHIOESTE:['madre','LAURADIANTI'],FRANCESCO2ESTE:['madre','LAURAMARTINOZZI']};
 for(const [id,[field,parent]] of Object.entries(expected)){
  assert.equal(people.get(id)[field],parent,id);
  const claim=personClaims(people.get(id)).find(c=>c.field===(field==='madre'?'Madre':'Padre'));
  assert(claim.sources.some(s=>s.locator&&s.locatorEn),id);
 }
 assert.equal(people.get('ALFONSO1ESTE').padre,'HERC1ESTE');assert.equal(people.get('ALFONSO1ESTE').madre,'LEONORNAP');
 assert.equal(people.get('MAXIMILIANOSFORZA').madre,'BEATEST');
 for(const id of manifest.newIds)for(const spouse of people.get(id).conyuges||[])assert(people.get(spouse).conyuges.includes(id),id+' '+spouse);
 assert.deepEqual(people.get('LAURADIANTI').amantes,['ALFONSO1ESTE']);assert(!people.get('LAURADIANTI').conyuges);
 assert(!people.get('DAREJANDADIANI').padre,'Disputed paternal identity is not assigned');
});

test('the full inventory remains reproducible and separates candidates from established marriages',()=>{
 const before=read('docs/audits/6.3.6-family-gaps-before.json'),after=read('docs/audits/6.3.6-family-gaps-after.json');
 assert.deepEqual(familyGaps(PERSONAS),after);
 assert.equal(before.counts.singleParentChildren,439);assert.equal(after.counts.singleParentChildren,431);
 assert.equal(before.singleParentChildren.filter(p=>!after.singleParentChildren.some(q=>q.id===p.id)).length,9);
 assert(after.parentsWithoutSpouse.some(p=>p.id==='LAURADIANTI'));
 assert(after.rootsMissingDates.some(p=>p.id==='TUTAGURIELI'));
 assert(!after.rootsMissingDates.some(p=>p.id==='HELENADRAGAS'||p.id==='BAYEZID1OSM'));
 for(const lang of ['es','en']){const report=fs.readFileSync(new URL(`../docs/audits/6.3.6-family-gaps.${lang}.md`,import.meta.url),'utf8');for(const p of before.singleParentChildren)assert(report.includes(p.id),p.id);}
});

test('Sancha/Sancia is one person and every retired personal URL permanently redirects',()=>{
 assert(!people.has('SANCHAARAG'));assert(!COMPLETE_ENGLISH_PROFILES.SANCHAARAG);
 assert.deepEqual(people.get('GOFFREDOBORJA').conyuges,['SANCIABORGIA']);
 assert.equal(people.get('SANCIABORGIA').madre,'TROAGIAAGAZELA');
 for(const path of ['/es/persona/sancha-de-aragon','/persona/sancha-de-aragon','/en/person/sancha-of-aragon'])for(const suffix of ['','/']){
  const result=resolveHostingRoute(new URL('https://www.treeofeurope.eu'+path+suffix));
  assert([301,308].includes(result.status));assert.equal(result.redirect,path.startsWith('/en')?'/en/person/sancia-of-aragon':'/es/persona/sancia-de-aragon');
 }
});

test('claim reviews attach to real individual facts and retain approximate or disputed dates',()=>{
 const claims=new Map(PERSONAS.flatMap(p=>personClaims(p)).map(c=>[c.id,c]));
 for(const [id,r] of Object.entries(RELEASE_636_REVIEWS)){
  assert(claims.has(id),id);assert(r.sources.every(s=>s.url&&s.locator&&s.locatorEn),id);
  assert((r.alternatives||[]).every(s=>typeof s==='string'),id);
 }
 assert.equal(claims.get('person:BAYEZID1OSM:birth').certainty,'disputed');
 assert.equal(people.get('BAYEZID1OSM').padre,'MURAD1OSM');assert.equal(people.get('HELENADRAGAS').nacAprox,true);
 for(const id of ['TUTAGURIELI','GHIASADDINRUSUDAN','ANNAABASHIDZE','DAREJANDADIANI'])assert(!Number.isInteger(people.get(id).nac),id);
 assert.equal(people.get('ALFONSOBISCEGLIE').nacAprox,true);
 const max=people.get('MAXIMILIANOSFORZA').gobiernos[0];assert.deepEqual([max.territorio,max.desde,max.hasta],['Milán',1512,1515]);
 const regency=people.get('LAURAMARTINOZZI').gobiernos[0];assert.equal(regency.condicion,'gobierno delegado');assert.equal(regency.soberano,'FRANCESCO2ESTE');
});

test('chosen images have bilingual provenance and responsive files, without fabricated likenesses',()=>{
 assert.equal(Object.keys(PORTRAITS_636).length,9);
 for(const [id,image] of Object.entries(PORTRAITS_636)){
  assert.deepEqual(IMAGENES_PERSONAS[id],image,id);assert(PORTRAITS_636_EN[id].autor&&PORTRAITS_636_EN[id].obra,id);
  assert(image.autor&&image.fuenteUrl&&image.derechos&&image.fecha,id);
  assert(fs.existsSync(new URL('../public'+image.archivo,import.meta.url)),id);
  assert(IMAGE_VARIANTS[image.archivo]?.variants.length,id);
 }
 assert.match(PORTRAITS_636.LUCRECIABORJA.fuenteUrl,/Dosso_DOSSI/);assert.match(PORTRAITS_636.LUCRECIABORJA.autor,/atribuido/);
 assert.match(PORTRAITS_636.ALFONSO1ESTE.autor,/Battista Dossi/);
 assert.match(PORTRAITS_636.MARTINCORTESALBACAR.tipo,/Ilustración/);
 for(const id of ['JERONIMOAYANZ','ALFONSOBISCEGLIE','SANCIABORGIA'])assert(!PORTRAITS_636[id],id);
});
