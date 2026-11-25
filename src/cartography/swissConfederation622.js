// External presentation of the dated cantonal alliance; geometry stays in the
// reviewed layers. Associates (Valais, the Three Leagues, St Gall) stay outside.
export const SWISS_CONFEDERATION_COLOR='#A25E68';
export const SWISS_CONFEDERATION_SOURCE={title:'Dictionnaire historique de la Suisse · Confédération',url:'https://hls-dhs-dss.ch/fr/articles/026413/2012-02-08/',locator:'Alliances des XIII cantons et bailliages communs; admissions de 1332 à 1513.'};
export const SWISS_MEMBERSHIP=Object.freeze({
 'Comunidad de Uri':1291,'Comunidad de Schwyz':1291,'Comunidad de Obwalden':1315,
 'Comunidad de Nidwalden':1291,'Unterwalden':1315,'Lucerna':1332,'Zúrich':1351,
 'Glaris':1352,'Zug':1352,'Berna':1353,'Friburgo suizo':1481,'Friburgo':1481,
 'Soleura':1481,'Basilea':1501,'Schaffhausen':1501,'Appenzell':1513,
 'Condado de Baden suizo':1415,'Turgovia':1460,'Baliatos comunes de los cantones suizos':1500,
});
export function swissConfederationAt(identity,year){
 if(identity==='Zúrich'&&year>=1440&&year<1450)return null;
 const from=SWISS_MEMBERSHIP[identity];
 return from!==undefined&&from<=year&&year<=1797?{id:'confederacion-suiza',label:'Confederación Suiza',color:SWISS_CONFEDERATION_COLOR,from,source:SWISS_CONFEDERATION_SOURCE}:null;
}
export const SWISS_COLLECTIVE={territorio:'Confederación Suiza',nombre:'Cantones confederados',desde:1291,hasta:1797,cargo:'Gobiernos cantonales y delegados',nota:'Alianzas entre cantones con gobierno propio y asambleas de delegados para los asuntos comunes. El color reúne los miembros según su fecha de incorporación y los baliatos comunes ya cartografiados. Valais, las Tres Ligas, San Galo y el obispado de Basilea mantienen su identidad propia.',fuente:SWISS_CONFEDERATION_SOURCE};
