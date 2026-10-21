import {ArrowRight} from 'lucide-react';
import DynastyArms from '../../components/DynastyArms.jsx';

// Shared by the catalogue and a house's parent/cadet navigation.
export default function DynastyCard({item,headingLevel=2,relationship}) {
  const Heading=headingLevel===3?'h3':'h2';
  return <article className="public-entity-card">
    <div className="public-entity-card-head"><div className="public-entity-heading"><DynastyArms dinastia={item.nombre} size={30}/><div>
      <span>{relationship || (item.editorial?'Historia de la dinastía':'Dinastía')}</span><Heading>{item.nombre}</Heading>
    </div></div><strong aria-label={`${item.total} ${item.total===1?'persona':'personas'}`}>{item.total}<small aria-hidden="true">{item.total===1?'persona':'personas'}</small></strong></div>
    {item.resumen&&<p className="public-muted public-dynasty-summary">{item.resumen}</p>}
    {!!item.miembros?.length&&<div className="public-entity-members">{item.miembros.map(p=><a key={p.id} href={`/es/persona/${p.slug}`}>{p.nombre}</a>)}</div>}
    <a className="public-entity-action" href={`/es/dinastia/${item.slug}`}>Ver ficha <ArrowRight size={13}/></a>
  </article>;
}
