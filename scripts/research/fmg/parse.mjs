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
  const c = clause.replace(/^\s*(?:firstly|secondly|thirdly|fourthly|fifthly|\([^)]*\)|as (?:his|her) [a-z]+ (?:wife|husband)|[\s,])*/, '');
  const name = (c.match(/^⟦([^⟧]+)⟧/) || c.match(/^((?:---|[A-ZÀ-ÞŁŚŻŹĆŃ][A-ZÀ-ÞŁŚŻŹĆŃ'’-]+)(?: [A-ZÀ-ÞŁŚŻŹĆŃ][A-ZÀ-ÞŁŚŻŹĆŃ'’-]+)*(?: [^,(⟦]{0,40})?)/) || [])[1];
  const dates = c.match(/\(([^()]*\d{3,4}[^()]*)\)/);
  return name ? {name: name.replace(/[⟦⟧]/g, '').trim(), clause: c.slice(0, 220).replace(/[⟦⟧]/g, ''), dates: dates ? lifeDates(dates[1]) : null} : null;
};
for (const file of fs.readdirSync(new URL('pages/', root))) {
  const html = new TextDecoder('windows-1252').decode(fs.readFileSync(new URL(`pages/${file}`, root)));
  const stack = [];   // last entry seen at each numbering level, for children lists
  for (const para of html.split(/<p\b[^>]*>/).slice(1)) {
    const body = para.split('</p>')[0];
    if (!/color:gray/.test(body)) continue;
    const anchor = (body.match(/<a name=["']?([A-Za-z0-9_]+)["']?\s*>/) || [])[1] || null;
    const text = decode(body.replace(/<b>\s*(?:<[^>]*>\s*)*<span[^>]*color:gray[^>]*>([\s\S]*?)<\/span>(?:\s*<\/[^>]+>)*?\s*<\/b>/g, (m, n) => `⟦${n.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()}⟧`).replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const head = text.match(/^(\d+\.|[a-z]{1,4}\))?\s*⟦([^⟧]+)⟧/);
    if (!head || head[2] === 'm') continue;
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
    entry.parentOfNext = HAD_CHILDREN.test(text);
    entries.push(entry);
    stack[level] = entry; stack.length = level + 1;
  }
}
fs.writeFileSync(new URL('entries.json', root), JSON.stringify(entries));
console.log('entries', entries.length, 'with parents', entries.filter(e => e.father).length, 'in a family list', entries.filter(e => e.parentEntry !== null).length, 'with both years', entries.filter(e => e.birth?.certain && e.death?.certain).length);
