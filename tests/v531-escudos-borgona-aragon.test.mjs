import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/data/personas.js';
import {TERRITORIOS_SUB, subterritoriosDeFiltro} from '../src/domain/filters/territoryFilters.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {aragonCrownRelation} from '../src/cartography/aragonCrownRelations.js';
import {ARAGON_CROWN_COLOR} from '../src/cartography/mapColors.js';
import DynastyArms from '../src/components/DynastyArms.jsx';
import {ESCUDOS, escudoDe, CREDITOS_ESCUDOS} from '../src/content/dinastias/escudos.js';
import {OG_FREE_LICENCE, ogArmsCreditFile} from '../src/features/public/ogImages.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(read('data/cartography/corridor-locations.json'));
data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
const mosaics = new Map();
const layersAt = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  return mosaics.get(year).byLocation.get(id) || [];
};
const person = id => PERSONAS.find(p => p.id === id);

test('los filtros de Borgoña separan las dos Borgoñas de los Países Bajos', () => {
  assert.deepEqual(TERRITORIOS_SUB['Borgoña y Países Bajos'], ['Las dos Borgoñas', 'Países Bajos', 'Nevers', 'Rethel']);
  assert.deepEqual(TERRITORIOS_SUB['Las dos Borgoñas'].slice(0, 3), ['Borgoña', 'Condado de Borgoña', 'Auxerre']);
  for (const province of ['Flandes', 'Artois', 'Holanda', 'Güeldres', 'Groninga', 'Tournai'])
    assert.ok(TERRITORIOS_SUB['Países Bajos'].includes(province), province);
  // Ponthieu was English before Burgundian; it stays only among French fiefs.
  assert.ok(!subterritoriosDeFiltro('Borgoña y Países Bajos').includes('Ponthieu'));
  assert.ok(TERRITORIOS_SUB.Francia.includes('Ponthieu'));
  for (const old of ['Borgoña y Franco Condado', 'Países Bajos y Flandes', 'Incorporaciones del siglo XVI'])
    assert.equal(TERRITORIOS_SUB[old], undefined, old);
});

test('los vasallos de la Corona de Aragón llevan su tono rojo con trama en el panorama', () => {
  for (const [year, id, identity, overlord] of [
    [1205, 'Carcassonne', 'Vizcondado de Carcasona', 'Aragón'], [1205, 'Pau', 'Bearne', 'Aragón'],
    [1213, 'Toulouse', 'Toulouse', 'Aragón'], [1213, 'Foix', 'Foix', 'Aragón'], [1210, 'Marseille', 'Provenza', 'Aragón'],
    [1300, 'Perpignan', 'Mallorca', 'Aragón'], [1330, 'Neopatras', 'Ducado de Neopatria', 'Trinacria'],
    [1350, 'Athens', 'Atenas', 'Trinacria'], [1380, 'Athens', 'Atenas', 'Aragón'],
  ]) {
    const layer = layersAt(year, id).find(l => l.entityId === identity);
    assert.ok(layer, `${id} ${year}`);
    assert.equal(layer.crownRelation?.overlord, overlord, `${id} ${year}`);
    assert.match(layer.mosaicColor, /^#[A-F0-9]{6}$/i);
  }
  // Montpellier is the king's own lordship inside France: the royal red.
  assert.equal(layersAt(1250, 'Montpellier')[0].mosaicColor, ARAGON_CROWN_COLOR);
  // Dated limits: Majorca's confiscation, the loss of Athens and Muret.
  assert.ok(!layersAt(1290, 'Perpignan').some(l => l.crownRelation?.overlord));
  assert.ok(!layersAt(1390, 'Athens').some(l => l.crownRelation));
  assert.ok(!layersAt(1220, 'Toulouse').some(l => l.crownRelation?.overlord === 'Aragón'));
  assert.equal(aragonCrownRelation('Provenza · 1200–1387 · ámbito 187', 1230).type, 'rama');
  assert.equal(aragonCrownRelation('Provenza · 1200–1387 · ámbito 187', 1230).overlord, null);
});

test('los reyes ven a sus vasallos en su propio mapa', () => {
  const kinds = (id, year) => mapAuthoritiesForPerson(person(id), year, data).filter(e => e.kind === 'vassal').map(e => e.territory);
  assert.deepEqual(kinds('PEDRO2AR', 1213).sort(), ['Bearne', 'Condado de Bigorra', 'Foix', 'Montpellier', 'Provenza', 'Toulouse']);
  assert.ok(kinds('PEDRO4ARAG', 1380).includes('Atenas') && kinds('PEDRO4ARAG', 1380).includes('Ducado de Neopatria'));
  assert.ok(kinds('FEDERICO3SIC', 1370).includes('Atenas'));
  assert.ok(!kinds('PEDRO4ARAG', 1370).includes('Atenas'));
  assert.ok(kinds('ALF4ARAG', 1330).includes('Judicado de Arborea'));
  assert.deepEqual(kinds('JAIME2MAL', 1300), ['Montpellier']);
  assert.match(read('src/features/atlas/MapaEuropa.jsx'), /'apanage','feudal','vassal'/);
});

test('todas las casas usan un escudo liso de Commons con crédito discreto', () => {
  for (const house of Object.keys(ESCUDOS)) {
    const imagen = escudoDe(house).imagen;
    assert.ok(imagen, house);
    assert.match(imagen.archivo, /^\/escudos\/[a-z0-9.-]+\.svg$/, house);
    const html = renderToStaticMarkup(React.createElement(DynastyArms, {dinastia: house, size: 40}));
    assert.match(html, /title="Escudo: [^"]+ · Wikimedia Commons"/, house);
  }
  const files = fs.readdirSync(new URL('../public/escudos/', import.meta.url));
  assert.deepEqual(files.sort(), [...new Set(CREDITOS_ESCUDOS.map(c => c.archivo.replace('/escudos/', '')))].sort());
  for (const c of CREDITOS_ESCUDOS.filter(c => !OG_FREE_LICENCE.test(c.licencia)))
    assert.ok(fs.existsSync(new URL(`../${ogArmsCreditFile(c.archivo)}`, import.meta.url)), c.dinastia);
  // The credit moved from under each shield to the page foot and the licences page.
  assert.doesNotMatch(read('src/features/public/PublicSite.jsx'), /<ArmsCredit/);
  assert.match(read('src/features/public/PublicSite.jsx'), /\/es\/licencias#escudos/);
  assert.match(read('src/features/public/DynastyPage.jsx'), /<ArmsCredit dinastia=\{d\.nombre\} className="dynasty-page-credit"\/>/);
  assert.equal(escudoDe('Wittelsbach').imagen.revision, '2024-01-29');
});
