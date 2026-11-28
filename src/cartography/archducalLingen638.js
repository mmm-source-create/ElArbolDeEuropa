// The 1609 charter (Stadtarchiv Lingen, Urk. 17) receives the estates' oath
// in Albert and Isabella's names. Their existing Netherlands government
// reaches this one researched cell after Spinola's reconquest in 1605.
export const ARCHDUCAL_LINGEN_PHASE = 'Condado de Lingen · dominio disputado · 1605–1621 · cobertura alemana 19';
export const ARCHDUCAL_LINGEN_SOURCE = Object.freeze({
  title:'Stadtarchiv Lingen · Urk. 17 (1609), Archivalie Oktober 2015',
  url:'https://www.lingen.de/tourismus-freizeit-kultur/stadtarchiv/archivalie-des-monats/2015/archivalie-oktober-2015.html',
  locator:'Párrafos sobre la carta sellada de 1609 (Stadtarchiv Lingen, Urk. 17): juramento de los estamentos en nombre de Alberto e Isabel y confirmación de privilegios; conquista de Spinola y retirada de Orange en agosto de 1605.',
  locatorEn:'Paragraphs on the sealed 1609 charter (Stadtarchiv Lingen, Urk. 17): the estates’ oath in Albert and Isabella’s names and confirmation of privileges; Spinola’s conquest and Orange’s withdrawal in August 1605.',
});
export function archducalLingenAt(territory, year, personId) {
  return territory === 'Países Bajos' && year >= 1605 && year <= 1621
    && ['ALB7AUST','ISABCLARAEUG'].includes(personId);
}
export const archducalLingenIncludes = (id, territory, year, personId) =>
  id === 'Lingen' && archducalLingenAt(territory, year, personId);
export function archducalLingenJurisdictions(names, territory, year, personId) {
  const filtered = names.filter(name => name !== ARCHDUCAL_LINGEN_PHASE);
  return archducalLingenAt(territory, year, personId)
    ? [...new Set([...filtered, ARCHDUCAL_LINGEN_PHASE])] : filtered;
}
