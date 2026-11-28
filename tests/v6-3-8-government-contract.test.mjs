import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {TERRITORIOS,TITULOS_POR_CLASE} from '../src/data/territorios.js';
import {auditarTerritorios} from '../scripts/audits/lib/auditTerritorios.js';
import {authorityKind} from '../src/domain/government/authorityKind.js';
const errorCodes=government=>auditarTerritorios([{id:'DELEGATE',nombre:'Delegado',reinos:[government.territorio],gobiernos:[government]}]).filter(i=>i.severity==='ERROR').map(i=>i.code);
const viceroy={territorio:'Portugal',desde:1583,hasta:1593,titulo:'Virrey',clase:'gobierno',condicion:'gobierno delegado',soberano:'MONARCH'};

test('638: a viceroyalty is a delegated office over an existing kingdom, not a change in its rank',()=>{
 assert.deepEqual(errorCodes(viceroy),[]);
 assert.equal(authorityKind(viceroy,1585),'delegated');
 assert.equal(TERRITORIOS.Portugal.clase,'reino');
 const albert=PERSONAS.find(p=>p.id==='ALB7AUST');
 const government=albert.gobiernos.find(g=>g.titulo==='Virrey'&&g.territorio==='Portugal');
 assert.equal(government.soberano,'FEL2ESP');assert.equal(authorityKind(government,1585),'delegated');
});
test('638: a viceroy without a different delegating sovereign is rejected',()=>{
 for(const update of [{soberano:undefined},{soberano:'DELEGATE'},{condicion:'efectivo'}]){
  assert(errorCodes({...viceroy,...update}).includes('DELEGATED_SOVEREIGN_MISSING'));
 }
 assert(errorCodes({...viceroy,clase:'reinado'}).includes('TITLE_CLASS_MISMATCH'));
});
test('638: the Forelands permit Maria Theresa’s feminine title without making it a general government title',()=>{
 const maria=PERSONAS.find(p=>p.id==='MARIATERESAHAB');
 const government=maria.gobiernos.find(g=>g.territorio==='Austria Anterior');
 assert(TERRITORIOS['Austria Anterior'].titulosDeGobierno.includes('Archiduquesa'));
 assert(!TITULOS_POR_CLASE.gobierno.includes('Archiduquesa'));
 assert.deepEqual(errorCodes(government),[]);
 assert(errorCodes({...government,territorio:'Tirol'}).includes('TITLE_CLASS_MISMATCH'));
});
