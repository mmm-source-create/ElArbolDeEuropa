import React from 'react';
export default function ReadingSkeleton({locale='es'}) {
 return <div className="reading-skeleton" aria-busy="true"><p role="status">{locale==='en'?'Preparing your page…':'Preparando lectura…'}</p><div aria-hidden="true"><div className="skeleton-heading"/><div className="skeleton-line"/><div className="story-layout"><div className="skeleton-text"/><div className="skeleton-timeline"/></div></div></div>;
}
