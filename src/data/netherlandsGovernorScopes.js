import {GOVERNOR_SOURCES as sources} from '../evidence/netherlandsGovernorReviews.js';

const provinces = ['Flandes','Brabante','Limburgo','Holanda','Henao','Zelanda','Artois',
  'Namur','Luxemburgo','Frisia','Utrecht','Overijssel','Drente','Groninga','Güeldres','Señorío de Malinas'];
const contestedSouth = ['Flandes','Brabante'];

// Scopes qualify the office; they do not replace the canonical mandate.
// Annual resolution cannot show every change of garrison within a year.
export function netherlandsGovernorScope(personId, territory, year) {
  if (territory !== 'Países Bajos' || !Number.isInteger(year)) return null;
  let jurisdictions, disputedJurisdictions=[], source, note, excludedIds=['Dinant'];
  if (personId === 'FERN2ALBA' && year >= 1567 && year <= 1573) {
    jurisdictions = year < 1572 ? provinces : provinces.filter(name => !['Holanda','Zelanda'].includes(name));
    disputedJurisdictions = year < 1572 ? [] : contestedSouth;
    source=sources.alba;
    note='Ámbito provincial de la gobernación delegada. Desde 1572 se excluyen Holanda y Zelanda rebeldes; Flandes y Brabante se muestran en disputa. No se reconstruye cada guarnición.';
  } else if (personId === 'LUISREQUESENS' && year >= 1573 && year <= 1576) {
    jurisdictions=provinces.filter(name => !['Holanda','Zelanda'].includes(name));
    disputedJurisdictions=contestedSouth;source=sources.requesens;
    note='Ámbito provincial de la gobernación de Requesens, con Flandes y Brabante en disputa. Holanda y Zelanda rebeldes quedan excluidas. En 1576 el mandato termina en marzo, antes de la Pacificación de Gante.';
  } else if (personId === 'DONJUANAUST' && year >= 1576 && year <= 1578) {
    jurisdictions=year === 1576 ? ['Luxemburgo'] : ['Luxemburgo','Namur'];
    disputedJurisdictions=year === 1576 ? [] : ['Namur'];source=sources.juan;
    note='Ámbito limitado: Luxemburgo permaneció leal y don Juan tomó la ciudadela de Namur en julio de 1577. La trama de Namur expresa una disputa regional, sin afirmar dominio de todo el condado. Se omite su breve reconocimiento en Bruselas; no se atribuyen las provincias rebeldes.';
  } else if (personId === 'ALEJFARNESIO' && year >= 1578 && year <= 1592) {
    jurisdictions=['Luxemburgo','Namur',...(year >= 1579 ? ['Artois','Henao'] : []),
      ...(year >= 1585 ? contestedSouth : [])];
    disputedJurisdictions=['Namur',...(year >= 1585 ? contestedSouth : [])];source=sources.farnese;
    excludedIds.push('Ostend','Bergen_Zoom',...(year >= 1590 ? ['Breda'] : []));
    note='Reconstrucción regional limitada: Artois y Henao desde la reconciliación de 1579; Flandes y Brabante desde las conquistas de 1584–1585, con trama por su control fragmentado. Ostende y Bergen op Zoom quedan excluidas, y Breda desde 1590. No representa todas las campañas de Farnesio.';
  } else return null;
  return {jurisdictions,disputedJurisdictions,excludedIds,source,
    additionalSources:[sources.revolt,sources.dinant,...(personId === 'ALEJFARNESIO' ? [sources.reconquest,...(year >= 1590 ? [sources.breda] : [])] : [])],
    note:note+' Dinant, perteneciente a Lieja, se excluye de la aproximación geométrica de Namur.'};
}
