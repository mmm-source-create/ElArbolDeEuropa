import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TERRITORIOS} from '../src/data/territorios.js';
import {HISTORIA_TERRITORIOS,FUENTES_TERRITORIOS} from '../src/content/territorios/index.js';
import review from '../data/cartography/german-swiss-expansion-review.json' with {type:'json'};
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {buildPoliticalMapIndex} from '../src/cartography/politicalMapIndex.js';
import {escudoDe, CREDITOS_ESCUDOS} from '../src/content/dinastias/escudos.js';
const read = p => fs.readFileSync(new URL('../'+p, import.meta.url),'utf8');
const data = JSON.parse(read('data/cartography/corridor-locations.json'));
data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
const years = new Map();
const identities = (year,id) => {
  if (!years.has(year)) years.set(year,europeMosaicAt(data,year,PERSONAS));
  return (years.get(year).byLocation.get(id) || []).map(l => l.entityId);
};
test('las casas solicitadas tienen archivo, crédito y comparten los escudos repetidos', () => {
  for (const h of ['Anjou-Durazzo','Jagellón','Hetúmida','Holstein-Gottorp','Vasa','Grifo','Piast','Přemysl','Dunkeld']) {
    const image = escudoDe(h)?.imagen;
    assert.ok(image?.autor && image.licencia && image.fuente,h);
    const file=fs.readFileSync(new URL('../public'+image.archivo,import.meta.url));
    if(image.archivo.endsWith('.svg'))assert.ok(file.toString('utf8').includes('<svg'),h);
    else assert.equal(file.subarray(1,4).toString('ascii'),'PNG',h);
  }
  assert.equal(escudoDe('Hetúmida').imagen,escudoDe('Habsburgo').imagen);
  assert.equal(escudoDe('Dunkeld').imagen,escudoDe('Estuardo').imagen);
  assert.match(escudoDe('Hetúmida').nota,/simplificada/);
  const banner = read('public'+escudoDe('Přemysl').imagen.archivo);
  assert.match(banner,/clip-path="url\(#shield\)"/);
  assert.match(banner,/preserveAspectRatio="xMidYMid meet"/);
  assert.ok(escudoDe('Přemysl').imagen.modificaciones);
  const files = fs.readdirSync(new URL('../public/escudos/',import.meta.url));
  assert.equal(files.length,new Set(CREDITOS_ESCUDOS.map(c => c.archivo)).size);
});
test('los núcleos suizos aparecen en sus fechas y pasan al marco helvético en 1798', () => {
  for (const [id,from,identity] of [['Schwyz',1291,'Comunidad de Schwyz'],['Lucerne',1332,'Lucerna'],['Zurich',1351,'Zúrich'],['Kyburg',1452,'Zúrich'],['Schaffhausen',1501,'Schaffhausen'],['Baden_im_Aargau',1415,'Condado de Baden suizo'],['Frauenfeld',1460,'Turgovia']]) {
    assert.ok(!identities(from-1,id).includes(identity),id+' antes');
    assert.ok(identities(from,id).includes(identity),id+' desde');
    assert.deepEqual(identities(1797,id),[identity],id+' 1797');
    assert.deepEqual(identities(1798,id),['República Helvética'],id+' 1798');
    assert.deepEqual(identities(1800,id),['República Helvética'],id+' 1800');
    assert.ok(buildPoliticalMapIndex(PERSONAS,1700,data).get(id)?.some(e => e.regionalEvidence),id+' inspector');
  }
});
test('la continuidad de los ducados llega a 1800 y Gottorp no recibe las partes reales', () => {
  for (const year of [1650,1651,1712,1713,1721,1772,1773,1800]) {
    assert.deepEqual(identities(year,'Slesvig'),['Schleswig'],String(year));
    assert.deepEqual(identities(year,'Kiel'),['Holstein'],String(year));
  }
  const duke = PERSONAS.find(p => p.id === 'CHARLESFREDHG');
  const holstein = mapAuthoritiesForPerson(duke,1720,data).find(e => e.territory === 'Holstein');
  assert.deepEqual(holstein?.ids,['Kiel']);
  assert.ok(!holstein.ids.includes('Rendsburg'));
  const layers = data.additionalTerritories;
  assert.match(layers.find(l => l.name.includes('Schleswig · administración real')).note,/1721/);
  assert.equal(layers.find(l => l.name.includes('Holstein · administración real')).coverage.from,1773);
});
test('Potsdam amplía Brandeburgo y Poznan conserva su traspaso de 1793', () => {
  assert.deepEqual(identities(1414,'Potsdam'),['Brandeburgo']);
  assert.deepEqual(identities(1415,'Potsdam'),['Brandeburgo']);
  assert.deepEqual(identities(1792,'Poznan'),['Polonia']);
  assert.deepEqual(identities(1793,'Poznan'),['Prusia']);
});

test('las fichas nuevas incluyen identidad, historia, cronología y fuentes', () => {
  for (const [name,entity] of Object.entries(review.entities)) {
    assert.ok(TERRITORIOS[name],name);
    assert.ok(HISTORIA_TERRITORIOS[name]?.resumen,name);
    assert.ok(HISTORIA_TERRITORIOS[name]?.evolucion.length,name);
    assert.ok(FUENTES_TERRITORIOS[name]?.length,name);
    for (const key of entity.sourceKeys) assert.ok(review.sources[key]?.locator,name+' '+key);
  }
});
test('ciudades libres y sedes episcopales no se atribuyen al ducado vecino', () => {
  for (const [id,name] of [['Nuremberg','Ciudad imperial de Núremberg'],['Ulm','Ciudad imperial de Ulm'],['Augsburg','Ciudad imperial de Augsburgo'],['Dillingen','Principado episcopal de Augsburgo'],['Passau','Principado episcopal de Passau'],['Freising','Principado episcopal de Freising'],['Regensburg','Ciudad imperial de Ratisbona'],['Lubeck','Ciudad imperial de Lübeck'],['Hamburg','Ciudad de Hamburgo'],['Bremen','Ciudad de Bremen']])
    assert.deepEqual(identities(1700,id),[name],id);
  assert.deepEqual(identities(1490,'Regensburg'),['Baviera']);
  assert.deepEqual(identities(1492,'Regensburg'),['Ciudad imperial de Ratisbona']);
  assert.deepEqual(identities(1679,'Magdeburg'),['Arzobispado de Magdeburgo']);
  assert.ok(!identities(1680,'Magdeburg').includes('Arzobispado de Magdeburgo'));
});
test('las transferencias institucionales conservan fechas y ámbitos', () => {
  assert.deepEqual(identities(1647,'Stade'),['Arzobispado de Bremen']);
  assert.deepEqual(identities(1648,'Stade'),['Ducados de Bremen-Verden']);
  assert.deepEqual(identities(1700,'Bremen'),['Ciudad de Bremen']);
  const index=buildPoliticalMapIndex(PERSONAS,1715,data);
  assert.ok(index.get('Stade').some(entry => entry.territory==='Hannover'));
  for (const id of ['Aurich','Emden','Ansbach','Bayreuth','Kulmbach']) {
    const year=id==='Aurich'||id==='Emden'?1744:1792;
    assert.ok(buildPoliticalMapIndex(PERSONAS,year,data).get(id)?.some(entry => entry.territory==='Prusia'),id);
  }
  assert.deepEqual(identities(1700,'St_Gallen'),['San Galo · ciudad y abadía']);
  assert.deepEqual(identities(1800,'St_Gallen'),['República Helvética']);
});
