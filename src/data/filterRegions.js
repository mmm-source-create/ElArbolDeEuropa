// Shared geographic regions for filters and public indexes. Plain module (no
// JSX imports) so the build generators can use it too.
export const FILTER_REGIONS=['Península ibérica','Francia y Países Bajos','Islas Británicas','Sacro Imperio y Europa central','Italia y Mediterráneo','Escandinavia y Báltico','Europa oriental','Balcanes y Bizancio','Fuera de Europa','Otros'];
export const TERRITORY_REGION={
 'España':0,'Portugal':0,'Califato almohade':0,'Emirato de al-Ándalus':0,'Emirato de Menorca':0,
 'Francia':1,'Borgoña y Países Bajos':1,'Borgoña y Franco Condado':1,'Países Bajos y Flandes':1,'Provincias Unidas':1,'Señorío de Malinas':1,'Tournai':1,
 'Inglaterra':2,'Escocia':2,'Irlanda':2,'Gran Bretaña':2,
 'Sacro Imperio':3,'Austria':3,'Hungría':3,'Prusia':3,'Brzeg':3,'Glaž':3,'Incorporaciones del siglo XVI':3,'Sajonia-Coburgo':3,'Sajonia-Coburgo-Eisenach':3,'Sajonia-Eisenach':3,'Sajonia-Gotha':3,'Sajonia-Weimar':3,
 'Estados Italianos':4,'Cerdeña':4,'Sicilia':4,'Nápoles':4,'Trinacria':4,'Verona':4,'Córcega':4,'Judicado de Arborea':4,'Judicado de Cagliari':4,'Judicado de Torres':4,'Marquesado de Oristano':4,
 'Escandinavia':5,
 'Polonia-Lituania':6,'Rusia':6,'Reino de Galicia y Lodomeria':6,
 'Balcanes':7,'Bizancio y Oriente latino':7,'Condado palatino de Cefalonia y Zacinto':7,'Despotado de Ioannina':7,'Despotado de Serres':7,'Donji Kraji':7,'Epiro de los Tocco':7,'Hum':7,'Norte de Serbia habsbúrgico':7,'Oltenia habsbúrgica':7,'Señorío de Dejanović':7,
 'Egipto':8,'Siria':8,'Georgia y Cáucaso':8,
};

// Priority when a component belongs to several roots: Italy and Iberia before the Empire.
const ROOT_PRIORITY=['Estados Italianos','España','Portugal','Francia','Borgoña y Países Bajos','Gran Bretaña','Inglaterra','Escocia','Irlanda','Escandinavia','Polonia-Lituania','Rusia','Balcanes','Bizancio y Oriente latino','Hungría','Austria','Prusia','Sacro Imperio'];
// Region of a person's linked territories: the most frequent one wins.
export function regionResolver(componentesDe){
 const map=new Map(Object.entries(TERRITORY_REGION).map(([name,index])=>[name,FILTER_REGIONS[index]]));
 const roots=[...ROOT_PRIORITY,...Object.keys(TERRITORY_REGION).filter(n=>!ROOT_PRIORITY.includes(n))];
 for(const root of roots){const region=map.get(root);if(!region)continue;for(const child of componentesDe(root))if(!map.has(child))map.set(child,region);}
 const regionOf=name=>map.get(name)||null;
 return {regionOf,personRegion:territories=>{
  const tally=new Map();for(const t of territories){const r=regionOf(t);if(r)tally.set(r,(tally.get(r)||0)+1);}
  return [...tally].sort((a,b)=>b[1]-a[1]||FILTER_REGIONS.indexOf(a[0])-FILTER_REGIONS.indexOf(b[0]))[0]?.[0]||'Otros';
 }};
}
