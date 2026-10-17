import {Search, ArrowRight, UserRoundPlus} from 'lucide-react';
import './atlas-growth.css';

// First-visit guidance lives inside the empty tree, without adding a toolbar.
export default function AtlasGrowth({ids,onStart,onHelp,selected,additions,onExpand}) {
 // With a single person on the tree, suggest the one action that makes it grow.
 if (Array.isArray(ids) && ids.length === 1 && selected && additions?.family?.length)
  return <aside className="atlas-next-step" aria-label="Siguiente paso"><span>Siguiente paso</span><button type="button" onClick={()=>onExpand('family')}><UserRoundPlus size={14} aria-hidden="true"/>Añade la familia de {selected.nombre} <small>+{additions.family.length}</small></button><em>o elige un año arriba para ver su época</em></aside>;
 if (!Array.isArray(ids) || ids.length) return null;
 return <section className="atlas-start" aria-label="Comenzar una familia"><Search size={22} aria-hidden="true"/><h2>Una persona es un buen comienzo</h2><p>Busca arriba un nombre o empieza con una de estas personas. Después podrás añadir su familia y elegir un año.</p><div>{[['ISAB1CAST','Isabel de Castilla'],['CARLOS5','Carlos V'],['LEONARDODAVINCI','Leonardo da Vinci']].map(([id,name])=><button type="button" className="nav-btn" key={id} onClick={()=>onStart(id)}>{name}<ArrowRight size={12}/></button>)}</div><button type="button" className="atlas-start-help" onClick={onHelp}>¿Primera visita? Ver guía de tres pasos</button></section>;
}
