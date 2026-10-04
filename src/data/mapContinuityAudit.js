import {buildPoliticalMapIndex, COLLECTIVE_AUTHORITIES} from './politicalMapIndex.js';
import {gobiernoEfectivo} from './territorios.js';

export const HISTORICAL_CUTS = Object.freeze([1522,1564,1619,1648,1665]);
export const TYROL_REVIEW_RANGE = Object.freeze({from:1490,to:1705});

export function auditMapContinuity(personas, {cuts=HISTORICAL_CUTS, focusTerritory='Tirol', range=TYROL_REVIEW_RANGE}={}) {
  const governments = personas.flatMap(person => (person.gobiernos || []).filter(gobiernoEfectivo)
    .map(government => ({personId:person.id,personName:person.nombre,...government})));
  const focus = governments.filter(g => g.territorio === focusTerritory);
  const collective = COLLECTIVE_AUTHORITIES.filter(a => a.territorio === focusTerritory);
  const yearsWithoutAuthority = [];
  for (let year=range.from; year<=range.to; year++) {
    if (!focus.some(g => g.desde<=year && g.hasta>=year) &&
        !collective.some(a => a.desde<=year && a.hasta>=year)) yearsWithoutAuthority.push(year);
  }
  const unexplainedOverlaps = [];
  for (let i=0;i<focus.length;i++) for (let j=i+1;j<focus.length;j++) {
    const a=focus[i],b=focus[j];
    if (a.personId===b.personId) continue;
    const from=Math.max(a.desde,b.desde),to=Math.min(a.hasta,b.hasta);
    if (to-from<1) continue; // Un año compartido puede ser el relevo anual.
    if ([a,b].some(g=>['regencia','corregente','jure uxoris'].includes(g.condicion))) continue;
    unexplainedOverlaps.push({territory:focusTerritory,from,to,people:[a.personName,b.personName]});
  }
  const snapshots = cuts.map(year => {
    const index=buildPoliticalMapIndex(personas,year);
    const colored=[...index.entries()].filter(([,entries])=>entries.some(e=>e.person));
    const missing=new Map();
    for (const [regionId,entries] of colored) for (const entry of entries) {
      if (!entry.person || entry.claim?.sources.length) continue;
      const key=`${entry.person.id}:${entry.territory}:${entry.government.desde}:${entry.government.hasta}`;
      const item=missing.get(key)||{personId:entry.person.id,person:entry.person.nombre,territory:entry.territory,from:entry.government.desde,to:entry.government.hasta,regions:[]};
      item.regions.push(regionId);missing.set(key,item);
    }
    return {year,coloredRegions:colored.length,governmentsWithoutClaimSource:[...missing.values()]};
  });
  return {
    scope:`${focusTerritory} ${range.from}–${range.to}; cortes ${cuts.join(', ')}`,
    focusTerritory,yearsWithoutAuthority,unexplainedOverlaps,snapshots,
    totals:{cutRegions:snapshots.reduce((sum,s)=>sum+s.coloredRegions,0),
      unsourcedGovernmentsAtCuts:snapshots.reduce((sum,s)=>sum+s.governmentsWithoutClaimSource.length,0)},
  };
}
