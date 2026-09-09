import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PERSONAS_FILE = path.join(ROOT, "src", "personas.jsx");
const HISTORIAS_FILE = path.join(ROOT, "src", "historiaData.jsx");
const META_FILE = path.join(ROOT, "src", "generated", "siteMeta.json");
const TREE_FILE = path.join(ROOT, "src", "generated", "treeBase.json");
const BASELINE_FILE = path.join(ROOT, "audit-baseline.json");
const REPORT_FILE = path.join(ROOT, "audit-report.json");

const FAIL_ON_ERRORS = process.argv.includes("--fail-on-errors");
const WRITE_BASELINE = process.argv.includes("--write-baseline");

async function importData(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source, "utf8").toString("base64")}`;
  return import(moduleUrl);
}

async function readJsonIfExists(filePath, fallback = null) {
  try { return JSON.parse(await fs.readFile(filePath, "utf8")); }
  catch { return fallback; }
}

const personasModule = await importData(PERSONAS_FILE);
const historiasModule = await importData(HISTORIAS_FILE);
const PERSONAS = Array.isArray(personasModule.PERSONAS) ? personasModule.PERSONAS : [];
const HISTORIAS = Array.isArray(historiasModule.HISTORIAS) ? historiasModule.HISTORIAS : [];
const EVENTOS = Array.isArray(historiasModule.EVENTOS_HISTORICOS) ? historiasModule.EVENTOS_HISTORICOS : [];
const siteMeta = await readJsonIfExists(META_FILE);
const treeBase = await readJsonIfExists(TREE_FILE);
const baselineRaw = await readJsonIfExists(BASELINE_FILE, { accepted: [] });
const baseline = new Set(Array.isArray(baselineRaw?.accepted) ? baselineRaw.accepted : []);

const issues = [];
const add = (severity, code, subject, message, extra = {}) => {
  const fingerprint = `${code}|${subject}|${message}`;
  issues.push({ severity, code, subject, message, fingerprint, legacy: baseline.has(fingerprint), ...extra });
};

const values = (v) => Array.isArray(v) ? v : v == null ? [] : [v];
const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const spouses = (p) => uniq([p?.conyuge, p?.conyuge2, ...values(p?.conyuges)]);
const lovers = (p) => uniq(values(p?.amantes));
const allRefs = (p) => ({
  padre: values(p?.padre),
  madre: values(p?.madre),
  conyuge: spouses(p),
  amante: lovers(p),
});

const idCounts = new Map();
for (const p of PERSONAS) idCounts.set(p?.id, (idCounts.get(p?.id) || 0) + 1);
for (const [id, count] of idCounts) {
  if (!id || typeof id !== "string") add("ERROR", "ID_INVALID", String(id), "ID vacío o no textual");
  else if (count > 1) add("ERROR", "ID_DUPLICATE", id, `ID repetido ${count} veces`);
}
const BY_ID = Object.fromEntries(PERSONAS.filter((p) => p?.id).map((p) => [p.id, p]));
const HIJOS_POR_ID = PERSONAS.reduce((acc, persona) => {
  for (const parentId of [persona?.padre, persona?.madre]) {
    if (!parentId) continue;
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(persona.id);
  }
  return acc;
}, {});

for (const p of PERSONAS) {
  const id = p?.id || "<sin-id>";
  if (!p?.nombre || typeof p.nombre !== "string") add("ERROR", "NAME_MISSING", id, "La ficha no tiene nombre válido");

  for (const [field, refs] of Object.entries(allRefs(p))) {
    const raw = field === "conyuge" ? [p?.conyuge, p?.conyuge2, ...values(p?.conyuges)] : field === "amante" ? values(p?.amantes) : values(p?.[field]);
    const cleaned = raw.filter(Boolean);
    if (new Set(cleaned).size !== cleaned.length) add("WARNING", "REL_DUPLICATE", id, `${field}: contiene referencias duplicadas`);
    for (const ref of refs) {
      if (ref === id) add("ERROR", "REL_SELF", id, `${field}: referencia a la propia persona`);
      else if (!BY_ID[ref]) add("ERROR", "REL_MISSING", id, `${field}: referencia inexistente ${ref}`);
    }
  }

  for (const partnerId of spouses(p)) {
    const partner = BY_ID[partnerId];
    if (partner && !spouses(partner).includes(id)) add("WARNING", "SPOUSE_ONE_WAY", `${id}->${partnerId}`, `${p.nombre} declara matrimonio con ${partner.nombre}, pero la relación no es recíproca`);
  }
  for (const loverId of lovers(p)) {
    const partner = BY_ID[loverId];
    if (partner && !lovers(partner).includes(id)) add("INFO", "LOVER_ONE_WAY", `${id}->${loverId}`, `${p.nombre} declara relación con ${partner.nombre}, pero la relación no es recíproca`);
  }

  for (const [role, parentId] of [["padre", p?.padre], ["madre", p?.madre]]) {
    const parent = BY_ID[parentId];
    if (!parent) continue;
    if (Number.isFinite(p.nac) && Number.isFinite(parent.nac)) {
      const age = p.nac - parent.nac;
      if (age < 0) add("ERROR", "PARENT_BORN_AFTER_CHILD", id, `${role} ${parent.nombre} nace después de ${p.nombre}`);
      else if (age < 12) add("ERROR", "PARENT_TOO_YOUNG", id, `${role} ${parent.nombre} tendría ${age} años al nacer ${p.nombre}`);
      else if (role === "madre" && age > 55) add("WARNING", "MOTHER_AGE_HIGH", id, `${parent.nombre} tendría ${age} años al nacer ${p.nombre}`);
      else if (role === "padre" && age > 80) add("WARNING", "FATHER_AGE_HIGH", id, `${parent.nombre} tendría ${age} años al nacer ${p.nombre}`);
    }
    if (Number.isFinite(p.nac) && Number.isFinite(parent.muer)) {
      const delta = p.nac - parent.muer;
      if (role === "madre" && delta > 0) add("ERROR", "BIRTH_AFTER_MOTHER_DEATH", id, `${p.nombre} nace ${delta} año(s) después de la muerte de su madre ${parent.nombre}`);
      if (role === "padre" && delta > 1) add("ERROR", "BIRTH_LONG_AFTER_FATHER_DEATH", id, `${p.nombre} nace ${delta} años después de la muerte de su padre ${parent.nombre}`);
      else if (role === "padre" && delta === 1) add("INFO", "POSTHUMOUS_POSSIBLE", id, `${p.nombre} nace al año siguiente de la muerte de su padre ${parent.nombre}; revisar solo si las fechas son exactas`);
    }
  }

  const reigns = Array.isArray(p.gobiernos) ? p.gobiernos : [];
  reigns.forEach((r, index) => {
    const key = `${id}#${index + 1}`;
    if (!r?.territorio) add("ERROR", "REIGN_TERRITORY_MISSING", key, "Reinado sin territorio");
    if (!Number.isFinite(r?.desde) || !Number.isFinite(r?.hasta)) add("ERROR", "REIGN_DATE_MISSING", key, "Reinado sin fechas numéricas completas");
    else {
      if (r.desde > r.hasta) add("ERROR", "REIGN_REVERSED", key, `${r.territorio}: ${r.desde}–${r.hasta}`);
      if (Number.isFinite(p.nac) && r.desde < p.nac) add("ERROR", "REIGN_BEFORE_BIRTH", key, `${r.territorio} comienza en ${r.desde}, antes del nacimiento (${p.nac})`);
      if (Number.isFinite(p.muer) && r.hasta > p.muer && !["titular", "pretensión", "pretension"].includes(String(r.condicion || "").toLowerCase())) {
        add("WARNING", "REIGN_AFTER_DEATH", key, `${r.territorio} termina en ${r.hasta}, después de la muerte (${p.muer})`);
      }
    }
  });
  for (let i = 0; i < reigns.length; i += 1) {
    for (let j = i + 1; j < reigns.length; j += 1) {
      const a = reigns[i], b = reigns[j];
      if (!a?.territorio || a.territorio !== b?.territorio || !Number.isFinite(a.desde) || !Number.isFinite(a.hasta) || !Number.isFinite(b.desde) || !Number.isFinite(b.hasta)) continue;
      const overlap = Math.max(a.desde, b.desde) < Math.min(a.hasta, b.hasta);
      if (overlap) add("WARNING", "REIGN_OVERLAP", id, `${a.territorio}: reinados solapados ${a.desde}–${a.hasta} y ${b.desde}–${b.hasta}`);
    }
  }

  const childIds = HIJOS_POR_ID[id] || [];
  if (childIds.length > 0 && spouses(p).length === 0 && lovers(p).length === 0) {
    const sample = childIds.slice(0, 4).map((childId) => BY_ID[childId]?.nombre || childId).join(", ");
    const rest = childIds.length > 4 ? ` (+${childIds.length - 4} más)` : "";
    add("INFO", "PARENT_WITHOUT_PARTNER", id, `${p.nombre}: ${childIds.length} hijo(s) registrado(s), sin cónyuge ni amante registrado · ${sample}${rest}`);
  }

  if (!Number.isFinite(p.nac) && !Number.isFinite(p.muer)) add("INFO", "DATES_UNKNOWN", id, `${p.nombre}: sin fechas de nacimiento ni muerte`);
  if (!p.padre && !p.madre) add("INFO", "ANCESTRY_EMPTY", id, `${p.nombre}: sin ascendencia registrada`);
}

// Ciclos genealógicos: solo padre/madre.
const visitState = new Map();
const stack = [];
function visit(id) {
  const state = visitState.get(id) || 0;
  if (state === 2) return;
  if (state === 1) {
    const pos = stack.indexOf(id);
    const cycle = [...stack.slice(pos), id];
    add("ERROR", "ANCESTRY_CYCLE", id, `Ciclo genealógico: ${cycle.join(" -> ")}`);
    return;
  }
  visitState.set(id, 1);
  stack.push(id);
  const p = BY_ID[id];
  for (const parentId of [p?.padre, p?.madre]) if (BY_ID[parentId]) visit(parentId);
  stack.pop();
  visitState.set(id, 2);
}
Object.keys(BY_ID).forEach(visit);

// Componentes del grafo familiar para detectar islas pequeñas.
const familyAdj = new Map(Object.keys(BY_ID).map((id) => [id, new Set()]));
for (const p of PERSONAS) {
  if (!p?.id) continue;
  const refs = uniq([p.padre, p.madre, ...spouses(p)]).filter((id) => BY_ID[id]);
  refs.forEach((ref) => { familyAdj.get(p.id).add(ref); familyAdj.get(ref).add(p.id); });
}
const unseen = new Set(Object.keys(BY_ID));
const components = [];
while (unseen.size) {
  const start = unseen.values().next().value;
  const q = [start]; unseen.delete(start); const ids = [];
  while (q.length) {
    const id = q.shift(); ids.push(id);
    for (const n of familyAdj.get(id) || []) if (unseen.delete(n)) q.push(n);
  }
  components.push(ids);
}
components.sort((a, b) => b.length - a.length);
for (const comp of components.slice(1)) {
  if (comp.length <= 4) add("INFO", "SMALL_COMPONENT", comp[0], `Componente familiar aislado de ${comp.length} persona(s): ${comp.slice(0, 4).map((id) => BY_ID[id]?.nombre || id).join(", ")}`);
}

// Historias y eventos.
const eventCounts = new Map();
for (const e of EVENTOS) eventCounts.set(e?.id, (eventCounts.get(e?.id) || 0) + 1);
for (const [id, count] of eventCounts) {
  if (!id) add("ERROR", "EVENT_ID_INVALID", "<evento>", "Evento sin ID");
  else if (count > 1) add("ERROR", "EVENT_ID_DUPLICATE", id, `ID de evento repetido ${count} veces`);
}
const EVENT_BY_ID = Object.fromEntries(EVENTOS.filter((e) => e?.id).map((e) => [e.id, e]));
for (const e of EVENTOS) {
  for (const personId of uniq(values(e?.personas))) if (!BY_ID[personId]) add("ERROR", "EVENT_PERSON_MISSING", e?.id || "<evento>", `Referencia a persona inexistente ${personId}`);
}
const storyCounts = new Map();
for (const h of HISTORIAS) storyCounts.set(h?.id, (storyCounts.get(h?.id) || 0) + 1);
for (const [id, count] of storyCounts) {
  if (!id) add("ERROR", "STORY_ID_INVALID", "<historia>", "Historia sin ID");
  else if (count > 1) add("ERROR", "STORY_ID_DUPLICATE", id, `ID de historia repetido ${count} veces`);
}
for (const h of HISTORIAS) {
  const steps = Array.isArray(h?.pasos) ? h.pasos : [];
  if (h?.disponible && !steps.length) add("ERROR", "STORY_AVAILABLE_EMPTY", h?.id || "<historia>", "Historia disponible sin pasos");
  steps.forEach((step, index) => {
    const subject = `${h?.id || "<historia>"}#${index + 1}`;
    for (const personId of uniq([step?.persona, ...values(step?.personas)])) if (personId && !BY_ID[personId]) add("ERROR", "STORY_PERSON_MISSING", subject, `Referencia a persona inexistente ${personId}`);
    if (step?.eventoId && !EVENT_BY_ID[step.eventoId]) add("ERROR", "STORY_EVENT_MISSING", subject, `Referencia a evento inexistente ${step.eventoId}`);
    if (step?.eventoId && EVENT_BY_ID[step.eventoId] && Number.isFinite(step.anio)) {
      const event = EVENT_BY_ID[step.eventoId];
      const start = Number.isFinite(event.anio) ? event.anio : event.desde;
      const end = Number.isFinite(event.anio) ? event.anio : event.hasta;
      if (Number.isFinite(start) && Number.isFinite(end) && (step.anio < start || step.anio > end)) add("INFO", "STORY_EVENT_DATE_MISMATCH", subject, `Paso ${step.anio} fuera del intervalo del evento ${step.eventoId} (${start}–${end})`);
    }
  });
}

// Metadatos generados. Se marcan como warning porque se corrigen regenerando.
if (siteMeta && siteMeta.personCount !== PERSONAS.length) add("WARNING", "GENERATED_META_STALE", "siteMeta", `personCount=${siteMeta.personCount}; PERSONAS=${PERSONAS.length}`);
if (treeBase?.gen && Object.keys(treeBase.gen).length !== PERSONAS.length) add("WARNING", "GENERATED_TREE_STALE", "treeBase", `gen=${Object.keys(treeBase.gen).length}; PERSONAS=${PERSONAS.length}`);

const counts = Object.fromEntries(["ERROR", "WARNING", "INFO"].map((sev) => [sev, issues.filter((i) => i.severity === sev).length]));
const newCounts = Object.fromEntries(["ERROR", "WARNING", "INFO"].map((sev) => [sev, issues.filter((i) => i.severity === sev && !i.legacy).length]));
const byCode = issues.reduce((acc, issue) => {
  acc[issue.code] = (acc[issue.code] || 0) + 1;
  return acc;
}, {});
const importance = (p) => {
  const title = String(p?.titulo || "").toLowerCase();
  let score = (Array.isArray(p?.reinados) ? p.reinados.length * 5 : 0);
  if (/emperador|emperatriz|rey|reina|zar|zarina|soberan/.test(title)) score += 12;
  else if (/príncipe|princesa|duque|duquesa|elector|gran duque/.test(title)) score += 7;
  else if (/conde|condesa|margrave/.test(title)) score += 3;
  score += Math.min(4, (HIJOS_POR_ID[p?.id] || []).length);
  return score;
};
const ancestryOpportunities = PERSONAS
  .filter((p) => p?.id && !p.padre && !p.madre && importance(p) >= 7)
  .map((p) => ({ id: p.id, nombre: p.nombre, titulo: p.titulo || "", dinastia: p.dinastia || "", score: importance(p) }))
  .sort((a, b) => b.score - a.score || a.nombre.localeCompare(b.nombre, "es"))
  .slice(0, 80);
const report = {
  generatedAt: new Date().toISOString(),
  totals: { personas: PERSONAS.length, historias: HISTORIAS.length, eventos: EVENTOS.length, components: components.length, largestComponent: components[0]?.length || 0 },
  counts,
  newCounts,
  byCode,
  opportunities: { importantPeopleWithoutParents: ancestryOpportunities },
  issues,
};
await fs.writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (WRITE_BASELINE) {
  const accepted = issues.filter((i) => i.severity === "ERROR" || i.severity === "WARNING").map((i) => i.fingerprint).sort();
  await fs.writeFile(BASELINE_FILE, `${JSON.stringify({ generatedAt: new Date().toISOString(), accepted }, null, 2)}\n`, "utf8");
}

console.log(`Auditoría: ${PERSONAS.length} personas · ${HISTORIAS.length} historias · ${EVENTOS.length} eventos`);
console.log(`Grafo familiar: ${components.length} componentes · principal ${components[0]?.length || 0}`);
console.log(`ERROR ${counts.ERROR} (${newCounts.ERROR} nuevos) · WARNING ${counts.WARNING} (${newCounts.WARNING} nuevos) · INFO ${counts.INFO} (${newCounts.INFO} nuevos)`);
console.log(`Oportunidades: ${ancestryOpportunities.length} personajes relevantes sin progenitores (top guardado en audit-report.json)`);
for (const sev of ["ERROR", "WARNING"]) {
  const list = issues.filter((i) => i.severity === sev && !i.legacy);
  if (!list.length) continue;
  console.log(`\n${sev}:`);
  list.slice(0, 80).forEach((i) => console.log(`- [${i.code}] ${i.subject}: ${i.message}`));
  if (list.length > 80) console.log(`- ... ${list.length - 80} más en audit-report.json`);
}
if (FAIL_ON_ERRORS && newCounts.ERROR > 0) process.exitCode = 1;
