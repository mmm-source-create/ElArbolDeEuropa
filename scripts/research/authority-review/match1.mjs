// Step 1: Spanish Wikipedia titles → Wikidata items (batches of 50), then entity claims.
import fs from 'node:fs';
const {PERSONAS}=await import('../../../src/data/personas.js');
const UA={'User-Agent':'ElArbolDeEuropa-review/1.0 (genealogical atlas; bibliographic review)'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const getJSON=async url=>{for(let a=0;a<6;a++){try{const r=await fetch(url,{headers:UA});const t=await r.text();return JSON.parse(t)}catch{await sleep(3000+a*4000)}}throw Error(url)};
const out=fs.existsSync('qids.json')?JSON.parse(fs.readFileSync('qids.json')):{};
const todo=PERSONAS.filter(p=>!out[p.id]);
for(let i=0;i<todo.length;i+=50){
 const batch=todo.slice(i,i+50);
 const titles=batch.map(p=>p.nombre);
 const j=await getJSON('https://es.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles='+encodeURIComponent(titles.join('|')));
 const norm=new Map((j.query.normalized||[]).map(n=>[n.from,n.to]));const red=new Map((j.query.redirects||[]).map(n=>[n.from,n.to]));
 const byTitle=new Map(Object.values(j.query.pages).map(p=>[p.title,p.pageprops?.wikibase_item]));
 for(const p of batch){let t=p.nombre;t=norm.get(t)||t;t=red.get(t)||t;const q=byTitle.get(t);out[p.id]=q?{qid:q,via:'eswiki',title:t}:{qid:null};}
 await sleep(800);
}
fs.writeFileSync('qids.json',JSON.stringify(out));
console.log('matched',Object.values(out).filter(v=>v.qid).length,'of',PERSONAS.length);
