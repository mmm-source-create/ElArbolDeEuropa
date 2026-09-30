import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {CLAIM_REVIEWS,PILOT_PERSON_IDS,citationText,coverageTasks,hasDocumentedClaim,personClaims} from '../src/evidence/claims.js';
import {sanitizeSession,shouldResumeAtlas} from '../src/explorer/atlasSession.js';

const byId=new Map(PERSONAS.map(person=>[person.id,person]));

test('las referencias del piloto apuntan a afirmaciones existentes y a un pasaje localizado',()=>{
  assert.equal(PILOT_PERSON_IDS.length,13);
  for(const id of PILOT_PERSON_IDS)assert.ok(byId.has(id),id);
  const reviewed=new Set();
  for(const [id,review] of Object.entries(CLAIM_REVIEWS).filter(([id])=>!id.includes('GERALD8KILDARE'))){
    const personId=id.split(':')[1];
    const claim=personClaims(byId.get(personId)).find(item=>item.id===id);
    assert.ok(claim,`No existe la afirmación ${id}`);
    assert.ok(review.sources.length,`${id} no tiene fuente`);
    for(const source of review.sources){
      const allowedHosts=new Set(['historia-hispanica.rah.es','pares.cultura.gob.es','www.lombardiabeniculturali.it','www.mcu.es','www.habsburger.net','ccfr.bnf.fr','www.rijksmuseum.nl','luxembourg.public.lu','citadelle.namur.be','www.canonvannederland.nl','www.archieven.nl','www.dbnl.org','catalogue.bnf.fr','sigilla.irht.cnrs.fr','orbi.uliege.be','connaitrelawallonie.wallonie.be','portail.biblissima.fr']);
      assert.ok(allowedHosts.has(new URL(source.url).hostname),source.url);
      assert.ok(source.locator);
    }
    if(review.exactDate)assert.equal(Number(review.exactDate.slice(0,4)),claim.value);
    reviewed.add(personId);
  }
  assert.ok(reviewed.size>=9);
  assert.ok(Object.keys(CLAIM_REVIEWS).length>=45);
});

test('el filtro exige al menos una afirmación documentada y con fuente individual',()=>{
  assert.equal(hasDocumentedClaim(byId.get('CARLOS5')),true);
  assert.equal(hasDocumentedClaim(byId.get('FEL3ESP')),true);
  assert.equal(hasDocumentedClaim({id:'sin-revisiones',nac:1500,muer:1510}),false);
  assert.equal(hasDocumentedClaim(null),false);
  assert.equal(sanitizeSession({version:1,soloDocumentados:true}).soloDocumentados,true);
  assert.equal(sanitizeSession({version:1,soloDocumentados:'true'}).soloDocumentados,false);
  assert.equal(shouldResumeAtlas('/es/?continuar=1&evidencia=1'),false);
});

test('Milán y los títulos italianos de los Austrias reflejan los hitos contrastados',()=>{
  const govt=(id,territory)=>personClaims(byId.get(id)).filter(c=>c.field==='Gobierno'&&c.value.territorio===territory);
  const milanCarlos=govt('CARLOS5','Milán');
  assert.equal(milanCarlos.length,1);
  assert.equal(milanCarlos[0].interval.from,1535);
  assert.equal(milanCarlos[0].certainty,'inferred');
  const milanFelipe=govt('FEL2ESP','Milán');
  assert.deepEqual(milanFelipe.map(c=>c.interval.from).sort(),[1546,1556]);
  assert.equal(milanFelipe.find(c=>c.interval.from===1546).certainty,'disputed');
  assert.equal(milanFelipe.find(c=>c.interval.from===1556).certainty,'documented');
  for(const id of ['CARLOS5','FEL2ESP','FEL3ESP','FEL4ESP','CARLOS2ESP'])assert.equal(govt(id,'Cerdeña').length,1,id);
  assert.equal(govt('JUANA1CAST','Cerdeña')[0].value.condicion,'titular');
  for(const territory of ['Milán','Nápoles','Trinacria','Cerdeña'])assert.equal(govt('CARLOS2ESP',territory).length,1,territory);
  const ferdinandHungary=govt('FERN1EMP','Hungría')[0];
  assert.equal(ferdinandHungary.value.condicion,'rama');
  assert.match(ferdinandHungary.value.ambito,/Noroeste/);
  for(const [territory,year] of [['Bohemia',1646],['Hungría',1647],['Alemania',1653]]){
    const claims=govt('FERN4BOH',territory);
    assert.equal(claims.length,1,territory);
    assert.equal(claims[0].interval.from,year);
    assert.equal(claims[0].value.condicion,'corregente');
    assert.equal(claims[0].certainty,'documented');
  }
  assert.equal(govt('FERN4BOH','Sacro Imperio').length,0);
});

test('las discrepancias no se convierten en fechas documentadas ni se ocultan en la cita',()=>{
  const fernando=personClaims(byId.get('FERN2ARAG')).find(item=>item.field==='Nacimiento');
  assert.equal(fernando.certainty,'disputed');
  assert.equal(fernando.exactDate,null);
  assert.equal(fernando.sources.length,2);
  assert.match(citationText(fernando,'Fernando II'),/1452-03-10.*1452-05-10/);
  const juana=personClaims(byId.get('JUANA1CAST'));
  assert.equal(juana.find(item=>item.field==='Gobierno'&&item.value.territorio==='Castilla').certainty,'documented');
  assert.equal(juana.find(item=>item.field==='Gobierno'&&item.value.territorio==='Navarra').certainty,'disputed');
  assert.equal(juana.find(item=>item.field==='Gobierno'&&item.value.territorio==='Nápoles').certainty,'disputed');
  const carlos=personClaims(byId.get('CARLOS5'));
  assert.equal(carlos.find(item=>item.field==='Gobierno'&&item.value.territorio==='Castilla').certainty,'inferred');
  assert.equal(carlos.find(item=>item.field==='Gobierno'&&item.value.territorio==='Sacro Imperio').certainty,'disputed');
  assert.ok(coverageTasks(PERSONAS,Infinity,TERRITORIOS).some(task=>task.kind==='conflict'&&task.personId==='JUANA1CAST'));
});

test('la fecha incierta no se transforma en fecha exacta y la cita utiliza nombres y localizadores',()=>{
  const uncertain=personClaims(byId.get('ISABPORT3')).find(item=>item.field==='Nacimiento');
  assert.equal(uncertain.certainty,'approximate');
  assert.equal(uncertain.interval.precision,'circa');
  assert.equal(uncertain.timeLabel,'¿1428?');
  assert.equal(uncertain.exactDate,null);
  const carlos=byId.get('CARLOS5');
  const father=personClaims(carlos).find(item=>item.field==='Padre');
  const text=citationText(father,carlos.nombre,'es',id=>byId.get(id)?.nombre);
  assert.match(text,/Felipe I de Castilla/);
  assert.match(text,/Biografía, párrafo 1/);
  assert.doesNotMatch(text,/FEL1CAST/);
  assert.ok(personClaims(carlos).some(item=>item.field==='Gobierno'&&item.certainty==='pending'));
});

test('la cola editorial separa revisión pendiente de posible error y enlaza huecos territoriales',()=>{
  const tasks=coverageTasks(PERSONAS,Infinity,TERRITORIOS);
  assert.ok(tasks.some(task=>task.kind==='government'&&task.status==='not_researched'));
  assert.ok(tasks.some(task=>task.kind==='territory_gap'&&task.territory));
  assert.ok(tasks.every(task=>task.status!=='possible_error'||['chronology','conflict'].includes(task.kind)));
  assert.equal(new Set(tasks.map(task=>task.id)).size,tasks.length);
});
