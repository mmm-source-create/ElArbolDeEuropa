// Fetch claims for matched items that are not cached yet (the SPARQL pass stores only the QID).
// It never changes a match.
import fs from 'node:fs';
import {getJSON,sleep,entityRecord} from './http.mjs';
const qids=JSON.parse(fs.readFileSync('qids.json')),ent=JSON.parse(fs.readFileSync('entities.json')),status=JSON.parse(fs.readFileSync('status.json'));
const need=[...new Set(Object.entries(status).filter(([,s])=>s==='ok').map(([id])=>qids[id].qid).filter(q=>!ent[q]))];
for(let i=0;i<need.length;i+=50){const j=await getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels&languages=es|en&ids='+need.slice(i,i+50).join('|'));
 for(const [q,e] of Object.entries(j.entities||{}))if(!e.missing)ent[q]=entityRecord(e);
 await sleep(700);}
fs.writeFileSync('entities.json',JSON.stringify(ent));console.log('fetched',need.length);
