import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'vite';
import {SUPPORT_URL} from '../src/siteConfig.js';

let ProjectSupport, SiteFooter, InfoPage, EnglishPage, PrivacyPage, temp;
before(async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  temp = await fs.mkdtemp(path.join(root, '.ssg-build-support-test-'));
  const nodeEnv = process.env.NODE_ENV;
  try {
    await build({root, configFile: false, publicDir: false, logLevel: 'error', build: {
      ssr: 'tests/fixtures/project-support-entry.jsx', outDir: temp, emptyOutDir: false,
      minify: false, rolldownOptions: {output: {entryFileNames: 'entry.mjs'}},
    }});
    ({ProjectSupport, SiteFooter, InfoPage, EnglishPage, PrivacyPage} = await import(pathToFileURL(path.join(temp, 'entry.mjs')).href));
  } finally {
    if (nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = nodeEnv;
  }
});
after(async () => { if (temp) await fs.rm(temp, {recursive: true, force: true}); });

function documentFor(component, check) {
  const dom = new JSDOM(renderToStaticMarkup(component));
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('script, iframe, form'), null);
    for (const link of doc.querySelectorAll(`a[href="${SUPPORT_URL}"]`)) {
      assert.equal(link.target, '_blank');
      assert.ok(link.relList.contains('noopener'));
      assert.ok(link.relList.contains('noreferrer'));
    }
    check(doc);
  } finally { dom.window.close(); }
}

for (const locale of ['es', 'en']) {
  test(`el pie de página ${locale} ofrece un único enlace seguro a Ko-fi, también compacto`, () => {
    for (const compact of [false, true]) {
      documentFor(React.createElement(SiteFooter, {locale, compact}), doc => {
        const links = doc.querySelectorAll(`a[href="${SUPPORT_URL}"]`);
        assert.equal(links.length, 1);
        assert.match(links[0].textContent, locale === 'es' ? /Apoyar el proyecto/ : /Support the project/);
        assert.match(links[0].getAttribute('aria-label'), locale === 'es' ? /otra pestaña/ : /new tab/);
        assert.ok(doc.querySelector(`a[href="${locale === 'es' ? '/es/privacidad' : '/en/privacy'}"]`));
      });
    }
  });
  test(`el bloque de apoyo ${locale} mantiene el acceso gratuito y sin contraprestación`, () => {
    documentFor(React.createElement(ProjectSupport, {locale}), doc => {
      assert.equal(doc.querySelectorAll(`a[href="${SUPPORT_URL}"]`).length, 1);
      assert.match(doc.querySelector('p').textContent, locale === 'es' ? /no compra productos, servicios ni acceso exclusivo/ : /does not purchase products, services or exclusive access/);
      assert.match(doc.querySelector('p').textContent, locale === 'es' ? /sin aportar dinero/ : /without contributing/);
    });
  });
  test(`privacidad ${locale} explica los pagos externos y los registros recibidos`, () => {
    documentFor(React.createElement(PrivacyPage, {locale}), doc => {
      assert.equal(doc.querySelectorAll('a[href="https://more.ko-fi.com/privacy"]').length, 1);
      assert.equal(doc.querySelectorAll('a[href="https://stripe.com/privacy"]').length, 1);
      assert.match(doc.querySelector('.privacy-content').textContent, locale === 'es' ? /no carga sus scripts/ : /load its scripts/);
      assert.match(doc.querySelector('.privacy-content').textContent, locale === 'es' ? /detalles de la operación/ : /transaction details/);
    });
  });
}

test('el bloque de apoyo aparece en Acerca del proyecto español, no en fuentes ni licencias', () => {
  for (const tipo of ['proyecto', 'fuentes', 'licencias', 'agradecimientos']) {
    documentFor(React.createElement(InfoPage, {tipo}), doc => {
      assert.equal(doc.querySelectorAll('main .project-support-card').length, tipo === 'proyecto' ? 1 : 0);
    });
  }
});

test('el bloque inglés aparece en About, incluido el render estático, no en Methodology', () => {
  for (const type of ['about', 'methodology']) {
    const page = {slug: type, data: {type, path: `/en/${type}`, nombre: type, description: 'Test', sections: []}};
    documentFor(React.createElement(EnglishPage, {page}), doc => {
      assert.equal(doc.querySelectorAll('main .project-support-card').length, type === 'about' ? 1 : 0);
      assert.equal(doc.querySelectorAll(`footer a[href="${SUPPORT_URL}"]`).length, 1);
    });
  }
});
