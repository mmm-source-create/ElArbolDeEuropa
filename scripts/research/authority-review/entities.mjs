// Step 2: fetch Wikidata entities for candidate QIDs and validate them against our dates.
import fs from 'node:fs';
const {PERSONAS}=await import('../../../src/personas.jsx');
const UA={'User-Agent':'ElArbolDeEuropa-review/1.0 (genealogical atlas; bibliographic review)'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const getJSON=async url=>{for(let a=0;a<6;a++){try{const r=await fetch(url,{headers:UA});return JSON.parse(await r.text())}catch{await sleep(3000+a*4000)}}throw Error(url)};
const qids=JSON.parse(fs.readFileSync('qids.json'));
const ent=fs.existsSync('entities.json')?JSON.parse(fs.readFileSync('entities.json')):{};
const want=[...new Set(Object.values(qids).map(v=>v.qid).filter(q=>q&&!ent[q]))];
const year=v=>{const t=v?.mainsnak?.datavalue?.value?.time;if(!t)return null;const m=t.match(/^([+-])(\d+)-/);return m?(m[1]==='-'?-1:1)*+m[2]:null};
const ids=(c,p)=>(c[p]||[]).map(s=>s.mainsnak?.datavalue?.value?.id).filter(Boolean);
for(let i=0;i<want.length;i+=50){
 const j=await getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels|descriptions&languages=es|en&ids='+want.slice(i,i+50).join('|'));
 for(const [q,e] of Object.entries(j.entities||{})){const c=e.claims||{};
  ent[q]={label:e.labels?.es?.value||e.labels?.en?.value,desc:e.descriptions?.es?.value||e.descriptions?.en?.value,human:ids(c,'P31').includes('Q5'),
   birth:(c.P569||[]).map(year).filter(v=>v!==null),death:(c.P570||[]).map(year).filter(v=>v!==null),
   father:ids(c,'P22'),mother:ids(c,'P25'),spouse:ids(c,'P26'),gnd:(c.P227||[]).map(s=>s.mainsnak?.datavalue?.value).filter(Boolean),
   bnf:(c.P268||[]).map(s=>s.mainsnak?.datavalue?.value).filter(Boolean),dbe:c.P4459?.[0]?.mainsnak?.datavalue?.value||null,
   dbi:c.P1986?.[0]?.mainsnak?.datavalue?.value||null,odnb:c.P1415?.[0]?.mainsnak?.datavalue?.value||null,britannica:c.P1417?.[0]?.mainsnak?.datavalue?.value||null};}
 await sleep(700);
}
fs.writeFileSync('entities.json',JSON.stringify(ent));
// validation
const near=(a,list,tol)=>a==null||!list.length?null:list.some(b=>Math.abs(a-b)<=tol);
let ok=0,bad=0,undated=0;const status={};
for(const p of PERSONAS){const m=qids[p.id];if(!m?.qid){status[p.id]='none';continue}const e=ent[m.qid];
 if(!e?.human){status[p.id]='nothuman';bad++;continue}
 const b=near(p.nac,e.birth,2),d=near(p.muer,e.death,2);
 if(b===false||d===false){status[p.id]='datemismatch';bad++;continue}
 if(b===null&&d===null){status[p.id]='undated';undated++;continue}
 status[p.id]='ok';ok++;}
fs.writeFileSync('status.json',JSON.stringify(status));
console.log({ok,bad,undated,none:Object.values(status).filter(s=>s==='none').length});
