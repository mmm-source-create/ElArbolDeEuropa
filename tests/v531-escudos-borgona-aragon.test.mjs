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
import {contenidoPersona} from '../src/content/personas/index.js';
import {personClaims} from '../src/evidence/claims.js';

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
    // Since V5.32 the duchies held by the kings themselves are their realms;
    // Salona stays a vassal of the dukes.
    [1350, 'Athens', 'Atenas', 'Trinacria'], [1385, 'Salona', 'Condado de Salona', 'Aragón'],
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
  // Montpellier is his own lordship since V5.31, painted as a government.
  assert.deepEqual(kinds('PEDRO2AR', 1213).sort(), ['Bearne', 'Condado de Bigorra', 'Foix', 'Provenza', 'Toulouse']);
  assert.ok(mapAuthoritiesForPerson(person('PEDRO2AR'), 1210, data).some(e => e.territory === 'Montpellier' && e.kind !== 'vassal'));
  assert.ok(kinds('PEDRO4ARAG', 1385).includes('Condado de Salona') && !kinds('PEDRO4ARAG', 1385).includes('Atenas'));
  assert.ok(kinds('FEDERICO3SIC', 1370).includes('Condado de Salona'));
  assert.ok(!kinds('PEDRO4ARAG', 1370).includes('Atenas'));
  assert.ok(kinds('ALF4ARAG', 1330).includes('Judicado de Arborea'));
  assert.deepEqual(kinds('JAIME2MAL', 1300), []);
  assert.match(read('src/features/atlas/MapaEuropa.jsx'), /'apanage','feudal','vassal'/);
});

test('todas las casas usan un escudo liso de Commons con crédito discreto', () => {
  for (const house of Object.keys(ESCUDOS)) {
    const imagen = escudoDe(house).imagen;
    assert.ok(imagen, house);
    assert.match(imagen.archivo, /^\/escudos\/[a-z0-9.-]+\.(svg|png)$/, house);
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

test('los vasallos aragoneses entran como personas, con fuentes y parentescos', () => {
  const ids = ['MANFREDOATENAS', 'GUILLERMOATENAS', 'JUANRANDAZZO', 'FEDERICORANDAZZO', 'ALFONSOFADRIQUE', 'PEDROFADRIQUE', 'JAIMEFADRIQUE', 'LUISFADRIQUE', 'MARIAFADRIQUE',
    'GUILLERMA1PALLARS', 'HUGOROGER3PALLARS', 'RAMON6TOLOSA', 'RAMON7TOLOSA', 'RAMONROGERFOIX', 'RAMONROGERTRENCAVEL', 'GASTON6BEARN', 'PETRONILABIGORRA',
    'ALF2PROVENZA', 'GUILLERMO8MONTP', 'ERMENGOL10URGEL', 'JAIME1URGEL', 'JAIME2URGEL'];
  for (const id of ids) {
    const p = person(id);
    assert.ok(p, id);
    assert.ok(contenidoPersona(id)?.resumen, id);
    for (const claim of personClaims(p).filter(c => c.field === 'Gobierno'))
      assert.ok(claim.certainty === 'documented' && claim.sources[0].url.startsWith('https://www.enciclopedia.cat/'), `${id} ${claim.id}`);
  }
  assert.equal(PERSONAS.filter(p => (p.gobiernos || []).some(g => g.territorio === 'Pallars Sobirà')).length, 15);
  // Family links into people already in the Atlas.
  for (const [child, parent] of [['MANFREDOATENAS', 'FEDERICO2SIC'], ['ROGER4FOIX', 'ROGERBERNARDO2FOIX'], ['GASTON7BEARN', 'GUILLERMO2BEARN'],
    ['RAMONBERENGUER4PROV', 'ALF2PROVENZA'], ['MARIAMONT', 'GUILLERMO8MONTP'], ['PEDRO2URGEL', 'JAIME1URGEL'], ['ISABURG', 'JAIME2URGEL'], ['RAMON7TOLOSA', 'RAMON6TOLOSA']])
    assert.equal(person(child).padre, parent, child);
  assert.ok(person('JUANAINGSIC').conyuges.includes('RAMON6TOLOSA'));
  // The vicar general is a delegated office under the duke, not sovereignty.
  const vicar = person('ALFONSOFADRIQUE').gobiernos.find(g => g.territorio === 'Atenas');
  assert.deepEqual([vicar.titulo, vicar.condicion, vicar.soberano], ['Vicario general', 'gobierno delegado', 'GUILLERMOATENAS']);
  assert.deepEqual(subterritoriosDeFiltro('Atenas'), ['Ducado de Neopatria', 'Condado de Salona']);
  assert.ok(subterritoriosDeFiltro('Corona de Aragón').includes('Pallars Sobirà'));
  assert.ok(subterritoriosDeFiltro('Francia').includes('Vizcondado de Carcasona'));
});

