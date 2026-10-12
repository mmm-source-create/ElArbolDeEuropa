import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import {build} from 'vite';
import {person} from './fixtures/static-pages.mjs';
import {makeStaticDocument} from '../scripts/lib/ssg-utils.mjs';

const execute = promisify(execFile);
// npm test also runs before generation in a fresh checkout. Provide only
// generated data inputs; all routes, components and dependencies remain real.
const generatedInputs = () => ({
  name: 'production-client-generated-inputs', enforce: 'pre',
  resolveId(id) {
    if (/generated\/(home|siteMeta)\.json$/.test(id)) return '\0client-data:' + id + '.js';
    if (/generated\/treeBase\.json\?url$/.test(id)) return '\0client-tree-url';
  },
  load(id) {
    if (id.startsWith('\0client-data:')) return 'export default {buildVersion:"client-test"};';
    if (id === '\0client-tree-url') return 'export default "data:application/json,{}";';
  },
});

test('the minified browser entry hydrates a profile and activates its controls without chunk initialization errors', async () => {
  const root = process.cwd();
  const temp = await fs.mkdtemp(path.join(root, '.ssg-build-client-'));
  const nodeEnv = process.env.NODE_ENV;
  try {
    // Use the actual two-entry configuration and client splitting, with no
    // substitutes for routes, icons or shared application modules.
    await build({root, publicDir: false, logLevel: 'error', plugins: [generatedInputs()], build: {outDir: temp, manifest: true}});
    await build({root, configFile: false, publicDir: false, logLevel: 'error', plugins: [generatedInputs()],
      build: {ssr: 'src/public/ssg-entry.jsx', outDir: path.join(temp, 'ssr'),
        rolldownOptions: {output: {entryFileNames: 'entry.mjs'}}}});
    const {renderPage} = await import(pathToFileURL(path.join(temp, 'ssr/entry.mjs')));
    const rendered = renderPage(person);
    const html = makeStaticDocument('<!doctype html><html><head><title>Prueba</title></head><body><div id="root"></div></body></html>', rendered, person, {css: [], js: []});
    await fs.writeFile(path.join(temp, 'page.html'), html);
    const manifest = JSON.parse(await fs.readFile(path.join(temp, '.vite/manifest.json'), 'utf8'));
    const entry = path.join(temp, manifest['index.html'].file);
    await fs.writeFile(path.join(temp, 'check.mjs'), `
      import assert from 'node:assert/strict';
      import fs from 'node:fs/promises';
      import {JSDOM} from 'jsdom';
      const dom = new JSDOM(await fs.readFile(new URL('./page.html', import.meta.url), 'utf8'), {url: 'https://www.treeofeurope.eu${person.path}'});
      for (const name of ['window','document','navigator','HTMLElement','HTMLInputElement','Event','MouseEvent','MutationObserver'])
        Object.defineProperty(globalThis, name, {value: name === 'window' ? dom.window : dom.window[name], configurable: true});
      const errors = [];
      console.error = (...args) => errors.push(args.map(String).join(' '));
      process.on('unhandledRejection', error => errors.push(String(error)));
      window.addEventListener('error', event => errors.push(event.message));
      // Module-preload requests are browser hints. The native imports still
      // load the built files; no profile JSON or route request is substituted.
      globalThis.fetch = async url => {
        if (/\\.js(?:[?#]|$)/.test(String(url))) return new Response('');
        throw new Error('Unexpected profile request: ' + url);
      };
      // jsdom does not download CSS. Complete only stylesheet load events;
      // JavaScript imports below still execute the real built module graph.
      const observer = new MutationObserver(() => {
        for (const link of document.querySelectorAll('link[rel="stylesheet"]'))
          if (!link.dataset.loaded) {link.dataset.loaded = '1'; link.dispatchEvent(new window.Event('load'));}
      });
      observer.observe(document.head, {childList: true});
      const heading = document.querySelector('h1');
      const select = document.querySelector('.crown-year select');
      const initial = document.querySelector('.crown-timeline h3').textContent;
      assert.ok(select && select.options.length > 1);
      await import(${JSON.stringify(pathToFileURL(entry).href)});
      let activated = false;
      for (let attempt = 0; attempt < 80 && !activated && !errors.length; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 25));
        select.value = '0';
        select.dispatchEvent(new window.Event('change', {bubbles: true}));
        await new Promise(resolve => setTimeout(resolve, 5));
        activated = document.querySelector('.crown-timeline h3').textContent !== initial;
      }
      assert.deepEqual(errors, [], 'The client module graph must initialize without errors');
      assert.ok(activated, 'The prerendered profile must hydrate and activate its controls');
      assert.equal(document.querySelector('h1'), heading, 'Hydration must preserve the server heading');
      observer.disconnect(); dom.window.close();
    `);
    const result = await execute(process.execPath, [path.join(temp, 'check.mjs')], {cwd: root, timeout: 30000});
    assert.equal(result.stderr, '');
  } finally {
    if (nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = nodeEnv;
    await fs.rm(temp, {recursive: true, force: true});
  }
});
