// 6.0.16 one-off: second clean-up of machine-translated English in the v6 batches.
// 6.0.15 left the translated territory, dynasty and story sources (translatedSource) untouched; they
// hold English text too and kept errors such as «Lion X» (Pope Leo X), «Alfonso IX of Lion»,
// «Berengaria of Castle» or «Voivode de Moldova». Only English values change: keys, slugs, aliases
// and Spanish names (nombre) are left alone. Usage: node scripts/data/fix-english-batches-616.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../../src/features/english/v6/', import.meta.url).pathname;
const DRY = process.argv.includes('--dry');
// Spanish given name + regnal number → English, as the English profiles of the same people use them.
const GIVEN_NUMBERED = {
  'Adolfo Federico': 'Adolf Frederick', Adolfo: 'Adolf', Alberto: 'Albert', Alejandro: 'Alexander', Alejo: 'Alexios', Amadeo: 'Amadeus', Amalarico: 'Amalric',
  Andrés: 'Andrew', Andrónico: 'Andronikos', Andronico: 'Andronikos', Arturo: 'Arthur', Augusto: 'Augustus', Balduino: 'Baldwin', Bernardo: 'Bernard', Blanca: 'Blanche',
  Bogislao: 'Bogislaw', Bohemundo: 'Bohemond', Bonifacio: 'Boniface', Calixto: 'Callixtus', Canuto: 'Canute', 'Carlos Manuel': 'Charles Emmanuel', Carlos: 'Charles',
  Casimiro: 'Casimir', Catalina: 'Catherine', Celestino: 'Celestine', Clemente: 'Clement', Conrado: 'Conrad', Constantino: 'Constantine', Cristián: 'Christian',
  Cristóbal: 'Christopher', Demetrio: 'Demetrius', Eduardo: 'Edward', Engelberto: 'Engelbert', Enrique: 'Henry', Erico: 'Eric', Ernesto: 'Ernest',
  'Federico Guillermo': 'Frederick William', 'Federico Augusto': 'Frederick Augustus', Federico: 'Frederick', Felipe: 'Philip', Filiberto: 'Philibert', Fiódor: 'Feodor',
  Fulco: 'Fulk', Godofredo: 'Geoffrey', Gregorio: 'Gregory', Guillermo: 'William', Gustavo: 'Gustav', Heraclio: 'Heraclius', Honorio: 'Honorius', Hugo: 'Hugh',
  Inocencio: 'Innocent', Jacobo: 'James', Jaime: 'James', Joaquín: 'Joachim', Jorge: 'George', José: 'Joseph', 'Juan Jorge': 'John George', 'Juan Federico': 'John Frederick',
  Juan: 'John', Julio: 'Julius', León: 'Leo', Leopoldo: 'Leopold', Luis: 'Louis', Manfredo: 'Manfred', Margarita: 'Margaret', Martín: 'Martin', Matilde: 'Matilda',
  Maximiliano: 'Maximilian', Miguel: 'Michael', Nicolás: 'Nicholas', Otón: 'Otto', Pablo: 'Paul', Paulo: 'Paul', Pedro: 'Peter', Pío: 'Pius', Raimundo: 'Raymond',
  Reinaldo: 'Reinald', Ricardo: 'Richard', Roberto: 'Robert', Rodolfo: 'Rudolf', Segismundo: 'Sigismund', Sixto: 'Sixtus', Teobaldo: 'Theobald', Tomás: 'Thomas',
  Urbano: 'Urban', Venceslao: 'Wenceslaus', Wenceslao: 'Wenceslaus', 'Víctor Amadeo': 'Victor Amadeus', Fernando: 'Ferdinand', Matías: 'Matthias', Esteban: 'Stephen', Bela: 'Béla', Ladislao: 'Ladislaus',
};
// Kings of Portugal and some Iberian rulers keep their own name in English.
const KEEP_BEFORE_PLACE = /^(?:of|de) (?:Portugal|Braganza|Viseu|Barcelos|Brazil)\b/;
const PLACES_ES = {Valaquia: 'Wallachia', Moldova: 'Moldavia', Flandes: 'Flanders', Holanda: 'Holland', Lorena: 'Lorraine', Castilla: 'Castile', Aragón: 'Aragon',
  Cerdeña: 'Sardinia', Sicilia: 'Sicily', Polonia: 'Poland', Suecia: 'Sweden', Dinamarca: 'Denmark', Noruega: 'Norway', Escocia: 'Scotland', Inglaterra: 'England',
  Francia: 'France', Alemania: 'Germany', Brandeburgo: 'Brandenburg', Mecklemburgo: 'Mecklenburg', Lituania: 'Lithuania', Rusia: 'Russia', Bizancio: 'Byzantium',
  Chipre: 'Cyprus', Jerusalén: 'Jerusalem', Trebisonda: 'Trebizond', Venecia: 'Venice', Génova: 'Genoa', Florencia: 'Florence', Toscana: 'Tuscany', Módena: 'Modena',
  Bretaña: 'Brittany', Normandía: 'Normandy', Aquitania: 'Aquitaine', Provenza: 'Provence', Champaña: 'Champagne', Turingia: 'Thuringia', Westfalia: 'Westphalia',
  Estiria: 'Styria', Carintia: 'Carinthia', Tirol: 'Tyrol', Suabia: 'Swabia', Alsacia: 'Alsace', Luxemburgo: 'Luxembourg', Henao: 'Hainaut', Zelanda: 'Zeeland',
  Güeldres: 'Guelders', Cléveris: 'Cleves', Hessen: 'Hesse', Saboya: 'Savoy', Borgoña: 'Burgundy', Baviera: 'Bavaria', Sajonia: 'Saxony', Brabante: 'Brabant',
  Hungría: 'Hungary', Nápoles: 'Naples', Milán: 'Milan', Bearne: 'Béarn', Curlandia: 'Courland', Piamonte: 'Piedmont', Antioquía: 'Antioch', Prusia: 'Prussia', Meissen: 'Meissen'};
const ENGLISH_PLACES = [...new Set(Object.values(PLACES_ES)), 'Austria', 'Bohemia', 'Portugal', 'Moravia', 'Silesia', 'Pomerania', 'Holstein', 'Oldenburg', 'Baden', 'Württemberg',
  'Orléans', 'Bourbon', 'Valois', 'Anjou', 'Montferrat', 'Navarre', 'the Palatinate', 'Brunswick', 'Hainaut', 'Armenia', 'Georgia', 'Serbia', 'Bulgaria', 'Wallachia', 'Moldavia'];
const TITLE_WORDS = 'Duke|Duchess|Count|Countess|King|Queen|Prince|Princess|Lord|Lady|Margrave|Margravine|Voivode|Emperor|Empress|Archduke|Archduchess|Landgrave|Elector|Electress|Regent|Viscount|Viscountess|Marquis|Marchioness|Infante|Infanta|Despot|Ban|Bishop|Archbishop|Grand Duke|Grand Prince|Crown';
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const givenAlt = Object.keys(GIVEN_NUMBERED).sort((a, b) => b.length - a.length).map(esc).join('|');
const NUMBERED = new RegExp(`\\b(${givenAlt}) ([IVX]+)\\b(?!['’]s? de)( (?:of|de) [A-Z][\\p{L}-]+)?`, 'gu');
const placeAlt = ENGLISH_PLACES.map(esc).sort((a, b) => b.length - a.length).join('|');
const PHRASES = [
  // 6.0.17: names left half-translated, found in the second sample review.
  [/\bTheobaldo\b/g, 'Theobald'], [/\bJohn Jacobo\b/g, 'John James'], [/\bMazarino\b/g, 'Mazarin'], [/\bIsabel the Catholic\b/g, 'Isabella the Catholic'],
  [/\bInfante Juan\b/g, 'Infante John'], [/\bFernando de Antequera\b/g, 'Ferdinand of Antequera'], [/\bGastón Fébus\b/g, 'Gaston Fébus'], [/\bJuan de Ghent\b/g, 'John of Gaunt'],
  [/\bMonferrato\b/g, 'Montferrat'], [/\bArnaldo Roger\b/g, 'Arnau Roger'], [/\b([Tt]he|[Aa]n?) infant (?=[A-Z])/g, '$1 infante '], [/\bInfant (?=[A-Z])/g, 'Infante '],
  // Patterns found in the 40-profile sample review of 6.0.16.
  [/\bDogo of\b/g, 'Doge of'], [/Dignity was elective: [^.]*Venetian territories\./g, 'The office was elective: the dogeship marks institutional continuity, not family ownership of the Venetian territories.'],
  [/\bHouse Paleologist\b/g, 'House Palaiologos'], [/\bGustavo Vasa\b/g, 'Gustav Vasa'], [/\bCristian ([IVX]+)\b/g, 'Christian $1'], [/^The executions have aggravated opposition to his authority\.$/g, 'Christian II took Stockholm. The executions deepened opposition to his authority.'],
  [/The pontificate of his father was linked to his passing from his pontifical court to Avignon and his suppression from his order of the Temple under the pressure of Philip IV of France\./g, 'A French pope whose pontificate is associated with the move of the papal court to Avignon and the suppression of the Order of the Temple under pressure from Philip IV of France.'],
  [/ · serie de retratos dinásticos\b/g, ' · series of dynastic portraits'], [/^siglo ([IVX]+)$/g, (m, n) => `${{XI: '11th', XII: '12th', XIII: '13th', XIV: '14th', XV: '15th', XVI: '16th', XVII: '17th', XVIII: '18th'}[n] || n} century`],
  [/, Viena$/g, ', Vienna'], [/\bElector of Palatinate\b/g, 'Elector Palatine'], [/\bsan Francis Borgia\b/g, 'Saint Francis Borgia'],
  [/inscripción «([^»]*)»; el archivo Commons se titula /g, 'inscription “$1”; the Commons file is titled '],
  [/\bRussia['’]s Alejo I\b/g, 'Alexis of Russia'], [/\bAlejo I (?:of|de) (?:Russia|Rusia)\b/g, 'Alexis of Russia'], [/\bAlejo III Angelo\b/g, 'Alexios III Angelos'],
  [/\bLion ([IVX]+)\b/g, 'Leo $1'], [/\bof Lion\b/g, 'of León'], [/\bCastile and Lion\b/g, 'Castile and León'], [/\bthe Lion heritage\b/g, 'the Leonese inheritance'],
  [/\bThe Lioness Agreement\b/g, 'The Leonese settlement'], [/\bLioness\b/g, 'Leonese'], [/\bBerenfuela\b/g, 'Berengaria'], [/\bof Castle\b/g, 'of Castile'],
  [/\bCastle and León\b/g, 'Castile and León'], [/\bTwo Potas\b/g, 'Two Popes'], [/\bPallars will be sober\b/g, 'Pallars Sobirà'], [/\bwill be sober\b/g, 'Sobirà'],
  [/Since 1230 it has been permanently sharing monarch with Leon/g, 'From 1230 it permanently shared a monarch with León'],
  [/\bMaria de Burgundy\b/g, 'Mary of Burgundy'], [/\bVoivod[ea] de (?:la )?(Moldova|Moldavia|Valaquia|Valachia|Wallachia)\b/g, (m, p) => `Voivode of ${PLACES_ES[p] || p}`],
  [/\bMargrave de Meißen\b/g, 'Margrave of Meissen'], [/\bMargrave de Mei(?:ss|ß)en\b/g, 'Margrave of Meissen'],
];
const SKIP_KEYS = new Set(['es', 'key', 'slug', 'aliases', 'searchAliases', 'sourceFile', 'nombre', 'url', 'en', 'id', 'assigned', 'slugName', 'esPath', 'path', 'archivo']);
let changes = 0; const samples = [];
const fix = text => {
  let out = text;
  for (const [re, to] of PHRASES) out = out.replace(re, to);
  // «(rama)» in English sentences only; Spanish source strings stay as they are.
  if (!/\b(?:Duque|Conde|Rey|Margrave) de\b| de la dinastía\b/.test(out)) out = out.replace(/\(rama\)/g, '(branch)');
  out = out.replace(NUMBERED, (whole, given, numeral, tail = '') => KEEP_BEFORE_PLACE.test(tail.trim()) ? whole : `${GIVEN_NUMBERED[given]} ${numeral}${tail.replace(/^ de /, ' of ')}`);
  for (const [es, en] of Object.entries(PLACES_ES)) out = out.replace(new RegExp(`\\b(?:de|of) ${esc(es)}\\b`, 'g'), `of ${en}`);
  out = out.replace(new RegExp(`\\b(${TITLE_WORDS}) de (?=(?:${placeAlt})\\b)`, 'g'), '$1 of ');
  out = out.replace(new RegExp(`\\b((?:${givenAlt})(?: [IVX]+)?) de (?=(?:${placeAlt})\\b)`, 'g'), (m, given) => `${given.replace(new RegExp(`^(${givenAlt})`), g => GIVEN_NUMBERED[g])} of `);
  return out;
};
const walk = (value, key) => {
  if (typeof value === 'string') { if (SKIP_KEYS.has(key)) return value; const out = fix(value); if (out !== value) { changes++; if (samples.length < 50) samples.push(`${value.slice(0, 90)}\n   → ${out.slice(0, 90)}`); } return out; }
  if (Array.isArray(value)) return value.map(item => walk(item, key));
  if (value && typeof value === 'object') { for (const k of Object.keys(value)) value[k] = SKIP_KEYS.has(k) ? value[k] : walk(value[k], k); return value; }
  return value;
};
for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-'))) {
  for (const file of ['names.json', 'notes.json', 'labels.json', 'people.json', 'dynasties.json', 'territories.json', 'stories.json', 'portraits.json']) {
    const full = path.join(root, batch, file);
    if (!fs.existsSync(full)) continue;
    const before = fs.readFileSync(full, 'utf8');
    const data = JSON.parse(before);
    // names, notes and labels map a Spanish key to an English value: only the value changes.
    if (['names.json', 'notes.json', 'labels.json'].includes(file)) { for (const k of Object.keys(data)) if (typeof data[k] === 'string') data[k] = walk(data[k], 'value'); }
    else {
      // A profile whose display name changes keeps its published English URL (slugName), as in 6.0.15.
      if (file === 'people.json') for (const profile of Object.values(data)) if (profile?.name && !profile.slugName && fix(profile.name) !== profile.name) profile.slugName = profile.name;
      walk(data, 'root');
    }
    const after = `${JSON.stringify(data, null, 2)}\n`;
    if (!DRY && after !== before) fs.writeFileSync(full, after);
  }
}
console.log(samples.join('\n'));
console.log(`${DRY ? 'Would change' : 'Changed'} ${changes} English texts.`);
