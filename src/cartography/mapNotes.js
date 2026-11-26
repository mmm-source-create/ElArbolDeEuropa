// 6.3.5 · Notas del mapa común reducidas a lo que importa en el año elegido.
// Las notas de la cartografía se escribieron para todo el ámbito de una capa
// (a menudo varios siglos) e incluyen avisos de método para la revisión. En el
// inspector solo interesa la entidad y lo que pasa en ese año: se quitan las
// frases de método, las aclaraciones en negativo y las cláusulas sobre años
// que no son el elegido. La nota completa sigue en los datos y en las fuentes.

const METHOD = [
  /aproximad|contorno|escala comarcal|deslinde|pol[ií]gono|subtrazad|celda|superficie regional|cartas hist[oó]ricas|contrastad|reconstrucci[oó]n comarcal|datación regional|revisión|n[uú]cleos inspeccionados|se preservan los t[ií]tulos|ficha/i,
  /approximat|outline|contour|boundar|polygon|cell|regional surface|historical maps|cross-checked|reconstruction|regional dating|review|record/i,
];
const JUSTIFICATION = [
  /\bno\b[^.;]*\b(extingue|desaparece|contin[uú]a|retrasa|concede|comparte|infiere|prueba|acredita|equivale|convierte|crea|implica|presupone|significa|deriva|anticipa|supone|representa|adelanta|interrumpe|cambia)\b|por el mero|por s[ií] sol|sin (inferir|equiparar|presuponer|anticipar)|se conserva[n]? (el|la|los|las|durante)|conserva la jurisdicci[oó]n|el distrito se conserva/i,
  /\b(does|do|did) not\b|\bnot\b[^.;]*\b(extinguish|disappear|continue|delay|grant|share|infer|prove|document|equate|imply|presuppose|mean|derive|anticipate|represent|interrupt|change)\b|by itself|by themselves|without (inferring|equating|presupposing)|is (kept|retained|preserved) (during|through)|keeps (its|the) jurisdiction/i,
];
const RESTATEMENT = /^[^.:;]{2,90}: [^.;]{2,90}, \d{3,4}[–-]\d{3,4}\.?$/;

const years = text => [...text.matchAll(/\b(1[0-9]{3})(?:\s*[–-]\s*(1[0-9]{3}))?\b/g)]
  .map(([, from, through]) => ({from: Number(from), through: Number(through || from), range: Boolean(through)}));

// Una cláusula habla de otro tiempo si todos sus años son posteriores al año
// elegido, o si es un intervalo ya cerrado.
function outOfTime(clause, year) {
  const found = years(clause);
  if (!found.length || !Number.isInteger(year)) return false;
  return found.every(({from, through, range}) => from > year || (range && through < year));
}

const sentencesOf = text => text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ0-9«“(])/).filter(Boolean);
const splitClauses = (sentence, locale) => sentence.replace(/\.$/, '')
  .split(locale === 'en' ? /;\s+|,\s+(?=with\s)/ : /;\s+|,\s+(?=con\s)/);

export function conciseMapNote(text, year, locale = 'es') {
  if (!text) return null;
  const en = locale === 'en';
  const method = METHOD[en ? 1 : 0], justification = JUSTIFICATION[en ? 1 : 0];
  const kept = [];
  for (const sentence of sentencesOf(text)) {
    if (method.test(sentence) || justification.test(sentence) || RESTATEMENT.test(sentence)) continue;
    const clauses = splitClauses(sentence, locale).filter((clause, index) => index === 0 || !outOfTime(clause, year));
    if (outOfTime(clauses[0], year)) continue;
    kept.push(`${clauses.join('; ')}.`);
  }
  return kept.length ? kept.join(' ') : null;
}
