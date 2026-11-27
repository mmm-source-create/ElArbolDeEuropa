import fs from 'node:fs';
import {atlasPoliticalMosaicAt,atlasMosaicPalette} from '../../../src/cartography/atlasMosaic.js';
const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json')),palette=atlasMosaicPalette(data);
const baseline=JSON.parse(fs.readFileSync('data/cartography/germany-completion-baseline.json'));
const cells=baseline.cells.filter(c=>c.changes.some(ch=>ch.identities.some(i=>/Sajonia (albertina|electoral)|Sajonia-Wittenberg/.test(i))));
const records=[];
for(let year=1547;year<=1800;year++){
 const m=atlasPoliticalMosaicAt(data,year,palette);
 for(const cell of cells){
  if(cell.gaps.some(g=>g.from<=year&&year<=g.through))continue;
  const previous=[...cell.changes.findLast(c=>c.from<=year).identities].sort(),expected=(m.byLocation.get(cell.id)||[]).map(l=>l.entityId).sort();
  if(JSON.stringify(previous)===JSON.stringify(expected))continue;
  if(!previous.some(i=>/^Sajonia (albertina|electoral)$|^Sajonia-Wittenberg$/.test(i))||!expected.includes('Sajonia'))throw Error('Unexpected Saxon change');
  const last=records.findLast(r=>r.locationId===cell.id);
  if(last&&last.through===year-1&&JSON.stringify(last.previous)===JSON.stringify(previous)&&JSON.stringify(last.expected)===JSON.stringify(expected))last.through=year;
  else records.push({id:`saxony-637-${cell.id}-${year}`,locationId:cell.id,scope:'retained',from:year,through:year,previous,expected,reviewedAt:'2026-11-27',reason:'Desde 1547 los dominios albertinos y electorales se reúnen en Sajonia electoral; se elimina su duplicación cartográfica. Se conserva cada identidad anterior en la referencia independiente.',source:'https://www.slub-dresden.de/besuchen/ausstellungen-corty-galerie/archiv-der-ausstellungen/ausstellungen-2017/wie-luthers-worte-fliegen-lernten-handschriften-und-flugschriften-der-reformation/lutherschaetze/eine-totenmesse-fuer-kurfuerst-moritz'});
 }
}
const file='data/cartography/germany-completion-preservation-corrections.json',previous=JSON.parse(fs.readFileSync(file)).filter(r=>!r.id.startsWith('saxony-637-'));
fs.writeFileSync(file,JSON.stringify([...previous,...records],null,2)+'\n');console.log(`${records.length} dated Saxon preservation corrections`);
