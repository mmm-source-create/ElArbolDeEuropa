import fs from 'node:fs';
import {PERSONAS} from '../../src/data/personas.js';
import {europeMosaicAt} from '../../src/cartography/europePanorama.js';
import {buildPoliticalMapIndex} from '../../src/cartography/politicalMapIndex.js';
import {territorialIdentity} from '../../src/cartography/territorialIdentity.js';

const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json'));
data.burgundy=JSON.parse(fs.readFileSync('data/cartography/burgundian-locations.json'));
const report={from:1200,through:1800,years:0,paintedCellYears:0,authorityEntries:0,overlappingCellYears:0,duplicates:[]};
for(let year=report.from;year<=report.through;year++){
  const mosaic=europeMosaicAt(data,year,PERSONAS);
  for(const [id,layers] of mosaic.byLocation){
    report.paintedCellYears++;
    if(layers.length>1)report.overlappingCellYears++;
    const keys=new Set();
    for(const layer of layers){
      // A shared sovereign/colour alone does not make two jurisdictions copies.
      const key=[layer.entityId,layer.politicalGroup,layer.authorityCondition,layer.mosaicColor].join('|');
      if(keys.has(key))report.duplicates.push({year,id,type:'layer',key});
      keys.add(key);
    }
  }
  const index=buildPoliticalMapIndex(PERSONAS,year,data,{includeClaims:true,includeDependencies:true});
  for(const [id,entries] of index){
    const keys=new Set();
    for(const entry of entries){
      report.authorityEntries++;
      const key=[entry.person?.id||entry.collective?.nombre,territorialIdentity(entry.territory),entry.kind,
        entry.government?.titulo,
        entry.relationship?.id,entry.crownRelation?.id,entry.paint].join('|');
      if(keys.has(key))report.duplicates.push({year,id,type:'authority',key});
      keys.add(key);
    }
  }
  report.years++;
}
fs.mkdirSync('.cache/audits',{recursive:true});
fs.writeFileSync('.cache/audits/map-duplicates.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,duplicates:report.duplicates.slice(0,20)}));
if(report.duplicates.length)process.exitCode=1;
