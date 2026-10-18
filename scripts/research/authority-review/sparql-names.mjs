// Batched SPARQL: items whose Spanish/English label or alias equals the person's name (or an
// alias), with birth/death years and relatives. Same acceptance rules as the other passes.
import fs from 'node:fs';
import {UA,sleep} from './http.mjs';
const {PERSONAS}=await import('../../../src/data/personas.js');
const {conyugesDe}=await import('../../../src/domain/genealogy/personAccessors.js');
const qids=JSON.parse(fs.readFileSync('qids.json')),status=JSON.parse(fs.readFileSync('status.json'));
const okQ=id=>status[id]==='ok'?qids[id].qid:null;
const esc=s=>s.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
const sparql=async q=>{for(let a=0;a<5;a++){try{const r=await fetch('https://query.wikidata.org/sparql?query='+encodeURIComponent(q),{headers:{...UA,'Accept':'application/sparql-results+json'},signal:AbortSignal.timeout(60000)});if(r.status===429||r.status>=500){await sleep(10000*(a+1));continue}return (await r.json()).results.bindings}catch{await sleep(5000*(a+1))}}return []};
const pending=PERSONAS.filter(p=>status[p.id]!=='ok');console.log('pending',pending.length);
const names=new Map();for(const p of pending)for(const n of new Set([p.nombre,...(p.aliases||[])]))if(n&&n.length<80){if(!names.has(n))names.set(n,[]);names.get(n).push(p.id)}
const list=[...names.keys()];const cands=new Map();
for(let i=0;i<list.length;i+=80){
 const values=list.slice(i,i+80).flatMap(n=>[`"${esc(n)}"@es`,`"${esc(n)}"@en`]).join(' ');
 const q=`SELECT ?item ?name (YEAR(?b) AS ?by) (YEAR(?d) AS ?dy) ?father ?mother ?spouse WHERE { VALUES ?name { ${values} } { ?item rdfs:label ?name } UNION { ?item skos:altLabel ?name } ?item wdt:P31 wd:Q5 . OPTIONAL{?item wdt:P569 ?b} OPTIONAL{?item wdt:P570 ?d} OPTIONAL{?item wdt:P22 ?father} OPTIONAL{?item wdt:P25 ?mother} OPTIONAL{?item wdt:P26 ?spouse} }`;
 for(const row of await sparql(q)){const item=row.item.value.split('/').pop(),name=row.name.value;
  const e=cands.get(item)||{names:new Set(),birth:new Set(),death:new Set(),father:new Set(),mother:new Set(),spouse:new Set()};
  e.names.add(name);if(row.by)e.birth.add(+row.by.value);if(row.dy)e.death.add(+row.dy.value);for(const k of ['father','mother','spouse'])if(row[k])e[k].add(row[k].value.split('/').pop());cands.set(item,e);}
 await sleep(1500);if(i%800===0)console.log(i,cands.size);
}
const judge=(p,e)=>{const dated=[p.nac,p.muer].filter(Number.isInteger).length;
 const B=[...e.birth],D=[...e.death];const b=Number.isInteger(p.nac)&&B.length?B.some(y=>Math.abs(y-p.nac)<=1):null,d=Number.isInteger(p.muer)&&D.length?D.some(y=>Math.abs(y-p.muer)<=1):null;
 if(b===false||d===false)return 0;
 const rel=[[p.padre,e.father],[p.madre,e.mother],...conyugesDe(p).map(s=>[s,e.spouse])].some(([r,set])=>r&&okQ(r)&&set.has(okQ(r)));
 if(rel)return 3;if(b&&d)return 2;if((b||d)&&dated===1)return 1;return 0;};
let gained=0;
for(let round=0;round<2;round++)for(const p of pending){if(status[p.id]==='ok')continue;
 const mine=[...cands].filter(([,e])=>[p.nombre,...(p.aliases||[])].some(n=>e.names.has(n)));
 const scored=mine.map(([q,e])=>[q,judge(p,e)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
 if(scored.length&&(scored.length===1||scored[0][1]>scored[1][1])){qids[p.id]={qid:scored[0][0],via:'sparql',score:scored[0][1]};status[p.id]='ok';gained++;}}
fs.writeFileSync('qids.json',JSON.stringify(qids));fs.writeFileSync('status.json',JSON.stringify(status));
console.log('gained',gained,'ok',Object.values(status).filter(s=>s==='ok').length);
