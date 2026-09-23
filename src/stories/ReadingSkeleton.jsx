import React from 'react';
const Lines = ({count = 3}) => <div className="skeleton-lines">{Array.from({length:count}, (_, i) => <span key={i}/>)}</div>;
const Cards = ({className, count = 6}) => <div className={className}>{Array.from({length:count}, (_, i) => <div className="skeleton-card" key={i}><Lines count={3}/></div>)}</div>;
function Placeholder({kind}) {
  if (kind === 'person') return <><div className="skeleton-breadcrumb"/><div className="public-person-hero"><div><div className="skeleton-heading"/><Lines count={4}/><div className="skeleton-button"/></div><div className="skeleton-portrait"/></div><div className="public-person-columns"><div className="skeleton-card"><Lines count={5}/></div><div className="skeleton-card"><Lines count={5}/></div></div></>;
  if (kind === 'home') return <><div className="skeleton-home-hero"><div className="skeleton-heading"/><Lines count={2}/><div className="skeleton-button"/><div className="skeleton-reading-meta"/></div><Cards className="public-door-grid" count={3}/><div className="skeleton-reading-meta"/><Cards className="public-person-grid"/></>;
  if (kind === 'catalog' || kind === 'methodology') return <><div className="skeleton-breadcrumb"/><div className="skeleton-catalog-heading"><div className="skeleton-heading"/><div className="skeleton-subtitle"/></div><div className="skeleton-search"/><Cards className={kind === 'methodology' ? 'public-info-grid' : 'public-person-list'}/></>;
  return <><div className="skeleton-breadcrumb"/><div className="skeleton-heading"/><div className="skeleton-subtitle"/><div className="skeleton-reading-meta"/><div className="story-layout"><div><Lines count={6}/><div className="skeleton-button"/><div className="skeleton-card"><Lines count={3}/></div></div><div className="skeleton-timeline">{Array.from({length:6},(_,i)=><Lines key={i} count={2}/>)}</div></div></>;
}
export default function ReadingSkeleton({locale = 'es', kind = 'story'}) {
 return <div className={`reading-skeleton reading-skeleton-${kind}`} role="status" aria-live="polite" aria-busy="true"><span className="skeleton-status">{locale === 'en' ? 'Preparing your page…' : 'Preparando página…'}</span><div aria-hidden="true"><Placeholder kind={kind}/></div></div>;
}
