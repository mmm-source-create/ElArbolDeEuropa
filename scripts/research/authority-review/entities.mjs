// Step 2: fetch Wikidata entities for candidate QIDs and validate them against our dates.
import fs from 'node:fs';
import {getJSON,sleep,entityRecord} from './http.mjs';
const {PERSONAS}=await import('../../../src/data/personas.js');
const qids=JSON.parse(fs.readFileSync('qids.json'));
const ent=fs.existsSync('entities.json')?JSON.parse(fs.readFileSync('entities.json')):{};
const want=[...new Set(Object.values(qids).map(v=>v.qid).filter(q=>q&&!ent[q]))];
for(let i=0;i<want.length;i+=50){
 const j=await getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels|descriptions&languages=es|en&ids='+want.slice(i,i+50).join('|'),{tries:6,orThrow:true});
 for(const [q,e] of Object.entries(j.entities||{}))ent[q]=entityRecord(e);
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
