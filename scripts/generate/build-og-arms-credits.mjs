// Pre-renders the credit line that a share card needs under a CC BY or CC BY-SA
// shield. The text is drawn once, with the fonts of the machine running this
// script, so the build never depends on server fonts (like og-wordmark.png).
// Re-run it after changing escudosCommons.js: the share-card build fails when
// a strip is missing.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {CREDITOS_ESCUDOS} from '../../src/content/dinastias/escudos.js';
import {OG_FREE_LICENCE, ogArmsCreditFile} from '../../src/features/public/ogImages.js';

const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const credits = new Map(CREDITOS_ESCUDOS.filter(c => !OG_FREE_LICENCE.test(c.licencia)).map(c => [c.archivo, c]));
const dir = path.dirname(ogArmsCreditFile('/x.svg'));
await fs.rm(dir, {recursive: true, force: true});
await fs.mkdir(dir, {recursive: true});
for (const [archivo, c] of credits) {
  const text = `<span foreground="#6B5A48">Escudo: ${escape(c.autor)} · ${escape(c.licencia)} · Wikimedia Commons</span>`;
  await sharp({text: {text, font: 'Georgia 17', width: 600, align: 'centre', rgba: true, dpi: 72}}).png().toFile(ogArmsCreditFile(archivo));
}
console.log(`Créditos para tarjetas: ${credits.size}`);
