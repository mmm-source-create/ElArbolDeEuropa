// Fetch claims for matched items that are not cached yet (the SPARQL pass stores only the QID).
// It never changes a match.
import fs from 'node:fs';
const UA={'User-Agent':'ElArbolDeEuropa-review/1.0 (https://treeofeurope.eu; genealogical atlas bibliographic review)'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const getJSON=async url=>{for(let a=0;a<5;a++){try{const r=await fetch(url,{headers:UA,signal:AbortSignal.timeout(20000)});if(r.status===429){await sleep(15000*(a+1));continue}return await r.json()}catch{await sleep(3000*(a+1))}}return {}};
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json'));
const year=v=>{const t=v?.mainsnak?.datavalue?.value?.time;if(!t)return null;const m=t.match(/^([+-])(\d+)-/);return m?(m[1]==='-'?-1:1)*+m[2]:null};
const ids=(c,p)=>(c[p]||[]).map(s=>s.mainsnak?.datavalue?.value?.id).filter(Boolean);
const need=[...new Set(Object.entries(status).filter(([,s])=>s==='ok').map(([id])=>qids[id].qid).filter(q=>!ent[q]))];
for(let i=0;i<need.length;i+=50){const j=await getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels&languages=es|en&ids='+need.slice(i,i+50).join('|'));
 for(const [q,e] of Object.entries(j.entities||{})){if(e.missing)continue;const c=e.claims||{};ent[q]={label:e.labels?.es?.value||e.labels?.en?.value,human:ids(c,'P31').includes('Q5'),birth:(c.P569||[]).map(year).filter(v=>v!==null),death:(c.P570||[]).map(year).filter(v=>v!==null),father:ids(c,'P22'),mother:ids(c,'P25'),spouse:ids(c,'P26'),gnd:(c.P227||[]).map(s=>s.mainsnak?.datavalue?.value).filter(Boolean),dbe:c.P4459?.[0]?.mainsnak?.datavalue?.value||null,dbi:c.P1986?.[0]?.mainsnak?.datavalue?.value||null,odnb:c.P1415?.[0]?.mainsnak?.datavalue?.value||null,britannica:c.P1417?.[0]?.mainsnak?.datavalue?.value||null};}
 await sleep(700);}
fs.writeFileSync('entities.json',JSON.stringify(ent));console.log('fetched',need.length);
