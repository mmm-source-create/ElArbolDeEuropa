// These indexes contain only recorded relationships; missing parents never imply siblings.
export function familyIndex(people) {
 const byId=Object.fromEntries(people.map(p=>[p.id,p])),children={},partners={};
 for(const p of people) {
  for(const id of [p.padre,p.madre].filter(id=>byId[id]))(children[id]??=[]).push(p.id);
  for(const id of [p.conyuge,p.conyuge2,...p.conyuges||[]].filter(id=>byId[id])) {
   (partners[p.id]??=new Set()).add(id);(partners[id]??=new Set()).add(p.id);
  }
 }
 return {byId,children,partners};
}
export function familyIds(index,id,kind='family') {
 const {byId,children,partners}=index,p=byId[id];if(!p)return [];
 const parents=[p.padre,p.madre].filter(id=>byId[id]);
 const ids=kind==='parents'?parents:kind==='children'?(children[id]||[]):[id,...parents,...partners[id]||[],...children[id]||[],...parents.flatMap(id=>children[id]||[])];
 return [...new Set(ids)];
}
export function atlasIdsFromLocation(pathname,search,index,personId=null) {
 const params=new URLSearchParams(search);
 if(params.has('seleccion'))return [...new Set(params.getAll('seleccion'))].filter(id=>Object.hasOwn(index.byId,id));
 if(params.get('arbol')==='completo')return null;
 if(params.has('familia'))return familyIds(index,params.get('familia'));
 // Existing thematic/shared URLs keep their original scope.
 if(!/^\/es\/?$/.test(pathname)||[...params.keys()].some(k=>!['atlas','continuar','panel','regreso'].includes(k)))return null;
 return personId?familyIds(index,personId):[];
}
export function writeAtlasIds(url,ids) {
 url.searchParams.delete('seleccion');url.searchParams.delete('familia');url.searchParams.delete('arbol');url.searchParams.delete('continuar');
 if(ids===null)url.searchParams.set('arbol','completo');
 else if(ids.length)ids.forEach(id=>url.searchParams.append('seleccion',id));
 else url.searchParams.set('seleccion','');
 url.searchParams.set('atlas','1');return url;
}
export function isolatedPopes(index) {
 return new Set(Object.values(index.byId).filter(p=>/papa/i.test(p.titulo||'')&&familyIds(index,p.id).length===1&&!(p.amantes||[]).some(id=>index.byId[id])&&!Object.values(index.byId).some(other=>(other.amantes||[]).includes(p.id))).map(p=>p.id));
}
export function groupIsolatedPopes(layout,ids,byId) {
 const popes=ids.filter(id=>layout.positions[id]).sort((a,b)=>(byId[a].nac??Infinity)-(byId[b].nac??Infinity)||byId[a].nombre.localeCompare(byId[b].nombre,'es'));
 if(popes.length<2)return layout;
 const set=new Set(popes),units=layout.units.filter(u=>!u.ids.every(id=>set.has(id))),positions={...layout.positions};
 const top=Math.max(70,...units.map(u=>u.y+u.height))+100;
 const columns=Math.min(6,popes.length),width=Math.max(720,...units.map(u=>u.x+u.width+60),columns*230+120);
 popes.forEach((id,i)=>{const p={...positions[id],x:60+(i%columns)*230,y:top+Math.floor(i/columns)*110,w:190,h:70};positions[id]=p;units.push({key:id,ids:[id],x:p.x,y:p.y,width:p.w,height:p.h,boxes:[{id,x:0,y:0,w:p.w,h:p.h}]});});
 return {...layout,positions,units,width,height:top+Math.ceil(popes.length/columns)*110+60,isolatedPopeCount:popes.length};
}
