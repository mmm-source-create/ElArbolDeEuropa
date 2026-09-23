import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import './atlas-skeleton.css';
export default function AtlasSkeleton({error=false,onRetry}) {
 return <div className="atlas-loading-shell"><SiteHeader/><main className="atlas-skeleton" aria-busy={!error}><div className="atlas-loading-message" role={error?'alert':'status'}>{error?<><strong>No se ha podido cargar el Atlas.</strong><p>Puedes intentarlo de nuevo o volver a las historias.</p><button className="public-primary" onClick={onRetry}>Reintentar</button><a href="/es/historias">Ver historias</a></>:<span>Preparando el Atlas…</span>}</div><div className="atlas-skeleton-controls" aria-hidden="true"><i/><i/><i/></div><div className="atlas-skeleton-stage" aria-hidden="true"><div className="atlas-skeleton-tree"><i/><i/><i/><i/><i/><i/></div><div className="atlas-skeleton-bio"><i/><i/><i/></div></div><div className="atlas-skeleton-timeline" aria-hidden="true"><i/><i/><i/></div></main></div>;
}
