const source={title:'Claudio Mutini · Treccani, Dizionario Biografico degli Italiani · Castiglione, Baldassarre (1979)',url:'https://www.treccani.it/enciclopedia/baldassarre-castiglione_(Dizionario-Biografico)/',locator:'Nacimiento en Casatico el 6 de diciembre de 1478, padres Cristoforo y Aloisa Gonzaga; matrimonio con Ippolita en 1516, muerte de ella en 1520 y fallecimiento en Toledo el 8 de febrero de 1529.'};
const review=(note,extra={})=>({certainty:'documented',sources:[{...source,locator:note}],note,reviewedAt:'2026-10-22',editor:'El Árbol de Europa',...extra});
export const CASTIGLIONE_REVIEWS={
 'person:BALDASSARECASTIGLIONE:birth':review('Nació en Casatico el 6 de diciembre de 1478.',{exactDate:'1478-12-06'}),
 'person:BALDASSARECASTIGLIONE:death':review('Murió en Toledo el 8 de febrero de 1529.',{exactDate:'1529-02-08'}),
 'person:BALDASSARECASTIGLIONE:father':review('La biografía identifica como padre a Cristoforo Castiglione.'),
 'person:BALDASSARECASTIGLIONE:mother':review('La biografía identifica como madre a Aloisa Gonzaga, también llamada Luigia.'),
 'person:BALDASSARECASTIGLIONE:spouse:IPPOLITATORELLI':review('Se casó con Ippolita Torelli en 1516; ella murió en 1520.'),
 'person:IPPOLITATORELLI:spouse:BALDASSARECASTIGLIONE':review('Matrimonio con Castiglione en 1516.'),
 'person:IPPOLITATORELLI:death':review('Ippolita murió en 1520.'),
 'person:CRISTOFOROCASTIGLIONE:death':review('Cristoforo murió en 1499 después de una larga agonía por las heridas de Fornovo.'),
 'person:CRISTOFOROCASTIGLIONE:spouse:LUIGIAGONZAGACASTIGLIONE':review('Cristoforo y Aloisa Gonzaga son los padres del escritor; la biografía describe su familia y hogar.'),
 'person:LUIGIAGONZAGACASTIGLIONE:spouse:CRISTOFOROCASTIGLIONE':review('Cristoforo y Aloisa Gonzaga son los padres del escritor.'),
};
