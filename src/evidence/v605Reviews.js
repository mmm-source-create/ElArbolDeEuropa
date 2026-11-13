const source=(title,url,locator)=>({title,url,locator});
const ndb=source('Deutsche Biographie · Friedrich, Herzog von Sachsen','https://www.deutsche-biographie.de/sfz27778.html','Genealogie: V Hzg. Albrecht d. Beherzte; M Sidonia; Hochmeister, 1498–1510.');
const max=source('AEIOU · Maximilian III. der Deutschmeister','https://austria-forum.org/af/AEIOU/Maximilian_III._der_Deutschmeister%2C_Erzherzog','1593–95 war er Statthalter von Innerösterreich, 1602–18 Regent von Tirol.');
const order=source('Deutscher Orden · Liste der Hochmeister','https://deutscher-orden.com/liste-der-hochmeister/','Nach dem Verlust des preußischen Ordenslandes (1525); Maximilian von Österreich 1590/95–1618.');
const review=(sources,note,certainty='documented')=>({sources,note,certainty,reviewedAt:'2026-11-13',editor:'El Árbol de Europa'});
export const V605_REVIEWS={
 'person:MAXIM3TIROL:government:Polonia:1587:1598:Rey':review([{...max,locator:'wurde er 1587 von einer Minderheit zum König von Polen gewählt und verzichtete 1598 darauf.'}],'Elección minoritaria y pretensión, sin gobierno efectivo de Polonia.'),
 'person:FREDSAXTEUTONIC:death':review([{...ndb,locator:'Friedrich, Herzog von Sachsen: † 14.12.1510 Rochlitz.'}],'Ambas biografías coinciden en el año de muerte, 1510; difieren en el día de diciembre.'),
 'person:WALTHERCRONBERG:death':review([source('Deutsche Biographie · Cronberg, Walter von','https://www.deutsche-biographie.de/sfz8991.html','Cronberg, Walter von: † 4.4.1543 Mergentheim.')],'La biografía fecha su muerte en 1543.'),
 'person:FREDSAXTEUTONIC:father':review([ndb],'La genealogía identifica a Alberto el Valiente como padre.'),
 'person:FREDSAXTEUTONIC:mother':review([ndb],'La genealogía identifica a Sidonia como madre.'),
 'person:FREDSAXTEUTONIC:birth':{...review([ndb,source('Sächsische Biografie · Friedrich','https://saebi.isgv.de/person/snr/9036','geboren: 25.10.1474 in Torgau')],'La NDB y la Sächsische Biografie difieren en el año de nacimiento.','disputed'),alternatives:['1473 (NDB)','1474 (Sächsische Biografie)']},
 'person:MAXIM3TIROL:government:Austria Interior:1593:1595:Regente':review([max],'Gobierno delegado durante la minoría de Fernando II.'),
 'person:MAXIM3TIROL:government:Prusia:1590:1618:Gran maestre':review([order],'La institución conservaba una reclamación sobre Prusia, no el gobierno efectivo del ducado. El comienzo del mandato se sitúa en la transición 1590–1595.','inferred')
};
