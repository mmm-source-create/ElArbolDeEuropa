import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readReview, sanitizeReviewQuestion} from '../src/desafio/learning.js';
import LearningSession from '../src/desafio/LearningSession.jsx';
import {secretFindings, activeSvgContent} from '../scripts/audit-security.mjs';
import {auditScriptPolicy} from '../scripts/security-policy.mjs';
import {SCREEN_NOTICE_SCRIPT} from '../src/public/screenNotice.js';
import {metricWithoutParameters} from '../src/monitoring.js';
import {resolveSiteUrl, DEFAULT_SITE_URL} from '../src/siteConfig.js';

const question = {firma: 'pregunta', pregunta: '¿Quién?', explicacion: 'Contexto', etiqueta: 'Repaso', formato: 'opciones', correctaId: 'A', opciones: [{id: 'A', label: 'A'}, {id: 'B', label: 'B'}]};
const storage = data => ({getItem: () => JSON.stringify(data)});

test('un registro de repaso corrupto se descarta y la pregunta válida sigue renderizándose', () => {
  const bad = [
    {etiqueta: {}}, {territorio: []}, {atlasPersonId: '__proto__'}, {imagenId: 'constructor'},
    {fuentes: ['javascript:alert(1)']}, {fuentes: ['https://user:pass@example.org']},
    {pregunta: 'x'.repeat(2001)}, {opciones: [{id: 'A', label: {}}, {id: 'B', label: 'B'}]},
  ].map((change, i) => ({...question, firma: `bad-${i}`, ...change}));
  const result = readReview(storage([...bad, question]), {}, []);
  assert.deepEqual(result, [question]);
  const html = renderToStaticMarkup(React.createElement(LearningSession, {questions: result, mode: 'repaso', byId: {}}));
  assert.match(html, /¿Quién\?/);
});
test('el repaso reconstruye solo campos conocidos y limita la lectura', () => {
  const polluted = JSON.parse(JSON.stringify(question).slice(0, -1) + ',"__proto__":{"polluted":true},"extra":{"foo":1}}');
  const clean = sanitizeReviewQuestion(polluted, {});
  assert.deepEqual(clean, question);
  assert.equal(Object.hasOwn(clean, '__proto__'), false);
  assert.deepEqual(readReview({getItem: () => ' '.repeat(4 * 1024 * 1024 + 1)}, {}, []), []);
});
test('el texto del repaso se representa como texto, sin crear contenido HTML activo', () => {
  const clean = sanitizeReviewQuestion({...question, pregunta: '<img src=x onerror=alert(1)>'}, {});
  const html = renderToStaticMarkup(React.createElement(LearningSession, {questions: [clean], mode: 'repaso', byId: {}}));
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<img src=x/);
});
test('la CSP permite el aviso exacto y los scripts propios, rechazando inyecciones', () => {
  const origin = DEFAULT_SITE_URL;
  assert.deepEqual(auditScriptPolicy(`<script>${SCREEN_NOTICE_SCRIPT}</script><script type="module" src="/assets/main.js"></script>`, origin), []);
  assert.ok(auditScriptPolicy('<script>alert(1)</script>', origin).length);
  assert.ok(auditScriptPolicy('<script src="https://outside.test/a.js"></script>', origin).length);
  assert.ok(auditScriptPolicy(`<script>${SCREEN_NOTICE_SCRIPT} </script>`, origin).length);
  assert.deepEqual(auditScriptPolicy('<script type="application/json">{"safe":true}</script>', origin), []);
});
test('el detector de secretos informa del tipo y línea sin mostrar el secreto', () => {
  const token = 'gh' + 'p_' + 'A'.repeat(36);
  const findings = secretFindings(`primera línea\n${token}`);
  assert.deepEqual(findings, [{kind: 'token de GitHub', line: 2}]);
  assert.ok(!JSON.stringify(findings).includes(token));
  assert.ok(activeSvgContent('<svg onload="doSomething()"/>'));
  assert.ok(activeSvgContent('<svg><foreignObject/></svg>'));
  assert.equal(activeSvgContent('<svg><path d="M0 0"/></svg>'), false);
});
test('las métricas no envían búsquedas, fragmentos ni credenciales de URL', () => {
  const result = metricWithoutParameters({type: 'vital', url: 'https://user:pass@www.treeofeurope.eu/es/desafio?reto=seed&q=nombre#seccion'});
  assert.equal(result.url, `${DEFAULT_SITE_URL}/es/desafio`);
  assert.equal(metricWithoutParameters({url: 'javascript:alert(1)'}), null);
  assert.equal(metricWithoutParameters({url: 'incorrecto'}), null);
});
test('el origen del proyecto es común y rechaza configuraciones ambiguas', () => {
  assert.equal(resolveSiteUrl(''), DEFAULT_SITE_URL);
  assert.equal(resolveSiteUrl(`${DEFAULT_SITE_URL}/`), DEFAULT_SITE_URL);
  for (const value of ['javascript:alert(1)', 'https://user:pass@example.org', 'https://example.org/path', 'https://example.org/?q=1']) assert.throws(() => resolveSiteUrl(value));
});
