// 6.0.17 · Parses Medieval Lands pages (.cache/fmg/pages) into person entries (.cache/fmg/entries.json):
// page, anchor, bold name, parents named in «son/daughter of X & his wife Y», dates and marriages.
// Bracketed, approximate («before», «after», «c.») or split years are marked uncertain.
import fs from 'node:fs';
const root = new URL('../../../.cache/fmg/', import.meta.url);
const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
const year = part => {
  if (!part) return null;
  const all = [...part.matchAll(/(\[?)(\d{3,4})(?:\/(\d{1,4}))?(\]?)/g)];
  if (!all.length) return null;
  const last = all[all.length - 1];
  const uncertain = Boolean(last[1] || last[4] || last[3]) || /\b(?:before|after|bef|aft|c\.|circa|about|or)\b|\?/.test(part);
  return {year: +last[2], certain: !uncertain};
};
// «(Poissy 25 Apr 1214-Tunis 25 Aug 1270, bur Saint-Denis)» → birth and death parts. The separator is
// the first hyphen preceded by nothing, a digit, «]» or «)», so place names such as Château-Thierry survive.
export const lifeDates = inner => {
  const text = inner.split(/,\s*bur\b|;\s*bur\b/)[0];
  for (let i = 0; i < text.length; i++) if (text[i] === '-' && (i === 0 || /[\d\])\s]/.test(text[i - 1]))) return {birth: year(text.slice(0, i)), death: year(text.slice(i + 1))};
  return {birth: year(text), death: null};
};
const entries = [];
const HAD_CHILDREN = /\bhad (?:\w+ )?(?:children|child|sons?|daughters?)\b|\bchildren:/;
// Spouse: the first capitalised name after the marriage marker, then its first parenthetical dates.
const marriage = clause => {
  const ordinal = (clause.match(/^\s*(?:\([^)]*\)\s*)?(firstly|secondly|thirdly|fourthly|fifthly)\b/) || [])[1] || null;
  const c = clause.replace(/^\s*(?:firstly|secondly|thirdly|fourthly|fifthly|\([^)]*\)|as (?:his|her) [a-z]+ (?:wife|husband)|[\s,])*/, '');
  const name = (c.match(/^⟦([^⟧]+)⟧/) || c.match(/^((?:---|[A-ZÀ-ÞŁŚŻŹĆŃ][A-ZÀ-ÞŁŚŻŹĆŃ'’-]+)(?: [A-ZÀ-ÞŁŚŻŹĆŃ][A-ZÀ-ÞŁŚŻŹĆŃ'’-]+)*(?: [^,(⟦]{0,40})?)/) || [])[1];
  const dates = c.match(/\(([^()]*\d{3,4}[^()]*)\)/);
  return name ? {ordinal, name: name.replace(/[⟦⟧]/g, '').trim(), clause: c.slice(0, 220).replace(/[⟦⟧]/g, ''), dates: dates ? lifeDates(dates[1]) : null} : null;
};
for (const file of fs.readdirSync(new URL('pages/', root))) {
  const html = new TextDecoder('windows-1252').decode(fs.readFileSync(new URL(`pages/${file}`, root)));
  const stack = [];   // last entry seen at each numbering level, for children lists
  let header = null;
  const marriagesSeen = [];   // 6.0.21: the last «X & his wife had n children:» paragraph
  for (const para of html.split(/<p\b[^>]*>/).slice(1)) {
    const body = para.split('</p>')[0];
    if (!/color:gray/.test(body)) {
      // 6.0.21: a short paragraph announcing the children of the last entry («King Henry II & his wife had
      // eight children:») opens its children list, as the same words inside the entry already did.
      const plain = decode(body.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
      const last = stack.filter(Boolean).at(-1);
      if (last && plain.length < 260 && /\bhad\b[^.]{0,60}\b(?:children|child|sons?|daughters?)\b|\bchildren:\s*$/.test(plain)) {
        last.parentOfNext = true;
        const ordinal = (plain.match(/& his (first|second|third|fourth|fifth) wife/) || [])[1] || (/& his wife/.test(plain) ? 'only' : null);
        const want = {first: 'firstly', second: 'secondly', third: 'thirdly', fourth: 'fourthly', fifth: 'fifthly'}[ordinal] || null;
        // The wife is the nearest preceding marriage paragraph («m (…) ELEONORE …») of that order.
        const wife = ordinal ? marriagesSeen.slice(-6).reverse().find(m => ordinal === 'only' ? !m.ordinal : m.ordinal === want) || null : null;
        header = {entry: last.index, text: plain, subject: (plain.match(/^(.*?)\s*(?:&|had\b)/) || [])[1] || null, illegitimate: /illegitimate|mistress|natural|by /i.test(plain), wife};
      }
      continue;
    }
    const anchor = (body.match(/<a name=["']?([A-Za-z0-9_]+)["']?\s*>/) || [])[1] || null;
    const text = decode(body.replace(/<b>\s*(?:<[^>]*>\s*)*<span[^>]*color:gray[^>]*>([\s\S]*?)<\/span>(?:\s*<\/[^>]+>)*?\s*<\/b>/g, (m, n) => `⟦${n.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()}⟧`).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const head = text.match(/^(\d+\.|[a-z]{1,4}\))?\s*⟦([^⟧]+)⟧/);
    if (head && /^m(?: (?:firstly|secondly|thirdly|fourthly|fifthly))?$/.test(head[2])) {
      const m = marriage(text.slice(head.index + head[0].length));
      if (m) marriagesSeen.push({...m, ordinal: head[2].split(' ')[1] || m.ordinal});
      continue;
    }
    if (!head) continue;
    const mark = head[1] || '';
    const previous = stack.filter(Boolean).at(-1);
    let level = !mark ? 0 : /^\d/.test(mark) ? 1 : /^[ivx]+\)$/.test(mark) && (stack[3] || (previous?.level === 2 && previous.parentOfNext)) ? 3 : 2;
    if (/^[ivx]+\)$/.test(mark) && mark !== 'i)' && level !== 3) level = 3;
    const after = text.slice(head.index + head[0].length);
    const parents = after.match(/^\s*,?\s*(?:[^,(]{0,60},\s*)?(?:son|daughter) of ([^(]*?)(?: & his (?:first |second |third )?wife ([^(]*?))?\s*\(/);
    const datesMatch = after.match(/\(([^()]*)\)/);
    const dates = datesMatch && datesMatch.index < 300 ? lifeDates(datesMatch[1]) : {birth: null, death: null};
    const marriages = text.split('⟦m⟧').slice(1).map(marriage).filter(Boolean);
    const parent = level > 0 ? stack.slice(0, level).filter(Boolean).at(-1) : null;
    const entry = {page: file, anchor, name: head[2], level, father: parents?.[1]?.trim() || null, mother: parents?.[2]?.trim() || null,
      parentEntry: parent?.parentOfNext ? parent.index : null, birth: dates.birth, death: dates.death, marriages, text: text.slice(0, 300), index: entries.length};
    // 6.0.21: sentences about offices («He succeeded his father in 1285 as PHILIPPE IV King of France»),
    // used to document governments. The entry's own text only, before its first marriage.
    const own = text.split('⟦m⟧')[0].replace(/\[\d+\]/g, '').replace(/[⟦⟧]/g, '');
    entry.acts = own.split(/(?<=[a-z0-9\])”"])\.\s+(?=["“A-Z])/).filter(x => /\b(?:succeeded|succeeds|became|elected|crowned|proclaimed|installed|invested|inherited|regent|deposed|abdicated|resigned|renounced|ruled|reigned|recognised|recognized|enfeoffed|granted)\b/i.test(x) && /\b\d{3,4}\b/.test(x) && x.length < 400).slice(0, 8);
    entry.parentOfNext = HAD_CHILDREN.test(text);
    if (entry.parentEntry !== null && header?.entry === entry.parentEntry) entry.listHeader = {text: header.text, subject: header.subject, illegitimate: header.illegitimate, wife: header.wife};
    else if (header && level > 0 && entry.parentEntry === header.entry) entry.listHeader = {text: header.text, subject: header.subject, illegitimate: header.illegitimate, wife: header.wife};
    if (level === 0 && !/^Mistress/i.test(head[2])) header = null;
    entries.push(entry);
    stack[level] = entry; stack.length = level + 1;
  }
}
fs.writeFileSync(new URL('entries.json', root), JSON.stringify(entries));
console.log('entries', entries.length, 'with parents', entries.filter(e => e.father).length, 'in a family list', entries.filter(e => e.parentEntry !== null).length, 'with both years', entries.filter(e => e.birth?.certain && e.death?.certain).length);
