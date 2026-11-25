// Count strict source/target inversions. Equal endpoints never cross, and
// connectors belonging to the same family are excluded from the layout score.
// Sorting + a Fenwick tree replaces the quadratic pair scan without changing
// the integer score or the order of the layout's subsequent decisions.
function inversions(edges){
 if(edges.length<2)return 0;
 const ordered=edges.slice().sort((a,b)=>a.source-b.source);
 const targets=[...new Set(edges.map(e=>e.target))].sort((a,b)=>a-b);
 const ranks=new Map(targets.map((v,i)=>[v,i+1]));
 const tree=new Uint32Array(targets.length+1);
 const add=i=>{for(;i<tree.length;i+=i&-i)tree[i]++;};
 const prefix=i=>{let total=0;for(;i>0;i-=i&-i)total+=tree[i];return total;};
 let count=0,seen=0;
 for(let start=0;start<ordered.length;){
  let end=start+1;while(end<ordered.length&&ordered[end].source===ordered[start].source)end++;
  // Query the entire equal-source batch before inserting any of it.
  for(let i=start;i<end;i++)count+=seen-prefix(ranks.get(ordered[i].target));
  for(let i=start;i<end;i++)add(ranks.get(ordered[i].target));
  seen+=end-start;start=end;
 }
 return count;
}
export function countFamilyCrossings(edges){
 const families=new Map();
 for(const edge of edges){if(!families.has(edge.familyKey))families.set(edge.familyKey,[]);families.get(edge.familyKey).push(edge);}
 return inversions(edges)-[...families.values()].reduce((sum,family)=>sum+inversions(family),0);
}
