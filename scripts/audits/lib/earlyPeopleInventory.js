import {gobiernosDe} from '../../../src/data/personAccessors.js';
import {gobiernoEfectivo} from '../../../src/data/territorios.js';

export function earlyPeopleInventory(people,before=1200){
 return people.filter(p=>p.nac<before||p.muer<before||gobiernosDe(p).some(g=>g.desde<before))
 .map(person=>({id:person.id,name:person.nombre,birth:person.nac??null,death:person.muer??null,
  governments:gobiernosDe(person).filter(g=>g.desde<before).map(g=>({territory:g.territorio,from:g.desde,through:g.hasta,title:g.titulo||person.titulo||'',condition:g.condicion||'gobierno registrado',effective:gobiernoEfectivo(g)})),
  laterTerritories:[...new Set(gobiernosDe(person).filter(g=>g.desde>=before).map(g=>g.territorio))],
  familyAssociations:[...(person.reinos||[])]}))
 .sort((a,b)=>(a.birth??Infinity)-(b.birth??Infinity)||a.name.localeCompare(b.name,'es'));
}
