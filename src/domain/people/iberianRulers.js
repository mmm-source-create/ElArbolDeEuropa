// Scope: recorded royal governments in Iberia, including dynastic claims and
// consort kings, plus Blanche II’s explicit Navarrese claim without government.
export const IBERIAN_ROYAL_TERRITORIES = Object.freeze([
 'Portugal','Castilla','León','Aragón','Valencia','Navarra','Mallorca','Granada',
 'Califato almohade','Emirato de al-Ándalus',
]);
const territories = new Set(IBERIAN_ROYAL_TERRITORIES);
const royalTitles = new Set(['Rey','Reina','Sultán','Emir','Califa']);
export function iberianRoyalRecords(people) {
 return people.filter(p => p.id === 'BLANCA2NAV' || p.gobiernos?.some(g => territories.has(g.territorio) && royalTitles.has(g.titulo)));
}
