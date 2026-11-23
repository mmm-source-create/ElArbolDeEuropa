import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';

export const TERRITORY_REGIONS = {
  iberia: ['Península ibérica', 'Iberian Peninsula'],
  'france-low-countries': ['Francia y Países Bajos', 'France and the Low Countries'],
  'british-isles': ['Islas Británicas', 'British Isles'],
  'central-alps': ['Europa central y Alpes', 'Central Europe and the Alps'],
  italy: ['Italia y sus islas', 'Italy and its islands'],
  'nordic-baltic': ['Escandinavia y Báltico', 'Scandinavia and the Baltic'],
  'eastern-europe': ['Europa oriental y estepas', 'Eastern Europe and the steppes'],
  balkans: ['Balcanes y Egeo', 'Balkans and the Aegean'],
  'africa-asia': ['África y Asia', 'Africa and Asia'],
  'atlantic-americas': ['Atlántico y América', 'Atlantic and the Americas'],
};
export const TERRITORY_NATURES = {
  entidad: ['Entidad histórica', 'Historical entity'],
  compuesta: ['Entidad compuesta', 'Composite entity'],
  agrupacion: ['Agrupación de exploración', 'Exploration grouping'],
};
export const TERRITORY_CLASSES = {
  gobierno:['Gobierno y jurisdicción','Government and jurisdiction'], principado:['Principado','Principality'],
  grupo_geografico:['Agrupación geográfica','Geographic grouping'], margraviato:['Margraviato','Margraviate'],
  condado:['Condado','County'], ducado:['Ducado','Duchy'], señorío:['Señorío','Lordship'], emirato:['Emirato','Emirate'],
  banato:['Banato','Banate'], despotado:['Despotado','Despotate'], imperio:['Imperio','Empire'],
  marquesado:['Marquesado','Marquisate'], reino:['Reino','Kingdom'], republica:['República','Republic'],
  sultanato:['Sultanato','Sultanate'], zarato:['Zarato','Tsardom'], califato:['Califato','Caliphate'],
  judicado:['Judicado','Judicate'], vizcondado:['Vizcondado','Viscounty'], grupo_historico:['Agrupación histórica','Historical grouping'],
  landgraviato:['Landgraviato','Landgraviate'], territorio_compuesto:['Territorio compuesto','Composite territory'],
  ciudad:['Ciudad','City'], burgraviato:['Burgraviato','Burgraviate'], archiducado:['Archiducado','Archduchy'],
  gran_ducado:['Gran ducado','Grand duchy'], electorado:['Electorado','Electorate'],
  estado_pontificio:['Estado pontificio','Papal state'], corona_compuesta:['Corona compuesta','Composite crown'],
  union_compuesta:['Unión compuesta','Composite union'],
};
// Curated entry points in canonical keys; labels and URLs come from each locale.
export const TERRITORY_FEATURED = ['España','Corona de Castilla','Corona de Aragón','Portugal','Navarra','Granada',
  'Francia','Borgoña','Condado de Borgoña','Países Bajos','Provincias Unidas','Borgoña y Países Bajos',
  'Inglaterra','Escocia','Irlanda','Gran Bretaña','Gales','Tír Eoghain',
  'Sacro Imperio','Austria','Bohemia','Hungría','Confederación Suiza','Baviera',
  'Estados Italianos','Estados Pontificios','Venecia','Milán','Nápoles','Sicilia',
  'Dinamarca','Noruega','Suecia','Prusia','Curlandia','Orden de Livonia',
  'Polonia-Lituania','Polonia','Lituania','Rusia','Moscú','Kanato de Crimea',
  'Bizancio','Imperio otomano','Serbia','Bosnia','Bulgaria','Atenas',
  'Jerusalén','Georgia','Armenia cilicia','Egipto','Persia','Sultanato mameluco',
  'Brasil','Guanartematos de Gran Canaria','Menceyatos de Tenerife'];
export const territoryFeaturedOrder = (items,locale='es',region=null) => territoryOrder(items,locale).sort((a,b)=>{
  const rank=item=>{const index=TERRITORY_FEATURED.indexOf(item.key||item.nombre);return index<0?Infinity:index;};
  return (region?Number(a.regiones[0]!==region)-Number(b.regiones[0]!==region):0)||rank(a)-rank(b);
});

export function territoryExcerpt(text,limit=240) {
  if(!text || text.length<=limit)return text||'';
  const sentence=text.slice(0,limit+1).lastIndexOf('. ');
  if(sentence>=55)return text.slice(0,sentence+1);
  const cut=text.lastIndexOf(' ',limit);
  return text.slice(0,cut>0?cut:limit).replace(/[ ,;:]$/,'')+'…';
}

export const territoryLabel = (labels, key, locale='es') => labels[key]?.[locale==='en'?1:0] || key;
export const territoryPath = item => item.path || `/es/territorio/${item.slug}`;
export const territoryOrder = (items,locale='es') => items.slice().sort((a,b)=>a.nombre.localeCompare(b.nombre,locale));

export function territoryFacets(items) {
  const regiones={}, clases={}, naturalezas={};
  for(const item of items) {
    for(const region of item.regiones || []) regiones[region]=(regiones[region]||0)+1;
    clases[item.clase]=(clases[item.clase]||0)+1;
    naturalezas[item.naturaleza]=(naturalezas[item.naturaleza]||0)+1;
  }
  return {regiones,clases,naturalezas};
}

export function filterTerritories(items,{query='',region='',nature='',type='',year='',history=false}={}) {
  const q=normalizarBusquedaPublica(query.trim());
  const hasYear=String(year).trim()!=='';
  const value=Number(year);
  return items.filter(item=>(!q || normalizarBusquedaPublica([item.nombre,...(item.aliases||[]),...(item.searchAliases||[]),...(item.miembros||[]).map(p=>p.nombre)].join(' ')).includes(q))
    && (!region || item.regiones?.includes(region)) && (!nature || item.naturaleza===nature)
    && (!type || item.clase===type) && (!history || item.editorial)
    && (!hasYear || (Number.isInteger(value) && item.intervalos?.some(([from,to])=>value>=from&&value<=to))));
}

// Balanced regional previews, rather than the 120 territories with most people.
export function territoryPreview(items,limit=120,locale='es') {
  const ordered=territoryFeaturedOrder(items,locale), selected=new Map();
  for(const region of Object.keys(TERRITORY_REGIONS))for(const item of territoryFeaturedOrder(ordered.filter(t=>t.regiones?.includes(region)),locale,region).slice(0,10))selected.set(territoryPath(item),item);
  for(const item of ordered)if(selected.size<limit)selected.set(territoryPath(item),item);
  return [...selected.values()].slice(0,limit);
}

export function territoryDirectory(items,locale='es') {
  return territoryOrder(items,locale).map(item=>({n:item.nombre,p:territoryPath(item)}));
}
