import React from 'react';
const Lines = ({count = 3}) => <div className="skeleton-lines">{Array.from({length:count}, (_, i) => <span key={i}/>)}</div>;
const Cards = ({className, count = 6, lines = 3}) => <div className={className}>{Array.from({length:count}, (_, i) => <div className="skeleton-card" key={i}><Lines count={lines}/></div>)}</div>;
function Placeholder({kind}) {
  if (kind === 'person') return <><div className="skeleton-breadcrumb"/><div className="public-person-hero"><div><div className="skeleton-heading"/><Lines count={4}/><div className="skeleton-button"/></div><div className="skeleton-portrait"/></div><div className="public-person-columns"><div className="skeleton-card"><Lines count={5}/></div><div className="skeleton-card"><Lines count={5}/></div></div></>;
  if (kind === 'home') return <><div className="skeleton-home-hero"><div className="skeleton-eyebrow"/><div className="skeleton-heading"/><Lines count={2}/><div className="skeleton-home-actions"><i/><i/><i/></div><div className="skeleton-home-stats"><i/><i/><i/><i/></div></div><Cards className="public-door-grid" count={6}/><div className="skeleton-section-heading"/><Cards className="public-person-grid"/></>;
  if (kind === 'catalog') return <><div className="skeleton-breadcrumb"/><div className="skeleton-catalog-heading"><div className="skeleton-heading"/><div className="skeleton-subtitle"/></div><div className="skeleton-search"/><Cards className="public-person-list" count={8} lines={2}/></>;
  if (kind === 'methodology') return <><div className="skeleton-breadcrumb"/><div className="skeleton-catalog-heading"><div className="skeleton-heading"/><div className="skeleton-subtitle"/></div><Cards className="public-info-grid" count={4} lines={5}/></>;
  return <><div className="skeleton-breadcrumb"/><div className="skeleton-heading"/><div className="skeleton-subtitle"/><div className="skeleton-reading-meta"/><div className="story-layout"><div><div className="skeleton-chapter-title"/><Lines count={7}/><div className="skeleton-button"/><div className="skeleton-card"><Lines count={3}/></div></div><div className="skeleton-timeline">{Array.from({length:6},(_,i)=><Lines key={i} count={2}/>)}</div></div></>;
}
export default function ReadingSkeleton({locale = 'es', kind = 'story'}) {
 return <div className={`reading-skeleton reading-skeleton-${kind}`} role="status" aria-live="polite" aria-busy="true"><span className="skeleton-status">{locale === 'en' ? 'Preparing your page…' : 'Preparando página…'}</span><div aria-hidden="true"><Placeholder kind={kind}/></div></div>;
}
