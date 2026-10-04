import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {idsDeGobiernoEnAño,idsDeReinoEnAño} from '../src/Territorios.jsx';
import {buildPoliticalMapIndex,inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {personClaims} from '../src/evidence/claims.js';

const byId=Object.fromEntries(PERSONAS.map(person=>[person.id,person]));
const rulers=(region,year)=>inspectMapRegion(region,year,buildPoliticalMapIndex(PERSONAS,year)).entries.map(entry=>entry.person?.id);
const government=(id,territory,year)=>byId[id].gobiernos.find(g=>g.territorio===territory&&g.desde<=year&&year<=g.hasta);

test('Baviera deja de absorber Franconia, Suabia, Salzburgo y Tirol',()=>{
  const bavaria=idsDeReinoEnAño('Baviera',1506);
  for(const id of ['Main_Franconia','Frankenwald','Swabian_Alb','Schaunberg','Salzburger_Land','Unterinntal','Upper_Carinthia']) assert.ok(!bavaria.includes(id),id);
  assert.ok(bavaria.includes('Munchner_Schotterebene'));
  assert.ok(!idsDeReinoEnAño('Baviera',1627).includes('Oberpfalzer_Wald'));
  assert.ok(idsDeReinoEnAño('Baviera',1628).includes('Oberpfalzer_Wald'));
  assert.ok(idsDeReinoEnAño('Palatinado',1627).includes('Oberpfalzer_Wald'));
  assert.ok(!idsDeReinoEnAño('Palatinado',1628).includes('Oberpfalzer_Wald'));
});

test('la partición de 1392 limita cada rama antes de la reunión de 1505',()=>{
  assert.deepEqual(idsDeGobiernoEnAño(government('ENRIQUE13','Baviera',1270),1270,'ENRIQUE13'),[]);
  const munich=idsDeGobiernoEnAño(government('ALB4BAV','Baviera',1480),1480,'ALB4BAV');
  const landshut=idsDeGobiernoEnAño(government('JORGE1BAV','Baviera',1480),1480,'JORGE1BAV');
  assert.ok(munich.includes('Munchner_Schotterebene'));
  assert.ok(!munich.includes('Bayerischer_Wald'));
  assert.ok(landshut.includes('Donau_Moos'));
  assert.ok(!landshut.includes('Munchner_Schotterebene'));
  assert.ok(idsDeGobiernoEnAño(government('ALB4BAV','Baviera',1506),1506,'ALB4BAV').includes('Bayerischer_Wald'));
  assert.deepEqual(idsDeGobiernoEnAño(government('ALB6BAV','Baviera',1650),1650,'ALB6BAV'),[]);
});

test('Palatinado electoral y Neoburgo son gobiernos diferentes',()=>{
  assert.ok(government('OTTHEINRICHPAL','Palatinado-Neoburgo',1535));
  assert.ok(government('PHILIPNEUBURG','Palatinado-Neoburgo',1535));
  assert.ok(government('WOLFGANGZWEIBNEUB','Palatinado-Neoburgo',1560));
  assert.ok(government('PHILIPLOUISNEUBURG','Palatinado-Neoburgo',1570));
  assert.equal(government('PHILIPLOUISNEUBURG','Palatinado',1580),undefined);
  assert.ok(government('PHILIPLOUISNEUBURG','Palatinado-Neoburgo',1580));
  assert.deepEqual(idsDeReinoEnAño('Palatinado-Neoburgo',1580),[]);
  assert.ok(rulers('Palatinate',1558).includes('OTTHEINRICHPAL'));
  assert.ok(rulers('Palatinate',1580).includes('LUIS6PAL'));
  assert.ok(!rulers('Palatinate',1580).includes('PHILIPLOUISNEUBURG'));
  assert.ok(rulers('Palatinate',1660).includes('KARLLUDWIGPAL'));
  assert.ok(rulers('Palatinate',1687).includes('PHILIPWILHELMPAL'));
});

test('la unión renana se forma y se reparte en los años documentados',()=>{
  assert.ok(rulers('Julich',1510).includes('WILHELM4JULBERG'));
  assert.ok(rulers('Niederrhein',1510).includes('JOHN2CLEVES'));
  for(const region of ['Julich','Bergisches_Land','Niederrhein']) assert.ok(rulers(region,1522).includes('JOHN3CLEVES'),region);
  assert.ok(rulers('Julich',1620).includes('WOLFGANGWILHELMNEUBURG'));
  assert.ok(!rulers('Julich',1620).includes('JOHNSIGBRAND'));
  assert.ok(rulers('Niederrhein',1620).includes('GEORGEWILLIAMBRAND'));
  assert.ok(!rulers('Niederrhein',1620).includes('WOLFGANGWILHELMNEUBURG'));
  assert.ok(rulers('Julich',1660).includes('PHILIPWILHELMPAL'));
  assert.ok(rulers('Julich',1695).includes('JUANGUILLERMOPAL'));
  assert.ok(government('JOHN3CLEVES','Ravensberg',1522));
  assert.ok(government('FREDWILGREAT','Mark',1666));
  assert.deepEqual(idsDeReinoEnAño('Ravensberg',1666),[]);
  assert.deepEqual(idsDeReinoEnAño('Mark',1666),[]);
  assert.match(TERRITORIOS.Ravensberg.nota,/Lippe/);
});

test('Flandes y Artois dejan de duplicarse en Francia y señalan el intervalo mixto',()=>{
  assert.ok(rulers('Roman_Flanders',1522).includes('CARLOS5'));
  assert.ok(!rulers('Roman_Flanders',1522).some(id=>byId[id]?.reinos?.includes('Francia')));
  assert.ok(rulers('Upper_Artois',1522).includes('CARLOS5'));
  assert.deepEqual(idsDeReinoEnAño('Artois',1660),[]);
  assert.ok(!idsDeReinoEnAño('Francia',1660).includes('Roman_Flanders'));
  assert.ok(idsDeReinoEnAño('Francia',1678).includes('Roman_Flanders'));
  assert.ok(idsDeReinoEnAño('Francia',1678).includes('Upper_Artois'));
  assert.equal(government('JUAN1BORG','Flandes',1405).desde,1405);
});

test('las nuevas correspondencias existen en el SVG y los gobiernos tienen citas',()=>{
  const svg=fs.readFileSync(new URL('../src/MapChart_Map.svg',import.meta.url),'utf8');
  for(const territory of ['Baviera','Palatinado','Jülich','Berg','Cléveris','Francia','Artois','Flandes']) {
    for(const id of idsDeReinoEnAño(territory,1522)) assert.ok(svg.includes(`id="${id}"`),`${territory}: ${id}`);
  }
  for(const id of ['LUIS3PAL','LUIS6PAL','KARLLUDWIGPAL','PHILIPWILHELMPAL','JOHN2CLEVES','JOHN3CLEVES','JOHNSIGBRAND','OTTHEINRICHPAL','PHILIPNEUBURG','WOLFGANGZWEIBNEUB']) {
    assert.ok(personClaims(byId[id]).filter(claim=>claim.field==='Gobierno'&&['Palatinado','Palatinado-Neoburgo','Cléveris','Jülich','Berg','Mark','Ravensberg'].includes(claim.value.territorio)).every(claim=>claim.sources.length&&claim.reviewedAt),id);
  }
});
