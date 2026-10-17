// A continental holding does not follow automatically from a royal title.
// Resolve separate mandates and date occupations on their own regional cells.
export function frontierJurisdictions(names, territory, year, personId) {
  if (personId === 'IVANASEN3BUL' && territory === 'Bulgaria') return ['Bulgaria · gobierno rival en Tarnovo'];
  if (territory === 'Bulgaria') {
    if (personId === 'IVANSTRATSIMIRBUL') return ['Zarato de Vidin'];
    return year >= 1371 ? ['Zarato de Tarnovo'] : ['Bulgaria'];
  }
  if (territory === 'Sirmia') return ['Sirmia'];
  if (territory === 'Dobruja') return ['Despotado de Dobruja'];
  if (territory === 'Hannover') return ['Electorado de Hannover'];
  if (territory === 'Aquitania') return ['Ducado de Aquitania'];
  if (territory === 'Normandía') return ['Ducado de Normandía'];
  if (territory === 'Anjou') return ['Condado de Anjou', ...(personId === 'JUANSINTIERRA' ? ['Touraine angevina'] : [])];
  if (territory === 'Maine') return ['Condado de Maine'];
  if (territory === 'Touraine') return ['Touraine angevina'];
  if (territory === 'Champaña') return ['Condado de Champaña'];
  if (territory === 'Foix') return ['Condado de Foix'];
  if (territory === 'Bearne') return ['Vizcondado de Bearne'];
  if (territory === 'Armagnac') return ['Condado de Armagnac'];
  if (territory === 'Banato de Temes') return ['Banato de Temes'];
  if (territory === 'Croacia' && year <= 1526) return ['Croacia medieval'];
  if (territory === 'Eslavonia' && year <= 1526) return ['Eslavonia medieval'];
  if (territory === 'Transilvania' && year <= 1540) return ['Transilvania medieval'];
  if (territory === 'Hungría') {
    if (personId === 'JUAN1ZAPOLYA' || personId === 'JUAN2SIGZAPOLYA' && year === 1540)
      return ['Núcleo oriental de Zápolya'];
    if (year <= 1526) return ['Hungría','Eslavonia medieval','Banato húngaro de Jajce',
      ...(personId === 'LUIS1' && year >= 1365 && year <= 1368 ? ['Vidin · ocupación húngara'] : [])];
  }
  if (territory === 'Inglaterra') return ['Inglaterra','Plaza inglesa de Calais',
    'Normandía · ocupación inglesa','Francia · ocupación inglesa','Maine · ocupación inglesa',
    'Gibraltar · ocupación anglo-neerlandesa'];
  if (territory === 'Gran Bretaña') return [...names,'Gibraltar','Menorca británica',
    'Gibraltar · ocupación anglo-neerlandesa','Menorca · ocupación británica'];
  if (territory === 'Francia' || territory === 'República francesa') return [...names,'Menorca francesa'];
  return names;
}
