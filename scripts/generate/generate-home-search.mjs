import fs from 'node:fs/promises';
const read = async file => JSON.parse(await fs.readFile(file,'utf8'));
const es = [];
for (const [catalogue,type,singular] of [['personas','person','persona'],['dinastias','dynasty','dinastia'],['territorios','territory','territorio'],['historias','story','historia']]) {
  const data = await read(`public/catalogos/${catalogue}.json`);
  for (const item of data.items) {
    if (type === 'story' && !item.disponible) continue;
    es.push({name:item.nombre || item.titulo,path:`/es/${singular}/${item.slug}`,type,aliases:[...(item.aliases || []),...(item.sobrenombre ? [item.sobrenombre] : [])],context:type === 'person' ? item.dinastia || '' : ''});
  }
}
// The people index remains complete even though the home carousel is curated.
const source = await read('public/english-meta/people.json'), en = [];
for (const [field,type] of [['people','person'],['dynasties','dynasty'],['territories','territory'],['stories','story']]) for (const item of source[field]) en.push({name:item.nombre,path:item.path,type,aliases:[...(item.aliases || []),...(item.sobrenombre ? [item.sobrenombre] : [])],context:type === 'person' ? item.role || '' : ''});
await Promise.all([fs.writeFile('public/catalogos/search-es.json',JSON.stringify({items:es})),fs.writeFile('public/catalogos/search-en.json',JSON.stringify({items:en}))]);
console.log(`Buscador de portada: ${es.length} entradas ES · ${en.length} entradas EN.`);
