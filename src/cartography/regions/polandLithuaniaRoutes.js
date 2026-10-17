import frontier from './polandLithuaniaFrontierRouteData.json' with {type:'json'};
import medieval from './polandLithuaniaMedievalRouteData.json' with {type:'json'};
import review from './polandLithuaniaRouteData.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes=regionalReviewRoutes(review),medievalRoutes=regionalReviewRoutes(medieval),frontierRoutes=regionalReviewRoutes(frontier);
export const POLAND_LITHUANIA_IDENTITIES=Object.freeze({...medievalRoutes.identities,...routes.identities,...frontierRoutes.identities});
export function polandLithuaniaJurisdictions(names,territory,year,personId){
 if(territory==='Polonia-Lituania'&&year>=1569)names=[...(names||[]),...polandLithuaniaJurisdictions([],'Polonia',year,personId),...polandLithuaniaJurisdictions([],'Lituania',year,personId)];
 const extra=territory==='Polonia'?['Livonia polaca · Latgalia']:territory==='Lituania'?['Lituania · voivodato de Polotsk']:territory==='Rusia'?['Rusia · ocupación de Polotsk']:territory==='Polonia-Lituania'?['Livonia polaca · Latgalia','Lituania · voivodato de Polotsk']:[];
 return frontierRoutes.jurisdictions(routes.jurisdictions(medievalRoutes.jurisdictions([...new Set([...(names||[]),...extra])],territory,year,personId),territory,year,personId),territory,year,personId);
}
