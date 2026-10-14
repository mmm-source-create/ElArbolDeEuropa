import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import './atlas-skeleton.css';
export function AtlasLoadError({onRetry}) {
  return <div className="atlas-loading-message" role="alert"><strong>No se ha podido cargar el Atlas.</strong>
    <p>Puedes intentarlo de nuevo o volver a las historias.</p>
    <button className="public-primary" onClick={onRetry}>Reintentar</button>
    <a href="/es/historias">Ver historias</a></div>;
}
// Bootstrap reserves a surface until the code arrives. Explorer then uses
// its actual elements; this component maintains no second Atlas layout.
export default function AtlasSkeleton({error=false,onRetry}) {
  return <div className={'atlas-loading atlas-bootstrap '+(error ? '' : 'loading')} aria-busy={!error}>
    <SiteHeader variant="atlas"/>
    {error ? <AtlasLoadError onRetry={onRetry}/> : <>
      <span className="atlas-loading-status" role="status">Cargando el atlas…</span>
      <main className="atlas-bootstrap-surface sk dim" aria-hidden="true"><span className="atlas-loading-bar"/></main>
    </>}
  </div>;
}
