// The supplemental cells share their principality's identity and government.
const SUPPLEMENTS = Object.freeze({
  Bosnia: 'Bosnia · relieve interior',
  Valaquia: 'Valaquia · comarcas interiores',
  Moldavia: 'Moldavia · valles interiores orientales',
});

export function medievalBalkanJurisdictions(names, territory) {
  const supplement = SUPPLEMENTS[territory];
  return supplement ? [...new Set([...names, supplement])] : names;
}

export function medievalBalkanScope(personId, territory, year) {
  if (personId !== 'VUKBOS' || territory !== 'Bosnia' || year < 1366 || year > 1367) return null;
  return {ids: ['Olovo'],
    source: {title: 'Hrvatski biografski leksikon · Kotromanići',
      url: 'https://hbl.lzmk.hr/Clanak/kotromanici?handler=ButtonSnimi',
      locator: 'Tvrtko I y Vuk: deposición de febrero de 1366, recuperación de marzo y resistencia oriental en torno a Bobovac; expulsión en 1367.'},
    note: 'Ámbito limitado y disputado del entorno de Bobovac dentro de la celda de Olovo. Representación anual aproximada: no atribuye a Vuk todo el banato ni prueba ocupación de cada punto durante ambos años.'};
}
