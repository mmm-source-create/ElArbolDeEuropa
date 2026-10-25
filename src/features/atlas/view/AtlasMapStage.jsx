import {governmentSummary} from '../../../domain/government/governmentPresentation.js';
import {gobiernosDe} from '../../../domain/genealogy/personAccessors.js';
import {MapaEuropa} from '../MapaEuropa.jsx';
import {esGobernante, territoriosGobernadosEnAño} from '../../../domain/government/reigns.js';

const IRISH_MAP_TERRITORIES = new Set(['Irlanda','Connacht','Leinster','Tír Eoghain','Tír Chonaill','Condado de Tyrone','Condado de Tyrconnell','Thomond','Condado de Thomond','Desmond','Condado de Desmond','Condado de Clancare','Condado de Ulster','Kildare','Ormond','Clanricarde','Vizcondado de Mayo']);

// Mapa del Atlas para la persona seleccionada.
export default function AtlasMapStage({vm}) {
  const {anioGlobal, initialMapViewport, recordMapViewport, seleccion, seleccionarPersonaPorId} = vm;
  return (
    <section className="workspace-stage workspace-map-stage" aria-label="Mapa de territorios">
              <MapaEuropa
                fitAllBounds={Boolean(vm.historiaActiva)}
                initialViewport={initialMapViewport}
                onViewportChange={recordMapViewport}
                seleccion={seleccion}
                anioGlobal={anioGlobal}
                onSelectPersona={seleccionarPersonaPorId}
              />
              <div className="territory-hint workspace-map-hint sk" style={{"--sk-index":5}}>
                {seleccion
                  ? (esGobernante(seleccion)
                      ? (Number.isFinite(anioGlobal)
                          ? (territoriosGobernadosEnAño(seleccion, anioGlobal).length
                              ? `En ${anioGlobal}, ${seleccion.nombre} gobernaba: ${governmentSummary(seleccion, anioGlobal).join(", ")}.`
                              : `${seleccion.nombre} no gobernaba ningún territorio registrado en ${anioGlobal}.`)
                          : `Se destacan los territorios que gobernó ${seleccion.nombre}; elige un año para ver solo los vigentes entonces.`)
                      : `${seleccion.nombre} no ostentó un título de gobierno, así que no se ilumina ningún territorio en el mapa (puedes ver su vinculación territorial en la biografía).`)
                  : (Number.isFinite(anioGlobal)
                      ? `Año ${anioGlobal}: haz clic sobre una persona para ver qué territorios gobernaba entonces.`
                      : "Haz clic sobre una persona para ver los territorios que gobernó.")}
                {gobiernosDe(seleccion).some(gobierno => IRISH_MAP_TERRITORIES.has(gobierno.territorio)) && <span> Irlanda: contornos regionales aproximados; los señoríos y condados no coincidían necesariamente con estas divisiones.</span>}
              </div>
            </section>
  );
}
