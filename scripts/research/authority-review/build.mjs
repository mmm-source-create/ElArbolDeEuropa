// Build claim reviews from GND authority records. A claim becomes "documented" only when
// the GND record states the same year (dates) or links the same person (parents, spouses).
import fs from 'node:fs';
const {PERSONAS}=await import('../../../src/personas.jsx');
const {personClaims,CLAIM_REVIEWS}=await import('../../../src/evidence/claims.js');
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json')),gnd=JSON.parse(fs.readFileSync('gnd.json'));
const gndOf=id=>status[id]==='ok'?(ent[qids[id]?.qid]?.gnd||[]).find(g=>gnd[g]&&!gnd[g].missing):null;
const yearOf=s=>{const m=String(s).match(/^-?(\d{3,4})/);return m?+m[1]:null};
const src=(g,locator)=>({title:`Deutsche Nationalbibliothek · GND · ${gnd[g].name}`,url:`https://d-nb.info/gnd/${g}`,locator});
// Earlier authority-record reviews are regenerated; specific editorial reviews are kept.
const manual=id=>CLAIM_REVIEWS[id]?.sources?.some(s=>!s.url.startsWith("https://d-nb.info/gnd/"));
const REVIEW_DATE='2026-10-17',EDITOR='El Árbol de Europa';
const out={},mism=[];const stat={birth:0,death:0,father:0,mother:0,spouse:0};
for(const p of PERSONAS){const g=gndOf(p.id);if(!g)continue;const r=gnd[g];
 for(const claim of personClaims(p)){
  if(manual(claim.id))continue; // manual reviews stay authoritative
  const kind=claim.id.split(':')[2];let ok=false,locator='',exactDate=null,note='';
  if(kind==='birth'||kind==='death'){
   if(kind==='birth'&&p.nacAprox||kind==='death'&&p.muerAprox)continue;
   const list=kind==='birth'?r.birth:r.death;if(!list.length)continue;
   const years=list.map(yearOf).filter(Boolean);
   if(years.includes(claim.value)){ok=true;const full=list.find(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&yearOf(d)===claim.value);exactDate=full||null;
    locator=kind==='birth'?'Datos vitales: fecha de nacimiento':'Datos vitales: fecha de fallecimiento';
    note=`La ficha de autoridad registra ${kind==='birth'?'el nacimiento':'el fallecimiento'} en ${full||claim.value}.`;}
   else mism.push(`${p.id}\t${kind}\tAtlas ${claim.value}\tGND ${list.join(', ')}\thttps://d-nb.info/gnd/${g}`);
  } else if(kind==='father'||kind==='mother'||kind==='spouse'){
   const other=claim.value,og=gndOf(other);if(!og)continue;
   const rel=kind==='spouse'?(r.spouses.includes(og)||gnd[og].spouses?.includes(g)):(r.parents.includes(og)||gnd[og].children?.includes(g));
   if(rel){ok=true;locator=kind==='spouse'?`Relaciones con personas: cónyuge → GND ${og}`:`Relaciones con personas: ${kind==='father'?'padre':'madre'} → GND ${og}`;
    note=`La ficha de autoridad enlaza a ${gnd[og].name} (GND ${og}) como ${kind==='spouse'?'cónyuge':kind==='father'?'padre':'madre'}.`;}
  } else continue;
  if(!ok)continue;
  const statKey=kind;stat[statKey]++;
  out[claim.id]={certainty:'documented',sources:[src(g,locator)],...(exactDate?{exactDate}:{}),note,reviewedAt:REVIEW_DATE,editor:EDITOR};
 }}
fs.writeFileSync('reviews.json',JSON.stringify(out));fs.writeFileSync('mismatches.tsv',mism.join('\n'));
console.log(stat,'total',Object.keys(out).length,'mismatches',mism.length);
// Governments: GND clause naming the same territory and the same span of years.
const {KW}=await import(new URL('./govkw.mjs', import.meta.url));
let gov=0;
for(const p of PERSONAS){const g=gndOf(p.id);if(!g)continue;const clauses=gnd[g].info.flatMap(s=>s.split(/[;|]/));
 for(const claim of personClaims(p)){if(claim.field!=='Gobierno'||manual(claim.id))continue;const m=claim.value;const kw=KW[m.territorio];if(!kw)continue;
  const re=new RegExp(`\\b${m.desde}\\s*(?:-|–|bis)\\s*${m.hasta}\\b`);const c=clauses.find(c=>re.test(c)&&kw.test(c));if(!c)continue;
  out[claim.id]={certainty:'documented',sources:[src(g,`Datos biográficos: «${c.trim().slice(0,160)}»`)],note:`La ficha de autoridad fecha este cargo en ${m.desde}–${m.hasta}.`,reviewedAt:REVIEW_DATE,editor:EDITOR};gov++;}}
fs.writeFileSync('reviews.json',JSON.stringify(out));console.log('gov',gov,'total',Object.keys(out).length);
