import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/personas.jsx';
import {governmentTableAt} from '../src/data/europePanorama.js';
import {COLLECTIVE_AUTHORITIES} from '../src/data/politicalMapIndex.js';
import {governmentRegion, governmentTier} from '../src/explorer/EuropeGovernments.jsx';
import SiteHeader from '../src/components/SiteHeader.jsx';
import fs from 'node:fs';
import HomeDiscovery from '../src/public/HomeDiscovery.jsx';

test('Europa: cada entidad de gobierno tiene región y las coronas encabezan su región', () => {
  for (let year = 1200; year <= 1800; year += 10) {
    for (const row of governmentTableAt(PERSONAS, year, COLLECTIVE_AUTHORITIES))
      assert.notEqual(governmentRegion(row), 'Otros', `${year}: ${row.label} sin región`);
  }
  const rows = Object.fromEntries(governmentTableAt(PERSONAS, 1500, COLLECTIVE_AUTHORITIES).map(row => [row.label, row]));
  for (const label of ['Francia', 'Inglaterra', 'Corona de Castilla', 'Imperio otomano']) assert.equal(governmentTier(rows[label]), 0, label);
  for (const label of ['Baden', 'Albret', 'Ferrara']) assert.equal(governmentTier(rows[label]), 1, label);
  assert.equal(governmentRegion(rows['Imperio otomano']), 'Balcanes y Bizancio');
  assert.equal(governmentRegion(rows.Kildare), 'Islas Británicas');
});

test('el selector ES | EN tiene la misma forma en el Atlas y en las páginas públicas', () => {
  const shape = element => {
    const doc = new JSDOM(renderToString(element)).window.document;
    return [...doc.querySelector('.site-language').children].map(node => `${node.className}:${node.textContent}`);
  };
  const atlas = shape(React.createElement(SiteHeader, {variant: 'atlas', locale: 'es', onLanguageChange: () => {}, prerendered: true}));
  const publicPage = shape(React.createElement(SiteHeader, {locale: 'es', pathname: '/es/personas', prerendered: true}));
  const english = shape(React.createElement(SiteHeader, {locale: 'en', pathname: '/en/people', prerendered: true}));
  assert.deepEqual(atlas, ['site-language-option active:ES', 'site-language-option:EN']);
  assert.deepEqual(publicPage, atlas);
  assert.deepEqual(english, ['site-language-option:ES', 'site-language-option active:EN']);
});

// src/generated is produced by the build and is not in the repository.
const homeLists = () => ({
  people: [{id: 'FED2HOH', nombre: 'Federico II Hohenstaufen', slug: 'federico-ii-hohenstaufen', sobrenombre: '', aliases: [], documentacion: null, resumen: 'Emperador.', dinastia: 'Hohenstaufen', titulo: 'Emperador', nac: 1194, muer: 1250, nacAprox: false, muerAprox: false, reinos: ['Sacro Imperio']}],
  stories: [{id: 'borgona', titulo: 'Borgoña: el reino que no fue', subtitulo: '', descripcion: 'Un recorrido.', slug: 'borgona-el-reino-que-no-fue', disponible: true, pasos: 11, minutos: 8}],
});

test('portada: entradas antes del carrusel, sin cinta de dinastías y con «Personas»', () => {
  // PublicSite.jsx needs the bundler (JSON imports), so the order is checked on its source.
  const source = fs.readFileSync(new URL('../src/public/PublicSite.jsx', import.meta.url), 'utf8');
  const home = source.slice(source.indexOf('export function HomeContent'), source.indexOf('const INFO_PAGES'));
  assert.ok(home.indexOf('home-quick-links') < home.indexOf('<HomeDiscovery '));
  assert.doesNotMatch(source, /DynastyMarquee/);
  assert.match(home, /public-door-arrow/);
  const doc = new JSDOM(renderToString(React.createElement(HomeDiscovery, {...homeLists(), peoplePath: '/es/personas', storiesPath: '/es/historias'}))).window.document;
  assert.match(doc.body.textContent, /Personas/);
  assert.match(doc.body.textContent, /Todas las personas/);
  assert.doesNotMatch(doc.body.textContent, /Personajes/);
});
