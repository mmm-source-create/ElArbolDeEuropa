// Wikidata entity search (Spanish, then English) for the people still unmatched, one request
// at a time; candidate claims fetched in batches. Same acceptance rules as the other passes.
import fs from 'node:fs';
const {PERSONAS}=await import('../../../src/personas.jsx');
const {conyugesDe}=await import('../../../src/data/personAccessors.js');
const UA={'User-Agent':'ElArbolDeEuropa-review/1.0 (https://treeofeurope.eu; genealogical atlas bibliographic review)'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const getJSON=async url=>{for(let a=0;a<5;a++){try{const r=await fetch(url,{headers:UA,signal:AbortSignal.timeout(20000)});if(r.status===429){await sleep(15000*(a+1));continue}return await r.json()}catch{await sleep(3000*(a+1))}}return {}};
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json'));
const year=v=>{const t=v?.mainsnak?.datavalue?.value?.time;if(!t)return null;const m=t.match(/^([+-])(\d+)-/);return m?(m[1]==='-'?-1:1)*+m[2]:null};
const ids=(c,p)=>(c[p]||[]).map(s=>s.mainsnak?.datavalue?.value?.id).filter(Boolean);
const store=(q,e)=>{const c=e.claims||{};ent[q]={label:e.labels?.es?.value||e.labels?.en?.value,human:ids(c,'P31').includes('Q5'),birth:(c.P569||[]).map(year).filter(v=>v!==null),death:(c.P570||[]).map(year).filter(v=>v!==null),father:ids(c,'P22'),mother:ids(c,'P25'),spouse:ids(c,'P26'),gnd:(c.P227||[]).map(s=>s.mainsnak?.datavalue?.value).filter(Boolean),dbe:c.P4459?.[0]?.mainsnak?.datavalue?.value||null,dbi:c.P1986?.[0]?.mainsnak?.datavalue?.value||null,odnb:c.P1415?.[0]?.mainsnak?.datavalue?.value||null,britannica:c.P1417?.[0]?.mainsnak?.datavalue?.value||null}};
const okQ=id=>status[id]==='ok'?qids[id].qid:null;
const judge=(p,e)=>{if(!e?.human)return 0;const dated=[p.nac,p.muer].filter(Number.isInteger).length;
 const b=Number.isInteger(p.nac)&&e.birth.length?e.birth.some(y=>Math.abs(y-p.nac)<=1):null,d=Number.isInteger(p.muer)&&e.death.length?e.death.some(y=>Math.abs(y-p.muer)<=1):null;
 if(b===false||d===false)return 0;
 const rel=[[p.padre,e.father],[p.madre,e.mother],...conyugesDe(p).map(s=>[s,e.spouse])].some(([r,list])=>r&&okQ(r)&&list.includes(okQ(r)));
 if(rel)return 3;if(b&&d)return 2;if((b||d)&&dated===1)return 1;return 0;};
const pending=PERSONAS.filter(p=>status[p.id]!=='ok');console.log('pending',pending.length);
const cand=new Map();let n=0;
for(const p of pending){const set=new Set(qids[p.id]?.qid?[qids[p.id].qid]:[]);
 for(const lang of ['es','en']){const s=await getJSON(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=${lang}&uselang=${lang}&type=item&limit=7&search=${encodeURIComponent(p.nombre)}`);for(const h of s.search||[])set.add(h.id);await sleep(700);}
 cand.set(p.id,set);if(++n%100===0)console.log(n);}
const need=[...new Set([...cand.values()].flatMap(s=>[...s]))].filter(q=>!ent[q]);
for(let i=0;i<need.length;i+=50){const j=await getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels&languages=es|en&ids='+need.slice(i,i+50).join('|'));for(const [q,e] of Object.entries(j.entities||{}))if(!e.missing)store(q,e);await sleep(700);}
let gained=0;
for(let round=0;round<2;round++)for(const p of pending){if(status[p.id]==='ok')continue;
 const scored=[...(cand.get(p.id)||[])].map(q=>[q,judge(p,ent[q])]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
 if(scored.length&&(scored.length===1||scored[0][1]>scored[1][1])){qids[p.id]={qid:scored[0][0],via:'wbsearch',score:scored[0][1]};status[p.id]='ok';gained++;}}
fs.writeFileSync('qids.json',JSON.stringify(qids));fs.writeFileSync('entities.json',JSON.stringify(ent));fs.writeFileSync('status.json',JSON.stringify(status));
console.log('gained',gained,'ok',Object.values(status).filter(s=>s==='ok').length);
