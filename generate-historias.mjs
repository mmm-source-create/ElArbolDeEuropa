import fs from 'node:fs/promises';
import { slugPublico } from './src/utils/personPresentation.js';
const source = await fs.readFile('src/historiaData.jsx', 'utf8');
const { HISTORIAS } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const files = await fs.readdir('public/personas-meta');
const people = new Map();
for (const file of files.filter(f => f.endsWith('.json') && f !== 'index.json')) {
  const p = JSON.parse(await fs.readFile(`public/personas-meta/${file}`, 'utf8'));
  if (p.id) people.set(p.id, p);
}
let count = 0;
for (const story of HISTORIAS.filter(h => h.disponible && h.pasos?.length)) {
  const slug = slugPublico(story.titulo);
  const ids = [...new Set(story.pasos.flatMap(p => p.personas || [p.persona]).filter(Boolean))];
  const protagonists = ids.map(id => {
    const p = people.get(id);
    if (!p) throw new Error(`Protagonista desconocido: ${story.id} / ${id}`);
    return { id, slug:p.slug, nombre:p.nombre, resumen:p.resumen, biografia:p.biografia };
  });
  const fuentes = [...new Map(ids.flatMap(id => people.get(id).fuentes || []).map(f => [JSON.stringify(f), f])).values()];
  const years = story.pasos.map(p => p.anio).filter(Number.isFinite);
  const base = { ...story, slug, storyTitle:story.titulo, period:`${Math.min(...years)}–${Math.max(...years)}`, protagonists, fuentes };
  await fs.mkdir(`public/historias-meta/${slug}/capitulo`, {recursive:true});
  for (let chapter = 0; chapter <= story.pasos.length; chapter++) {
    const data = {...base, chapter:chapter || null, nombre:chapter ? story.pasos[chapter-1].titulo : story.titulo};
    await fs.writeFile(`public/historias-meta/${slug}${chapter ? `/capitulo/${chapter}` : ''}.json`, JSON.stringify(data));
    count++;
  }
  // Old identifier-based links remain readable and canonicalize to the title slug.
  const alias = slugPublico(story.id);
  if (alias !== slug) await fs.copyFile(`public/historias-meta/${slug}.json`, `public/historias-meta/${alias}.json`);
}
console.log(`Historias: ${count} entradas y capítulos generados.`);
