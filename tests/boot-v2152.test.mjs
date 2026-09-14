import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {build} from 'vite';
import {JSDOM} from 'jsdom';
import {act} from 'react';
import {person} from './fixtures/static-pages.mjs';
import {serializePage} from '../src/public/staticData.js';
import {startSpeedInsights} from '../src/monitoring.js';

let temp;
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {url: 'https://www.treeofeurope.eu/es/'});
for (const name of ['window', 'document', 'navigator', 'HTMLElement']) Object.defineProperty(globalThis, name, {value: name === 'window' ? dom.window : dom.window[name], configurable: true});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
before(async () => {
  const nodeEnv = process.env.NODE_ENV;
  temp = await fs.mkdtemp(path.resolve('.ssg-build-boot-'));
  await build({configFile: false, publicDir: false, logLevel: 'error', plugins: [{
    name: 'boot-route-fixtures', enforce: 'pre',
    resolveId(id, importer) {
      if (importer?.endsWith('/src/main.jsx') && ['./App.jsx', './public/StaticPublicPage.jsx'].includes(id)) return '\0boot:' + id;
    },
    load(id) {
      if (id.startsWith('\0boot:')) return `import React from 'react';export default function Page(){return React.createElement('h1',null,'${id.includes('StaticPublicPage') ? 'SSG' : 'SPA'}');}`;
    },
  }], build: {ssr: 'src/main.jsx', outDir: temp, minify: false, rolldownOptions: {output: {entryFileNames: 'entry.mjs'}}}});
  if (nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = nodeEnv;
});
after(async () => {dom.window.close(); if (temp) await fs.rm(temp, {recursive: true, force: true});});

for (const mode of ['SSG', 'SPA']) test(`el arranque real ${mode} inserta una sola medición sin sustituir la ficha estática`, async () => {
  dom.reconfigure({url: `https://www.treeofeurope.eu${mode === 'SSG' ? person.path : '/es/?atlas=1'}`});
  document.head.innerHTML = '';
  document.body.innerHTML = mode === 'SSG' ? `<div id="root"><h1>SSG</h1></div><script id="eade-initial-page" type="application/json">${serializePage(person)}</script>` : '<div id="root"></div>';
  const heading = document.querySelector('h1');
  const errors = [], originalError = console.error;
  console.error = (...args) => errors.push(args.join(' '));
  try {
    await act(async () => {
      await import(`${pathToFileURL(path.join(temp, 'entry.mjs')).href}?mode=${mode}`);
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    assert.equal(document.querySelector('h1')?.textContent, mode, errors.join('\n'));
    if (mode === 'SSG') assert.equal(document.querySelector('h1'), heading);
    startSpeedInsights();
    assert.equal(document.head.querySelectorAll('script[src*="speed-insights"]').length, 1);
    assert.equal(document.head.querySelector('script').defer, true);
    assert.deepEqual(errors, []);
  } finally {console.error = originalError;}
});
