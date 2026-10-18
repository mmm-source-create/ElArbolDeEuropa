// Clase de autoridad de un mandato en un año (titular, disputada, delegada o soberana); la usan el mapa y las fichas.
import {intervalosDisputadosDe} from '../genealogy/personAccessors.js';

export function authorityKind(government, year = null) {
  if (['titular', 'pretensión'].includes(government?.condicion) || government?.efectivo === false) return 'titular';
  const disputes = intervalosDisputadosDe(government);
  if (disputes.some(period => period.desde <= year && year <= period.hasta)) return 'disputed';
  if (['rival', 'disputado', 'ocupación'].includes(government?.condicion)) return 'disputed';
  if (['regencia', 'gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return 'delegated';
  return 'sovereign';
}
