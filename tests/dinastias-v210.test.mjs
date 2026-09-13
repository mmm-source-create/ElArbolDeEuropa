import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildDynastyPages,auditDynasties} from '../src/data/dynastyModel.js';
import {canonicalDynasty,canonicalDynastySlug} from '../src/data/dynastyAliases.js';
import {HISTORIA_DINASTIAS,RAMAS_DINASTICAS} from '../src/content/dinastias/index.js';
import {CASAS_V210} from '../src/content/personas/casas-v210.js';
import {SOURCES,SOURCE_PUBLICATIONS,SOURCE_GROUPS,sourcesForPerson,FUENTES_TERRITORIOS} from '../src/content/sources.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {sucesionDe} from '../src/data/sucesion.js';
import {auditDocumentation,documentaryLife,documentaryLifeBounds,formatDocumentaryDate} from '../src/utils/documentaryDates.js';
import {slugBasePersona,slugPublico} from '../src/utils/personLabels.js';

const {PERSONAS}=await import('data:text/javascript;base64,'+fs.readFileSync(new URL('../src/personas.jsx',import.meta.url)).toString('base64'));
const by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
const pages=buildDynastyPages(PERSONAS);

test('las historias y sus ramas tienen personas, territorios y fuentes válidos',()=>{
  assert.equal(Object.keys(HISTORIA_DINASTIAS).length,16);
  assert.equal(pages.filter(p=>p.editorial).length,16);
  assert.deepEqual(auditDynasties(PERSONAS),[]);
  assert.equal(new Set(pages.map(p=>p.slug)).size,pages.length);
  for(const p of pages) {
    assert.equal(p.total,p.miembros.length);
    for(const t of p.territorios)assert.ok(TERRITORIOS[t],t);
    for(const member of [...p.miembros,...p.protagonistas,...p.ramas.flatMap(r=>r.personas)]) {
      const base=slugBasePersona(by[member.id]);
      const count=PERSONAS.filter(p=>slugBasePersona(p)===base).length;
      assert.equal(member.slug,base+(count>1?`-${slugPublico(member.id)}`:''));
    }
  }
  assert.ok(auditDynasties(PERSONAS.filter(p=>p.id!=='ROBERT1DREUX')).some(i=>i.message.includes('ROBERT1DREUX')));
});

test('las transmisiones matrimoniales no se presentan como ramas masculinas',()=>{
  const branch=id=>RAMAS_DINASTICAS.find(r=>r.id===id);
  assert.equal(branch('montfort-bretana').tipo,'rama_cadete');
  assert.equal(by.JOHNMONTPRET.padre,'ARTHUR2BRET');
  assert.equal(by.ROBERT1DREUX.padre,by.LUIS7FRA.padre);
  assert.equal(by.FEL2FRA.padre,'LUIS7FRA');
  assert.equal(branch('foix-grailly').tipo,'continuidad_patrimonial');
  assert.equal(by.JOHN1FOIX.madre,'ISABELLEFOIX');
  assert.equal(by.JOHN1FOIX.padre,'ARCHAMBAUDGRAILLY');
  assert.equal(branch('albret-navarra').tipo,'continuidad_patrimonial');
  assert.equal(by.JUANA2NAV.dinastia,'Capeto');
  assert.equal(canonicalDynasty('Capeto-Évreux'),'Évreux');
  assert.equal(canonicalDynastySlug('capeto-evreux'),'evreux');
  assert.equal(canonicalDynastySlug('foix'),'foix');
});

test('las conexiones bretonas, navarras y pirenaicas se recorren por filiaciones reales',()=>{
  assert.equal(by.ANABRET.madre,'MARGFOIXBRET');
  assert.equal(by.MARGFOIXBRET.madre,'LEONOR1NAV');
  assert.equal(by.MARGFOIXBRET.padre,'GASTON4FOIX');
  assert.equal(by.FRANCOIS2BRET.padre,'RICHARDETAMPES');
  assert.equal(by.RICHARDETAMPES.madre,'JOANNAVBRET');
  assert.equal(by.GERMANAFOIX.madre,'MARIEORLEANSFOIX');
  assert.equal(by.MARIEORLEANSFOIX.padre,'CARLOS1ORLEANS');
  assert.equal(by.MARGBOURBONALBRET.madre,'ISABVAL2');
  assert.equal(by.ROGERBERNARD1CASTEL.padre,by.GASTON2FOIX.padre);
  assert.equal(by.MATTHIEUFOIX.padre,by.ISABELLEFOIX.padre);
});

test('los títulos bretones disputados y los vizcondados se mantienen explícitos',()=>{
  const effective=sucesionDe(PERSONAS,'Bretaña').map(r=>r.persona.id);
  const all=sucesionDe(PERSONAS,'Bretaña',{disputas:true}).map(r=>r.persona.id);
  assert.ok(effective.includes('JOHN4BRET'));
  assert.ok(!effective.includes('CHARLESBLOIS'));
  assert.ok(all.includes('CHARLESBLOIS'));
  for(const id of ['ROGERBERNARD1CASTEL','ROGERBERNARD2CASTEL']) {
    const g=by[id].gobiernos.find(g=>g.territorio==='Castellbó');
    assert.equal(g.clase,'vizcondado');assert.equal(g.titulo,'Vizconde');
  }
  assert.equal(by.MARGUERITEBEARN.gobiernos.find(g=>g.territorio==='Bearne').titulo,'Vizcondesa');
});

test('las 75 minibiografías se vinculan al registro general, sin crear grupos regionales de fuentes',()=>{
  assert.equal(Object.keys(CASAS_V210).length,75);
  for(const [id,bio] of Object.entries(CASAS_V210)) {
    assert.ok(by[id],id);assert.ok(bio.biografia.length>120,id);
    assert.ok(sourcesForPerson(id).length,id);
  }
  assert.equal(SOURCE_PUBLICATIONS.length,28);
  assert.equal(SOURCE_GROUPS.length,4);
  assert.equal(new Set(SOURCES.map(s=>s.url)).size,SOURCES.length);
  for(const t of ['Albret','Dreux','Bearne','Penthièvre','Castellbó'])assert.ok(FUENTES_TERRITORIOS[t]?.length,t);
});

test('los intervalos y límites documentales conservan la precisión y rechazan contradicciones',()=>{
  assert.deepEqual(auditDocumentation(PERSONAS),[]);
  assert.equal(documentaryLife(by.ALIXTHOUARS),'1200–1201 · 1221');
  assert.equal(formatDocumentaryDate(by.ARCHAMBAUDGRAILLY,'nac'),'c. 1330');
  const p={id:'TEST',nac:1201,muer:1250,documentacion:{fechas:{nac:{tipo:'intervalo',desde:1200,hasta:1202,nota:'Dos dataciones conocidas.'}}}};
  assert.deepEqual(documentaryLifeBounds(p),[1200,1250]);
  assert.deepEqual(documentaryLifeBounds({nac:1201,muer:1250}),[1201,1250]);
  assert.equal(documentaryLifeBounds({}),null);
  assert.deepEqual(documentaryLifeBounds({},[{desde:1210,hasta:1220}]),[1210,1220]);
  assert.deepEqual(auditDocumentation([p]),[]);
  const invalid=structuredClone(p);invalid.documentacion.fechas.nac.hasta=1199;
  assert.ok(auditDocumentation([invalid]).length);
  const outside=structuredClone(p);outside.nac=1190;
  assert.ok(auditDocumentation([outside]).length);
  const before={...p,documentacion:{fechas:{nac:{tipo:'antes',hasta:1202,nota:'Solo consta este límite.'}}}};
  assert.equal(formatDocumentaryDate(before,'nac'),'antes de 1202');
  assert.deepEqual(documentaryLifeBounds(before),[-Infinity,1250]);
  before.nac=1202;assert.ok(auditDocumentation([before]).length);
  const after={...p,documentacion:{fechas:{muer:{tipo:'despues',desde:1249,nota:'Última constancia.'}}}};
  assert.equal(formatDocumentaryDate(after,'muer'),'después de 1249');
  assert.deepEqual(documentaryLifeBounds(after),[1201,Infinity]);
  after.muer=1249;assert.ok(auditDocumentation([after]).length);
});
