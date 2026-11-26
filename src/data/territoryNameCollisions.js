// 6.3.5 · Fichas territoriales con el mismo nombre una vez quitado el rango.
// Una misma entidad con otro rango o con otra denominación no tiene dos fichas:
// se funde en una con etapas fechadas (Aquitania, Riga, Leiningen). Cada
// coincidencia que queda es de entidades distintas, con su razón histórica. Un
// test impide añadir una ficha nueva que coincida sin justificarla aquí.

const RANKS = 'reino|ducado|condado|principado|margraviato|señorío|senorio|república|republica|archiducado|gran ducado|landgraviato|electorado|obispado|arzobispado|imperio|sultanato|emirato|kanato|despotado|banato|voivodato|zarato|califato|marquesado|vizcondado|baronía|baronia|ciudad|comuna|estado|isla|islas|corona|tierras';
export const territoryNameKey = name => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(new RegExp(`^(${RANKS.normalize('NFD').replace(/[̀-ͯ]/g, '')})\\s+(de|del|de la|de los|de las)\\s+`), '')
  .replace(/[^a-z0-9]+/g, ' ').trim();

export const DISTINCT_TERRITORY_NAMES = Object.freeze([
  {names:['Arzobispado de Bremen','Ciudad de Bremen','Ducado de Bremen'], reason:'Principado eclesiástico, ciudad imperial libre y ducado secularizado (1648) bajo Suecia: tres jurisdicciones coetáneas o sucesivas distintas.'},
  {names:['Brunswick','Ciudad de Brunswick','Principado de Brunswick'], reason:'El ducado güelfo, la ciudad hanseática con autonomía frente al duque y la porción de Brunswick-Wolfenbüttel de las particiones.'},
  {names:['Arzobispado de Riga','Obispado de Riga'], reason:'Ninguna: fusionadas en 6.3.5 (el obispado es la etapa 1201–1254 del arzobispado).', merged:true},
  {names:['Curlandia','Obispado de Curlandia'], reason:'El ducado laico de 1561 y el obispado de Curlandia (Piltene), jurisdicción eclesiástica distinta.'},
  {names:['Comuna de Trieste','Obispado de Trieste'], reason:'La comuna urbana y el señorío temporal del obispo, en litigio entre sí.'},
  {names:['Despotado de Ioannina','Señorío de Ioannina'], reason:'Ninguna: fusionadas en 6.3.5.', merged:true},
  {names:['Emirato de Sivas','Sultanato de Sivas'], reason:'El beylicato eretnida (1335–1381) y el sultanato de Kadı Burhaneddin (1381–1398), que lo sustituye con otra dinastía y otra estructura de poder.'},
  {names:['Brescia','Comuna de Brescia'], reason:'La ciudad bajo señores y la comuna medieval autónoma: régimen distinto, no un cambio de rango.'},
  {names:['Como','Comuna de Como'], reason:'La ciudad bajo Milán y la comuna medieval autónoma.'},
  {names:['Comuna de Módena','Módena'], reason:'La comuna medieval y el ducado de los Este (1452).'},
  {names:['Comuna de Parma','Parma'], reason:'La comuna medieval y el ducado farnesiano (1545).'},
  {names:['Córcega','Reino de Córcega'], reason:'La isla bajo Pisa y Génova, y el Reino anglocorso (1794–1796), Estado con constitución propia.'},
  {names:['Emirato de Mallorca','Mallorca'], reason:'La taifa andalusí y el reino cristiano de 1229.'},
  {names:['Emirato de Menorca','Menorca'], reason:'El almojarifazgo tributario (1231–1287) y la isla bajo la Corona de Aragón.'},
  {names:['Emirato de Valencia','Valencia'], reason:'La taifa andalusí y el reino cristiano de 1238.'},
  {names:['Obispado de Urgell','Urgell'], reason:'El señorío del obispo y el condado de Urgell.'},
  {names:['Basilea','Obispado de Basilea'], reason:'La ciudad, cantón suizo desde 1501, y el principado episcopal con sede en Porrentruy.'},
  {names:['Auvernia','Ducado de Auvernia'], reason:'El condado de Auvernia, que siguió existiendo, y el ducado apanaje creado en 1360 con las tierras reales.'},
  {names:['Clermont','Obispado de Clermont'], reason:'Clermont-en-Beauvaisis (condado) y el obispado de Clermont en Auvernia: lugares distintos.'},
  {names:['Turena','Vizcondado de Turena'], reason:'Touraine (condado y ducado del Loira) y el vizcondado de Turenne (Lemosín): lugares distintos con el mismo nombre en español.'},
  {names:['Banato de Temes','Condado de Temes'], reason:'El condado medieval húngaro y el Banato habsbúrgico de 1718–1778, con otra administración y otros límites.'},
  {names:['República de Venecia','Venecia'], reason:'Pendiente de decisión: «República de Venecia» es el gobierno colectivo tardío (1651–1796) y «Venecia» lleva los mandatos de los dogos.', pending:true},
  {names:['Castilla','Corona de Castilla'], reason:'El reino y la corona compuesta (1230) que reúne Castilla, León y sus reinos.'},
  {names:['Aragón','Corona de Aragón'], reason:'El reino y la corona compuesta (1137) con Cataluña, Valencia y Mallorca.'},
  {names:['Borgoña','Condado de Borgoña'], reason:'El ducado de Borgoña (Dijon) y el condado de Borgoña o Franco Condado (Besanzón).'},
  {names:['Condado de Thomond','Thomond'], reason:'El reino gaélico de los O’Brien y el condado de la Corona creado en 1543.'},
  {names:['Condado de Desmond','Desmond'], reason:'El reino gaélico de los MacCarthy y el condado de los Fitzgerald (1329).'},
  {names:['Condado de Leiningen','Principado de Leiningen'], reason:'Ninguna: fusionadas en 6.3.5 (el principado es la etapa 1779–1793 del condado).', merged:true},
  {names:['Aquitania','Ducado de Aquitania'], reason:'Ninguna: fusionadas en 6.3.5.', merged:true},
]);
