import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {colorTerritorioEnMapa,REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {BURGUNDIAN_COLOR} from '../src/cartography/mapColors.js';
import {buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {pilotJurisdictionsFor} from '../src/cartography/locationMapPilot.js';
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
data.burgundy=JSON.parse(fs.readFileSync(new URL('../data/cartography/burgundian-locations.json',import.meta.url)));
const inspect=(id,year)=>inspectMapRegion(id,year,buildPoliticalMapIndex(PERSONAS,year,data,{includeClaims:true,includeDependencies:true}),data);
const sovereigns=(id,year)=>inspect(id,year).entries.filter(e=>e.kind==='sovereign').map(e=>e.person?.id);
const colors=(year,id)=>[...new Set((europeMosaicAt(data,year,PERSONAS).byLocation.get(id)||[]).map(l=>l.mosaicColor))];
const personalColors=(id,year)=>new Set(mapAuthoritiesForPerson(by.get(id),year,data).filter(e=>e.paint&&e.kind==='sovereign')
  .map(e=>colorTerritorioEnMapa(by.get(id),e.territory,year)));

test('Prussian completion cells of 1789 name the king instead of a pending jurisdiction',()=>{
 for(const id of ['Bialobork','Czluchow','Tecklenburg','Lingen','Labiau','Gardelegen','Anklam','Altena']){
  assert.deepEqual(sovereigns(id,1789),['FREDWIL2PRU'],id);
  assert(!inspect(id,1789).entries.some(e=>e.kind==='regional'),id);
 }
 assert.deepEqual(colors(1789,'Gardelegen'),[REINO_COLOR.Prusia],'the Altmark joins the Prussian monarchy colour');
 assert.deepEqual(sovereigns('Stralsund',1789),['GUSTAV3SUE']);
 assert.deepEqual(sovereigns('Ribe',1789),['CHRISTIAN7DEN']);
});

test('linked completion phases respect partitions, cadet branches and dated acquisitions',()=>{
 // Divided Bavaria and Mark before the Jülich succession stay with no invented duke.
 assert(!pilotJurisdictionsFor('Baviera',1450,'ALB3BAV').some(name=>name.includes('cobertura alemana')));
 assert(!pilotJurisdictionsFor('Brandeburgo',1500,'JOACHIM1BRAND').some(name=>name.startsWith('Mark ·')));
 assert(pilotJurisdictionsFor('Brandeburgo',1700,'FRED1PRUSSIA').some(name=>name.startsWith('Mark ·')));
 // The Leuchtenberg line no longer duplicates the elector's Bavaria.
 for(const id of ['Munich','Amberg'])assert.deepEqual(sovereigns(id,1648),['MAX1BAV'],id);
 // Linked phases supplement, never replace, an approximate government.
 assert.deepEqual(sovereigns('Munich',1705),['MAX2EMANBAV']);
 // Revolt of the Catalans: one sovereign, Philip IV's control disputed.
 const barcelona=inspect('Barcelona',1650).entries;
 assert.deepEqual(barcelona.filter(e=>e.kind==='sovereign').map(e=>e.person.id),['LUIS14FRA']);
 assert(barcelona.some(e=>e.kind==='disputed'&&e.person.id==='FEL4ESP'));
 assert.deepEqual(sovereigns('Barcelona',1655),['FEL4ESP']);
});

test('Great Britain and Hanover no longer share the fallback grey; the Commonwealth is inspectable',()=>{
 assert.notDeepEqual(colors(1720,'London'),colors(1720,'Hanover'));
 assert.deepEqual(colors(1720,'Edinburgh'),colors(1720,'London'));
 assert.equal(REINO_COLOR['Gran Bretaña'],REINO_COLOR.Inglaterra);
 const weimar=colorTerritorioEnMapa({gobiernos:[]},'Sajonia-Weimar',1650);
 assert.match(weimar,/^#[0-9A-F]{6}$/i);assert.notEqual(weimar,'#5C5346');
 for(const [id,year,territory] of [['London',1650,'Inglaterra'],['Dublin',1655,'Irlanda'],['Edinburgh',1655,'Escocia']]){
  const entry=inspect(id,year).entries.find(e=>e.kind==='collective');
  assert.equal(entry?.territory,territory,id);assert(entry.collective.fuente.url.startsWith('https://www.british-history.ac.uk/'));
 }
});

test('personal maps show composite monarchies whole, with Portugal and the Burgundian inheritance apart',()=>{
 const philip=personalColors('FEL2ESP',1585);
 assert.deepEqual(philip,new Set([REINO_COLOR.España,REINO_COLOR.Portugal,BURGUNDIAN_COLOR]));
 assert.equal(personalColors('LEOP1HRE',1690).size,1);
 assert.equal(personalColors('FREDWIL2PRU',1789).size,1);
 assert.equal(personalColors('CHRISTIAN7DEN',1772).size,1);
 // From 1773 Holstein is his as an imperial duchy outside the Denmark-Norway rule.
 assert.deepEqual(personalColors('CHRISTIAN7DEN',1789),new Set([REINO_COLOR.Dinamarca,colorTerritorioEnMapa(by.get('CHRISTIAN7DEN'),'Holstein',1789)]));
 assert.notEqual(colorTerritorioEnMapa(by.get('CHRISTIAN7DEN'),'Holstein',1789),REINO_COLOR.Dinamarca);
 assert.deepEqual(personalColors('MARIATERESAHAB',1750),new Set([REINO_COLOR.Austria,BURGUNDIAN_COLOR]));
 // Transient personal unions keep their crowns apart, as Portugal does.
 assert.notEqual(colorTerritorioEnMapa(by.get('LUIS1'),'Polonia',1375),colorTerritorioEnMapa(by.get('LUIS1'),'Hungría',1375));
 assert.notEqual(colorTerritorioEnMapa(by.get('JACOBO1ING'),'Escocia',1610),colorTerritorioEnMapa(by.get('JACOBO1ING'),'Inglaterra',1610));
 assert.notEqual(colorTerritorioEnMapa(by.get('JUANSINTIERRA'),'Normandía',1200),colorTerritorioEnMapa(by.get('JUANSINTIERRA'),'Inglaterra',1200));
 // Supplementary Burgundian lordships follow their group without their own mandate.
 const charles=mapAuthoritiesForPerson(by.get('CARLOS5'),1540,data).find(e=>e.territory==='Condado de Charolais');
 assert.equal(colorTerritorioEnMapa(by.get('CARLOS5'),charles.territory,1540),BURGUNDIAN_COLOR);
});
