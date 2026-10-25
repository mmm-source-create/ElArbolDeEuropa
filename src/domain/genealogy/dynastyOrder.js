import {canonicalDynasty} from '../../data/dynastyAliases.js';
import {isNamedDynasty} from '../../data/dynastyNames.js';
import {HOUSE_PARENTS} from '../../content/dinastias/houseRelations.js';
import {RAMAS_DINASTICAS} from '../../content/dinastias/index.js';

// Search order only. Direct membership and every displayed count stay intact.
export function dynastyOrderCounts(people,{parents=HOUSE_PARENTS,branches=RAMAS_DINASTICAS}={}) {
 const members=new Map(),children=new Map();
 for(const person of people){const house=canonicalDynasty(person.dinastia);if(!isNamedDynasty(house))continue;if(!members.has(house))members.set(house,new Set());members.get(house).add(person.id);}
 const edge=(parent,child)=>{parent=canonicalDynasty(parent);child=canonicalDynasty(child);if(parent===child)return;if(!children.has(parent))children.set(parent,new Set());children.get(parent).add(child);};
 for(const [child,origins] of Object.entries(parents))for(const parent of origins)edge(parent,child);
 for(const branch of branches)if(branch.tipo==='rama_cadete')edge(branch.origen,branch.destino);
 return new Map([...members.keys()].map(root=>{
  const visited=new Set(),ids=new Set(),pending=[root];
  while(pending.length){const house=pending.pop();if(visited.has(house))continue;visited.add(house);for(const id of members.get(house)||[])ids.add(id);pending.push(...(children.get(house)||[]));}
  return [root,ids.size];
 }));
}
