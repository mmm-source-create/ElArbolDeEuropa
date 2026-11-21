// 6.0.16 · Fetch BnF authority records (catalogue.bnf.fr SRU, UNIMARC) for matched people; incremental.
// Kept: heading (200), coded dates (103) and the biographical note (300).
import fs from 'node:fs';
import {UA,sleep} from './http.mjs';
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json'));
const bnf=fs.existsSync('bnf.json')?JSON.parse(fs.readFileSync('bnf.json')):{};
const want=new Set();
for(const [id,s] of Object.entries(status))if(s==='ok')for(const b of ent[qids[id].qid]?.bnf||[])if(!bnf[b])want.add(b);
const list=[...want];console.log('to fetch',list.length);
const sub=(field,code)=>[...field.matchAll(new RegExp(`<mxc:subfield code="${code}">([^<]*)</mxc:subfield>`,'g'))].map(m=>m[1]);
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'");
const parse=xml=>{const fields=[...xml.matchAll(/<mxc:datafield tag="(\d{3})"[^>]*>([\s\S]*?)<\/mxc:datafield>/g)].map(m=>[m[1],m[2]]);
 const get=tag=>fields.filter(([t])=>t===tag).map(([,f])=>f);
 const h=get('200')[0];const coded=(get('103')[0]&&sub(get('103')[0],'a')[0])||'';const codedDeath=(get('103')[0]&&sub(get('103')[0],'b')[0])||'';
 return {name:h?decode([...sub(h,'a'),...sub(h,'b'),...sub(h,'d'),...sub(h,'c')].join(' ').trim()):null,heading:h?decode(sub(h,'f').join(' ')):null,
  birth:coded.trim(),death:codedDeath.trim(),note:get('300').map(f=>decode(sub(f,'a').join(' ')))};};
let done=0;
async function worker(){while(list.length){const b=list.shift();for(let a=0;a<4;a++){try{
  const r=await fetch(`https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=${encodeURIComponent(`aut.persistentid all "ark:/12148/cb${b}"`)}&recordSchema=unimarcxchange`,{headers:UA,signal:AbortSignal.timeout(30000)});
  if(r.status===429||r.status>=500){await sleep(10000*(a+1));continue}
  const xml=await r.text();bnf[b]=/<srw:numberOfRecords>0</.test(xml)?{missing:true}:parse(xml);break}catch{await sleep(3000*(a+1))}}
 if(++done%200===0){fs.writeFileSync('bnf.json',JSON.stringify(bnf));console.log(done)}await sleep(250)}}
await Promise.all([worker(),worker(),worker()]);
fs.writeFileSync('bnf.json',JSON.stringify(bnf));console.log('done',Object.keys(bnf).length);
