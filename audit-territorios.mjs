import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PERSONAS_FILE = path.join(ROOT, "src", "personas.jsx");
const REPORT_FILE = path.join(ROOT, "audit-territorios-report.json");
const FAIL_ON_ERRORS = process.argv.includes("--fail-on-errors");

async function importData(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  return import(`data:text/javascript;base64,${Buffer.from(source, "utf8").toString("base64")}`);
}

const { PERSONAS = [] } = await importData(PERSONAS_FILE);
const BY_ID = Object.fromEntries(PERSONAS.filter((p) => p?.id).map((p) => [p.id, p]));
const issues = [];
const suggestions = [];
const add = (severity, code, subject, message, extra = {}) => issues.push({ severity, code, subject, message, ...extra });
const suggest = (code, subject, message, extra = {}) => suggestions.push({ code, subject, message, ...extra });
const uniq = (arr) => [...new Set((arr || []).filter(Boolean))];
const nonEffective = new Set(["titular", "pretensión", "pretension", "rival"]);
const reigns = (p) => Array.isArray(p?.reinados) ? p.reinados.filter(Boolean) : [];
const isEffective = (r) => r && r.efectivo !== false && !nonEffective.has(String(r.tipo || "").toLowerCase());
const title = (p) => String(p?.titulo || "").trim();
const likelyRulerTitle = (p) => /\b(papa|emperador|emperatriz|rey|reina|zar|zarina|sult[aá]n|emir|duque|duquesa|gran duque|elector|landgrave|margrave|conde|condesa|voivoda|d[eé]spota|ban|estat[uú]der|señor|señora|regente|soberano|soberana)\b/i.test(title(p))
  && !/^(consorte|noble)\b/i.test(title(p));

for (const p of PERSONAS) {
  if (!p?.id) continue;
  const rList = reigns(p);
  const realmSet = new Set(p.reinos || []);
  for (let i = 0; i < rList.length; i += 1) {
    const r = rList[i];
    const key = `${p.id}#${i + 1}`;
    if (!r?.territorio) add("ERROR", "GOV_TERRITORY_MISSING", key, `${p.nombre}: gobierno sin territorio`);
    if (!Number.isFinite(r?.desde) || !Number.isFinite(r?.hasta)) add("ERROR", "GOV_DATE_MISSING", key, `${p.nombre}: gobierno sin fechas completas`);
    else if (r.desde > r.hasta) add("ERROR", "GOV_REVERSED", key, `${p.nombre}: ${r.territorio} ${r.desde}–${r.hasta}`);
    if (r?.territorio && !realmSet.has(r.territorio)) {
      add("WARNING", "GOV_REALM_NOT_LISTED", key, `${p.nombre}: gobierna ${r.territorio}, pero el territorio no figura en reinos[]`);
    }
    if (isEffective(r) && p.gobernante !== true && /^(consorte|noble)\b/i.test(title(p)) && !["regencia", "jure uxoris"].includes(String(r.tipo || "").toLowerCase())) {
      add("INFO", "CONSORT_EFFECTIVE_GOVERNMENT", key, `${p.nombre}: ficha de ${title(p)} con gobierno efectivo en ${r.territorio}; revisar si es intencional`);
    }
  }

  if (likelyRulerTitle(p) && !(p.reinos || []).length) {
    add("WARNING", "RULER_WITHOUT_REALM", p.id, `${p.nombre}: ${title(p)} sin territorios asociados`);
  }

  // Si ya existe cualquier registro de gobierno (también rival o titular), la ficha
  // no se considera "sin gobierno": el auditor debe detectar ausencias, no convertir
  // reclamaciones históricas documentadas en falsos positivos de gobierno efectivo.
  if (likelyRulerTitle(p) && rList.length === 0 && (p.reinos || []).length) {
    const inCorePeriod = (!Number.isFinite(p.muer) || p.muer >= 1200) && (!Number.isFinite(p.nac) || p.nac < 1800);
    if (inCorePeriod) suggest("POSSIBLE_GOVERNMENT_MISSING", p.id, `${p.nombre}: ${title(p)} vinculado a ${(p.reinos || []).join(", ")} sin gobierno efectivo registrado`, {
      nombre: p.nombre,
      titulo: title(p),
      reinos: p.reinos || [],
      nac: p.nac ?? null,
      muer: p.muer ?? null,
    });
  }
}

const territoryPeople = new Map();
const territoryGovs = new Map();
for (const p of PERSONAS) {
  for (const territory of uniq(p.reinos || [])) {
    if (!territoryPeople.has(territory)) territoryPeople.set(territory, []);
    territoryPeople.get(territory).push(p);
  }
  for (const r of reigns(p).filter(isEffective)) {
    if (!r?.territorio) continue;
    if (!territoryGovs.has(r.territorio)) territoryGovs.set(r.territorio, []);
    territoryGovs.get(r.territorio).push({ persona: p, reinado: r });
  }
}

const orphanTerritories = [];
for (const [territory, people] of territoryPeople) {
  const govs = territoryGovs.get(territory) || [];
  const rulerCandidates = people.filter(likelyRulerTitle);
  if (!govs.length && rulerCandidates.length >= 2) {
    orphanTerritories.push({ territorio: territory, personas: people.length, candidatosGobernantes: rulerCandidates.length, ejemplos: rulerCandidates.slice(0, 8).map((p) => `${p.nombre} (${p.titulo})`) });
  }
}
orphanTerritories.sort((a, b) => b.candidatosGobernantes - a.candidatosGobernantes || a.territorio.localeCompare(b.territorio, "es"));

const longGaps = [];
for (const [territory, govs] of territoryGovs) {
  if (govs.length < 3) continue;
  const intervals = govs
    .filter(({ reinado }) => Number.isFinite(reinado.desde) && Number.isFinite(reinado.hasta))
    .map(({ persona, reinado }) => ({ id: persona.id, nombre: persona.nombre, desde: reinado.desde, hasta: reinado.hasta }))
    .sort((a, b) => a.desde - b.desde || a.hasta - b.hasta);
  let end = intervals[0]?.hasta;
  let previous = intervals[0] || null;
  for (let i = 1; i < intervals.length; i += 1) {
    const cur = intervals[i];
    if (Number.isFinite(end) && cur.desde - end >= 50) {
      longGaps.push({ territorio: territory, desde: end, hasta: cur.desde, años: cur.desde - end, anterior: previous?.nombre || null, siguiente: cur.nombre });
    }
    if (!Number.isFinite(end) || cur.hasta > end) {
      end = cur.hasta;
      previous = cur;
    }
  }
}
longGaps.sort((a, b) => b.años - a.años || a.territorio.localeCompare(b.territorio, "es"));

suggestions.sort((a, b) => {
  const score = (x) => /emperador|rey|reina|zar|sultán|emir|duque|elector/i.test(x.titulo || "") ? 2 : /conde|margrave|landgrave|voivoda|ban/i.test(x.titulo || "") ? 1 : 0;
  return score(b) - score(a) || String(a.nombre || a.subject).localeCompare(String(b.nombre || b.subject), "es");
});

const highConfidenceSuggestions = suggestions.filter((x) =>
  /\b(papa|emperador|rey\b|reina\b|zar\b|sult[aá]n|emir|voivoda|elector|landgrave|margrave|ban\b|d[eé]spota|estat[uú]der|regente)\b/i.test(x.titulo || "")
  && !/consorte|titular|pretendiente|zarév/i.test(x.titulo || "")
);

const counts = Object.fromEntries(["ERROR", "WARNING", "INFO"].map((sev) => [sev, issues.filter((x) => x.severity === sev).length]));
const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    personas: PERSONAS.length,
    territoriosRelacionados: territoryPeople.size,
    territoriosConGobierno: territoryGovs.size,
  },
  counts,
  suggestions: {
    highConfidenceGovernmentMissing: highConfidenceSuggestions,
    possibleGovernmentMissing: suggestions,
    orphanTerritories,
    longChronologyGaps: longGaps,
  },
  issues,
};
await fs.writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Auditoría territorial: ${PERSONAS.length} personas · ${territoryPeople.size} territorios relacionados · ${territoryGovs.size} con gobierno registrado`);
console.log(`ERROR ${counts.ERROR} · WARNING ${counts.WARNING} · INFO ${counts.INFO}`);
console.log(`Candidatos de alta prioridad: ${highConfidenceSuggestions.length} · revisión amplia: ${suggestions.length} · territorios huérfanos: ${orphanTerritories.length} · huecos cronológicos >=50 años: ${longGaps.length}`);
if (highConfidenceSuggestions.length) {
  console.log("\nCandidatos de alta prioridad a revisar:");
  highConfidenceSuggestions.slice(0, 20).forEach((x) => console.log(`- ${x.nombre}: ${x.titulo} · ${(x.reinos || []).join(", ")}`));
}
if (orphanTerritories.length) {
  console.log("\nTerritorios sin gobiernos efectivos pese a tener varios titulares potenciales:");
  orphanTerritories.slice(0, 20).forEach((x) => console.log(`- ${x.territorio}: ${x.candidatosGobernantes} candidatos`));
}
if (FAIL_ON_ERRORS && counts.ERROR > 0) process.exitCode = 1;
