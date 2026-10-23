export const TRANSLATED_DYNASTIES=[{es:'anjou-hungria',en:'anjou-hungary'}];
export const TRANSLATED_TERRITORIES=[{es:'normandia',en:'normandy'}];
export const TRANSLATED_STORIES = [
 {id:'borgona',es:'borgona-el-reino-que-no-fue',en:'burgundy-the-kingdom-that-never-was'},
 {id:'gioconda',es:'en-busca-de-la-gioconda',en:'in-search-of-the-mona-lisa'},
];
export const TRANSLATED_PEOPLE = [
 {id:'JUANA1NAP',es:'juana-i-de-napoles',en:'joanna-i-of-naples'},
 {id:'CARLOS1',es:'carlos-i',en:'charles-i-of-hungary'},
 {id:'MATIAS1HUN',es:'matias-corvino',en:'matthias-corvinus'},
 {id:'CARLOS3NAP',es:'carlos-iii-de-napoles-y-ii-de-hungria',en:'charles-of-durazzo'},
 {id:'LUIS1',es:'luis-i',en:'louis-i-of-hungary'},
 {id:'MARIA1H',es:'maria-i-de-hungria',en:'mary-queen-of-hungary'},
 {id:'EDUV1',es:'santa-eduviges-i',en:'jadwiga-of-poland'},
 {id:'HENRY2ING',es:'enrique-ii-de-inglaterra',en:'henry-ii-of-england'},
 {id:'ELEANORAQUIT',es:'leonor-de-aquitania',en:'eleanor-of-aquitaine'},
 {id:'RICARDO1ING',es:'ricardo-i-de-inglaterra',en:'richard-i-of-england'},
 {id:'ISABEL1ING',es:'isabel-i-de-inglaterra',en:'elizabeth-i-of-england'},
 {id:'LUIS9',es:'san-luis-ix',en:'louis-ix-of-france'},
 {id:'SULEIMAN1OSM',es:'soliman-i',en:'suleiman-the-magnificent'},
 {id:'ISAB1CAST',es:'isabel-i-de-castilla',en:'isabella-i-of-castile'},
 {id:'CARLOS5',es:'carlos-v',en:'charles-v'},
 {id:'LEONARDODAVINCI',es:'leonardo-da-vinci',en:'leonardo-da-vinci'},
 {id:'MARIABORG',es:'maria-de-borgona-mariaborg',en:'mary-of-burgundy'},
 {id:'MAXIM1',es:'maximiliano-i',en:'maximilian-i'},
 {id:'FEL2ESP',es:'felipe-ii-de-espana',en:'philip-ii-of-spain'},
 {id:'FERN2ARAG',es:'fernando-ii-de-aragon',en:'ferdinand-ii-of-aragon'},
 {id:'ENRIQ8ING',es:'enrique-viii',en:'henry-viii-of-england'},
 {id:'LUIS14FRA',es:'luis-xiv-de-francia',en:'louis-xiv-of-france'},
 {id:'JUANAARCO',es:'juana-de-arco',en:'joan-of-arc'},
 {id:'LORENZOMEDICI',es:'lorenzo-de-medici-lorenzomedici',en:'lorenzo-de-medici'},
 {id:'MEHMED2OSM',es:'mehmed-ii',en:'mehmed-ii'},
 {id:'PETER1RUS',es:'pedro-i-de-rusia',en:'peter-the-great'},
 {id:'CATHERINE2RUS',es:'catalina-ii-de-rusia',en:'catherine-the-great'},
 {id:'FRED2PRUSSIA',es:'federico-ii-de-prusia',en:'frederick-the-great'},
];
export function englishRoute(pathname) {
 const path=String(pathname).replace(/\/$/,'');
 const simple={'/en':'home','/en/about':'about','/en/methodology':'methodology','/en/stories':'stories','/en/people':'people','/en/dynasties':'dynasties','/en/territories':'territories','/en/challenge':'challenge'};
 if(simple[path])return {kind:'english',slug:simple[path],chapter:null,path:path==='/en'?'/en/':path};
 const match=path.match(/^\/en\/(story|person|dynasty|territory)\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/chapter\/([1-9][0-9]*))?$/);
 if(!match||match[1]!=='story'&&match[3])return null;
 return {kind:'english',slug:`${match[1]}-${match[2]}`,chapter:match[3]?Number(match[3]):null,path};
}
// Forma del esqueleto de carga para una ruta inglesa.
export const englishSkeletonKind=route=>route?.slug?.startsWith('person-')?'person':/^(dynasty|territory)-/.test(route?.slug||'')?'entity-body':route?.slug==='home'?'home':['people','stories','dynasties','territories','challenge'].includes(route?.slug)?'catalog':['methodology','about'].includes(route?.slug)?'methodology':'story';

export function translatedEquivalent(pathname,locale) {
 const path=String(pathname).replace(/\/$/,'');
 for(const [es,en] of [['/es','/en/'],['/es/proyecto','/en/about'],['/es/fuentes','/en/methodology'],['/es/historias','/en/stories'],['/es/personas','/en/people'],['/es/privacidad','/en/privacy'],['/es/dinastias','/en/dynasties'],['/es/territorios','/en/territories'],['/es/desafio','/en/challenge']]) {
  if(locale==='en'&&path===es)return en;
  if(locale==='es'&&path===en.replace(/\/$/,''))return es==='\/es'?'/es/':es;
 }
 for(const s of TRANSLATED_STORIES){
  const from=locale==='en'?`/es/historia/${s.es}`:`/en/story/${s.en}`,to=locale==='en'?`/en/story/${s.en}`:`/es/historia/${s.es}`;
  if(path===from)return to;
  const prefix=from+(locale==='en'?'/capitulo/':'/chapter/');
  if(path.startsWith(prefix)&&/^[1-9][0-9]*$/.test(path.slice(prefix.length)))return to+(locale==='en'?'/chapter/':'/capitulo/')+path.slice(prefix.length);
 }
 for(const [items,esKind,enKind] of [[TRANSLATED_DYNASTIES,'dinastia','dynasty'],[TRANSLATED_TERRITORIES,'territorio','territory']])for(const p of items){if(locale==='en'&&path===`/es/${esKind}/${p.es}`)return `/en/${enKind}/${p.en}`;if(locale==='es'&&path===`/en/${enKind}/${p.en}`)return `/es/${esKind}/${p.es}`;}
 for(const p of TRANSLATED_PEOPLE){if(locale==='en'&&path===`/es/persona/${p.es}`)return `/en/person/${p.en}`;if(locale==='es'&&path===`/en/person/${p.en}`)return `/es/persona/${p.es}`;}
 return null;
}
export function englishPaths() {
 return ['/en/dynasties','/en/territories','/en/challenge',...TRANSLATED_DYNASTIES.map(p=>`/en/dynasty/${p.en}`),...TRANSLATED_TERRITORIES.map(p=>`/en/territory/${p.en}`),'/en/','/en/about','/en/stories','/en/people','/en/methodology',...TRANSLATED_PEOPLE.map(p=>`/en/person/${p.en}`),...TRANSLATED_STORIES.flatMap(s=>[`/en/story/${s.en}`,...Array.from({length:11},(_,i)=>`/en/story/${s.en}/chapter/${i+1}`)])];
}
