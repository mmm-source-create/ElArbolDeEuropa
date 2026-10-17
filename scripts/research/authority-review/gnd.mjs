// Fetch GND authority records (lobid.org JSON) for matched people; incremental.
import fs from 'node:fs';
const UA={'User-Agent':'ElArbolDeEuropa-review/1.0 (genealogical atlas; bibliographic review)'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json'));
const gnd=fs.existsSync('gnd.json')?JSON.parse(fs.readFileSync('gnd.json')):{};
const want=new Set();
for(const [id,s] of Object.entries(status))if(s==='ok'){for(const g of ent[qids[id].qid]?.gnd||[])if(!gnd[g])want.add(g)}
const list=[...want];console.log('to fetch',list.length);
const pick=j=>({name:j.preferredName,birth:j.dateOfBirth||[],death:j.dateOfDeath||[],parents:(j.hasParent||[]).map(x=>x.id.split('/').pop()),spouses:(j.hasSpouse||[]).map(x=>x.id.split('/').pop()),children:(j.hasChild||[]).map(x=>x.id.split('/').pop()),info:j.biographicalOrHistoricalInformation||[],titles:(j.titleOfNobility||[]).map(x=>x.label||x),type:j.type||[]});
let done=0;
async function worker(){while(list.length){const g=list.shift();for(let a=0;a<4;a++){try{const r=await fetch(`https://lobid.org/gnd/${g}.json`,{headers:UA});if(r.status===404){gnd[g]={missing:true};break}const j=await r.json();gnd[g]=pick(j);break}catch{await sleep(2000*(a+1))}}if(++done%200===0){fs.writeFileSync('gnd.json',JSON.stringify(gnd));console.log(done)}await sleep(150)}}
await Promise.all([worker(),worker(),worker(),worker()]);
fs.writeFileSync('gnd.json',JSON.stringify(gnd));console.log('done',Object.keys(gnd).length);
