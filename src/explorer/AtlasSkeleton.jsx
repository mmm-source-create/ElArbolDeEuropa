import SiteHeader from '../components/SiteHeader.jsx';
import './atlas-skeleton.css';
export function AtlasLoadError({onRetry}) {
  return <div className="atlas-loading-message" role="alert"><strong>No se ha podido cargar el Atlas.</strong>
    <p>Puedes intentarlo de nuevo o volver a las historias.</p>
    <button className="public-primary" onClick={onRetry}>Reintentar</button>
    <a href="/es/historias">Ver historias</a></div>;
}
// Bootstrap draws the Atlas outline (scene, search, year, view row, tree and
// side panel) until the code arrives; Explorer then overlays its real boxes.
export default function AtlasSkeleton({error=false,onRetry}) {
  return <div className={'atlas-loading atlas-bootstrap '+(error ? '' : 'loading')} aria-busy={!error}>
    <SiteHeader variant="atlas"/>
    {error ? <AtlasLoadError onRetry={onRetry}/> : <>
      <span className="atlas-loading-status" role="status">Cargando el atlas…</span>
      <main className="atlas-bootstrap-surface" aria-hidden="true"><span className="atlas-loading-bar"/>
        <div className="atlas-bs-scene sk" style={{"--sk-index":0}}/>
        <div className="atlas-bs-topbar"><div className="atlas-bs-search sk" style={{"--sk-index":1}}/><div className="atlas-bs-year"><i className="sk" style={{"--sk-index":2}}/><b className="sk" style={{"--sk-index":3}}/></div></div>
        <div className="atlas-bs-row"><div className="atlas-bs-pills sk" style={{"--sk-index":4}}/><div className="atlas-bs-icons">{[5,6,7,8].map(i=><i key={i} className="sk" style={{"--sk-index":i}}/>)}</div></div>
        <div className="atlas-bs-grid"><div className="atlas-bs-tree sk dim"><span/><span/><span/></div><div className="atlas-bs-panel sk dim"/></div>
      </main>
    </>}
  </div>;
}
