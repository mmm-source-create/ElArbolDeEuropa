// 6.0.10: data for the redesigned home page, in both languages.
// - Rulers in 1500 for the panel beside the map.
// - Carousels: people, dynasties (with arms) and stories.
// - The pool for the person of the day: people with a painted portrait and an
//   extended biography in Spanish and English (public/catalogos/recomendaciones.json).
// Runs after generate-english, before generate-seo.
import fs from 'node:fs/promises';
import {PERSONAS} from '../../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../../src/data/imagenesPersonas.js';
import {escudoDe} from '../../src/content/dinastias/escudos.js';
import {isNamedDynasty} from '../../src/data/dynastyNames.js';
import {ENGLISH_DYNASTIES, ENGLISH_TERRITORIES} from '../../src/features/english/entityTranslations.js';
import {biografiaExtensaPersona} from '../../src/content/biografias-extensas.js';
import {HISTORIAS} from '../../src/data/historias.js';
import {HOME_YEARS} from '../../src/features/public/homeYears.js';

const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = (file, data) => fs.writeFile(file, JSON.stringify(data));
export const HOME_YEAR = 1500;
// Paintings and manuscript miniatures; prints, coins, statues and disputed
// identifications are left out of the daily pick.
export const PAINTED = /^(Retrato|Copia de un retrato|Autorretrato|Miniatura|Representación)/;

const home = await readJson('src/generated/home.json');
const englishHome = await readJson('public/english-meta/home.json');
const esPeople = (await readJson('public/catalogos/personas.json')).items;
const esDynasties = (await readJson('public/catalogos/dinastias.json')).items;
const esStories = (await readJson('public/catalogos/historias.json')).items;
const enPeople = (await readJson('public/english-meta/people.json')).people;
const enDynasties = (await readJson('public/english-meta/dynasties.json')).dynasties;
const enById = new Map(enPeople.map(p => [p.id, p]));
const esById = new Map(esPeople.map(p => [p.id, p]));
const enDynastyBySlug = new Map(enDynasties.map(d => [d.slug, d]));
const enHouse = Object.fromEntries(Object.values(ENGLISH_DYNASTIES).filter(d => d?.key).map(d => [d.key, d.name]));
const enTerritory = Object.fromEntries(Object.values(ENGLISH_TERRITORIES).filter(t => t?.key).map(t => [t.key, t.name]));
const life = p => ({nac: p.nac ?? null, muer: p.muer ?? null, nacAprox: Boolean(p.nacAprox), muerAprox: Boolean(p.muerAprox)});

// Rulers with an effective reign in each year of the time line, with a
// portrait, most relevant first. 6.0.11: one panel per previewed year.
function rulersOf(year) {
  const holding = PERSONAS
    .map(p => [p, (p.gobiernos || []).find(g => g.clase === 'reinado' && g.condicion === 'efectivo' && g.desde <= year && g.hasta >= year)])
    .filter(([p, g]) => g && IMAGENES_PERSONAS[p.id] && esById.has(p.id) && enById.has(p.id))
    .sort(([a], [b]) => (esById.get(b.id).relevancia || 0) - (esById.get(a.id).relevancia || 0))
    .slice(0, 5);
  const total = PERSONAS.filter(p => (p.gobiernos || []).some(g => g.desde <= year && g.hasta >= year && g.condicion === 'efectivo')).length;
  return {
    es: {anio: year, total, personas: holding.map(([p, g]) => ({id: p.id, nombre: esById.get(p.id).nombre, slug: esById.get(p.id).slug, territorio: g.territorio, desde: g.desde, hasta: g.hasta}))},
    en: {year, total, people: holding.map(([p, g]) => ({id: p.id, nombre: enById.get(p.id).nombre, path: enById.get(p.id).path, territory: enTerritory[g.territorio] || g.territorio, from: g.desde, to: g.hasta}))},
  };
}
const byYear = Object.fromEntries(HOME_YEARS.map(year => [year, rulersOf(year)]));
home.gobernantesAnio = byYear[HOME_YEAR].es;
englishHome.rulersOfYear = byYear[HOME_YEAR].en;
home.gobernantesPorAnio = Object.fromEntries(HOME_YEARS.map(year => [year, byYear[year].es]));
englishHome.rulersByYear = Object.fromEntries(HOME_YEARS.map(year => [year, byYear[year].en]));
const rulers = byYear[HOME_YEAR].es.personas;

// Dynasty carousel: houses with arms and a written history, largest first.
const dynasties = esDynasties.filter(d => escudoDe(d.nombre) && d.editorial).slice(0, 12);
home.dinastiasCarrusel = dynasties.map(d => ({nombre: d.nombre, slug: d.slug, total: d.total, resumen: d.resumen || ''}));
englishHome.dynasties = dynasties.map(d => enDynastyBySlug.get(d.slug)).filter(Boolean).map(d => ({key: d.key, nombre: d.nombre, path: d.path, total: d.total, description: d.description || ''}));
// 6.0.11: each story shows the person who appears in most of its chapters
// (ties: the first to appear) among those with a portrait.
export function storyPortrait(story) {
  const counts = new Map();
  for (const step of story?.pasos || []) for (const id of new Set([step.persona, ...(step.personas || [])].filter(Boolean))) counts.set(id, (counts.get(id) || 0) + 1);
  return [...counts].filter(([id]) => IMAGENES_PERSONAS[id]).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}
const storyById = new Map(HISTORIAS.map(story => [story.id, story]));
home.historiasCarrusel = esStories.filter(s => s.disponible).slice(0, 12).map(s => ({...s, retrato: storyPortrait(storyById.get(s.id))}));
englishHome.stories = (englishHome.stories || []).slice(0, 12).map(s => ({...s, retrato: storyPortrait(storyById.get(s.id))}));

// Most searched (Search Console, November 2026): shortcuts under the search box.
const SEARCHED_PEOPLE = ['FED2HOH', 'MATILDLANCBAV', 'ISABELNEVILLE', 'ENRIQ4CAST'];
home.masBuscados = [...SEARCHED_PEOPLE.filter(id => esById.has(id)).map(id => ({nombre: esById.get(id).nombre, path: `/es/persona/${esById.get(id).slug}`})), {nombre: 'Casa MacCarthy', path: '/es/dinastia/maccarthy'}];
englishHome.mostSearched = [...SEARCHED_PEOPLE.filter(id => enById.has(id)).map(id => ({nombre: enById.get(id).nombre, path: enById.get(id).path})), {nombre: 'MacCarthy dynasty', path: enDynastyBySlug.get('maccarthy')?.path || '/en/dynasties'}];

// Person of the day.
const firstSection = sections => {
  const text = String(sections?.[0]?.texto || '').replace(/\s+/g, ' ').trim();
  if (text.length <= 420) return text;
  const cut = text.slice(0, 420), end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return end > 200 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};
const pool = [];
for (const p of PERSONAS) {
  const image = IMAGENES_PERSONAS[p.id], es = esById.get(p.id), en = enById.get(p.id);
  if (!image || !PAINTED.test(image.tipo || '') || !es || !en) continue;
  // Spanish biography from the source; English from the generated edition
  // (generate-english runs first, also before the tests).
  const esBiography = biografiaExtensaPersona(p);
  let enMeta;
  try { enMeta = await readJson(`public/english-meta/person-${en.path.split('/').pop()}.json`); } catch { continue; }
  if (!esBiography?.length || !enMeta.biografiaExtensa?.length) continue;
  const esMeta = {biografiaExtensa: esBiography};
  pool.push({id: p.id, ...life(p),
    es: {nombre: es.nombre, path: `/es/persona/${es.slug}`, titulo: es.titulo || '', casa: isNamedDynasty(p.dinastia) ? p.dinastia : '', texto: firstSection(esMeta.biografiaExtensa)},
    en: {nombre: en.nombre, path: en.path, titulo: en.role || '', casa: isNamedDynasty(p.dinastia) ? (enHouse[p.dinastia] || p.dinastia) : '', texto: firstSection(enMeta.biografiaExtensa)}});
}
pool.sort((a, b) => a.id.localeCompare(b.id));
if (pool.length < 30) throw new Error(`Solo ${pool.length} personas para la recomendación diaria`);
await writeJson('public/catalogos/recomendaciones.json', {items: pool});
// The person of the day is chosen in the browser: the static page must not
// depend on the day it was built.
delete home.recomendacion;
delete englishHome.recommendation;
englishHome.nombre = 'Six centuries of Europe, family by family';

await writeJson('src/generated/home.json', home);
await writeJson('public/catalogos/home.json', home);
await writeJson('public/english-meta/home.json', englishHome);
console.log(`Portada: ${HOME_YEARS.length} años con gobernantes (${rulers.length} en ${HOME_YEAR}), ${dynasties.length} casas, ${home.historiasCarrusel.length} historias y ${pool.length} personas para la recomendación diaria.`);
