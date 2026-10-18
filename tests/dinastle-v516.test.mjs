import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS,EVENTOS_HISTORICOS} from '../src/data/historias.js';
import {buildDinastleModel,dailyDinastle,dinastleDay,familyDistance,compareDinastle,restoreDinastle,submitDinastle,dinastleShare} from '../src/features/desafio/dinastleEngine.js';
const model=buildDinastleModel(PERSONAS,HISTORIAS,EVENTOS_HISTORICOS);
test('daily roster uses existing editorial people with comparable data and visits every candidate before repeating',()=>{
 assert(model.eligible.length>100&&model.eligible.length<PERSONAS.length/2);
 for(const e of model.eligible){assert(e.house);assert(Number.isInteger(e.year));assert(e.roles.length);assert(e.territories.length);assert(PERSONAS.includes(e.person));}
 const days=Array.from({length:model.eligible.length},(_,i)=>new Date(Date.UTC(2026,9,15+i,12)).toISOString().slice(0,10));
 assert.equal(new Set(days.map(d=>dailyDinastle(model,d).id)).size,model.eligible.length);
 assert.equal(dailyDinastle(model,'2026-10-15').id,dailyDinastle(model,'2026-10-15').id);
});
test('daily rollover follows Madrid with daylight-saving changes instead of local UTC offsets',()=>{
 assert.equal(dinastleDay(new Date('2026-10-14T21:59:59Z')),'2026-10-14');
 assert.equal(dinastleDay(new Date('2026-10-14T22:00:00Z')),'2026-10-15');
 assert.equal(dinastleDay(new Date('2026-12-14T23:00:00Z')),'2026-12-15');
});
test('filiation does not take shortcuts through marriage or an episode',()=>{
 const people=[{id:'a',nombre:'A',dinastia:'Capeto',nac:1400,titulo:'Artista',reinos:['Francia']},{id:'b',nombre:'B',dinastia:'Médici',nac:1400,titulo:'Artista',reinos:['Italia'],conyuges:['a']},{id:'c',nombre:'C',dinastia:'Capeto',nac:1420,titulo:'Artista',padre:'a',reinos:['Francia']}];
 const m=buildDinastleModel(people,[],[{personas:['b','c']}]);
 assert.equal(familyDistance(m,'a','c'),1);assert.equal(familyDistance(m,'a','b'),null);
 assert.match(compareDinastle(m,m.byId.get('a'),m.byId.get('b'))[4].label,/Matrimonio/);
 assert.match(compareDinastle(m,m.byId.get('b'),m.byId.get('c'))[4].label,/episodio/);
});
test('regional folders never count as a dynasty, and absent data never count as a miss',()=>{
 const m=buildDinastleModel([{id:'a',nombre:'A',dinastia:'Médici',titulo:'Artista',nac:1450,nacAprox:true,reinos:['Florencia']},{id:'b',nombre:'B',dinastia:'Este',titulo:'Artista',nac:1450,reinos:['Ferrara']},{id:'c',nombre:'C',dinastia:'Desconocida',titulo:'',reinos:[]}]);
 const [house,territory,,year]=compareDinastle(m,m.byId.get('a'),m.byId.get('b'));
 assert.equal(house.status,'miss');assert.equal(territory.status,'near');assert.equal(year.status,'near');
 for(const c of compareDinastle(m,m.byId.get('c'),m.byId.get('a')))assert.equal(c.status,'unknown');
});
test('a sovereign and a consort do not become the same function',()=>{
 const queen={id:'queen',nombre:'Reina',dinastia:'Tudor',titulo:'Reina',nac:1500,reinos:['Inglaterra'],gobiernos:[{territorio:'Inglaterra',desde:1520,hasta:1540,titulo:'Reina',condicion:'efectivo'}]};
 const consort={id:'consort',nombre:'Consorte',dinastia:'Tudor',titulo:'Reina consorte',nac:1501,reinos:['Inglaterra']};
 const m=buildDinastleModel([queen,consort]);assert.equal(compareDinastle(m,m.byId.get('queen'),m.byId.get('consort'))[2].status,'miss');
});
test('saved games are validated, completion counts once, free play does not count and shares hide the answer',()=>{
 const day='2026-10-15',initial=restoreDinastle(null,model,day),secret=model.byId.get(initial.secret),guess=model.entries.find(e=>e.id!==secret.id);
 let state=submitDinastle(initial,guess.id);state=submitDinastle(state,secret.id);
 assert.equal(state.stats.played,1);assert.equal(state.stats.won,1);assert.equal(submitDinastle(state,guess.id),state);
 const text=dinastleShare(model,state);assert(!text.includes(secret.person.nombre));assert.match(text,/🟩/);
 assert.deepEqual(restoreDinastle(state,model,day).guesses,state.guesses);
 assert.equal(restoreDinastle({...state,secret:'missing'},model,day).guesses.length,0);
 assert.equal(restoreDinastle(state,model,'2026-10-16').guesses.length,0);
 const free=submitDinastle({...initial,daily:false},initial.secret);assert.equal(free.stats.played,0);
 const next=submitDinastle(restoreDinastle(state,model,'2026-10-16'),dailyDinastle(model,'2026-10-16').id);assert.equal(next.stats.streak,2);
 const skipped=submitDinastle(restoreDinastle(state,model,'2026-10-18'),dailyDinastle(model,'2026-10-18').id);assert.equal(skipped.stats.streak,1);
});
