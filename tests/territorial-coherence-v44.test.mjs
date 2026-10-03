import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {REINO_A_IDS, REINO_VERSIONES, idsDeReinoEnAño, reinadosActivos} from '../src/Territorios.jsx';

const person = id => PERSONAS.find(p => p.id === id);
const painted = (id, year) => new Set(reinadosActivos(person(id), year, {soloEfectivos:true})
  .flatMap(g => idsDeReinoEnAño(g.territorio, year)));
const contains = (territory, year, id) => idsDeReinoEnAño(territory, year).includes(id);

test('las entidades compuestas no duplican polígonos ni borran sus reinos', () => {
  for (const group of ['España', 'Corona de Castilla', 'Corona de Aragón']) {
    assert.deepEqual(idsDeReinoEnAño(group, 1540), [], group);
  }
  assert.ok(contains('Aragón', 1540, 'Zaragoza'));
  for (const id of ['Barcelona', 'Valencia', 'Mallorca', 'Cagliari', 'Mazara', 'Calabria_Citra']) {
    assert.ok(!contains('Aragón', 1540, id), id);
  }
  assert.ok(contains('Condado de Barcelona', 1540, 'Barcelona'));
  assert.ok(contains('Valencia', 1540, 'Valencia'));
  assert.ok(contains('Cerdeña', 1540, 'Cagliari'));
  assert.ok(contains('Trinacria', 1540, 'Mazara'));
  assert.ok(contains('Nápoles', 1540, 'Calabria_Citra'));
  const carlos = painted('CARLOS5', 1540);
  for (const id of ['Zaragoza', 'Barcelona', 'Valencia', 'Mallorca', 'Cagliari', 'Mazara', 'Calabria_Citra']) {
    assert.ok(carlos.has(id), `Carlos V: ${id}`);
  }
  for (const id of ['Cismonte', 'Pumonte', 'Bergamo', 'Brescia']) {
    assert.ok(!carlos.has(id), `Carlos V no debe pintar ${id}`);
  }
});

test('Castilla, León y el emirato granadino cambian por conquistas fechadas', () => {
  assert.ok(!painted('FERN3', 1229).has('Leon'));
  assert.ok(painted('FERN3', 1231).has('Leon'));
  assert.ok(!contains('Castilla', 1235, 'Cordoba'));
  assert.ok(contains('Castilla', 1236, 'Cordoba'));
  assert.ok(!contains('Castilla', 1247, 'Sevilla'));
  assert.ok(contains('Castilla', 1248, 'Sevilla'));
  assert.ok(!contains('León', 1228, 'Caceres'));
  assert.ok(contains('León', 1229, 'Caceres'));
  assert.ok(contains('Granada', 1486, 'Malaga'));
  assert.ok(!contains('Granada', 1487, 'Malaga'));
  assert.ok(contains('Castilla', 1487, 'Malaga'));
  assert.ok(!contains('Castilla', 1495, 'Canary_Islands'));
  assert.ok(contains('Castilla', 1496, 'Canary_Islands'));
});

test('la Corona de Aragón conserva reinos separados y fecha los cambios del Rosellón', () => {
  assert.ok(contains('Mallorca', 1300, 'Rosello'));
  assert.ok(!contains('Condado de Barcelona', 1300, 'Rosello'));
  assert.ok(!contains('Cerdeña', 1322, 'Cagliari'));
  assert.ok(contains('Cerdeña', 1326, 'Cagliari'));
  assert.ok(!contains('Cerdeña', 1400, 'Arborea'));
  assert.ok(contains('Cerdeña', 1420, 'Arborea'));
  assert.ok(!contains('Cerdeña', 1540, 'Cismonte'));
  assert.ok(contains('Francia', 1480, 'Rosello'));
  assert.ok(!contains('Condado de Barcelona', 1480, 'Rosello'));
  assert.ok(!contains('Francia', 1500, 'Rosello'));
  assert.ok(contains('Condado de Barcelona', 1500, 'Rosello'));
  assert.ok(contains('Francia', 1660, 'Rosello'));
  assert.ok(!contains('Condado de Barcelona', 1660, 'Rosello'));
});

test('Portugal permanece separado y sus islas se incorporan en años distintos', () => {
  assert.ok(!contains('Portugal', 1248, 'Algarve'));
  assert.ok(contains('Portugal', 1249, 'Algarve'));
  assert.ok(!contains('Portugal', 1424, 'Madeira'));
  assert.ok(contains('Portugal', 1425, 'Madeira'));
  assert.ok(!contains('Portugal', 1451, 'Azores'));
  assert.ok(contains('Portugal', 1452, 'Azores'));
  assert.ok(!painted('FEL2ESP', 1579).has('Minho'));
  assert.ok(painted('FEL2ESP', 1580).has('Minho'));
  assert.ok(!painted('CARLOS5', 1540).has('Minho'));
});

test('los estados italianos no se absorben por título ni soberanía formal', () => {
  assert.ok(contains('Milán', 1427, 'Bergamo'));
  assert.ok(!contains('Milán', 1428, 'Bergamo'));
  assert.ok(!contains('Milán', 1540, 'Brescia'));
  assert.ok(!contains('Florencia', 1405, 'Pisa'));
  assert.ok(contains('Florencia', 1406, 'Pisa'));
  for (const id of ['Ferrara', 'Urbino', 'Bologna', 'Romagna', 'Perugia']) {
    assert.ok(!contains('Estados Pontificios', 1500, id), id);
  }
  assert.ok(contains('Estados Pontificios', 1506, 'Bologna'));
  assert.ok(contains('Estados Pontificios', 1512, 'Romagna'));
  assert.ok(contains('Estados Pontificios', 1540, 'Perugia'));
  assert.ok(contains('Estados Pontificios', 1598, 'Ferrara'));
  assert.ok(contains('Estados Pontificios', 1631, 'Urbino'));
  assert.ok(!contains('Toscana', 1600, 'Lucca'));
  assert.ok(!contains('Nápoles', 1600, 'Mazara'));
  assert.ok(!contains('Trinacria', 1600, 'Calabria_Ultra'));
  assert.ok(!contains('Sicilia', 1300, 'Calabria_Ultra'));
});

test('la sucesión italiana de 1700–1759 cambia de monarca sin fusionar reinos', () => {
  assert.ok(painted('FEL5ESP', 1705).has('Milano'));
  assert.ok(!painted('FEL5ESP', 1707).has('Milano'));
  assert.ok(painted('CARLOS6HRE', 1710).has('Milano'));
  assert.ok(painted('CARLOS6HRE', 1710).has('Calabria_Citra'));
  assert.ok(painted('CARLOS6HRE', 1710).has('Cagliari'));
  assert.ok(!painted('CARLOS6HRE', 1710).has('Mazara'));
  assert.ok(painted('FEL5ESP', 1718).has('Cagliari'));
  assert.ok(painted('CARLOS6HRE', 1725).has('Mazara'));
  assert.ok(!painted('CARLOS6HRE', 1725).has('Cagliari'));
  assert.ok(painted('VICTORAMADEO2SAB', 1725).has('Cagliari'));
  assert.ok(!painted('CARLOS6HRE', 1734).has('Milano'));
  assert.ok(painted('CARLOSEMANUEL3SAB', 1734).has('Milano'));
  assert.ok(!painted('CARLOSEMANUEL3SAB', 1737).has('Milano'));
  assert.ok(painted('CARLOS6HRE', 1737).has('Milano'));
  assert.ok(painted('CARLOS3ESP', 1740).has('Calabria_Citra'));
  assert.ok(painted('CARLOS3ESP', 1740).has('Mazara'));
  assert.ok(!painted('CARLOS3ESP', 1740).has('Toledo'));
  assert.ok(!painted('CARLOS3ESP', 1760).has('Mazara'));
  assert.ok(painted('FERN4NAP', 1760).has('Mazara'));
  assert.ok(painted('FERN4NAP', 1760).has('Calabria_Citra'));
  assert.ok(!painted('FERN4NAP', 1808).has('Calabria_Citra'));
  assert.ok(painted('FERN4NAP', 1808).has('Mazara'));
});

test('cada región añadida existe en el SVG cartográfico', () => {
  const svg = fs.readFileSync(new URL('../src/MapChart_Map.svg', import.meta.url), 'utf8');
  const svgIds = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const supplied = `Tursan Bayonne Navarre Bearn_Bigorre Comminges Barbastro Huesca Urgell Rosello Girona Osona Barcelona New_Catalonia Razes Foix Armagnac Toulousain Coruna Lugo Ourense Tras_Os_Montes Beira_Alta Beira_Baixa Ribatejo Alto_Alentejo Baixo_Alentejo Algarve Estremadura Beira_Litoral Santiago Minho Huelva Sevilla Cadiz Malaga Canary_Islands Madeira Cordoba Jaen Granada Almeria Murcia Orihuela Jativa Castellon Alcaniz Teruel Alarcon Albacete Hellin Valencia Ocana West_Mancha Toledo Madrid East_Mancha Villanueva_de_la_Serena Merida Mallorca Logudoro Arborea Cagliari Gallura Pumonte Cismonte Mazara Girgenti Noto Demena Tunis Sahel_Tun Qabisa Kairouan Bizerte Medjerda Annaba Constantine Kabylia Mitidja Dahra Ouarsenis Oran Tlemcen Oujda Kert Errif Habat Azghar Fez Tamasna Dukkala Haha Sus Cuenca Guadalajara Calatayud Zaragoza Soria Segovia Avila Salamanca Zamora Valladolid Leon Palencia Lerma Burgos Alava Gipuzkoa Montana East_Asturias West_Asturias Astorga Benavente Ciudad_Rodrigo Plasencia Caceres Badajoz Trujillo Biscay Calabria_Citra Calabria_Ultra Otranto Basilicata Bari Principato_Citra Capitanata Abruzzo_Citra Molise Principato_Ultra Lavoro Abruzzo_Ultra Marche Istria Friuli Gorizia Venice Padua Ferrara Romagna Urbino Spoleto Campagna Marittima Perugia Arezzo Patrimonio Florence Bologna Siena Grosseto Pisa Lucca Modena Reggioem Levante Punente Mondovi Saluzzo Monferrato Torino Savoy Pavia Piacenza Parma Alessandria Novara Milano Monza Cremona Brescia Verona Vicenza Belluno South_Tirol Mantua Trentino Bergamo Valtellina Ticino Aosta Oberwallis Nice Dracenois Dignois Aquisextain Avignonnais Gresivaudan Valentinois Crete Rodos Argolis Arcadia Messenia Ilia Laconia Corinthia Achaea Ionian_Islands Aetolia South_Epirus North_Epirus Neopatras Attica Euboea Naxos Chios Cyprus Albania Illyria Zeta Hum South_Dalmatia North_Dalmatia Lika`.split(' ');
  for (const id of supplied) assert.ok(svgIds.has(id), `etiqueta aportada: ${id}`);
  const affected = ['Castilla','León','Granada','Aragón','Condado de Barcelona','Valencia','Mallorca','Cerdeña','Portugal','Francia','Sicilia','Nápoles','Trinacria','Milán','Estados Pontificios','Ferrara','Florencia','Mantua','Módena','Monferrato','Saluzzo','Parma','Urbino','Toscana'];
  for (const territory of affected) {
    const regions = [...REINO_A_IDS[territory], ...(REINO_VERSIONES[territory] || []).flatMap(v => v.ids)];
    for (const id of regions) assert.ok(svgIds.has(id), `${territory} → ${id}`);
  }
});
