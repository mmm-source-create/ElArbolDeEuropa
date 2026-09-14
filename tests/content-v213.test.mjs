import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {ALPES_V213} from '../src/content/personas/alpes-v213.js';
import {SOURCES,SOURCE_PUBLICATIONS,sourcesForPerson} from '../src/content/sources.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {auditarTerritorios} from '../src/data/auditTerritorios.js';
import {sucesionDe} from '../src/data/sucesion.js';
import {RELEVOS_ALPES} from '../src/content/sucesiones/alpes-v213.js';
const by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
test('las cincuenta biografías alpinas tienen contenido y referencias individuales únicas',()=>{
 assert.equal(Object.keys(ALPES_V213).length,50);
 for(const [id,c]of Object.entries(ALPES_V213)){assert.ok(by[id]);assert.ok(c.biografia.length>150,id);assert.ok(sourcesForPerson(id).length,id);}
 assert.equal(new Set(SOURCES.map(s=>s.url)).size,SOURCES.length);assert.equal(SOURCE_PUBLICATIONS.filter(s=>s.titulo==='Treccani').length,1);
});
test('Saluzzo enlaza por filiaciones con Saboya, Monferrato y Sicilia',()=>{
 assert.equal(by.TOMAS1SAL.madre,'BEATSAB');assert.equal(by.TOMAS1SAL.padre,'MANF3SAL');assert.ok(by.BEATSAB.conyuges.includes('MANFSIC'));
 assert.equal(by.LUDOVICO2SAL.madre,'ISABELMONSAL');assert.equal(by.ISABELMONSAL.madre,'GIOVANNASABMON');assert.equal(by.GIOVANNASABMON.padre,'AMEDEO7SAB');
 assert.equal(by.TEODORO1MON.padre,'ANDRO2');assert.equal(by.TEODORO1MON.madre,'VIOLANTEMONBYZ');assert.equal(by.MARGPALEO.padre,'GUGL9MON');
 assert.equal(TERRITORIOS.Saluzzo.clase,'marquesado');
});
test('los gobiernos de la actualización distinguen minoría, regencia, pretensión y rango',()=>{
 assert.equal(by.CARLOSGIOAMEDSAB.padre,'CARLOS1SAB');assert.equal(by.BIANCAMONSAB.gobiernos[0].condicion,'regencia');
 assert.ok(!sucesionDe(PERSONAS,'Saluzzo').some(r=>r.persona.id==='JUANLUDSAL'));assert.ok(sucesionDe(PERSONAS,'Saluzzo',{disputas:true}).some(r=>r.persona.id==='JUANLUDSAL'));
 assert.equal(by.GUILLERMOGONZAGA.gobiernos.find(g=>g.territorio==='Monferrato'&&g.desde===1550).titulo,'Marqués');
 assert.deepEqual(auditarTerritorios(PERSONAS).filter(i=>i.severity==='ERROR'),[]);
 const invalid={id:'invalid',gobiernos:[{territorio:'Saluzzo',titulo:'Gobernadora',clase:'gobierno',condicion:'efectivo',desde:1500,hasta:1501}]};
 assert.ok(auditarTerritorios([invalid]).some(i=>i.code==='TERRITORY_CLASS_MISMATCH'));
 invalid.gobiernos[0].condicion='regencia';assert.deepEqual(auditarTerritorios([invalid]),[]);
 assert.equal(RELEVOS_ALPES.length,17);
});
test('cada rewrite conserva su variante con barra y los mismos requisitos de query',()=>{
 const {rewrites}=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url)));
 for(const rule of rewrites.filter(r=>r.source!=='/'&&!r.source.endsWith('/'))){const sibling=rewrites.find(r=>r.source===rule.source+'/'&&r.destination===rule.destination);assert.ok(sibling,rule.source);assert.deepEqual(sibling.has,rule.has);}
});
