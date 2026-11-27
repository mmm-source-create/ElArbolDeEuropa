import fs from 'node:fs';
import {PERSONAS} from '../../../src/data/personas.js';
import {europeMosaicAt} from '../../../src/cartography/europePanorama.js';
import {governmentGroupsAt} from '../../../src/domain/government/governmentPresentation.js';
const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json'));
data.burgundy=JSON.parse(fs.readFileSync('data/cartography/burgundian-locations.json'));
const years=(process.argv[2]||'1594,1595,1596,1598,1600,1621,1622').split(',').map(Number),filter=new RegExp(process.argv[3]||'Cambrai|Cuijk|Charol|Brabant|Brussels|Franche|Borgoña','i');
for(const year of years){const m=europeMosaicAt(data,year,PERSONAS),out=[];for(const [id,rows] of m.byLocation)if(filter.test(id)||rows.some(r=>filter.test(r.entityId)))out.push({id,layers:rows.map(r=>({name:r.name,identity:r.entityId,color:r.mosaicColor,group:r.politicalGroup,label:r.politicalLabel,relation:r.tributaryRelation?.id,crown:r.crownRelation?.type,candidates:r.candidates.filter(c=>c.ids.has(id)).map(c=>({id:c.personId,group:c.id,color:c.color,kind:c.kind}))}))});console.log(JSON.stringify({year,cells:out}));}
