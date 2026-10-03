import test from 'node:test';
import assert from 'node:assert/strict';
import { PERSONAS } from '../src/personas.jsx';
import { CLAIM_REVIEWS } from '../src/evidence/reviewRecords.js';
import { REINO_COLOR, colorTerritorioEnMapa, agrupacionesPoliticasEnMapa } from '../src/Territorios.jsx';
import { computeGenerations } from '../src/explorer/treeLayout.js';

const byId = Object.fromEntries(PERSONAS.map(persona => [persona.id, persona]));

test('la sucesión de los dogos venecianos cubre 1400–1605 sin atribuir la República a una familia', () => {
  const doges = PERSONAS.flatMap(persona => (persona.gobiernos || [])
    .filter(g => g.territorio === 'Venecia' && g.titulo === 'Dogo' && g.condicion === 'efectivo')
    .map(g => ({persona, ...g})))
    .filter(g => g.desde <= 1605 && g.hasta >= 1400);
  for (let year = 1400; year <= 1605; year++) {
    assert.ok(doges.some(g => g.desde <= year && year <= g.hasta), `sin dux registrado en ${year}`);
  }
  for (const g of doges) {
    assert.ok(CLAIM_REVIEWS[`person:${g.persona.id}:government:Venecia:${g.desde}:${g.hasta}:Dogo`]?.sources?.length,
      `sin fuente de cargo: ${g.persona.nombre}`);
    assert.match(g.nota || '', /República/);
  }
});

test('Pignatelli conserva las dos ramas documentadas sin sobrino inventado', () => {
  assert.equal(byId.PAPA_INOCENCIO12.padre, 'FRANCESCO_PIGN_SPINAZZOLA');
  assert.equal(byId.PAPA_INOCENCIO12.madre, 'PORZIA_CARAFA');
  assert.equal(byId.CARD_FRANCESCO_PIGN.padre, 'GIULIO_PIGN_CERCHIARA');
  assert.equal(byId.CARD_FRANCESCO_PIGN.madre, 'BEATRICE_CARAFA_NOJA');
  assert.equal(byId.NICOLA_PIGN_VICERE.padre, byId.CARD_FRANCESCO_PIGN.padre);
  assert.notEqual(byId.CARD_FRANCESCO_PIGN.padre, byId.PAPA_INOCENCIO12.padre);
});

test('la administración austro-bohemia empieza en 1749 y Hungría conserva su color', () => {
  const ruler = {id:'REGLA_AUSTRO_BOHEMIA',gobiernos:['Austria','Bohemia','Hungría']
    .map(territorio => ({territorio,desde:1740,hasta:1780,titulo:'Soberana',condicion:'efectivo'}))};
  assert.equal(colorTerritorioEnMapa(ruler,'Bohemia',1748),REINO_COLOR.Bohemia);
  assert.equal(colorTerritorioEnMapa(ruler,'Bohemia',1749),REINO_COLOR.Austria);
  assert.equal(colorTerritorioEnMapa(ruler,'Hungría',1750),REINO_COLOR.Hungría);
  assert.ok(agrupacionesPoliticasEnMapa(ruler,1750).some(g => g.id === 'austro-bohemia'));
});

test('la leyenda omite agrupaciones absorbidas por otra de mayor prioridad', () => {
  const ruler = {id:'REGLA_HISPANICA',gobiernos:['Castilla','León','Aragón','Mallorca','Portugal']
    .map(territorio => ({territorio,desde:1580,hasta:1590,titulo:'Rey',condicion:'efectivo'}))};
  assert.deepEqual(agrupacionesPoliticasEnMapa(ruler,1585).map(g => g.id), ['monarquia-hispanica']);
  assert.equal(colorTerritorioEnMapa(ruler,'Portugal',1585),REINO_COLOR.Portugal);
});

test('ramas conectadas pero separadas se alinean por coetaneidad sin invertir la filiación', () => {
  const people = [
    {id:'A',nac:1400},{id:'AC',nac:1430,padre:'A'},
    {id:'B',nac:1500},{id:'BC',nac:1530,padre:'B'},
    {id:'C',nac:1505},
  ];
  const generations = computeGenerations(people);
  assert.equal(generations.B,generations.C);
  assert.ok(generations.B > generations.A);
  assert.ok(generations.AC > generations.A);
  assert.ok(generations.BC > generations.B);
});
