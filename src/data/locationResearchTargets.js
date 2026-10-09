// A work queue is not an authority claim. None of these suggestions paints
// a cell. Only a dated, sourced map layer can graduate an ID from this audit.
import {TERRITORIOS} from './territorios.js';
import {territorialIdentity} from './territorialIdentity.js';
const MANUAL = Object.freeze({
  Erfurt:['Electorado de Maguncia','Jurisdicción de Erfurt'],
  Wurzen:['Principado episcopal de Meißen'],
  Arnstadt:['Condados de Schwarzburg'],Sondershausen:['Schwarzburg-Sondershausen'],
  Schleusingen:['Condado de Henneberg'],Meiningen:['Würzburg','Sajonia-Meiningen'],
  Muhlhausen:['Ciudad imperial de Mühlhausen'],
  Gorlitz:['Margraviato de Alta Lusacia','Ducado de Görlitz'],
  Bautzen:['Margraviato de Alta Lusacia'],
  Luckau:['Margraviato de Baja Lusacia'],Guben:['Margraviato de Baja Lusacia'],
  Plauen:['Vogtland','Burgraviato de Meißen'],
  Annaburg:['Sajonia electoral','Sajonia ernestina'],Zerbst:['Principado de Anhalt-Zerbst'],
  Munster:['Principado episcopal de Münster'],Detmold:['Condado y principado de Lippe'],
  Severin:['Banato de Severin','Valaquia','Hungría'],
  Targu_Trotus:['Principado de Moldavia'],Tutova:['Principado de Moldavia'],
  Hangu_Romania:['Principado de Moldavia'],
  Turnu_Magurele:['Valaquia','Raia otomana de Turnu'],
  Zimnicea:['Valaquia'],Radovanu:['Valaquia'],Corabia:['Valaquia','Oltenia'],
  Ravno:['Hum','República de Ragusa'],Glaz:['Bosnia','Imperio otomano'],
  Gradina:['Croacia','Dalmacia veneciana','Imperio otomano'],
  Wetzlar:['Ciudad imperial de Wetzlar'],Konstanz:['Ciudad imperial y obispado de Constanza'],
  Kempten:['Abadía principesca y ciudad imperial de Kempten'],
  Stein_Glacier:['Cantones y señoríos de la Suiza central'],
  Bernese_Alps:['Berna','Señoríos del Oberland bernés'],
  Glarner_Alps:['Glaris','Schwyz'],
  Dinaric_Alps7:['Herzegovina','Imperio otomano'],
  Eastern_Carpathians9:['Moldavia','Transilvania'],
  Southern_Carpathians1:['Valaquia','Transilvania'],
  Southern_Carpathians3:['Valaquia','Transilvania'],
  Bavarian_Alps1:['Baviera','Tirol'],Bavarian_Alps2:['Baviera','Tirol'],
});
function queueFor([x,y]) {
  if(x>684&&y>174)return {queue:'Anatolia, Cáucaso y Asia occidental',priority:4,plan:'Principados, emiratos y provincias de Asia occidental por incorporar'};
  if(x>705&&y<=174)return {queue:'Rusia oriental y Asia Central',priority:4,plan:'Principados y kanatos orientales por incorporar'};
  if(y>197&&x<650)return {queue:'Magreb y norte de África',priority:4,plan:'Sultanatos y señoríos del Magreb por incorporar'};
  if(y>197)return {queue:'Egipto y Mediterráneo oriental',priority:4,plan:'Sultanatos y provincias del Mediterráneo oriental por incorporar'};
  if(y<116&&x>576&&x<652)return {queue:'Escandinavia y Báltico',priority:2,plan:'Reinos escandinavos y señoríos bálticos'};
  if(x>=608&&x<655&&y>=151&&y<181)return {queue:'Adriático, Balcanes y Cárpatos',priority:1,plan:'Reinos, banatos y señoríos balcánicos por desagregar'};
  if(x>=586&&x<616&&y>=129&&y<157)return {queue:'Territorios imperiales y Alpes septentrionales',priority:1,plan:'Condados, obispados y ciudades del Sacro Imperio por incorporar'};
  if(x<578&&y>=161&&y<198)return {queue:'Iberia y Pirineos',priority:2,plan:'Coronas y señoríos ibéricos por completar'};
  if(x<567&&y<145)return {queue:'Islas británicas',priority:2,plan:'Reinos y señoríos británicos por completar'};
  if(x<595&&y>=128&&y<174)return {queue:'Francia, Países Bajos y Alpes occidentales',priority:2,plan:'Feudos franceses y señoríos de los Países Bajos por incorporar'};
  if(x<625&&y>=156&&y<197)return {queue:'Italia y Alpes meridionales',priority:2,plan:'Comunas, obispados y señoríos italianos por incorporar'};
  return {queue:'Europa central, oriental y región póntica',priority:3,plan:'Principados y señoríos de Europa oriental por incorporar'};
}
const distance=(a,b)=>Math.hypot(Math.max(0,b[0]-a[2],a[0]-b[2]),Math.max(0,b[1]-a[3],a[1]-b[3]));
export function locationResearchTargets(cells,data) {
  const byId=new Map(cells.map(c=>[c.id,c]));
  // Index actual selected polygon bounds, not cities or names of people.
  const layerBounds=[...(data.territories||[]),...(data.additionalTerritories||[])]
    .filter(l=>!/(?:marco|Sacro Imperio)/i.test(l.name))
    .map(layer=>({name:layer.name,boxes:[...new Set((layer.versions||[]).flatMap(v=>v.ids))]
      .map(id=>byId.get(id)?.bounds).filter(Boolean)})).filter(l=>l.boxes.length);
  for(const cell of cells) {
    if(!cell.visible||cell.colored)continue;
    const queue=queueFor(cell.centroid);let targets=[];
    if(MANUAL[cell.id])targets=MANUAL[cell.id].map(name=>({name,state:layerBounds.some(l=>l.name===name)?'existing_layer'
      :TERRITORIOS[territorialIdentity(name)]?'existing_entity':'planned_entity',basis:'explicit_research_target'}));
    else {
      const near=layerBounds.map(l=>({name:l.name,distance:Math.min(...l.boxes.map(box=>distance(cell.bounds,box)))}))
        .filter(l=>l.distance<=.6).sort((a,b)=>a.distance-b.distance||a.name.localeCompare(b.name,'es')).slice(0,3);
      targets=near.map(l=>({name:l.name,state:'existing_layer',basis:'neighbouring_polygon',distance:+l.distance.toFixed(3)}));
      if(!targets.length&&cell.legacyCandidates.length)targets=cell.legacyCandidates.slice(0,3).map(l=>({name:`Entidades históricas de ${l.region.replaceAll('_',' ')}`,state:'planned_entity',basis:`legacy_${l.kind}`}));
    }
    if(!targets.length)targets=[{name:queue.plan,state:'planned_entity',basis:'regional_work_queue'}];
    cell.research={queue:queue.queue,priority:queue.priority,targets,
      certainty:'unverified',note:'Pistas geométricas para investigar. No acreditan soberanía ni permiten rellenar esta celda sin fuente y periodo propios.'};
  }
}
