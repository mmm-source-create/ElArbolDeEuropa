import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {colorTerritorioEnMapa, REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {BURGUNDIAN_COLOR, ENGLISH_CROWN_COLOR, FRENCH_CROWN_COLOR, POLAND_LITHUANIA_COLOR, frenchFiefColor} from '../src/cartography/mapColors.js';
import {governmentSummary} from '../src/domain/government/governmentPresentation.js';
import {gobiernosDe} from '../src/domain/genealogy/personAccessors.js';
import {ESCUDOS,escudoDe} from '../src/content/dinastias/escudos.js';
import DynastyArms from '../src/components/DynastyArms.jsx';

const by = Object.fromEntries(PERSONAS.map(person => [person.id, person]));
const data = JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json', import.meta.url)));
data.burgundy = JSON.parse(fs.readFileSync(new URL('../data/cartography/burgundian-locations.json', import.meta.url)));
const mosaics = new Map();
const cell = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  return mosaics.get(year).byLocation.get(id) || [];
};
const colors = (year, id) => new Set(cell(year, id).map(layer => layer.mosaicColor));
const fief = (year, id) => cell(year, id).some(layer => layer.crownRelation);

test('los estados borgoñones solo comparten el granate cuando comparten duque', () => {
  assert.notEqual(colorTerritorioEnMapa(by.LUIS2FLA, 'Flandes', 1370), BURGUNDIAN_COLOR);
  assert.notEqual(colorTerritorioEnMapa(by.MARGFRAFLA, 'Artois', 1370), BURGUNDIAN_COLOR);
  // From 1384 Flanders shares the duke; Namur joins Philip the Good's lands.
  assert.equal(colorTerritorioEnMapa(by.MARGFLAN, 'Flandes', 1390), BURGUNDIAN_COLOR);
  assert.equal(colorTerritorioEnMapa(by.FEL3BORG, 'Namur', 1440), BURGUNDIAN_COLOR);
  for (const territory of ['Flandes', 'Nevers', 'Rethel', 'Güeldres', 'Namur', 'Condado de Borgoña', 'Frisia', 'Utrecht'])
    assert.notEqual(REINO_COLOR[territory], BURGUNDIAN_COLOR, territory);
  assert.ok(!colors(1360, 'Bruges').has(BURGUNDIAN_COLOR), 'Flandes de Luis de Male');
  assert.ok(colors(1430, 'Bruges').has(BURGUNDIAN_COLOR) && fief(1430, 'Bruges'), 'Flandes borgoñona, feudo francés');
  assert.ok(colors(1430, 'Dijon').has(BURGUNDIAN_COLOR) && fief(1430, 'Dijon'));
  assert.deepEqual(governmentSummary(by.LUIS2FLA, 1370), ['Flandes', 'Nevers', 'Rethel']);
});

test('la Francia inglesa lleva el color de Inglaterra y los feudos franceses no parecen estados independientes', () => {
  assert.ok(colors(1300, 'Bordeaux').has(ENGLISH_CROWN_COLOR) && fief(1300, 'Bordeaux'), 'Gascuña tenida en feudo');
  assert.ok(colors(1360, 'Bordeaux').has(ENGLISH_CROWN_COLOR) && !fief(1360, 'Bordeaux'), 'Brétigny en plena soberanía');
  assert.ok(colors(1400, 'Bordeaux').has(ENGLISH_CROWN_COLOR));
  assert.ok(colors(1400, 'Calais').has(ENGLISH_CROWN_COLOR));
  assert.ok(!colors(1460, 'Bordeaux').has(ENGLISH_CROWN_COLOR));
  for (const [id, identity] of [['Rennes', 'Bretaña'], ['Bourbon', 'Borbón']]) {
    assert.ok(fief(1360, id), id);
    assert.ok(colors(1360, id).has(frenchFiefColor(identity)), id);
  }
  assert.ok(colors(1360, 'Paris').has(FRENCH_CROWN_COLOR) && !fief(1360, 'Paris'), 'dominio real');
  assert.notEqual(frenchFiefColor('Bretaña'), FRENCH_CROWN_COLOR);
});

test('la guerra de los Cien Años distingue la doble monarquía de Troyes y la reconquista', () => {
  for (const id of ['Paris', 'Reims', 'Troyes', 'Amiens', 'Rouen']) assert.ok(colors(1425, id).has(ENGLISH_CROWN_COLOR), `${id} 1425`);
  for (const id of ['Reims', 'Troyes', 'Senlis']) assert.ok(!colors(1430, id).has(ENGLISH_CROWN_COLOR), `${id} 1430`);
  assert.ok(colors(1430, 'Paris').has(ENGLISH_CROWN_COLOR));
  assert.ok(colors(1430, 'Chartres').has(ENGLISH_CROWN_COLOR) && !colors(1432, 'Chartres').has(ENGLISH_CROWN_COLOR));
  assert.ok(!colors(1437, 'Paris').has(ENGLISH_CROWN_COLOR));
  assert.ok(!colors(1451, 'Rouen').has(ENGLISH_CROWN_COLOR));
});

test('Ricardo Corazón de León y los dominios angevinos', () => {
  const richard = by.RICARDO1ING;
  assert.equal(richard.sobrenombre, 'Corazón de León');
  assert.equal(richard.padre, 'HENRY2ING');
  assert.equal(richard.madre, 'ELEANORAQUIT');
  assert.deepEqual(richard.conyuges, ['BERENGUELANAV']);
  assert.equal(by.BERENGUELANAV.padre, 'SANCHO6NAV');
  assert.deepEqual(gobiernosDe(richard).map(g => g.territorio).sort(), ['Anjou', 'Aquitania', 'Inglaterra', 'Maine', 'Normandía']);
  assert.equal(by.HENRY2ING.padre, 'GODOFREDO5ANJ');
  assert.equal(by.GODOFREDO5ANJ.padre, 'FULK5JER');
  assert.equal(by.ARTURO1BRET.padre, 'GODOFREDO2BRET');
  assert.ok(by.ELEANORAQUIT.conyuges.includes('LUIS7FRA') && by.LUIS7FRA.conyuges.includes('ELEANORAQUIT'));
  assert.deepEqual(governmentSummary(richard,1190).sort(),['Anjou','Aquitania','Inglaterra','Maine','Normandía']);
  for (const id of ['Rouen', 'Angers', 'Le_Mans', 'Bordeaux', 'Tours'])
    assert.ok(colors(1190, id).has(ENGLISH_CROWN_COLOR) && fief(1190, id), `${id} 1190`);
  assert.ok(fief(1190, 'Rennes') && !colors(1190, 'Rennes').has(ENGLISH_CROWN_COLOR));
  assert.ok(!colors(1150, 'Rouen').has(ENGLISH_CROWN_COLOR), 'antes de la coronación de 1154');
});

test('Polonia-Lituania unida no se confunde con Bohemia ni con sus vecinos violetas', () => {
  for (const neighbour of ['Bohemia', 'Moravia', 'Transilvania', 'Lituania', 'Kanato de Crimea', 'Austria'])
    assert.notEqual(POLAND_LITHUANIA_COLOR, REINO_COLOR[neighbour], neighbour);
  assert.equal(REINO_COLOR['Polonia-Lituania'], POLAND_LITHUANIA_COLOR);
  assert.ok(colors(1620, 'Warsaw').has(POLAND_LITHUANIA_COLOR) || colors(1620, 'Krakow').has(POLAND_LITHUANIA_COLOR));
});

test('los escudos de las grandes casas se dibujan y corresponden a dinastías del Atlas', () => {
  const dynasties = new Set(PERSONAS.map(person => person.dinastia));
  assert.ok(Object.keys(ESCUDOS).length >= 35);
  for (const [name, escudo] of Object.entries(ESCUDOS)) {
    assert.ok(dynasties.has(name), name);
    assert.match(escudo.blason, /^[A-ZÁÉÍÓÚ].+\.$/, name);
    const svg = renderToStaticMarkup(React.createElement(DynastyArms, {dinastia: name, size: 40, drawn: true}));
    if (escudo.tipo === 'tughra') {assert.match(svg,/^<img[^>]+alt="Tuğra de Orhan/);continue;}
    if (escudo.tipo === 'signo') {assert.match(svg,/^<img[^>]+alt="Signo principesco de Sviatoslav/);continue;}
    if (['emblema','estandarte'].includes(escudo.tipo)) {
      assert.match(svg,/^<img/);
      assert.ok(svg.includes(escudoDe(name).imagen.archivo),name);
      continue;
    }
    assert.match(svg, /^<svg[^>]+role="img"/, name);
    assert.ok(svg.includes('<title>'), name);
  }
  assert.equal(renderToStaticMarkup(React.createElement(DynastyArms, {dinastia: 'Familias menores'})), '');
});

test('más sobrenombres consolidados en la historiografía', () => {
  const nicknames = PERSONAS.filter(person => person.sobrenombre);
  assert.ok(nicknames.length >= 290);
  for (const [id, nickname] of [['PEDRO4ARAG', 'el Ceremonioso'], ['LUIS4', 'el Bávaro'], ['JAIME1AR', 'el Conquistador'], ['FED5PALBOH', 'el Rey de Invierno'], ['LUIS10FRA', 'el Obstinado']])
    assert.equal(by[id].sobrenombre, nickname, id);
});
