const Lines = ({count = 3}) => <div className="skeleton-lines">{Array.from({length:count}, (_, i) => <span key={i}/>)}</div>;
const Cards = ({className, count = 6, lines = 3}) => <div className={className}>{Array.from({length:count}, (_, i) => <div className="skeleton-card" key={i}><Lines count={lines}/></div>)}</div>;
// Catalog lists load under a real title and search box: only the list is a
// placeholder, shaped like the cards that will replace it.
const ListPlaceholder = ({list}) => {
  if (list === 'entities') return <div className="public-entity-grid">{Array.from({length:6},(_,i)=><div className="skeleton-entity" key={i}><div className="skeleton-eyebrow"/><div className="skeleton-entity-title"/><div className="skeleton-chips"><i/><i/><i/><i/></div><div className="skeleton-link"/></div>)}</div>;
  if (list === 'stories') return <div className="public-story-grid public-story-catalog">{Array.from({length:6},(_,i)=><div className="skeleton-entity" key={i}><div className="skeleton-eyebrow"/><div className="skeleton-entity-title"/><Lines count={2}/><div className="skeleton-link"/></div>)}</div>;
  return <div className="public-person-list">{Array.from({length:8},(_,i)=><div className="skeleton-person" key={i}><div className="skeleton-avatar"/><Lines count={2}/></div>)}</div>;
};
function Placeholder({kind, list}) {
  if (kind === 'catalog-list') return <ListPlaceholder list={list}/>;
  if (kind === 'person') return <><div className="skeleton-breadcrumb"/><div className="public-person-hero"><div><div className="skeleton-heading"/><Lines count={4}/><div className="skeleton-button"/></div><div className="skeleton-portrait"/></div><div className="public-person-columns"><div className="skeleton-card"><Lines count={5}/></div><div className="skeleton-card"><Lines count={5}/></div></div></>;
  if (kind === 'home') return <><div className="skeleton-home-hero"><div className="skeleton-eyebrow"/><div className="skeleton-heading"/><Lines count={2}/><div className="skeleton-home-actions"><i/><i/></div><div className="skeleton-home-stats"><i/><i/><i/><i/></div></div><div className="skeleton-section-heading"/><div className="skeleton-home-carousel">{Array.from({length:4},(_,i)=><div key={i}><div className="skeleton-portrait"/><Lines count={2}/></div>)}</div></>;
  if (kind === 'catalog') return <><div className="skeleton-breadcrumb"/><div className="skeleton-catalog-heading"><div className="skeleton-heading"/><div className="skeleton-subtitle"/></div><div className="skeleton-search"/><Cards className="public-person-list" count={8} lines={2}/></>;
  if (kind === 'methodology') return <><div className="skeleton-breadcrumb"/><div className="skeleton-catalog-heading"><div className="skeleton-heading"/><div className="skeleton-subtitle"/></div><Cards className="public-info-grid" count={4} lines={5}/></>;
  return <><div className="skeleton-breadcrumb"/><div className="skeleton-heading"/><div className="skeleton-subtitle"/><div className="skeleton-reading-meta"/><div className="story-layout"><div><div className="skeleton-chapter-title"/><Lines count={7}/><div className="skeleton-button"/><div className="skeleton-card"><Lines count={3}/></div></div><div className="skeleton-timeline">{Array.from({length:6},(_,i)=><Lines key={i} count={2}/>)}</div></div></>;
}
export default function ReadingSkeleton({locale = 'es', kind = 'story', list}) {
 return <div className={`reading-skeleton reading-skeleton-${kind}`} role="status" aria-live="polite" aria-busy="true"><span className="skeleton-status">{locale === 'en' ? 'Preparing your page…' : 'Preparando página…'}</span><div aria-hidden="true"><Placeholder kind={kind} list={list}/></div></div>;
}
