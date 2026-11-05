import {governmentSummary} from '../../../domain/government/governmentPresentation.js';
import {gobiernosDe} from '../../../domain/genealogy/personAccessors.js';
import {MapaEuropa} from '../MapaEuropa.jsx';
import {esGobernante, territoriosGobernadosEnAño} from '../../../domain/government/reigns.js';
import {englishLabel} from '../../english/v6/atlasPresentation.js';

const IRISH_MAP_TERRITORIES = new Set(['Irlanda','Connacht','Leinster','Tír Eoghain','Tír Chonaill','Condado de Tyrone','Condado de Tyrconnell','Thomond','Condado de Thomond','Desmond','Condado de Desmond','Condado de Clancare','Condado de Ulster','Kildare','Ormond','Clanricarde','Vizcondado de Mayo']);

// Mapa del Atlas para la persona seleccionada.
export default function AtlasMapStage({vm}) {
  const {anioGlobal, initialMapViewport, locale, recordMapViewport, seleccion, seleccionarPersonaPorId} = vm;
  const en=locale==='en',terms=items=>en?items.map(englishLabel):items;
  return (
    <section className="workspace-stage workspace-map-stage" aria-label={en?'Map of territories':'Mapa de territorios'}>
              <MapaEuropa
                locale={locale}
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
                              ? (en?`In ${anioGlobal}, ${seleccion.nombre} ruled: ${terms(governmentSummary(seleccion, anioGlobal)).join(", ")}.`:`En ${anioGlobal}, ${seleccion.nombre} gobernaba: ${governmentSummary(seleccion, anioGlobal).join(", ")}.`)
                              : (en?`${seleccion.nombre} did not rule any recorded territory in ${anioGlobal}.`:`${seleccion.nombre} no gobernaba ningún territorio registrado en ${anioGlobal}.`))
                          : (en?`The territories ruled by ${seleccion.nombre} are highlighted; choose a year to show only those then active.`:`Se destacan los territorios que gobernó ${seleccion.nombre}; elige un año para ver solo los vigentes entonces.`))
                      : (en?`${seleccion.nombre} did not hold a governing title, so no territory is highlighted on the map. Their territorial associations remain available in the biography.`:`${seleccion.nombre} no ostentó un título de gobierno, así que no se ilumina ningún territorio en el mapa (puedes ver su vinculación territorial en la biografía).`))
                  : (Number.isFinite(anioGlobal)
                      ? (en?`Year ${anioGlobal}: select a person to see which territories they ruled then.`:`Año ${anioGlobal}: haz clic sobre una persona para ver qué territorios gobernaba entonces.`)
                      : (en?'Select a person to see the territories they ruled.':"Haz clic sobre una persona para ver los territorios que gobernó."))}
                {gobiernosDe(seleccion).some(gobierno => IRISH_MAP_TERRITORIES.has(gobierno.territorio)) && <span>{en?' Ireland: approximate regional outlines; lordships and counties did not necessarily match these divisions.':' Irlanda: contornos regionales aproximados; los señoríos y condados no coincidían necesariamente con estas divisiones.'}</span>}
              </div>
            </section>
  );
}
