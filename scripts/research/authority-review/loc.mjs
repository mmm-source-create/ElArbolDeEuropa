// 6.0.16 · Fetch Library of Congress name authority records (id.loc.gov MADS/RDF) for matched people; incremental.
// Kept: authoritative heading and the structured birth and death dates.
import fs from 'node:fs';
import {UA,sleep} from './http.mjs';
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json'));
const loc=fs.existsSync('loc.json')?JSON.parse(fs.readFileSync('loc.json')):{};
const want=new Set();
for(const [id,s] of Object.entries(status))if(s==='ok')for(const l of ent[qids[id].qid]?.loc||[])if(/^n[bors]?\d+$/.test(l)&&!loc[l])want.add(l);
const list=[...want];console.log('to fetch',list.length);
const val=(node,key)=>(node?.[`http://www.loc.gov/mads/rdf/v1#${key}`]||[]).map(v=>v['@value']).filter(Boolean);
let done=0;
async function worker(){while(list.length){const l=list.shift();for(let a=0;a<4;a++){try{
  const r=await fetch(`https://id.loc.gov/authorities/names/${l}.madsrdf.json`,{headers:UA,redirect:'follow',signal:AbortSignal.timeout(30000)});
  if(r.status===404){loc[l]={missing:true};break}
  if(r.status===429||r.status>=500){await sleep(10000*(a+1));continue}
  const d=await r.json();const self=d.find(n=>n['@id']===`http://id.loc.gov/authorities/names/${l}`);const rwo=d.find(n=>n['@id']===`http://id.loc.gov/rwo/agents/${l}`);
  loc[l]={name:val(self,'authoritativeLabel')[0]||null,birth:val(rwo,'birthDate'),death:val(rwo,'deathDate')};break}catch{await sleep(3000*(a+1))}}
 if(++done%200===0){fs.writeFileSync('loc.json',JSON.stringify(loc));console.log(done)}await sleep(400)}}
await Promise.all([worker(),worker()]);
fs.writeFileSync('loc.json',JSON.stringify(loc));console.log('done',Object.keys(loc).length);
