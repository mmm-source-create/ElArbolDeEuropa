import {BY_ID} from '../../../domain/genealogy/relations.js';
import {ALCANCES_FOCO} from '../../../domain/genealogy/relationshipGraph.js';

// Barra del modo foco.
export default function FocusBar({vm}) {
  const {focoAlcance, focoId, focoSet, locale, setFocoAlcance, setFocoId, setMode, visiblePeople} = vm;
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const scopeLabels={cercana:'Close family',ascendencia:'Ancestors',descendencia:'Descendants'};
  return (
    <div className="compare-bar workspace-mode-bar focus-mode-bar">
          <span>{tr('Foco','Focus')}: <b>{focoId ? BY_ID[focoId]?.nombre : tr('haz clic en una persona','select a person')}</b></span>
          <label className="focus-scope-select">{tr('Ver solo','Show only')} <select aria-label={tr('Alcance del modo foco','Focus mode scope')} value={focoAlcance} onChange={(event) => setFocoAlcance(event.target.value)}>{ALCANCES_FOCO.map((opcion) => <option key={opcion.id} value={opcion.id}>{en?scopeLabels[opcion.id]:opcion.label}</option>)}</select></label>
          {focoSet && (
            <span className="focus-count">
              {visiblePeople.length} {visiblePeople.length === 1 ? tr('persona visible','visible person') : tr('personas visibles','visible people')}
            </span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => {setMode("view");setFocoId(null);}}>{tr('Salir del foco','Exit focus')}</button>
        </div>
  );
}
