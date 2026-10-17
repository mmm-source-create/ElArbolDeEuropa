// Emit src/evidence/authorityReviews.js: one compact entry per person with a verified GND record.
import fs from 'node:fs';
const {PERSONAS}=await import('../../../src/personas.jsx');
const {conyugesDe}=await import('../../../src/data/personAccessors.js');
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json')),gnd=JSON.parse(fs.readFileSync('gnd.json'));
const reviews=JSON.parse(fs.readFileSync('reviews.json'));
const data={};
for(const p of PERSONAS){if(status[p.id]!=='ok')continue;const e=ent[qids[p.id].qid];if(!e)continue;
 const g=(e.gnd||[]).find(x=>gnd[x]&&!gnd[x].missing);const entry={};
 if(g){entry.g=g;entry.n=gnd[g].name;}
 const r={};if(e.dbe)r.dbe=e.dbe;if(e.dbi)r.dbi=e.dbi;if(e.odnb)r.odnb=e.odnb;if(e.britannica)r.brit=e.britannica;
 if(Object.keys(r).length)entry.r=r;
 const key=s=>`person:${p.id}:${s}`;
 if(reviews[key('birth')])entry.b=reviews[key('birth')].exactDate||p.nac;
 if(reviews[key('death')])entry.d=reviews[key('death')].exactDate||p.muer;
 if(reviews[key('father')])entry.f=1;if(reviews[key('mother')])entry.m=1;
 const sp=conyugesDe(p).filter(s=>reviews[key('spouse:'+s)]);if(sp.length)entry.s=sp;
 const gov=Object.entries(reviews).filter(([k])=>k.startsWith(key('government:'))).map(([k,v])=>[k.slice(key('government:').length),v.sources[0].locator.replace(/^Datos biográficos: «|»$/g,'')]);
 if(gov.length)entry.v=gov;
 if(Object.keys(entry).length)data[p.id]=entry;}
const header=`// V5.25 · Revisión bibliográfica con fichas de autoridad.
// Cada persona se identificó en Wikidata solo para localizar su ficha de autoridad
// (Deutsche Nationalbibliothek, GND); Wikidata no se cita como fuente. Una afirmación
// se marca como documentada únicamente si la ficha GND registra el mismo año (fechas),
// enlaza a la misma persona como padre, madre o cónyuge, o fecha el mismo cargo y
// territorio con los mismos años. Las discrepancias quedan pendientes y se listan en
// docs/V5.25-discrepancias.md. «r» guarda identificadores de diccionarios biográficos.
// Generado con scripts/research/authority-review/run.mjs; no editar a mano.
`;
const body=`const DATA = ${JSON.stringify(data)};
const REVIEWED_AT = '2026-10-17';
const EDITOR = 'El Árbol de Europa';
const gndSource = (id, locator) => ({title: \`Deutsche Nationalbibliothek · GND · \${DATA[id].n}\`, url: \`https://d-nb.info/gnd/\${DATA[id].g}\`, locator});
const review = (id, locator, note, extra = {}) => ({certainty: 'documented', sources: [gndSource(id, locator)], note, reviewedAt: REVIEWED_AT, editor: EDITOR, ...extra});
const dateReview = (id, value, kind) => {
  const exact = typeof value === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(value) ? value : null;
  const label = kind === 'birth' ? 'nacimiento' : 'fallecimiento';
  return review(id, \`Datos vitales: fecha de \${label}\`, \`La ficha de autoridad registra el \${label} en \${value}.\`, exact ? {exactDate: exact} : {});
};
const relationReview = (id, otherId, relation) => DATA[otherId]?.g
  ? review(id, \`Relaciones con personas: \${relation} → GND \${DATA[otherId].g}\`, \`La ficha de autoridad enlaza a \${DATA[otherId].n} (GND \${DATA[otherId].g}) como \${relation}.\`)
  : null;

// Parents need the person record to resolve the related IDs, so they are expanded by claims.js.
export function authorityParentReview(person, field) {
  const entry = DATA[person?.id];
  if (!entry?.g || !entry[field === 'father' ? 'f' : 'm']) return null;
  return relationReview(person.id, field === 'father' ? person.padre : person.madre, field === 'father' ? 'padre' : 'madre');
}

export const AUTHORITY_REVIEWS = (() => {
  const out = {};
  for (const [id, entry] of Object.entries(DATA)) {
    if (!entry.g) continue;
    if (entry.b != null) out[\`person:\${id}:birth\`] = dateReview(id, entry.b, 'birth');
    if (entry.d != null) out[\`person:\${id}:death\`] = dateReview(id, entry.d, 'death');
    for (const spouse of entry.s || []) {
      const value = relationReview(id, spouse, 'cónyuge');
      if (value) out[\`person:\${id}:spouse:\${spouse}\`] = value;
    }
    for (const [key, clause] of entry.v || []) {
      const [, from, to] = key.split(':');
      out[\`person:\${id}:government:\${key}\`] = review(id, \`Datos biográficos: «\${clause}»\`, \`La ficha de autoridad fecha este cargo en \${from}–\${to}.\`);
    }
  }
  return Object.freeze(out);
})();

const DICTIONARIES = [
  ['dbe', 'Real Academia de la Historia · Diccionario Biográfico español', v => \`https://dbe.rah.es/biografias/\${v}\`],
  ['dbi', 'Treccani · Dizionario Biografico degli Italiani', v => \`https://www.treccani.it/enciclopedia/\${v}_(Dizionario-Biografico)\`],
  ['odnb', 'Oxford Dictionary of National Biography', v => \`https://doi.org/10.1093/ref:odnb/\${v}\`],
  ['brit', 'Encyclopaedia Britannica', v => \`https://www.britannica.com/\${v}\`],
];
// Biographical references for the profile: the GND record and the national dictionaries
// that hold an article on this person. They give context; they do not verify each claim.
export function authorityReferences(id) {
  const entry = DATA[id];
  if (!entry) return [];
  const refs = [];
  if (entry.g) refs.push({titulo: \`Deutsche Nationalbibliothek · Ficha de autoridad GND · \${entry.n}\`, url: \`https://d-nb.info/gnd/\${entry.g}\`});
  for (const [key, title, url] of DICTIONARIES) if (entry.r?.[key]) refs.push({titulo: title, url: url(entry.r[key])});
  return refs;
}
`;
fs.writeFileSync(new URL('../../../src/evidence/authorityReviews.js', import.meta.url),header+body);
console.log('people',Object.keys(data).length,'with gnd',Object.values(data).filter(e=>e.g).length,'bytes',fs.statSync(new URL('../../../src/evidence/authorityReviews.js', import.meta.url)).size);
// Discrepancies: the GND record gives another year. They stay pending for an editor.
const rows=fs.existsSync('mismatches.tsv')?fs.readFileSync('mismatches.tsv','utf8').trim().split('\n').filter(Boolean):[];
const name=Object.fromEntries(PERSONAS.map(p=>[p.id,p.nombre]));
const lines=rows.map(r=>{const [id,kind,ours,theirs,url]=r.split('\t');return `| ${name[id]||id} (\`${id}\`) | ${kind==='birth'?'Nacimiento':'Fallecimiento'} | ${ours.replace('Atlas ','')} | ${theirs.replace('GND ','')} | [ficha](${url}) |`;}).sort();
fs.writeFileSync(new URL('../../../docs/V5.25-discrepancias.md', import.meta.url),`# V5.25 · Fechas que no coinciden con la ficha de autoridad

La revisión con las fichas GND (Deutsche Nationalbibliothek) encontró ${rows.length} fechas en las que el
Atlas y la ficha dan años distintos. No se han cambiado: siguen «Pendientes de revisión» hasta que una
fuente específica permita decidir. Muchas son diferencias de un año propias de fechas medievales
(estilo del año, cómputo de la regencia o fecha de la noticia), no necesariamente errores.

| Persona | Dato | Atlas | GND | Fuente |
|---|---|---|---|---|
${lines.join('\n')}
`);
console.log('discrepancias',rows.length);
