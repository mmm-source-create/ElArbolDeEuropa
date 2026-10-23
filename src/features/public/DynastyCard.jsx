import {ArrowRight} from 'lucide-react';
import DynastyArms from '../../components/DynastyArms.jsx';

// Shared by the catalogue and a house's parent/cadet navigation.
export default function DynastyCard({item,headingLevel=2,relationship,children,showMembers=true,locale='es'}) {
  const Heading=headingLevel===3?'h3':'h2';
  const en=locale==='en';
  const unit=en?(item.total===1?'person':'people'):(item.total===1?'persona':'personas');
  const path=item.path||`/es/dinastia/${item.slug}`;
  return <article className="public-entity-card">
    <div className="public-entity-card-head"><div className="public-entity-heading">{item.arms?<img src={item.arms.archivo} width="30" height="36" alt={en?`Arms of ${item.nombre}`:`Escudo de ${item.nombre}`}/>:<DynastyArms dinastia={item.key||item.nombre} size={30} locale={locale} label={en?`Arms of ${item.nombre}`:undefined}/>}<div>
      <span>{relationship || (en?'Dynasty':item.editorial?'Historia de la dinastía':'Dinastía')}</span><Heading>{item.nombre}</Heading>
    </div></div><strong aria-label={`${item.total} ${unit}`}>{item.total}<small aria-hidden="true">{unit}</small></strong></div>
    {item.resumen&&<p className="public-muted public-dynasty-summary">{item.resumen}</p>}
    {showMembers&&!!item.miembros?.length&&<div className="public-entity-members">{item.miembros.map(p=><a key={p.id} href={p.path||`/es/persona/${p.slug}`}>{p.nombre}{en&&(!p.path||p.path.startsWith('/es/'))?' · ES':''}</a>)}</div>}
    <a className="public-entity-action" href={path}>{en?'Read the record':'Ver ficha'}{en&&path.startsWith('/es/')?' · ES':''}<ArrowRight size={13}/></a>
    {children&&<div className="dynasty-card-connections">{children}</div>}
  </article>;
}
