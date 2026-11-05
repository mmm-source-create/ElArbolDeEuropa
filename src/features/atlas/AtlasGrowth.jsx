import {useState} from 'react';
import {BY_ID} from '../../domain/genealogy/relations.js';
import {chooseStarterPeople} from './starterPeople.js';
import {Search, ArrowRight, UserRoundPlus} from 'lucide-react';
import './atlas-growth.css';

// First-visit guidance lives inside the empty tree, without adding a toolbar.
export default function AtlasGrowth({ids,onStart,onHelp,selected,additions,onExpand,locale='es'}) {
 const en=locale==='en';
 const [starters]=useState(chooseStarterPeople);
 // With a single person on the tree, suggest the one action that makes it grow.
 if (Array.isArray(ids) && ids.length === 1 && selected && additions?.family?.length)
  return <aside className="atlas-next-step" aria-label={en?'Next step':'Siguiente paso'}><span>{en?'Next step':'Siguiente paso'}</span><button type="button" onClick={()=>onExpand('family')}><UserRoundPlus size={14} aria-hidden="true"/>{en?'Add the family of':'Añade la familia de'} {selected.nombre} <small>+{additions.family.length}</small></button><em>{en?'or choose a year above to see their period':'o elige un año arriba para ver su época'}</em></aside>;
 if (!Array.isArray(ids) || ids.length) return null;
 return <section className="atlas-start" aria-label={en?'Start a family':'Comenzar una familia'}><Search size={22} aria-hidden="true"/><h2>{en?'One person is a good start':'Una persona es un buen comienzo'}</h2><p>{en?'Search for a name above or begin with one of these people. You can then add their family and choose a year.':'Busca arriba un nombre o empieza con una de estas personas. Después podrás añadir su familia y elegir un año.'}</p><div>{starters.map(({id,label})=><button type="button" className="nav-btn" key={id} onClick={()=>onStart(id)}>{en?BY_ID[id].nombre:(label || BY_ID[id].nombre)}<ArrowRight size={12}/></button>)}</div><button type="button" className="atlas-start-help" onClick={onHelp}>{en?'First visit? Open tutorial':'¿Primera visita? Abrir tutorial'}</button></section>;
}
