import {LOUIS_DEPENDENCY_SOURCES} from '../cartography/louisHungaryDependencies.js';
export const LOUIS_HUNGARY_SOURCES=Object.values(LOUIS_DEPENDENCY_SOURCES).map(s=>({titulo:s.title,url:s.url,nota:s.locator,grupo:'Artículos de repertorios',personas:['LUIS1'],territorios:['Hungría','Croacia']}));
