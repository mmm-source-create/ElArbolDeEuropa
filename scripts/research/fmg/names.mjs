// 6.0.17 · Given names across the languages of Medieval Lands and of the Atlas (Spanish and English).
const CLASSES = [
  'john juan jean johann johannes giovanni joao jan janos ioannes ivan hans jehan joan jaume iohannes jovan',
  'james jaime jacobo jacques jakob giacomo jacopo jaume',
  'peter pedro pierre pietro piotr petr pere petrus petar',
  'henry enrique henri heinrich enrico henryk henrique enric heinz',
  'william guillermo guillaume wilhelm guglielmo willem guilhem guillem vilem',
  'charles carlos karl carlo karel karol carles karoly',
  'louis luis ludwig luigi lodewijk ludovico lluis lajos ludvik lewis',
  'philip felipe philippe philipp filippo filip felip fulop',
  'frederick federico frederic friedrich fryderyk frederik fadrique',
  'ferdinand fernando ferdinando ferran fernao',
  'alfonso alphonse afonso alfons alonso ildefonso anfos alfonse',
  'margaret margarita marguerite margarete margherita margareta malgorzata margrethe margit',
  'catherine catalina katharina caterina katarzyna katerina caterine kateryna katalin',
  'elizabeth isabel isabelle isabella elisabeth elisabetta elzbieta isabeau erzsebet elisabet jelisaveta alzbeta elisenda',
  'joanna juana jeanne johanna giovanna joan joana jehanne',
  'mary maria marie mary marija',
  'anne ana anna anne',
  'eleanor leonor eleonore eleanor alienor eleonora eleonor',
  'blanche blanca blanche bianca',
  'agnes ines agnes agnese agnieszka anezka',
  'beatrice beatriz beatrix beatrice',
  'constance constanza costanza konstanze constanca',
  'stephen esteban etienne stephan stefano istvan stefan stjepan stephen',
  'george jorge georges georg giorgio jerzy gyorgy giorgi djordje juraj',
  'albert alberto albrecht',
  'otto oton othon ottone ottokar otakar',
  'rudolf rodolfo rodolphe rudolph',
  'conrad conrado konrad corrado',
  'raymond raimundo raimon ramon raimondo raymond',
  'robert roberto rupert ruprecht',
  'richard ricardo riccardo',
  'edward eduardo edouard duarte',
  'thomas tomas tommaso',
  'nicholas nicolas nikolaus niccolo mikolaj nikolaos',
  'michael miguel michel michele mikhael mihail mikhail mihaly',
  'alexios alejo alexis alexius',
  'andronikos andronico andronicus',
  'theodore teodoro theodoros todor',
  'constantine constantino konstantinos costantino',
  'ladislaus ladislao wladyslaw laszlo vladislav ulaszlo',
  'wenceslaus wenceslao venceslao vaclav waclaw wenzel',
  'casimir casimiro kazimierz',
  'boleslaw boleslao boleslav',
  'matthias matias mathias matyas',
  'sigismund segismundo zygmunt zsigmond',
  'andrew andres andre andreas andrea andras',
  'bela bela',
  'magnus magnus',
  'eric erico erik',
  'christian cristian christian kristian',
  'sancho sanche',
  'garcia garsias',
  'baldwin balduino baudouin boudewijn',
  'godfrey godofredo geoffroy gottfried goffredo geoffrey',
  'hugh hugo hugues ugo',
  'guy guido gui',
  'amadeus amadeo amedee amedeo',
  'boniface bonifacio',
  'leopold leopoldo',
  'maximilian maximiliano',
  'bohemond bohemundo bohemond boemondo',
  'leo leon leone',
  'eudes odo eudes',
  'theobald teobaldo thibaut',
  'gaston gaston',
];
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[łŁ]/g, 'l').toLowerCase();
const CANON = new Map();
for (const line of CLASSES) { const words = line.split(' '); for (const w of words) if (!CANON.has(w)) CANON.set(w, words[0]); }
export const canonGiven = word => { const w = strip(word).replace(/[^a-z]/g, ''); return CANON.get(w) || w; };
const NUMERAL = /^[IVX]+$/;
// The given name (first word) and the regnal number if one follows it.
export const nameParts = name => {
  const words = String(name || '').replace(/["“”].*?["“”]/g, ' ').replace(/[\[\]]/g, '').trim().split(/\s+/).filter(Boolean);
  if (!words.length || words[0] === '---') return null;
  const numeral = words.slice(1, 3).find(w => NUMERAL.test(w)) || null;
  return {given: canonGiven(words[0]), numeral};
};
export const compatible = (a, b) => {
  if (!a || !b) return false;
  const same = a.given === b.given || (a.given.length >= 4 && b.given.length >= 4 && a.given.slice(0, 4) === b.given.slice(0, 4));
  return same && (!a.numeral || !b.numeral || a.numeral === b.numeral);
};
