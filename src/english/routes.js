export const TRANSLATED_STORIES = [
 {id:'borgona',es:'borgona-el-reino-que-no-fue',en:'burgundy-the-kingdom-that-never-was'},
 {id:'gioconda',es:'en-busca-de-la-gioconda',en:'in-search-of-the-mona-lisa'},
];
export const TRANSLATED_PEOPLE = [
 {id:'ISAB1CAST',es:'isabel-i-de-castilla',en:'isabella-i-of-castile'},
 {id:'CARLOS5',es:'carlos-v',en:'charles-v'},
 {id:'LEONARDODAVINCI',es:'leonardo-da-vinci',en:'leonardo-da-vinci'},
 {id:'MARIABORG',es:'maria-de-borgona-mariaborg',en:'mary-of-burgundy'},
 {id:'MAXIM1',es:'maximiliano-i',en:'maximilian-i'},
];
export function englishRoute(pathname) {
 const path=String(pathname).replace(/\/$/,'');
 const simple={'/en':'home','/en/methodology':'methodology','/en/stories':'stories','/en/people':'people'};
 if(simple[path])return {kind:'english',slug:simple[path],chapter:null,path:path==='/en'?'/en/':path};
 const match=path.match(/^\/en\/(story|person)\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/chapter\/([1-9][0-9]*))?$/);
 if(!match||match[1]==='person'&&match[3])return null;
 return {kind:'english',slug:`${match[1]}-${match[2]}`,chapter:match[3]?Number(match[3]):null,path};
}
export function translatedEquivalent(pathname,locale) {
 const path=String(pathname).replace(/\/$/,'');
 for(const [es,en] of [['/es','/en/'],['/es/fuentes','/en/methodology'],['/es/historias','/en/stories'],['/es/personas','/en/people'],['/es/privacidad','/en/privacy']]) {
  if(locale==='en'&&path===es)return en;
  if(locale==='es'&&path===en.replace(/\/$/,''))return es==='\/es'?'/es/':es;
 }
 for(const s of TRANSLATED_STORIES){
  const from=locale==='en'?`/es/historia/${s.es}`:`/en/story/${s.en}`,to=locale==='en'?`/en/story/${s.en}`:`/es/historia/${s.es}`;
  if(path===from)return to;
  const prefix=from+(locale==='en'?'/capitulo/':'/chapter/');
  if(path.startsWith(prefix)&&/^[1-9][0-9]*$/.test(path.slice(prefix.length)))return to+(locale==='en'?'/chapter/':'/capitulo/')+path.slice(prefix.length);
 }
 for(const p of TRANSLATED_PEOPLE){if(locale==='en'&&path===`/es/persona/${p.es}`)return `/en/person/${p.en}`;if(locale==='es'&&path===`/en/person/${p.en}`)return `/es/persona/${p.es}`;}
 return null;
}
export function englishPaths() {
 return ['/en/','/en/stories','/en/people','/en/methodology',...TRANSLATED_PEOPLE.map(p=>`/en/person/${p.en}`),...TRANSLATED_STORIES.flatMap(s=>[`/en/story/${s.en}`,...Array.from({length:11},(_,i)=>`/en/story/${s.en}/chapter/${i+1}`)])];
}
