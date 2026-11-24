import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const results = {people: [], dynasties: [], territories: [], stories: [], events: [], total: 0};

async function renderTopbar(query) {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {url: 'https://www.treeofeurope.eu/es/?atlas=1', pretendToBeVisual: true});
  Object.assign(globalThis, {window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, MouseEvent: dom.window.MouseEvent, IS_REACT_ACT_ENVIRONMENT: true});
  const React = (await import('react')).default;
  const {createRoot} = await import('react-dom/client');
  const {act} = React;
  const {default: AtlasTopbar} = await import('../src/features/atlas/view/AtlasTopbar.jsx');
  const vm = {locale: 'es', query, setQuery() {}, queryTrim: query, searchMatchIds: query ? ['GALILEO'] : [], currentSearchIndex: 0, irACoincidencia() {}, anioGlobal: 1500, anioInput: '1500', atlasScene: 'atlas', positions: {}, gobernantesActivosEnAnio: [], personasVivasEnAnio: []};
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(React.createElement(AtlasTopbar, {vm, searchOpen: false, searchResults: results, setSearchOpen() {}})));
  return {dom, root, act};
}

const press = (element, window) => {
  const event = new window.MouseEvent('mousedown', {bubbles: true, cancelable: true});
  element.dispatchEvent(event);
  return event;
};

test('a press anywhere inside the Atlas search box focuses the field', async () => {
  for (const query of ['', 'Galileo']) {
    const {dom, root, act} = await renderTopbar(query);
    const box = document.querySelector('.toolbar-search-box'), input = box.querySelector('input');
    for (const target of [box, box.querySelector(':scope > svg')]) {
      input.blur();
      const event = press(target, dom.window);
      assert.equal(document.activeElement, input, `${query || 'empty'}: ${target.tagName}`);
      // The default is prevented so the field does not lose focus straight away.
      assert.equal(event.defaultPrevented, true);
    }
    // The controls keep their own behaviour.
    input.blur();
    const clear = box.querySelector('button[aria-label="Borrar búsqueda"]');
    assert.equal(press(clear, dom.window).defaultPrevented, false);
    assert.notEqual(document.activeElement, input);
    await act(async () => root.unmount());
    dom.window.close();
  }
});

test('the empty search no longer reserves hidden space for its controls', () => {
  const css = read('src/features/atlas/atlas-controls.css');
  assert.match(css, /\.toolbar-search-nav\[hidden\] \{ display:none; \}/);
  assert.doesNotMatch(css, /\.toolbar-search-nav\[hidden\] \{ display:flex; visibility:hidden/);
  assert.match(css, /\.toolbar-search-box \{ cursor:text; \}/);
  assert.match(css, /\.toolbar-search-count \{ width:auto; min-width:5ch;/);
  // The box keeps a fixed height and full width, so showing the controls cannot resize the bar.
  assert.match(css, /\.toolbar-search-box \{ display:flex; align-items:center; width:100%; max-width:100%; height:44px;/);
  assert.match(css, /@media\(min-width:1200px\) \{ \.workspace-topbar \{ grid-template-columns: minmax\(250px, 420px\)/);
});
