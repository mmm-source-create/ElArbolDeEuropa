import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {atlasPoliticalMosaicAt, atlasMosaicPalette} from './prototypes/euv-locations/atlas-mosaic.js';
import {PERSONAS} from './src/personas.jsx';
import {locationResearchTargets} from './src/data/locationResearchTargets.js';

// Inspect the same annual mosaic shown in the laboratory. A raw version's
// IDs alone are insufficient: dated removals and superseded layers can win.
export function auditLocationCoverage(data, inventory, {from=data.from,through=data.through,people=PERSONAS}={}) {
  if(!Number.isInteger(from)||!Number.isInteger(through)||from>through) throw new Error('Invalid audit period');
  const palette=atlasMosaicPalette(data,people);
  const usage=new Map();
  for(let year=from;year<=through;year++) {
    const mosaic=atlasPoliticalMosaicAt(data,year,palette,people);
    for(const [id,layers] of mosaic.byLocation) {
      let row=usage.get(id);
      if(!row) {row={firstYear:year,lastYear:year,coloredYears:0,layers:new Set()};usage.set(id,row)}
      row.lastYear=year;row.coloredYears++;
      for(const layer of layers) row.layers.add(layer.name);
    }
  }
  const legacy=new Map();
  for(const [region,match] of Object.entries(data.locationCrosswalk?.newIdsByOldId || {})) {
    for(const [kind,ids] of [['overlap',match.ids],['borderline',match.borderline]]) for(const item of ids || []) {
      const id=typeof item==='string'?item:item.id;
      if(!legacy.has(id)) legacy.set(id,[]);
      legacy.get(id).push({region,kind});
    }
  }
  const cells=inventory.cells.map(cell=>{
    const row=usage.get(cell.id);
    return {...cell, physicalFeature:/(?:mountain|alps|carpathian|pyrenees|apennin|massif|wasteland|glacier|desert)/i.test(cell.id),
      legacyCandidates:legacy.get(cell.id) || [],
      colored:!!row, ...(row?{...row,layers:[...row.layers].sort()}:{}),
      status:!cell.visible?'outside_frame':row?'represented':'needs_review'};
  });
  locationResearchTargets(cells,data);
  const queues=Object.entries(Object.groupBy(cells.filter(c=>c.visible&&!c.colored),c=>c.research.queue))
    .map(([queue,rows])=>({queue,cells:rows.length,physical:rows.filter(c=>c.physicalFeature).length,priority:Math.min(...rows.map(c=>c.research.priority))}))
    .sort((a,b)=>a.priority-b.priority||b.cells-a.cells);
  return {period:{from,through},method:`All ${through-from+1} annual laboratory mosaics, including dated overrides, supersession and personal fallback layers; not a proof of historical completeness. Research targets are geometric leads, never automatic political assignments.`,
    summary:{paths:cells.length,visible:cells.filter(c=>c.visible).length,
      everColored:cells.filter(c=>c.visible&&c.colored).length,
      neverColored:cells.filter(c=>c.visible&&!c.colored).length,
      neverColoredPhysical:cells.filter(c=>c.visible&&!c.colored&&c.physicalFeature).length,
      outsideFrame:cells.filter(c=>!c.visible).length,untriaged:cells.filter(c=>c.visible&&!c.colored&&!c.research?.targets.length).length},queues,cells};
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const read=name=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url),'utf8'));
  const report=auditLocationCoverage(read('./prototypes/euv-locations/corridor-locations.json'),read('./prototypes/euv-locations/location-inventory.json'));
  const destination=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:'audit-uncolored-locations-report.json';
  fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n');
  if(process.argv.includes('--publish')) {
    fs.mkdirSync('public/map-audit',{recursive:true});
    const pending={...report,cells:report.cells.filter(c=>c.visible&&!c.colored)};
    fs.writeFileSync('public/map-audit/never-colored.json',JSON.stringify(pending)+'\n');
    const quote=value=>'"'+String(value??'').replaceAll('"','""')+'"';
    const rows=[['id','relieve','prioridad','cola_geografica','entidades_a_investigar','fundamento','area_svg','limites_svg'],...pending.cells.map(c=>[c.id,c.physicalFeature?'sí':'no',c.research.priority,c.research.queue,c.research.targets.map(t=>t.name).join(' | '),c.research.targets.map(t=>t.basis).join(' | '),c.area,c.bounds.join(' ')])];
    fs.writeFileSync('public/map-audit/never-colored.csv','\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\n')+'\n');
  }
  if(report.summary.untriaged) throw new Error('Untriaged visible cells');
  console.log(JSON.stringify(report.summary));
}
