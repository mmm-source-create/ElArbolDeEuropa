import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HOME_YEARS} from '../src/features/public/homeYears.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('every year of the home time line has a map in both themes', () => {
  for (const year of HOME_YEARS) for (const theme of ['claro', 'oscuro']) {
    const file = new URL(`../public/home/mapa-${year}-${theme}.webp`, import.meta.url);
    assert.ok(fs.existsSync(file), `${year} ${theme}`);
    assert.ok(fs.statSync(file).size > 50_000, `${year} ${theme} is too small to be the rendered map`);
  }
  // The maps are painted from the cell SVG; each cell's own style would win.
  assert.match(read('scripts/generate/generate-home-maps.mjs'), /style="fill:#d8d6ce;stroke:#d8d6ce;stroke-width:0\\\.08"/);
});

test('the time line previews a year on the page; only the button opens the Atlas', () => {
  const home = read('src/features/public/HomePage.jsx');
  assert.match(home, /<button key=\{y\} type="button" aria-pressed=\{y === year\}[^>]*onClick=\{\(\) => setYear\(y\)\}/);
  assert.match(home, /<a className="home-atlas-open" href=\{atlasYear\(year\)\}>/);
  assert.match(home, /--home-map-light': `url\(\$\{mapImage\(year, false\)\}\)`/);
  assert.doesNotMatch(home, /Una vida lleva a otra|One life leads to another/);
  assert.match(home, /story\.retrato \|\| STORY_PORTRAITS/);
});

test('each story shows the person who appears in most chapters, ties going to the first', async () => {
  const pass = (persona, ...personas) => ({persona, personas});
  const story = {pasos: [pass('A', 'A', 'B'), pass('B', 'B'), pass('C', 'A', 'C')]};
  // A and B appear in two chapters each; A appears first.
  const counts = new Map();
  for (const step of story.pasos) for (const id of new Set([step.persona, ...step.personas])) counts.set(id, (counts.get(id) || 0) + 1);
  const best = [...counts].sort((a, b) => b[1] - a[1])[0][0];
  assert.equal(best, 'A');
  const generator = read('scripts/generate/generate-home.mjs');
  assert.match(generator, /export function storyPortrait\(story\)/);
  assert.match(generator, /\.sort\(\(a, b\) => b\[1\] - a\[1\]\)\[0\]\?\.\[0\]/); // stable sort keeps first appearance
  const home = JSON.parse(read('src/generated/home.json'));
  assert.equal(Object.keys(home.gobernantesPorAnio).length, HOME_YEARS.length);
  assert.ok(home.historiasCarrusel.filter(story => story.retrato).length >= home.historiasCarrusel.length - 2);
});

test('the current tab keeps a single underline on hover', () => {
  assert.match(read('src/ui/motion.css'), /:is\(header \.site-nav,\.site-nav\)>a\[aria-current="page"\]:is\(:hover,:focus-visible\)\{background-size:0 1px\}/);
});

test('generic English summaries are neutral and use English names', () => {
  const root = new URL('../src/features/english/v6/', import.meta.url);
  for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-'))) {
    for (const file of fs.readdirSync(new URL(`${batch}/`, root))) {
      const text = fs.readFileSync(new URL(`${batch}/${file}`, root), 'utf8');
      assert.doesNotMatch(text, /(?:[Hh]is|[Hh]er|[Tt]heir|[Yy]our|[Ii]ts) (?:trajectory|career|path|track record) is linked to/, `${batch}/${file}`);
      for (const bad of ['They\'ll know', 'Cléneris', 'Holy Empire', 'Bisseglie', 'Sandeverino', 'Statamara', 'Great Chism', 'Thirty-Year War']) assert.equal(text.includes(bad), false, `${batch}/${file}: ${bad}`);
    }
  }
});

test('coin images show only the face with the king', () => {
  const sources = JSON.parse(read('scripts/assets/sources/portraits-609.json'));
  for (const id of ['HENRY2CYPRUS', 'JAMES2CYPRUS']) assert.equal(sources[id].encuadre, '50% 50%', id);
});
