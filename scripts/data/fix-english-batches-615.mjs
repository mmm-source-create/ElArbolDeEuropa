// 6.0.15 one-off: English texts of the v6 batches still mixed Spanish given
// names with English places («Carlos Alberto de Savoy», «Isabel de Burgundy»),
// kept Spanish place names («Beatrice de Saboya», «Valois-Borgoña») and had a
// few garbled sentences and wrong pronouns. Only English values change; the
// Spanish sources (translatedSource, keys, slugs, aliases) are left alone.
// Usage: node scripts/data/fix-english-batches-615.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../../src/features/english/v6/', import.meta.url).pathname;
const DRY = process.argv.includes('--dry');

const GIVEN = {
  Carlos: 'Charles', Luis: 'Louis', Juan: 'John', Juana: 'Joanna', Isabel: 'Isabella', Margarita: 'Margaret', Fernando: 'Ferdinand',
  Federico: 'Frederick', Enrique: 'Henry', Felipe: 'Philip', Leonor: 'Eleanor', Catalina: 'Catherine', Jaime: 'James', Pedro: 'Peter',
  Guillermo: 'William', Ana: 'Anne', Blanca: 'Blanche', Inés: 'Agnes', Beatriz: 'Beatrice', Constanza: 'Constance', Francisco: 'Francis',
  Gustavo: 'Gustav', Adolfo: 'Adolf', Alberto: 'Albert', Rodolfo: 'Rudolf', Roberto: 'Robert', Andrés: 'Andrew',
  Antonio: 'Anthony', Teodoro: 'Theodore', Jorge: 'George', Cristián: 'Christian', Cristina: 'Christina', Sofía: 'Sophia', Eduardo: 'Edward',
  Ricardo: 'Richard', Gastón: 'Gaston', Amadeo: 'Amadeus', Félix: 'Felix', Matilde: 'Matilda', Otón: 'Otto', Segismundo: 'Sigismund',
  Ladislao: 'Ladislaus', Casimiro: 'Casimir', Wenceslao: 'Wenceslaus', Alejandro: 'Alexander', Miguel: 'Michael', Nicolás: 'Nicholas',
  Esteban: 'Stephen', Bonifacio: 'Boniface', Hugo: 'Hugh', Raimundo: 'Raymond', Godofredo: 'Geoffrey', Balduino: 'Baldwin',
  Leopoldo: 'Leopold', Maximiliano: 'Maximilian', Jacobo: 'James', Ernesto: 'Ernest', Mauricio: 'Maurice', Víctor: 'Victor', Cristian: 'Christian', Carlota: 'Charlotte',
};
// English place names, and Spanish forms that had been left in English text.
const PLACES_ES = {Saboya: 'Savoy', Borgoña: 'Burgundy', Baviera: 'Bavaria', Sajonia: 'Saxony', Brabante: 'Brabant', Hungría: 'Hungary',
  Nápoles: 'Naples', Milán: 'Milan', Bearne: 'Béarn', Curlandia: 'Courland', Piamonte: 'Piedmont', Antioquía: 'Antioch', Prusia: 'Prussia'};
const PLACES = ['Savoy', 'Burgundy', 'Bavaria', 'Saxony', 'Antioch', 'Prussia', 'the Palatinate', 'Palatinate', 'Nuremberg', 'Mecklenburg',
  'Pomerania', 'Württemberg', 'Brandenburg', 'Hungary', 'Bohemia', 'Austria', 'Sicily', 'Naples', 'France', 'England', 'Navarre', 'Flanders',
  'Brabant', 'Hainaut', 'Holland', 'Cleves', 'Lorraine', 'Anjou', 'Orléans', 'Montferrat', 'Sweden', 'Denmark', 'Norway', 'Poland',
  'Lithuania', 'Russia', 'Hesse', 'Baden', 'Brunswick', 'Holstein', 'Oldenburg', 'Courland', 'Styria', 'Tyrol', 'Carinthia', 'Moravia',
  'Silesia', 'Luxembourg', 'Brittany', 'Normandy', 'Champagne', 'Provence', 'Toulouse', 'Évreux', 'Valois', 'Bourbon', 'Castile',
  'Aragon', 'Scotland', 'Cyprus', 'Jerusalem', 'Armenia', 'Foix', 'Albret', 'Nevers', 'Rethel', 'Blois', 'Vendôme', 'Béarn', 'Comminges',
  'Germany', 'Inner Austria', 'Saxe', 'Hesse-Darmstadt', 'Geneva', 'Piedmont', 'Aquitaine', 'Male'];
const placeAlt = PLACES.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|');
const givenAlt = Object.keys(GIVEN).sort((a, b) => b.length - a.length).join('|');
const NAME = new RegExp(`\\b((?:${givenAlt})(?: (?:${givenAlt}|[IVX]+))*) (de|del|of) (${placeAlt})(?=\\b|-)`, 'g');

// Sentences fixed as a whole.
const PHRASES = [
  // Savoy dukes and kings (Manuel alone is a Castilian surname, as in Juana Manuel).
  ['María Ana', 'Maria Anna'], ['Maria Anne of', 'Maria Anna of'], ['Carlos Manuel', 'Charles Emmanuel'], ['Víctor Manuel', 'Victor Emmanuel'], ['Manuel Filiberto', 'Emmanuel Philibert'],
  ['At the death of Alfonso V, Aragón and Trinacria pass to their brother John II, while Naples remains for his son Fernando. Personal union does not become a stable fusion',
   'On the death of Alfonso V, Aragon and Trinacria passed to his brother John II, while Naples went to his son Ferdinand. The personal union did not become a stable fusion'],
  ['Ducado de la terre royale granted to Berry in 1360, other than the county and the Auvergne dolphinry.',
   'A duchy formed from the royal domain and granted to the Duke of Berry in 1360, distinct from the county and the dauphiné of Auvergne.'],
  ['Ministry of Culture: Corona de Castilla', 'Ministry of Culture: Crown of Castile'],
  ['Infante de la dynasty Casa de Aragón', 'Infante of the House of Aragon'],
  ['He ruled alongside Fernando de Aragón', 'She ruled alongside Ferdinand of Aragon'],
  ['The daughter of Philip II and Isabel of Valois, he married', 'The daughter of Philip II and Elisabeth of Valois, she married'],
  ['He promoted the peace of Westphalia (1648)', 'She promoted the Peace of Westphalia (1648)'],
  ['She was educated as an heir prince', 'She was educated as an heir to the throne'],
  ['Carlos the Temerario inherits Burgundy', 'Charles the Bold inherits Burgundy'],
  ['Carlos el Temerario hereda Borgoña', 'Charles the Bold inherits Burgundy'],
  ['Abdications of Carlos V', 'Abdications of Charles V'], ['The Recovery of Carlos V', 'The recovery of Charles V'],
  ['Utrecht in Carlos V, 1528', 'Utrecht under Charles V, 1528'], ['Federico II Dies', 'Frederick II dies'], ['Isabel Dies', 'Isabella dies'],
  ["Carlos's Accumulation", 'Charles’s accumulation'], ['Marriage of Isabel of Castile and Fernando of Aragon', 'Marriage of Isabella of Castile and Ferdinand of Aragon'],
  ['The Heritage of Margarita III', 'The inheritance of Margaret III'],
  ['Abdicted after the Piamontian liberal revolution', 'abdicated after the liberal revolution in Piedmont'],
  ['Valois-Borgoña', 'Valois-Burgundy'], ['Ivrea-Borgoña', 'Ivrea-Burgundy'], ['Trastámara-Nápoles', 'Trastámara-Naples'],
  ['of Ancárida origin', 'of Anscarid origin'], ['reigned in Castilla and León', 'reigned in Castile and León'],
  ['Claudia de \'Medici', 'Claudia de’ Medici'], ['Count of Tolosa', 'Count of Toulouse'], ['the legacy Pierre de Castelnau', 'the legate Pierre de Castelnau'],
  ['the Albigense ', 'the Albigensian '], ['his prenaic interests', 'his Pyrenean interests'], ['Juan James of Montferrat', 'John James of Montferrat'],
  ['Isabel de Bavaria - Ingolstadt', 'Isabeau of Bavaria'], ['Isabel de Burgh', 'Elizabeth de Burgh'],
  ['Juan de Aragón', 'John of Aragon'], ['Alonso de Aragón', 'Alonso of Aragon'], ['Yolanda de Aragón', 'Yolande of Aragon'],
  ['Sancha de Castilla', 'Sancha of Castile'], ['Alfonso VIII de Castilla', 'Alfonso VIII of Castile'], ['Fernando III de Castilla', 'Ferdinand III of Castile'],
  ['Catalina de Castilla y Lancaster', 'Catherine of Castile and Lancaster'], ['Miguel de la Paz de Portugal y Aragón', 'Miguel da Paz, Prince of Portugal'],
  ['Carlos Roberto de Anjou', 'Charles Robert of Anjou'], ['Carlos Martel de Anjou-Sicily', 'Charles Martel of Anjou-Sicily'],
  ['Margarita de Bearne', 'Margaret of Béarn'], ['Margarita de Ginebra', 'Margaret of Geneva'], ['Margarita de Austria-Styria', 'Margaret of Austria-Styria'],
  ['Carlos Teodoro del Palatinate-Neoburg', 'Charles Theodore of the Palatinate-Neuburg'], ['Carlos Manuel de Savoy-Carignano', 'Charles Emmanuel of Savoy-Carignano'],
  ['Carlos de Saxony, Duke of Curlandia', 'Charles of Saxony, Duke of Courland'], ['Carlos X Gustavo of Sweden', 'Charles X Gustav of Sweden'],
  ['Carlos IV of Spain', 'Charles IV of Spain'], ['Adolfo Federico of Sweden', 'Adolf Frederick of Sweden'], ['Gustavo II Adolfo', 'Gustavus II Adolphus'],
  ['Maria Leonor of Brandenburg', 'Maria Eleonora of Brandenburg'], ['Anne Leonor of Hesse-Darmstadt', 'Anna Eleonore of Hesse-Darmstadt'],
  ['Juan Casimiro of the Palatinate-Zweibrücken', 'John Casimir of the Palatinate-Zweibrücken'], ['Catalina Zaccaria', 'Catherine Zaccaria'],
  ['Juan Federico de Württemberg', 'John Frederick of Württemberg'], ['Juan Federico de Pomerania', 'John Frederick of Pomerania'],
  ['Federico V de Nuremberg', 'Frederick V of Nuremberg'], ['Enrique de Antioch', 'Henry of Antioch'],
  ['His daughters Juana and Margarita', 'His daughters Joanna and Margaret'], ['Antonio de Burgundy', 'Anthony of Burgundy'],
  ['Antonio de Borgoña', 'Anthony of Burgundy'], ['Margarita de Brabante', 'Margaret of Brabant'],
  ['Jaime II agreed to abandon his Sicilian claim in Anagni, but the Sicilians refused to return to the Angevin domain. They chose their brother',
   'James II agreed to abandon his Sicilian claim at Anagni, but the Sicilians refused to return to Angevin rule. They chose his brother'],
  ['the Casa de Barcelona', 'the House of Barcelona'],
  ['The daughter of Blanca I of Navarre and Juan de Aragón, she was the sister of Charles, Prince of Viana and Leonor. After the death of Carlos',
   'The daughter of Blanche I of Navarre and John of Aragon, she was the sister of Charles, Prince of Viana, and of Eleanor. After Charles’s death'],
  ['Marquesado de Ceva', 'Marquisate of Ceva'], ['Marquesado de Fosdinovo', 'Marquisate of Fosdinovo'], ['Marquesado de Oristano', 'Marquisate of Oristano'],
];
const SKIP_KEYS = new Set(['translatedSource', 'es', 'key', 'slug', 'aliases', 'members', 'miembros', 'protagonistas', 'dinastia', 'nombre', 'assigned', 'sourceFile', 'en']);
const IBERIAN_ONLY = /\b(Portugal|Viseu|Barcelos|Braganza|Spain)\b/;
let changes = 0;
const fix = text => {
  let out = text;
  for (const [bad, good] of PHRASES) out = out.split(bad).join(good);
  for (const [es, en] of Object.entries(PLACES_ES)) out = out.replace(new RegExp(`\\b(de|of) ${es}\\b`, 'g'), `$1 ${en}`);
  out = out.replace(NAME, (whole, given, link, place) => {
    if (IBERIAN_ONLY.test(place)) return whole;
    const english = given.split(' ').map(word => GIVEN[word] || word).join(' ');
    return `${english} of ${place === 'Palatinate' ? 'the Palatinate' : place}`;
  });
  return out;
};
// A person whose display name changes keeps the old one as slugName, so the
// English address of the profile does not change (as in personNameReview607.js).
const keepSlug = profiles => {
  for (const profile of Object.values(profiles)) if (profile && typeof profile === 'object' && profile.name && !profile.slugName) {
    const fixed = fix(profile.name);
    if (fixed !== profile.name) profile.slugName = profile.name;
  }
};
const walk = (value, key) => {
  if (typeof value === 'string') { const out = fix(value); if (out !== value) changes++; return out; }
  if (Array.isArray(value)) return value.map(item => walk(item, key));
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) if (!SKIP_KEYS.has(k)) value[k] = walk(value[k], k);
    return value;
  }
  return value;
};
const samples = [];
for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-'))) {
  for (const file of ['names.json', 'notes.json', 'labels.json', 'people.json', 'dynasties.json', 'portraits.json']) {
    const full = path.join(root, batch, file);
    if (!fs.existsSync(full)) continue;
    const before = fs.readFileSync(full, 'utf8');
    const data = JSON.parse(before);
    // names, notes and labels map a Spanish key to an English value: only the value changes.
    if (['names.json', 'notes.json', 'labels.json'].includes(file)) {
      for (const k of Object.keys(data)) if (typeof data[k] === 'string') {
        const out = fix(data[k]);
        if (out !== data[k]) { changes++; if (samples.length < 40) samples.push(`${data[k].slice(0, 70)} → ${out.slice(0, 70)}`); data[k] = out; }
      }
    } else { if (file === 'people.json') keepSlug(data); walk(data); }
    const after = `${JSON.stringify(data, null, 2)}\n`;
    if (!DRY && after !== before) fs.writeFileSync(full, after);
  }
}
console.log(samples.join('\n'));
console.log(`${DRY ? 'Cambiarían' : 'Corregidos'} ${changes} textos en inglés.`);
