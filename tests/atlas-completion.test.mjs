import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {atlasFilterOptions} from '../src/domain/filters/atlasFilters.js';
import {PERSONAS} from '../src/data/personas.js';
import {HOUSE_PARENTS} from '../src/content/dinastias/houseRelations.js';
import {GRUPOS_DINASTICOS_GENEALOGICOS} from '../src/domain/genealogy/dynasties.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {mapAuthoritiesForPerson,mapAuthoritiesAcrossLife} from '../src/cartography/mapAuthorities.js';
import {authorityColor} from '../src/cartography/mapColors.js';
import {colorTerritorioEnMapa} from '../src/cartography/kingdomMaps.js';
import {ATLAS_TUTORIAL,tutorialProgress} from '../src/content/atlasTutorial.js';
import {personClaims} from '../src/evidence/claims.js';
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
const entries=(id,y,dependencies=true)=>mapAuthoritiesForPerson(people.get(id),y,data,{includeDependencies:dependencies});

test('the full tutorial preserves old progress and matching stable steps in both languages',()=>{
 for(const locale of ['es','en']){
  const courses=ATLAS_TUTORIAL[locale].courses;
  assert.equal(courses.length,8);assert.equal(courses.flatMap(c=>c.steps).length,33);
  assert.equal(new Set(courses.map(c=>c.id)).size,8);
  for(const c of courses){assert.equal(new Set(c.steps.map(s=>s.id)).size,c.steps.length);for(const s of c.steps){assert(s.title&&s.body&&s.label&&s.result);assert(s.action||s.href);}}
 }
 assert.deepEqual(ATLAS_TUTORIAL.es.courses.map(c=>[c.id,c.steps.map(s=>s.id)]),ATLAS_TUTORIAL.en.courses.map(c=>[c.id,c.steps.map(s=>s.id)]));
 const old={courses:{familia:{step:'anadir',complete:false},tiempo:{step:'cronologia',complete:true}}};
 assert.deepEqual(tutorialProgress(old).courses.familia,old.courses.familia);
});
test('Capet navigation is acyclic, follows immediate branches and supplies a credited coat to every represented branch',()=>{
 for(const h of GRUPOS_DINASTICOS_GENEALOGICOS.Capeto){
  assert(PERSONAS.some(p=>p.dinastia===h));assert(escudoDe(h)?.imagen?.fuente,h);
  const walk=(name,path=[])=>{assert(!path.includes(name),path.join(' > '));for(const parent of HOUSE_PARENTS[name]||[])walk(parent,[...path,name]);};walk(h);
 }
 const filters=atlasFilterOptions(PERSONAS);
 for(const h of GRUPOS_DINASTICOS_GENEALOGICOS.Capeto)for(const parent of HOUSE_PARENTS[h]||[])assert(filters.ramasPorPrincipal[parent]?.includes(h),h+' reachable from its immediate origin');
 assert(!filters.ramasPorPrincipal.Capeto.includes('Clermont'));
 assert(!filters.ramasPorPrincipal.Valois.includes('Valois-Angulema'));
 assert.deepEqual(HOUSE_PARENTS['Valois-Anjou'],['Valois']);
 assert.deepEqual(HOUSE_PARENTS['Valois-Angulema'],['Valois-Orleans']);
 assert.deepEqual(HOUSE_PARENTS['Borbón-Orleans-Gastón'],['Borbón']);
 assert.equal(HOUSE_PARENTS.Clermont,undefined);
 for(const [id,house]of Object.entries({BALDWIN4JER:'Anjou-Gâtinais',LUIS1:'Anjou-Hungría',RENATOANJOU:'Valois-Anjou',AGNESCOURJER:'Courtenay-Edesa',CATVALCOUR:'Valois',MARGBORB:'Dampierre',FELIPE2ORLEANS:'Borbón-Orleans',GASTONORLEANS:'Borbón-Orleans-Gastón',ROB1CLER:'Borbón',ROB1ART:'Artois',EUDES3BORG:'Borgoña'}))assert.equal(people.get(id).dinastia,house,id);
 assert.equal(escudoDe('Borbón-Orleans-Gastón').imagen.archivo,escudoDe('Borbón-Orleans').imagen.archivo);
 assert.match(escudoDe('Borbón').imagen.titulo,/Robert de Clermont/);
 assert.match(escudoDe('Valois-Alençon').imagen.titulo,/Pierre dAlencon/);
 assert.match(escudoDe('Luxemburgo').imagen.titulo,/Counts of Luxembourg/);
});
test('Angevin interior appears as dated dependencies, never as invented direct governments',()=>{
 const henry=entries('HENRY2ING',1180);
 for(const id of ['Gueret','Angouleme','Limoges','Perigueux','Turenne','Ventadour','Nerac','Auch','Riom']){
  assert(henry.some(e=>e.kind==='fief'&&e.ids.includes(id)),id);
  assert(!entries('HENRY2ING',1180,false).some(e=>e.ids.includes(id)),id+' dependencies switch');
 }
 assert(!entries('RICARDO1ING',1190).some(e=>e.kind==='fief'&&e.ids.includes('Riom')),'Auvergne rights ceded in 1189');
 assert(entries('RICARDO1ING',1190).some(e=>e.kind==='fief'&&e.ids.includes('Limoges')));
 assert(!entries('RICARDO1ING',1199).some(e=>e.kind==='fief'&&e.ids.includes('Limoges')),'Limoges defection');
 assert(entries('JUANSINTIERRA',1200).some(e=>e.kind==='fief'&&e.ids.includes('Perigueux')));
 assert(!entries('JUANSINTIERRA',1204).some(e=>e.kind==='fief'&&e.ids.includes('Perigueux')));
 assert(!henry.some(e=>e.ids.includes('Toulouse')),'Toulouse is not filled as an Angevin province');
 assert(!people.get('HENRY2ING').gobiernos.some(g=>g.territorio==='Vizcondado de Limoges'));
});
test('Tyrol follows the predominant lifetime colour while dated Austrian transfers stay intact',async()=>{
 const p=people.get('CARLOS5'),life=await mapAuthoritiesAcrossLife(p,data);
 assert.equal(life.find(e=>e.territory==='Tirol').color,life.find(e=>e.territory==='Austria').color);
 const color=(t,y)=>{const e=entries('CARLOS5',y).find(e=>e.territory===t);return e&&authorityColor(e,colorTerritorioEnMapa(p,t,y));};
 assert.equal(color('Tirol',1521),color('Austria',1521));
 assert.notEqual(colorTerritorioEnMapa(p,'Tirol',1522),colorTerritorioEnMapa(p,'Austria',1522));
 assert(!entries('CARLOS5',1523).some(e=>e.territory==='Tirol'));
});
test('Castiglione has documented family claims without fabricated territorial rule',()=>{
 const p=people.get('BALDASSARECASTIGLIONE');
 assert.equal(p.padre,'CRISTOFOROCASTIGLIONE');assert.equal(p.madre,'LUIGIAGONZAGACASTIGLIONE');
 assert.deepEqual(p.conyuges,['IPPOLITATORELLI']);assert.equal(p.gobiernos?.length||0,0);
 const claims=personClaims(p);for(const key of ['father','mother','spouse:IPPOLITATORELLI']){const claim=claims.find(c=>c.id==='person:BALDASSARECASTIGLIONE:'+key);assert(claim?.sources.length,key);}
 assert.equal(claims.find(c=>c.id==='person:BALDASSARECASTIGLIONE:birth').exactDate,'1478-12-06');
 for(const id of [p.padre,p.madre,...p.conyuges])assert(people.has(id));
});
