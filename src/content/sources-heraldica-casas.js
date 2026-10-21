import {PORTUGAL_HOUSE_SOURCES,BRETON_HOUSE_SOURCE} from './dinastias/heraldica-y-casas.js';

const portuguesePeople=[[],[],['FERN1PORT'],['JUAN1PORT','PED1PORT','EDU1PORT']];
const titles=['Enrique de Borgoña, conde de Portugal','Alfonso I de Portugal','Fernando I de Portugal','Juan I de Portugal'];
export const HERALDRY_HOUSE_SOURCES = [
  ...PORTUGAL_HOUSE_SOURCES.map((url,i)=>({titulo:`Treccani · ${titles[i]}`,url,grupo:'Casas y filiaciones',territorios:['Portugal'],personas:portuguesePeople[i],
    nota:'Contexto de la primera dinastía portuguesa y de la rama de Avís. El nombre Borgoña-Portugal precisa la denominación alternativa Alfonsina.'})),
  {titulo:'Archives départementales de Loire-Atlantique · La guerre de Succession de Bretagne (1341–1365)',url:BRETON_HOUSE_SOURCE,grupo:'Casas y filiaciones',territorios:['Bretaña'],personas:['JOHNMONTPRET','JOHN4BRET'],
    nota:'Apoyos de los dos partidos, batalla de Auray y tratado de Guérande que consolidó a la rama de Montfort-Bretaña.'},
];
