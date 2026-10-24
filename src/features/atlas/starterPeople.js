// Each row is one of the three periods chosen for the empty Atlas.
// Territory keys compare shared crowns, including England / Great Britain.
const candidate=(id,name,territories,label)=>({id,name,territories,label});
export const STARTER_POOLS=[
 [candidate('RICARDO1ING','ricardo',['britania']),candidate('FEL2FRA','felipe',['francia']),candidate('BALDWIN4JER','balduino',['jerusalen']),candidate('ALF10','alfonso',['castilla']),candidate('JAIME2AR','jaime',['aragon']),candidate('BELA4','bela',['hungria']),candidate('GIANGAL1','gian-galeazzo',['milan'])],
 [candidate('LUIS1','luis',['hungria','polonia']),candidate('CAR1BORG','carlos',['borgona']),candidate('CARLOS5','carlos',['imperio'],'Carlos V del Sacro Imperio'),candidate('ISAB1CAST','isabel',['castilla']),candidate('FERN1EMP','fernando',['imperio','austria','bohemia','hungria']),candidate('LUIS12FRA','luis',['francia']),candidate('FEL2ESP','felipe',['castilla','aragon','portugal']),candidate('SEGIS3VASA','segismundo',['polonia','lituania','suecia'])],
 [candidate('JUAN3SOBIESKI','juan',['polonia','lituania']),candidate('LUIS14FRA','luis',['francia']),candidate('FRAN2HRE','francisco',['imperio','austria','bohemia','hungria']),candidate('GEORGE3GB','jorge',['britania','hannover']),candidate('FRED2PRUSSIA','federico',['prusia']),candidate('GUSTAV2ADOLFO','gustavo',['suecia'])],
];
export function compatibleStarters(a,b) {
 return a.name!==b.name&&!a.territories.some(territory=>b.territories.includes(territory));
}
export const STARTER_TRIOS=STARTER_POOLS[0].flatMap(a=>STARTER_POOLS[1].flatMap(b=>STARTER_POOLS[2].filter(c=>compatibleStarters(a,b)&&compatibleStarters(a,c)&&compatibleStarters(b,c)).map(c=>[a,b,c])));
export function chooseStarterPeople(random=Math.random) {
 const index=Math.min(STARTER_TRIOS.length-1,Math.max(0,Math.floor(random()*STARTER_TRIOS.length)));
 return STARTER_TRIOS[index];
}
