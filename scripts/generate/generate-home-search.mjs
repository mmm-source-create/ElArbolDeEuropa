import {collectionLabels} from '../../src/features/stories/storyThemes.js';
import fs from 'node:fs/promises';
const read = async file => JSON.parse(await fs.readFile(file,'utf8'));
const es = [];
for (const [catalogue,type,singular] of [['personas','person','persona'],['dinastias','dynasty','dinastia'],['territorios','territory','territorio'],['historias','story','historia']]) {
  const data = await read(`public/catalogos/${catalogue}.json`);
  for (const item of data.items) {
    if (type === 'story' && !item.disponible) continue;
    es.push({name:item.nombre || item.titulo,path:`/es/${singular}/${item.slug}`,type,aliases:[...(item.aliases || []),...(item.searchAliases || []),...(item.sobrenombre ? [item.sobrenombre] : [])],collections:type==='story'?collectionLabels(item,'es'):[],context:type === 'person' ? item.dinastia || '' : type==='story'?collectionLabels(item,'es').join(' · '):''});
  }
}
// The people index remains complete even though the home carousel is curated.
const en = [];
const source=Object.fromEntries(await Promise.all(['people','dynasties','territories','stories'].map(async field=>[field,(await read(`public/english-meta/${field}.json`))[field]])));
for (const [field,type] of [['people','person'],['dynasties','dynasty'],['territories','territory'],['stories','story']]) for (const item of source[field].filter(item=>item.disponible!==false)) en.push({name:item.nombre,path:item.path,type,aliases:[...(item.aliases || []),...(item.searchAliases || []),...(item.sobrenombre ? [item.sobrenombre] : [])],collections:type==='story'?collectionLabels(item,'en'):[],context:type === 'person' ? item.role || '' : type==='story'?collectionLabels(item,'en').join(' · '):''});
await Promise.all([fs.writeFile('public/catalogos/search-es.json',JSON.stringify({items:es})),fs.writeFile('public/catalogos/search-en.json',JSON.stringify({items:en}))]);
console.log(`Buscador de portada: ${es.length} entradas ES · ${en.length} entradas EN.`);
