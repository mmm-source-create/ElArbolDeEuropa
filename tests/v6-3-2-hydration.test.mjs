import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims} from '../src/evidence/claims.js';
import {slugBasePersona, slugPublico} from '../src/domain/people/personPresentation.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import CrownTimeline from '../src/components/CrownTimeline.jsx';
import CrownTimelineView, {staticCrownModel} from '../src/components/CrownTimelineView.jsx';

// Static imports reachable from a module, as the bundler would follow them.
function reachable(start) {
  const seen = new Set([path.resolve(start)]);
  const queue = [...seen];
  while (queue.length) {
    const file = queue.shift();
    if (!/\.(m?jsx?)$/.test(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/^\s*(?:import|export)\s[^;]*?from\s*['"](\.[^'"]+)['"]|^\s*import\s*['"](\.[^'"]+)['"]/gm)) {
      const base = path.resolve(path.dirname(file), (match[1] || match[2]).replace(/\?.*$/, ''));
      const found = [base, `${base}.js`, `${base}.jsx`, `${base}/index.js`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (found && !seen.has(found)) { seen.add(found); queue.push(found); }
    }
  }
  return [...seen].map(file => path.relative(process.cwd(), file));
}

const record = slug => JSON.parse(fs.readFileSync(`public/personas-meta/${slug}.json`, 'utf8'));

test('la ficha estática se hidrata sin la base de personas, la evidencia ni las tablas de retratos', () => {
  const modules = new Set([...reachable('src/features/public/PersonPage.jsx'), ...reachable('src/features/public/staticData.js')]);
  for (const heavy of ['src/data/personas.js', 'src/evidence/claims.js', 'src/evidence/reviewRecords.js', 'src/content/sources.js',
    'src/data/imagenesPersonas.js', 'src/data/imageVariants.js', 'src/data/territorios.js', 'src/domain/government/governmentPresentation.js']) {
    assert.ok(!modules.has(heavy), `${heavy} no debe cargarse al hidratar una ficha`);
  }
  const main = fs.readFileSync('src/app/main.jsx', 'utf8');
  assert.match(main, /persona:page=>import\('\.\.\/features\/public\/PersonPage\.jsx'\)/);
});

test('cada ficha lleva sus afirmaciones, su retrato, sus miniaturas y sus etapas de gobierno', () => {
  const carlos = record('carlos-v');
  const {claims, crownTimeline, retrato, ...base} = carlos;
  assert.deepEqual(claims, JSON.parse(JSON.stringify(personClaims(base))), 'las mismas afirmaciones que calculaba el navegador');
  assert.ok(claims.length > 40);
  assert.match(retrato.responsive.srcSet, /\d+w/);
  assert.ok(carlos.padres.every(parent => 'thumb' in parent));
  assert.ok(carlos.hijos.some(child => child.thumb?.srcSet));
  assert.ok(crownTimeline.stages.length > 5);
  assert.ok(crownTimeline.stages.every(stage => stage.grouped.every(group => group.mandates.every(index => Number.isInteger(index) && crownTimeline.mandates[index]))));
});

test('la línea de coronas de la ficha coincide con la que calcula el Atlas', () => {
  for (const slug of ['carlos-v', 'felipe-ii-de-espana', 'isabel-i-de-castilla']) {
    const data = record(slug);
    const model = staticCrownModel(data.crownTimeline);
    const live = React.createElement(CrownTimeline, {persona: data, accesos: data.accesosCoronas, fuentes: data.fuentes});
    for (const stage of data.crownTimeline.stages) {
      const props = {persona: data, fuentes: data.fuentes, anio: stage.desde};
      assert.equal(renderToStaticMarkup(React.createElement(CrownTimelineView, {...props, model})),
        renderToStaticMarkup(React.cloneElement(live, {anio: stage.desde})), `${slug} ${stage.desde}`);
    }
  }
  assert.equal(staticCrownModel(null), null);
});

test('las direcciones en español de las personas traducidas no cambian', () => {
  const counts = {};
  PERSONAS.forEach(person => { const base = slugBasePersona(person, 'es'); counts[base] = (counts[base] || 0) + 1; });
  const expected = Object.fromEntries(PERSONAS.map(person => { const base = slugBasePersona(person, 'es'); return [person.id, counts[base] > 1 ? `${base}-${slugPublico(person.id)}` : base]; }));
  const titled = JSON.parse(JSON.stringify(TRANSLATED_PEOPLE)).filter(route => route.es === expected[route.id]);
  assert.ok(titled.length > 2000);
  assert.ok(TRANSLATED_PEOPLE.every(route => route.es));
});
