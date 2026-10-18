import {BY_ID} from '../../../domain/genealogy/relations.js';
import {ALCANCES_FOCO} from '../../../domain/genealogy/relationshipGraph.js';

// Barra del modo foco.
export default function FocusBar({vm}) {
  const {focoAlcance, focoId, focoSet, setFocoAlcance, setFocoId, setMode, visiblePeople} = vm;
  return (
    <div className="compare-bar workspace-mode-bar focus-mode-bar">
          <span>Foco: <b>{focoId ? BY_ID[focoId]?.nombre : "haz clic en una persona"}</b></span>
          <label className="focus-scope-select">Ver solo <select aria-label="Alcance del modo foco" value={focoAlcance} onChange={(event) => setFocoAlcance(event.target.value)}>{ALCANCES_FOCO.map((opcion) => <option key={opcion.id} value={opcion.id}>{opcion.label}</option>)}</select></label>
          {focoSet && (
            <span className="focus-count">
              {visiblePeople.length} persona{visiblePeople.length === 1 ? "" : "s"} visibles
            </span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => {setMode("view");setFocoId(null);}}>Salir del foco</button>
        </div>
  );
}
