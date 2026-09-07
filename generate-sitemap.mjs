import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { slugBasePersona, slugPublico } from "./src/utils/personPresentation.js";

const ROOT = process.cwd();
const PERSONAS_FILE = path.join(ROOT, "src", "personas.jsx");
const HISTORIAS_FILE = path.join(ROOT, "src", "historiaData.jsx");
const OUTPUT_FILES = [
  path.join(ROOT, "public", "sitemap-full.xml"),
  path.join(ROOT, "public", "sitemap.xml"),
];
const SITE_URL = String(process.env.VITE_SITE_URL || "https://www.treeofeurope.eu").replace(/\/+$/, "");

async function importJsxData(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  // Estos ficheros contienen únicamente datos JS (sin JSX). Importarlos como
  // data: URL evita depender de que Node reconozca la extensión .jsx.
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source, "utf8").toString("base64")}`;
  return import(moduleUrl);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const [{ PERSONAS }, { HISTORIAS }] = await Promise.all([
  importJsxData(PERSONAS_FILE),
  importJsxData(HISTORIAS_FILE),
]);

if (!Array.isArray(PERSONAS) || !Array.isArray(HISTORIAS)) {
  throw new Error("No se han podido cargar PERSONAS/HISTORIAS para generar el sitemap.");
}

// Debe ser idéntico al sistema de slugs de App.jsx: cuando dos personas tienen
// el mismo nombre, añadimos el ID para que las URLs sigan siendo únicas.
const personaSlugBaseCount = PERSONAS.reduce((acc, persona) => {
  const base = slugBasePersona(persona, "es");
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});

const personaUrls = PERSONAS.map((persona) => {
  const base = slugBasePersona(persona, "es");
  const slug = personaSlugBaseCount[base] > 1
    ? `${base}-${slugPublico(persona.id)}`
    : base;
  return `/es/persona/${slug}`;
});

const dinastiaUrls = [...new Set(PERSONAS.map((p) => p.dinastia).filter(Boolean))]
  .map((valor) => `/es/dinastia/${slugPublico(valor)}`);

const territorioUrls = [...new Set(PERSONAS.flatMap((p) => p.reinos || []).filter(Boolean))]
  .map((valor) => `/es/territorio/${slugPublico(valor)}`);

// No indexamos todavía historias marcadas como "Próximamente": evitamos crear
// páginas de contenido escaso hasta que el recorrido exista realmente.
const historiaUrls = HISTORIAS
  .filter((historia) => historia?.disponible && historia?.titulo)
  .map((historia) => `/es/historia/${slugPublico(historia.titulo)}`);

// /en/ sí existe como landing. Las fichas inglesas se añadirán automáticamente
// cuando empecemos a incorporar nombreEn y contenido inglés completo.
const englishPersonaUrls = (() => {
  const traducidas = PERSONAS.filter((p) => typeof p.nombreEn === "string" && p.nombreEn.trim());
  const counts = traducidas.reduce((acc, p) => {
    const base = slugBasePersona(p, "en");
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});
  return traducidas.map((p) => {
    const base = slugBasePersona(p, "en");
    const slug = counts[base] > 1 ? `${base}-${slugPublico(p.id)}` : base;
    return `/en/person/${slug}`;
  });
})();

const catalogoUrls = ["/es/personas", "/es/dinastias", "/es/territorios", "/es/historias"];
const proyectoUrls = ["/es/proyecto", "/es/fuentes", "/es/licencias", "/es/agradecimientos"];
const experienciaUrls = ["/es/desafio"];

const paths = [
  "/es/",
  "/en/",
  ...catalogoUrls,
  ...proyectoUrls,
  ...experienciaUrls,
  ...personaUrls,
  ...dinastiaUrls,
  ...territorioUrls,
  ...historiaUrls,
  ...englishPersonaUrls,
];

const uniquePaths = [...new Set(paths)];
if (uniquePaths.length !== paths.length) {
  const duplicates = paths.filter((item, index) => paths.indexOf(item) !== index);
  throw new Error(`Hay URLs duplicadas en el sitemap: ${[...new Set(duplicates)].join(", ")}`);
}

const urls = uniquePaths.map((pathname) => `${SITE_URL}${pathname}`);
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`),
  '</urlset>',
  '',
].join("\n");

await fs.mkdir(path.dirname(OUTPUT_FILES[0]), { recursive: true });
await Promise.all(OUTPUT_FILES.map((outputFile) => fs.writeFile(outputFile, xml, "utf8")));

console.log(`sitemap-full.xml + sitemap.xml generados: ${urls.length} URLs`);
console.log(`  Catálogos ES: ${catalogoUrls.length}`);
console.log(`  Proyecto ES: ${proyectoUrls.length}`);
console.log(`  Experiencias ES: ${experienciaUrls.length}`);
console.log(`  Personas ES: ${personaUrls.length}`);
console.log(`  Dinastías ES: ${dinastiaUrls.length}`);
console.log(`  Territorios ES: ${territorioUrls.length}`);
console.log(`  Historias ES: ${historiaUrls.length}`);
console.log(`  Personas EN: ${englishPersonaUrls.length}`);
