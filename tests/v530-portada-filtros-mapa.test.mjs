import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {publicMeta, entityMeta} from '../src/features/public/publicMeta.js';
import {OG_DEFAULT_IMAGE, ogPersonaImage, ogDynastyImage} from '../src/features/public/ogImages.js';
import {atlasFilterOptions, territoryRegion} from '../src/domain/filters/atlasFilters.js';
import {TERRITORIOS_SUB, subterritoriosDeFiltro} from '../src/domain/filters/territoryFilters.js';
import {territoriosDe} from '../src/domain/genealogy/personAccessors.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import DynastyArms, {ArmsCredit} from '../src/components/DynastyArms.jsx';
import {ESCUDOS, escudoDe, CREDITOS_ESCUDOS} from '../src/content/dinastias/escudos.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const meta = (m, key) => m.meta.find(([, k]) => k === key)?.[2];

test('cada ficha comparte una imagen de 1200×630 y una tarjeta grande', () => {
  const carlos = publicMeta(entityMeta('persona', {nombre: 'Carlos V', resumen: 'Emperador.', ogImage: ogPersonaImage('carlos-v')}, 'carlos-v'));
  assert.equal(meta(carlos, 'og:image'), 'https://www.treeofeurope.eu/og/persona/carlos-v.jpg');
  assert.equal(meta(carlos, 'og:image:width'), '1200');
  assert.equal(meta(carlos, 'og:image:alt'), 'Retrato de Carlos V');
  assert.equal(meta(carlos, 'twitter:card'), 'summary_large_image');
  assert.equal(meta(carlos, 'twitter:image'), meta(carlos, 'og:image'));
  const house = publicMeta(entityMeta('dinastia', {nombre: 'Habsburgo', slug: 'habsburgo', ogImage: ogDynastyImage('habsburgo')}, 'habsburgo'));
  assert.equal(meta(house, 'og:image'), 'https://www.treeofeurope.eu/og/dinastia/habsburgo.jpg');
  const territory = publicMeta(entityMeta('territorio', {nombre: 'Navarra', resumen: 'Reino.'}, 'navarra'));
  assert.equal(meta(territory, 'og:image'), new URL(OG_DEFAULT_IMAGE, 'https://www.treeofeurope.eu').href);
  assert.match(read('index.html'), /property="og:image" content="https:\/\/www\.treeofeurope\.eu\/og\/eade\.jpg"/);
  assert.match(read('package.json'), /generate-og-images\.mjs/);
});

test('los filtros territoriales agrupan por entidad política y región, sin sufijos ni sueltos', () => {
  const options = atlasFilterOptions(PERSONAS);
  const children = new Set(Object.values(TERRITORIOS_SUB).flat());
  for (const root of options.territorios) assert.notEqual(territoryRegion(root), 'Otros', root);
  for (const loose of ['Brzeg', 'Glaž', 'Sajonia-Gotha', 'Judicado de Arborea', 'República de Pskov', 'Principado de Trakai', 'Acaya', 'Soissons', 'Hum', 'Despotado de Serres'])
    assert.ok(!options.territorios.includes(loose) && children.has(loose), loose);
  const reachable = new Set(options.territorios.flatMap(root => [root, ...subterritoriosDeFiltro(root)]));
  for (const territory of new Set(PERSONAS.flatMap(territoriosDe))) assert.ok(reachable.has(territory), territory);
  assert.ok(subterritoriosDeFiltro('Sajonia').includes('Sajonia-Weimar'));
  assert.ok(subterritoriosDeFiltro('al-Ándalus').includes('Califato almohade'));
  for (const outside of ['Flandes', 'Milán', 'Hungría']) assert.ok(!subterritoriosDeFiltro('Sacro Imperio').includes(outside), outside);
  assert.doesNotMatch(read('src/features/atlas/view/AtlasFiltersPanel.jsx'), /· región/);
});

test('Desafío no deja un fondo claro bajo el tema oscuro y los botones de ramas no se parten', () => {
  assert.match(read('src/features/settings/preferences.css'), /html\[data-eade-theme="dark"\],html\[data-eade-theme="dark"\] body\{background:var\(--eade-paper\)/);
  assert.doesNotMatch(read('src/app/App.jsx'), /<Suspense fallback=\{null\}>\s*<DesafioPage/);
  const css = read('src/features/atlas/atlas-controls.css');
  assert.match(css, /minmax\(min\(100%, 14em\), 1fr\)/);
  assert.match(css, /\.bio-family-actions > div button small \{[^}]*white-space: nowrap/);
});

test('el norte de África, Tierra Santa y Chipre tienen cartografía continua de 1200 a 1800', () => {
  const data = JSON.parse(read('data/cartography/corridor-locations.json'));
  data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
  const review = JSON.parse(read('data/cartography/north-africa-levant-review.json'));
  const mosaics = new Map();
  const owner = (year, id) => {
    if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
    return (mosaics.get(year).byLocation.get(id) || []).map(layer => layer.entityId);
  };
  for (const year of [1200, 1300, 1400, 1500, 1600, 1700, 1800])
    for (const id of review.scope.ids) assert.ok(owner(year, id).length, `${id} ${year}`);
  for (const [year, id, identity] of [
    [1260, 'Marrakesh', 'Califato almohade'], [1300, 'Marrakesh', 'Sultanato benimerín'], [1600, 'Fez', 'Sultanato saadí'], [1700, 'Fez', 'Sultanato alauí'],
    [1300, 'Tlemcen', 'Reino de Tremecén'], [1340, 'Tlemcen', 'Sultanato benimerín'], [1300, 'Tunis', 'Sultanato hafsí'], [1600, 'Tunis', 'Regencia de Túnez'],
    [1600, 'Oran', 'Presidios españoles del Magreb'], [1720, 'Oran', 'Regencia de Argel'], [1500, 'Tangier', 'Plazas portuguesas del Magreb'], [1670, 'Tangier', 'Tánger inglés'],
    [1520, 'Tripoli', 'Presidios españoles del Magreb'], [1540, 'Tripoli', 'Trípoli de los caballeros de Malta'], [1750, 'Tripoli', 'Regencia de Trípoli'],
    [1230, 'Jerusalem', 'Jerusalén'], [1240, 'Jerusalem', 'Sultanato ayubí'], [1243, 'Jerusalem', 'Jerusalén'], [1290, 'Acre', 'Jerusalén'], [1291, 'Acre', 'Sultanato mameluco'],
    [1300, 'Cairo', 'Sultanato mameluco'], [1520, 'Cairo', 'Imperio otomano'], [1799, 'Cairo', 'Ocupación francesa de Egipto'], [1550, 'Famagusta', 'Venecia'],
  ]) assert.ok(owner(year, id).includes(identity), `${id} ${year}: ${owner(year, id)}`);
});

test('los escudos de Wikimedia Commons se muestran con autor y licencia, sin contenido activo', () => {
  assert.ok(CREDITOS_ESCUDOS.length >= 30);
  for (const credit of CREDITOS_ESCUDOS) {
    assert.ok(ESCUDOS[credit.dinastia], credit.dinastia);
    assert.ok(credit.autor && credit.licencia, credit.dinastia);
    assert.match(credit.fuente, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    if (/^CC BY/.test(credit.licencia)) assert.match(credit.licenciaUrl, /^https:\/\/creativecommons\.org\/licenses\/by(-sa)?\/(?:[1-4]\.0|2\.5)\/$/);
    const file = read(`public${credit.archivo}`);
    if (credit.archivo.endsWith('.svg')) {
      assert.match(file, /<svg\b[^>]*viewBox=/, credit.archivo);
      assert.doesNotMatch(file, /<script|javascript:|<foreignObject|\son[a-z]+\s*=/i, credit.archivo);
    }
    const html = renderToStaticMarkup(React.createElement(DynastyArms, {dinastia: credit.dinastia, size: 40}));
    assert.match(html, new RegExp(`^<img[^>]+src="${credit.archivo.replace(/[.()]/g, '\\$&')}"`), credit.dinastia);
    const caption = renderToStaticMarkup(React.createElement(ArmsCredit, {dinastia: credit.dinastia}));
    assert.ok(caption.includes(credit.licencia) && caption.includes('Wikimedia Commons'), credit.dinastia);
  }
  // Since V5.31 every house shows a Commons file; the drawing is only a fallback.
  for (const house of Object.keys(ESCUDOS)) assert.ok(escudoDe(house).imagen, house);
});
