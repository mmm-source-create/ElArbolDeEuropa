// Árbol de Steiner exacto para un máximo de cinco terminales: cada vínculo cuenta uno.
// Programación dinámica por subconjuntos + caminos mínimos; no infiere filiaciones.
export const CONNECTION_LIMIT = 5;
export const CONNECTION_TYPES = {sangre:['sangre'],matrimonio:['sangre','matrimonio']};
const pairKey=(a,b)=>[a,b].sort().join('|');
class Heap {
 constructor(){this.items=[];}
 less(a,b){return a[0]<b[0]||(a[0]===b[0]&&a[1]<b[1]);}
 push(value){const a=this.items;a.push(value);let i=a.length-1;while(i){const p=(i-1)>>1;if(!this.less(a[i],a[p]))break;[a[i],a[p]]=[a[p],a[i]];i=p;}}
 pop(){const a=this.items,first=a[0],last=a.pop();if(a.length){a[0]=last;let i=0;while(true){let j=i,l=2*i+1,r=l+1;if(l<a.length&&this.less(a[l],a[j]))j=l;if(r<a.length&&this.less(a[r],a[j]))j=r;if(j===i)break;[a[i],a[j]]=[a[j],a[i]];i=j;}}return first;}
 get length(){return this.items.length;}
}
export function connectionTree(graph,requested,criterion='matrimonio') {
 const terminals=[...new Set(requested||[])];
 if(terminals.length>CONNECTION_LIMIT)throw new Error('Selecciona como máximo cinco personas.');
 if(terminals.some(id=>typeof id!=='string'||!Object.hasOwn(graph,id)))throw new Error('Hay personas que no existen en la base.');
 const allowed=new Set(CONNECTION_TYPES[criterion]||CONNECTION_TYPES.matrimonio);
 const names=Object.keys(graph).sort(),index=new Map(names.map((id,i)=>[id,i]));
 const adj=names.map(id=>(graph[id]||[]).filter(e=>index.has(e.id)&&e.tipos.some(t=>allowed.has(t))).map(e=>index.get(e.id)).sort((a,b)=>a-b));
 const pending=new Set(terminals),groups=[];
 while(pending.size){
  const first=pending.values().next().value,seen=new Set([index.get(first)]),queue=[index.get(first)];
  for(let i=0;i<queue.length;i++)for(const v of adj[queue[i]])if(!seen.has(v)){seen.add(v);queue.push(v);}
  const group=terminals.filter(id=>seen.has(index.get(id)));group.forEach(id=>pending.delete(id));groups.push(group);
 }
 const nodes=new Set(terminals),edges=new Map();
 const addEdge=(a,b)=>{
  const from=names[a],to=names[b],types=graph[from].find(e=>e.id===to).tipos.filter(t=>allowed.has(t));
  nodes.add(from);nodes.add(to);edges.set(pairKey(from,to),{from,to,type:types.includes('sangre')?'sangre':'matrimonio'});
 };
 for(const group of groups) {
  if(group.length<2)continue;
  const n=names.length,full=(1<<group.length)-1;
  const costs=Array.from({length:full+1},()=>new Float64Array(n).fill(Infinity));
  const prev=Array.from({length:full+1},()=>new Int32Array(n).fill(-1));
  const split=Array.from({length:full+1},()=>new Int32Array(n));
  group.forEach((id,i)=>{costs[1<<i][index.get(id)]=0;});
  for(let mask=1;mask<=full;mask++) {
   for(let part=(mask-1)&mask;part;part=(part-1)&mask){
    const other=mask^part;if(!other||part>other)continue;
    for(let v=0;v<n;v++){
     const candidate=costs[part][v]+costs[other][v];
     if(candidate<costs[mask][v]){costs[mask][v]=candidate;split[mask][v]=part;prev[mask][v]=-1;}
    }
   }
   const heap=new Heap();for(let v=0;v<n;v++)if(Number.isFinite(costs[mask][v]))heap.push([costs[mask][v],v]);
   while(heap.length){
    const [cost,u]=heap.pop();if(cost!==costs[mask][u])continue;
    for(const v of adj[u])if(cost+1<costs[mask][v]){costs[mask][v]=cost+1;prev[mask][v]=u;split[mask][v]=0;heap.push([cost+1,v]);}
   }
  }
  let root=0;for(let v=1;v<n;v++)if(costs[full][v]<costs[full][root])root=v;
  const trace=(mask,start)=>{
   let v=start;while(prev[mask][v]>=0){const next=prev[mask][v];addEdge(v,next);v=next;}
   const part=split[mask][v];if(part){trace(part,v);trace(mask^part,v);}
  };
  trace(full,root);
 }
 return {terminals,ids:[...nodes].sort(),edges:[...edges.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([,edge])=>edge),groups,connected:groups.length<=1,criterion:allowed.has('matrimonio')?'matrimonio':'sangre'};
}
export function connectionUrl(ids,criterion='matrimonio') {
 const params=new URLSearchParams({atlas:'1',vista:'arbol',vinculos:criterion==='sangre'?'sangre':'matrimonio'});
 [...new Set(ids)].slice(0,CONNECTION_LIMIT).forEach(id=>params.append('conectar',id));
 return `/es/?${params}`;
}
export function connectionFromSearch(search,byId) {
 const params=new URLSearchParams(search);
 const ids=[...new Set(params.getAll('conectar'))].filter(id=>Object.hasOwn(byId,id)).slice(0,CONNECTION_LIMIT);
 return {ids,criterion:params.get('vinculos')==='sangre'?'sangre':'matrimonio'};
}
