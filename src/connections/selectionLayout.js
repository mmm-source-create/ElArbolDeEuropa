// Compacta únicamente las generaciones vacías de una selección. Cada persona aparece una vez.
export function selectionLayout(ids, gen, byId) {
 const levels=[...new Set(ids.map(id=>gen[id]??0))].sort((a,b)=>a-b);
 const rows=levels.map(level=>ids.filter(id=>(gen[id]??0)===level).sort((a,b)=>(byId[a]?.nac??9999)-(byId[b]?.nac??9999)||a.localeCompare(b)));
 const width=Math.max(720,...rows.map(r=>r.length*260+160)),positions={},units=[];
 rows.forEach((row,ri)=>row.forEach((id,ci)=>{
  const p={x:100+(width-200-row.length*260)/2+ci*260,y:100+ri*180,w:228,h:100,row:ri};positions[id]=p;
  units.push({key:id,ids:[id],x:p.x,y:p.y,width:p.w,height:p.h,boxes:[{id,x:0,y:0,w:p.w,h:p.h}]});
 }));
 return {positions,units,width,height:Math.max(400,rows.length*180+120),pairContacts:{},rowBands:rows.map((_,i)=>[100+i*180,200+i*180])};
}
export function selectionEdges(graph,ids) {
 const selected=new Set(ids),edges=[];
 for(const from of [...selected].sort())for(const e of graph[from]||[])if(selected.has(e.id)&&from<e.id){
  const type=e.tipos.includes('sangre')?'sangre':e.tipos.includes('matrimonio')?'matrimonio':e.tipos.includes('amante')?'amante':null;
  if(type)edges.push({from,to:e.id,type});
 }
 return edges;
}
export function edgePath(edge, positions, index=0) {
 let a=positions[edge.from],b=positions[edge.to];if(!a||!b)return '';
 if(a.row>b.row)[a,b]=[b,a];
 const ax=a.x+a.w/2,bx=b.x+b.w/2;
 if(a.row===b.row){
  const y=a.y-14-(index%5)*7;
  return `M ${ax} ${a.y} V ${y} H ${bx} V ${b.y}`;
 }
 if(b.row-a.row>1){const x=20+(index%8)*7;return `M ${a.x} ${a.y+a.h/2} H ${x} V ${b.y+b.h/2} H ${b.x}`;}
 const y=(a.y+a.h+b.y)/2;
 return `M ${ax} ${a.y+a.h} V ${y} H ${bx} V ${b.y}`;
}
