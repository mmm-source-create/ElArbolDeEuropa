import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';

const preparedIndexes=new WeakMap();

// The index holds labels and links only; full records load after navigation.
export function homeSearchResults(items, query, limit = 8) {
  const text = normalizarBusquedaPublica(query).trim();
  if (text.length < 2) return [];
  const words = text.split(/\s+/);
  let prepared=preparedIndexes.get(items);
  if (!prepared) {
    prepared=items.map((item,order)=>{const name=normalizarBusquedaPublica(item.name),aliases=[...(item.aliases||[]),...(item.searchAliases||[])].map(normalizarBusquedaPublica);return {item,order,name,aliases,terms:[name,...aliases,normalizarBusquedaPublica(item.context||'')].join(' ')};});
    preparedIndexes.set(items,prepared);
  }
  return prepared.map(({item,order,name,aliases,terms})=>({item,order,score:name===text||aliases.includes(text)?0:name.startsWith(text)?1:2,matches:words.every(word=>terms.includes(word))})).filter(result => result.matches).sort((a,b) => a.score - b.score || a.order - b.order).slice(0,limit).map(result => result.item);
}

export function featuredPeopleForLocale(featured, people) {
  const byId = new Map(people.map(person => [person.id,person]));
  return featured.map(person => {
    const translated = byId.get(person.id);
    if (!translated) throw Error(`Missing featured English person: ${person.id}`);
    return translated;
  });
}
