import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {biografiaExtensaPersona} from '../src/content/biografias-extensas.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {englishPaths,translatedEquivalent} from '../src/features/english/routes.js';
import {portraitSuggestions} from '../src/features/desafio/portraitSearch.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import EvidencePanel from '../src/components/EvidencePanel.jsx';

const person = id => PERSONAS.find(p => p.id === id);
const english = id => completeEnglishProfile({...person(id), biografiaExtensa: biografiaExtensaPersona(person(id)) || [],
  padres: [], conyuges: [], hijos: [], relacionadosDinastia: [], contemporaneos: [], historias: []});
const TEN = {
  FEL2ESP: ['Philip II of Spain', 'philip-ii-of-spain', 'felipe-ii-de-espana'],
  FERN2ARAG: ['Ferdinand II of Aragon', 'ferdinand-ii-of-aragon', 'fernando-ii-de-aragon'],
  ENRIQ8ING: ['Henry VIII of England', 'henry-viii-of-england', 'enrique-viii'],
  LUIS14FRA: ['Louis XIV of France', 'louis-xiv-of-france', 'luis-xiv-de-francia'],
  JUANAARCO: ['Joan of Arc', 'joan-of-arc', 'juana-de-arco'],
  LORENZOMEDICI: ['Lorenzo de’ Medici', 'lorenzo-de-medici', 'lorenzo-de-medici-lorenzomedici'],
  MEHMED2OSM: ['Mehmed II', 'mehmed-ii', 'mehmed-ii'],
  PETER1RUS: ['Peter I of Russia', 'peter-the-great', 'pedro-i-de-rusia'],
  CATHERINE2RUS: ['Catherine II of Russia', 'catherine-the-great', 'catalina-ii-de-rusia'],
  FRED2PRUSSIA: ['Frederick II of Prussia', 'frederick-the-great', 'federico-ii-de-prusia'],
};

test('ten further complete English profiles use English historiographical names and real routes', () => {
  assert.equal(Object.keys(COMPLETE_ENGLISH_PROFILES).length, 256);
  for (const [id, [name, en, es]] of Object.entries(TEN)) {
    const translated = english(id);
    assert.equal(translated.nombre, name, id);
    assert.equal(translated.biografiaExtensa.length, 4, id);
    translated.biografiaExtensa.forEach(section => assert.doesNotMatch(section.texto, /\b(que|los|las|del)\b/, `${id}: ${section.titulo}`));
    assert(englishPaths().includes(`/en/person/${en}`), en);
    assert.equal(translatedEquivalent(`/es/persona/${es}`, 'en'), `/en/person/${en}`);
    assert.equal(translatedEquivalent(`/en/person/${en}`, 'es'), `/es/persona/${es}`);
    if (IMAGENES_PERSONAS[id]) assert.doesNotMatch(Object.values(translated.portrait).join(' '), /Retrato|Dominio público|Taller|Según|Atribuido/, id);
  }
  assert.equal(COMPLETE_ENGLISH_PROFILES.LUIS14FRA.nickname, 'the Sun King');
  assert.equal(COMPLETE_ENGLISH_PROFILES.MEHMED2OSM.nickname, 'the Conqueror');
  // V5.36 separates the epithet from the regnal name, retaining the original routes.
  for (const id of ['PETER1RUS', 'CATHERINE2RUS', 'FRED2PRUSSIA']) assert.equal(COMPLETE_ENGLISH_PROFILES[id].nickname, 'the Great');
});

test('English names, nicknames and regnal variants find the new portraits', () => {
  const pool = Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id, p]) => ({id, nombre: p.name, sobrenombre: p.nickname, aliases: p.aliases || []}));
  for (const [query, id] of [['Sun King', 'LUIS14FRA'], ['Maid of Orléans', 'JUANAARCO'], ['Peter I of Russia', 'PETER1RUS'], ['Ferdinand the Catholic', 'FERN2ARAG'], ['Lorenzo the Magnificent', 'LORENZOMEDICI'], ['Old Fritz', 'FRED2PRUSSIA']])
    assert.equal(portraitSuggestions(pool, query, 7, 'en')[0].id, id, query);
});

test('scopes, government groups and successions are translated or fail closed', () => {
  const frederick = english('FRED2PRUSSIA');
  assert.equal(frederick.englishLabels['Monarquía prusiana'], 'Prussian monarchy');
  assert.equal(frederick.englishLabels['Parte prusiana de Silesia y condado de Glatz; remanente austríaco excluido'], 'Prussian part of Silesia and the County of Glatz; Austrian remnant excluded');
  assert.equal(frederick.englishLabels.Electorado, 'Electorate');
  assert.equal(frederick.englishSourceTitles['Deutsche Nationalbibliothek · Ficha de autoridad GND · Friedrich II., Preußen, König'], 'Deutsche Nationalbibliothek · GND authority record · Friedrich II., Preußen, König');
  assert.equal(english('CARLOS5').englishSourceTitles['Rijksmuseum · Alegoría de la abdicación de Carlos V'], 'Rijksmuseum · Allegory of the abdication of Charles V');
  assert.deepEqual(english('FEL2ESP').localizedClaims.find(c => c.id === 'person:FEL2ESP:government:Milán:1546:1555:Duque').alternatives, ['1540 · chronology of dukes', '1546 · historical record']);
  // Original titles of works are not translated.
  assert.equal(english('CARLOS5').englishSourceTitles['Real Academia de la Historia · Diccionario Biográfico español'], undefined);
  const changed = structuredClone(person('FRED2PRUSSIA'));
  changed.gobiernos[0].ambito = 'Un ámbito nuevo sin traducción';
  assert.throws(() => completeEnglishProfile({...changed, biografiaExtensa: biografiaExtensaPersona(person('FRED2PRUSSIA')), padres: [], conyuges: [], hijos: [], relacionadosDinastia: [], contemporaneos: [], historias: []}), /Missing profile label/);
  const html = renderToStaticMarkup(React.createElement(EvidencePanel, {person: english('FERN2ARAG'), locale: 'en'}));
  assert.doesNotMatch(html, /Predecesor no registrado|Sucesor no registrado/);
  assert.match(html, /Castile ·/);
});

test('errors found while translating are corrected in the Spanish records too', () => {
  assert.equal(person('LUIS14FRA').gobiernos.find(g => g.territorio === 'Navarra').ambito, 'Dinastía Albret-Borbón; Baja Navarra tras la conquista');
  assert.match(biografiaExtensaPersona(person('CATHERINE2RUS'))[3].texto, /1793 lo hizo solo con Prusia/);
  assert.equal(IMAGENES_PERSONAS.JUANAARCO.autor, 'Jean Pichore');
  assert.equal(IMAGENES_PERSONAS.JUANAARCO.fecha, '1504–1506');
  assert.match(IMAGENES_PERSONAS.FERN2ARAG.institucion, /Kunsthistorisches Museum/);
});
