// V5.34 · Las tierras de los reyes de Navarra de las casas de Foix y Albret
// (Foix, Bigorra, Albret y el Bearne), con la Gran Enciclopèdia Catalana.
const SOURCES = Object.freeze({
 "foix": {
  "title": "Gran Enciclopèdia Catalana · Comtat de Foix",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-foix",
  "locator": "Gastón IV (1436); sus nietos Francisco Febo y Catalina, reyes de Navarra; Enrique (II de Navarra), Juana (III) y Enrique IV de Francia, que incorporó los dominios a la Corona francesa en 1607."
 },
 "bigorra": {
  "title": "Gran Enciclopèdia Catalana · Bigorra",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/bigorra",
  "locator": "En 1425 Juan I de Grailly, conde de Foix, recibe el condado de Carlos VII; desde entonces lo gobiernan los condes de Foix; Enrique IV lo incorpora a su reino en 1607."
 },
 "albret": {
  "title": "Gran Enciclopèdia Catalana · Albret",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/albret",
  "locator": "Alano el Grande (1440–1522), tutor de su nieto Enrique II de Navarra; Juana III; ducado erigido en 1556 e incorporado a la Corona por Enrique IV en 1607."
 },
 "bearn": {
  "title": "Gran Enciclopèdia Catalana · Bearn",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/bearn-0",
  "locator": "Soberanía de hecho del vizcondado en el siglo XVI; Enrique III de Navarra (IV de Francia) conserva su autonomía administrativa (1607); en 1620 Luis XIII proclama en Pau el edicto de unión a Francia."
 }
});
const review = (keys, note) => ({certainty: 'documented', sources: keys.map(key => SOURCES[key]), note, reviewedAt: '2026-10-19', editor: 'El Árbol de Europa'});
export const NAVARRE_LANDS_REVIEWS = Object.freeze({
  "person:JOHN1FOIX:government:Condado de Bigorra:1425:1436:Conde": review(["bigorra"], "Carlos VII de Francia le concedió el condado en 1425."),
  "person:GASTON4FOIX:government:Condado de Bigorra:1436:1472:Conde": review(["bigorra"], "Desde 1425 Bigorra la gobernaron los condes de Foix."),
  "person:FRANCISCOFEBONAV:government:Foix:1472:1483:Conde": review(["foix"], "Sucesión de los condes de Foix; los años siguen el vizcondado de Bearne, que heredaba la misma persona."),
  "person:FRANCISCOFEBONAV:government:Condado de Bigorra:1472:1483:Conde": review(["bigorra"], "Desde 1425 Bigorra la gobernaron los condes de Foix."),
  "person:CATALINA1NAV:government:Foix:1483:1517:Condesa": review(["foix"], "Sucesión de los condes de Foix; los años siguen el vizcondado de Bearne, que heredaba la misma persona."),
  "person:CATALINA1NAV:government:Condado de Bigorra:1483:1517:Condesa": review(["bigorra"], "Desde 1425 Bigorra la gobernaron los condes de Foix."),
  "person:ENRIQ2NAV:government:Foix:1517:1555:Conde": review(["foix"], "Sucesión de los condes de Foix; los años siguen el vizcondado de Bearne, que heredaba la misma persona."),
  "person:ENRIQ2NAV:government:Condado de Bigorra:1517:1555:Conde": review(["bigorra"], "Desde 1425 Bigorra la gobernaron los condes de Foix."),
  "person:ENRIQ2NAV:government:Albret:1522:1555:Señor": review(["albret"], "Heredó el señorío a la muerte de su abuelo y tutor Alano el Grande (1522)."),
  "person:JUANA3NAV:government:Foix:1555:1572:Condesa": review(["foix"], "Sucesión de los condes de Foix; los años siguen el vizcondado de Bearne, que heredaba la misma persona."),
  "person:JUANA3NAV:government:Condado de Bigorra:1555:1572:Condesa": review(["bigorra"], "Desde 1425 Bigorra la gobernaron los condes de Foix."),
  "person:JUANA3NAV:government:Albret:1555:1572:Duquesa": review(["albret"], "El señorío fue erigido en ducado en 1556."),
  "person:ENRIQ4FRA:government:Bearne:1572:1610:Vizconde": review(["bearn"], "Señor soberano del Bearne; la unión a Francia llegó con Luis XIII en 1620."),
  "person:ENRIQ4FRA:government:Foix:1572:1607:Conde": review(["foix"], "Lo incorporó a la Corona francesa en 1607."),
  "person:ENRIQ4FRA:government:Condado de Bigorra:1572:1607:Conde": review(["bigorra"], "Lo incorporó a la Corona francesa en 1607."),
  "person:ENRIQ4FRA:government:Albret:1572:1607:Duque": review(["albret"], "Lo incorporó a la Corona francesa en 1607."),
  "person:LUIS13FRA:government:Bearne:1610:1620:Vizconde": review(["bearn"], "En 1620 entró en Pau y proclamó el edicto de unión del Bearne a Francia."),
});
