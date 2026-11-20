// 6.0.7: English names and nicknames of the people ranked 101–200 by relevance,
// checked against English-language historiography. IDs and published URLs are
// unchanged; only the visible name and nickname are corrected.
export const PERSON_NAMES_607 = Object.freeze({
  LADI1:{name:'Władysław I of Poland',nickname:'the Elbow-high',aliases:['Władysław Łokietek']},
  LADI3:{nickname:'of Varna'},
  LADI4:{nickname:'the Cuman'},
  ALB3AUST:{nickname:'with the Pigtail'},
  FRED2SAX:{name:'Frederick II of Saxony'},
  // 6.0.8, third review: people ranked 201–300.
  ROD3HAB:{name:'Rudolf III of Habsburg',aliases:['Rudolf I of Bohemia']},
  AIMERYLUSIGNANJER:{name:'Aimery of Lusignan',aliases:['Amalric II of Jerusalem','Aimery of Cyprus']},
  FEDERICO2SIC:{name:'Frederick III of Sicily',aliases:['Frederick II of Trinacria']},
  FEDERICO3SIC:{name:'Frederick IV of Sicily',aliases:['Frederick III of Trinacria']},
  CATVALCOUR:{name:'Catherine of Valois-Courtenay'},
  STEFANDUSAN:{nickname:'the Mighty'},
  FERN1NAP:{nickname:'',aliases:['Ferrante']},
  // Found while checking relations of the reviewed names.
  ALEXIOS3ANGELOS:{name:'Alexios III Angelos'},
});
export const reviewPersonProfiles=profiles=>Object.fromEntries(Object.entries(profiles).map(([id,profile])=>{
  const review=PERSON_NAMES_607[id];
  if(!review)return [id,profile];
  const aliases=[...new Set([...(profile.aliases||[]),...(review.aliases||[])])];
  // Published English URLs keep the slug of the name they were created with.
  const slugName=review.name&&review.name!==profile.name?profile.slugName||profile.name:profile.slugName;
  return [id,{...profile,...review,aliases,...(slugName?{slugName}:{})}];
}));
export const reviewPersonNames=names=>Object.fromEntries(Object.entries(names).map(([id,name])=>[id,PERSON_NAMES_607[id]?.name||name]));
