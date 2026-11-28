import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {TERRITORIOS} from '../../../src/data/territorios.js';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const names=new Map(Object.keys(TERRITORIOS).map(name=>[name,new Set(['catalogue'])]));
for(const file of fs.readdirSync(root+'data/cartography').filter(f=>f.endsWith('review.json'))){
 const data=JSON.parse(fs.readFileSync(root+'data/cartography/'+file));
 for(const p of data.assignments||[])if(p.identity){if(!names.has(p.identity))names.set(p.identity,new Set());names.get(p.identity).add(file);}
}
const adjectives={Austria:['austriac','austria','austro'],España:['espanol','hispanic'],Francia:['frances','franca'],Inglaterra:['ingles','anglo'],Escocia:['escoces'],Venecia:['venecian'],Génova:['genoves'],Polonia:['polac'],Lituania:['lituan'],Prusia:['prusian'],Rusia:['rus','moscovit'],Suecia:['suec'],Dinamarca:['danes'],Noruega:['norueg'],Hungría:['hungar'],Bohemia:['bohemi'],Portugal:['portugues'],Saboya:['saboyan'],Borgoña:['borgonon'],Nápoles:['napolitan'],Sicilia:['sicilian']};
const rows=[];
for(const [name,origins] of names){
 const text=norm(name), tokens=text.split(' '),matches=new Map();
 for(const other of names.keys()){
  if(other===name)continue; const needle=norm(other);
  if(needle.length>=4&&(' '+text+' ').includes(' '+needle+' '))matches.set(other,'name');
 }
 for(const [other,stems] of Object.entries(adjectives))if(other!==name&&stems.some(stem=>tokens.some(token=>token.startsWith(stem)&&token!==norm(other))))matches.set(other,'adjective');
 if(matches.size)rows.push({name,mentions:[...matches].map(([territory,match])=>({territory,match})),origins:[...origins].sort()});
}
rows.sort((a,b)=>a.name.localeCompare(b.name,'es'));
fs.mkdirSync(root+'docs/reviews',{recursive:true});
fs.writeFileSync(root+'docs/reviews/6.3.8-territory-names.json',JSON.stringify({method:'Catalogue names and reviewed map identities; whole names and an explicit Spanish adjective dictionary. Candidates for review, not inferred ownership.',count:rows.length,rows},null,2)+'\n');
for(const lang of ['es','en']){
 const en=lang==='en';let out=en?'# 6.3.8 · Territory names referring to other territories\n\n':'# 6.3.8 · Territorios cuyos nombres remiten a otros territorios\n\n';
 out+=en?`${rows.length} candidates from the territory catalogue and all reviewed map identities. A match does not establish ownership or an error. The scan includes full names and explicitly listed Spanish adjectives. Composite titles, geographical qualifiers and historical labels are retained for inspection. Sources and machine-readable matches are in [the inventory](6.3.8-territory-names.json).\n\n`:`${rows.length} candidatos del catálogo y de todas las identidades cartográficas revisadas. Una coincidencia no acredita pertenencia ni constituye por sí sola un error. Se incluyen nombres completos y una lista explícita de gentilicios españoles. Se conservan para revisión los títulos compuestos y los calificativos geográficos e históricos. Las procedencias y coincidencias están en [el inventario](6.3.8-territory-names.json).\n\n`;
 out+=en?'| Name in the source data | Territory mentioned | Match |\n|---|---|---|\n':'| Nombre en los datos | Territorio mencionado | Coincidencia |\n|---|---|---|\n';
 for(const row of rows)out+=`| ${row.name} | ${row.mentions.map(m=>m.territory).join('; ')} | ${row.mentions.map(m=>m.match).includes('adjective')?(en?'name / adjective':'nombre / gentilicio'):(en?'name':'nombre')} |\n`;
 fs.writeFileSync(root+`docs/reviews/6.3.8-territory-names${en?'-en':''}.md`,out);
}
console.log(`${rows.length} territory-name candidates written.`);
