// V5.23 · Historias de diez casas más. Contexto editorial: cada fecha o
// parentesco individual se verifica en su ficha. Las fuentes deben figurar en
// el registro general (src/content/sources.js).
const MEDLANDS='https://fmg.ac/Projects/MedLands/index.htm';
const RAH='https://historia-hispanica.rah.es/';
const BRITANNICA='https://www.britannica.com/';

export const CASAS_V523 = {
  'Estuardo': {
    resumen:'Senescales de Escocia convertidos en reyes en 1371, los Estuardo heredaron Inglaterra e Irlanda en 1603 y reinaron, con la interrupción de la República, hasta la muerte de Ana en 1714.',
    origen:'El nombre procede del cargo de senescal (steward) que la familia ocupaba en la corte escocesa. Walter Stewart se casó con Marjorie, hija de Roberto I Bruce, y su hijo Roberto II subió al trono en 1371 al extinguirse los Bruce.',
    trayectoria:'Los reyes escoceses del siglo XV, varios de ellos coronados siendo niños, se enfrentaron a una nobleza poderosa. Jacobo IV murió en Flodden (1513) contra Inglaterra. María Estuardo, hija de Jacobo V, perdió el trono en 1567. Su hijo Jacobo VI, bisnieto de Margarita Tudor, hermana de Enrique VIII, heredó en 1603 la corona inglesa de Isabel I y unió las coronas en su persona.',
    legado:'Carlos I fue ejecutado en 1649 y la monarquía volvió con Carlos II en 1660. El católico Jacobo II fue depuesto en 1688 en favor de su hija María II y de Guillermo de Orange. La Unión de 1707 creó Gran Bretaña bajo Ana, y a su muerte el Acta de Establecimiento llevó la corona a los Hannover, excluyendo a los Estuardo católicos.',
    territorios:['Escocia','Inglaterra','Irlanda','Gran Bretaña'],
    protagonistas:['ROBERT2SCOT','JAMES1SCOT','JACOBO4ESCOCIA','JACOBO5ESCOCIA','MARIAESTUARDO','JACOBO1ING','CARLOS1ING','CARLOS2ING','JACOBO2ING','MARY2ING','ANNEQUEEN'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Tudor': {
    resumen:'Una familia galesa que llegó al trono inglés con la victoria de Enrique VII en 1485 y lo ocupó durante cinco reinados, de la ruptura con Roma a la era isabelina.',
    origen:'Owen Tudor, un caballero galés, se casó con Catalina de Valois, viuda de Enrique V. Su nieto Enrique, heredero de los derechos de los Lancaster por su madre Margarita Beaufort, venció a Ricardo III en Bosworth (1485) y se casó con Isabel de York, cerrando la guerra de las Dos Rosas.',
    trayectoria:'Enrique VII reforzó la hacienda real y casó a su hijo Arturo con Catalina de Aragón y a su hija Margarita con Jacobo IV de Escocia. Enrique VIII rompió con Roma para anular su matrimonio con Catalina. Le sucedieron sus tres hijos: Eduardo VI, protestante; María I, que restauró el catolicismo y se casó con Felipe II; e Isabel I.',
    legado:'Isabel I no se casó, y a su muerte en 1603 la corona pasó a Jacobo VI de Escocia, bisnieto de Margarita Tudor. La casa dejó una Iglesia de Inglaterra separada de Roma, una monarquía con fuerte base parlamentaria y una marina capaz de enfrentarse a España.',
    territorios:['Inglaterra','Irlanda','Gales'],
    protagonistas:['ENRIQ7ING','ARTUROGALES','ENRIQ8ING','EDUARDO6ING','MARIA1ING','ISABEL1ING'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Plantagenet': {
    resumen:'Los descendientes de Godofredo de Anjou que reinaron en Inglaterra desde 1154 y llegaron a gobernar, como vasallos del rey de Francia, gran parte del oeste francés.',
    origen:'Godofredo de Anjou, cuyo emblema dio nombre a la casa, se casó con Matilde, hija de Enrique I de Inglaterra. Su hijo Enrique II heredó Inglaterra en 1154 y, con su esposa Leonor de Aquitania, reunió Normandía, Anjou y Aquitania: un conjunto de dominios a ambos lados del canal.',
    trayectoria:'Juan Sin Tierra perdió Normandía y Anjou ante Felipe II de Francia (1202–1204) y tuvo que aceptar la Carta Magna (1215). Enrique III y Eduardo I reforzaron el Parlamento; Eduardo I conquistó Gales. Eduardo III reclamó la corona francesa en 1337 y abrió la guerra de los Cien Años, con victorias de su hijo el Príncipe Negro.',
    legado:'Ricardo II fue depuesto en 1399 por su primo Enrique de Lancaster, hijo de Juan de Gante. Las ramas de Lancaster y York, ambas plantagenets, se disputaron después el trono en la guerra de las Dos Rosas, que terminó con los Tudor en 1485.',
    territorios:['Inglaterra','Normandía','Aquitania','Anjou','Gales','Irlanda'],
    protagonistas:['HENRY2ING','JUANSINTIERRA','ENRIQ3ING','EDUARDO1ING','EDUARDO2ING','EDUARDO3ING','EDUNEGRO','JUANGASTE','RICARDO2ING'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Hohenzollern': {
    resumen:'Burgraves de Núremberg que en 1415 recibieron Brandeburgo, sumaron el ducado de Prusia en 1618 y convirtieron sus dominios en el reino de Prusia, una gran potencia del siglo XVIII.',
    origen:'Federico VI de Núremberg, de la rama franconia, recibió del emperador Segismundo el margraviato de Brandeburgo y su dignidad electoral (1415–1417). Otra rama gobernó la Prusia de la Orden Teutónica: Alberto la secularizó en 1525 y la convirtió en ducado bajo soberanía polaca.',
    trayectoria:'En 1618 el elector Juan Segismundo heredó Prusia. Tras la devastación de la guerra de los Treinta Años, Federico Guillermo, el Gran Elector, construyó un ejército permanente y obtuvo en 1657 la plena soberanía sobre Prusia. Su hijo Federico se coronó rey en Prusia en 1701.',
    legado:'Federico Guillermo I organizó la administración y el ejército, y Federico II conquistó Silesia y participó en los repartos de Polonia. En el siglo XIX la casa encabezó la unificación alemana: Guillermo I fue proclamado emperador en 1871.',
    territorios:['Brandeburgo','Prusia','Silesia','Sacro Imperio'],
    protagonistas:['FRED1BRAND','ALBERTPRUSSIA','JOHNSIGBRAND','FREDWILGREAT','FRED1PRUSSIA','FREDWIL1PRU','FRED2PRUSSIA','FREDWIL2PRU','FREDWIL3PRU','WILHELM1PRU'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Avís': {
    resumen:'La dinastía nacida de la crisis de 1383–1385 que gobernó Portugal durante su expansión atlántica y se extinguió con la muerte de Sebastián en Alcazarquivir y la de su tío Enrique.',
    origen:'Juan, maestre de la orden de Avís e hijo natural de Pedro I, fue aclamado rey por las Cortes de Coimbra en 1385 frente a las pretensiones de Juan I de Castilla. Su victoria en Aljubarrota (1385) y la alianza con Inglaterra, sellada por su matrimonio con Felipa de Lancaster, aseguraron la independencia del reino.',
    trayectoria:'La conquista de Ceuta (1415) abrió la expansión africana, impulsada por el infante Enrique el Navegante. Juan II organizó la ruta hacia la India y negoció con Castilla el tratado de Tordesillas (1494). Con Manuel I, Vasco da Gama llegó a la India y Cabral a Brasil.',
    legado:'Sebastián murió sin hijos en Alcazarquivir (1578). Tras el breve reinado del cardenal Enrique, Felipe II, nieto de Manuel I por su madre, fue reconocido rey en 1581. Portugal recuperó su independencia en 1640 con la casa de Braganza, descendiente de Juan I.',
    territorios:['Portugal','Brasil'],
    protagonistas:['JUAN1PORT','EDU1PORT','PEDROPORTCOIM','ALF5PORT','JUAN2PORT','MAN1PORT','JUAN3PORT','SEBAS1PORT'],
    fuentes:[RAH,MEDLANDS,BRITANNICA],
  },
  'Anjou': {
    resumen:'Bajo este nombre el Atlas reúne dos linajes distintos: los antiguos condes de Anjou, que dieron reyes a Jerusalén, y la casa capeta de Anjou, que reinó en Nápoles, Hungría y Polonia.',
    origen:'Fulco V, conde de Anjou, se casó con Melisenda, heredera de Jerusalén, y reinó allí desde 1131; sus descendientes Balduino III, Amalarico I y Balduino IV gobernaron el reino cruzado. Su hijo Godofredo fue padre de Enrique II de Inglaterra, origen de los Plantagenet. La segunda casa de Anjou procede de Carlos, hermano de Luis IX de Francia, que recibió el condado en apanage.',
    trayectoria:'Carlos I de Anjou conquistó Sicilia y Nápoles con el apoyo del papado (1266) y venció a Conradino en 1268. Tras las Vísperas sicilianas (1282) conservó solo Nápoles. Una rama, la de Carlos Roberto, reinó en Hungría; Luis I el Grande fue además rey de Polonia, donde le sucedió su hija Eduviges.',
    legado:'Juana I de Nápoles adoptó a Luis I de Anjou, de la casa Valois, origen de una nueva línea angevina que disputó Nápoles a los Durazzo y a Aragón; Renato de Anjou la perdió en 1442 ante Alfonso V. Las pretensiones angevinas sobre Nápoles sirvieron después a los reyes de Francia para justificar las guerras de Italia.',
    territorios:['Anjou','Nápoles','Sicilia','Hungría','Polonia','Provenza'],
    protagonistas:['FULK5JER','BALDWIN3JER','AMALRIC1JER','BALDWIN4JER','CARLOS1ANJ','CARLOS2NAP','ROB1NAP','LUIS1','JUANA1NAP','LUIS1ANJOU','MARIA1H','EDUV1','RENATOANJOU'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Osmanlí': {
    resumen:'La dinastía de Osmán gobernó desde Anatolia un imperio que tomó Constantinopla en 1453 y se extendió por los Balcanes, Oriente Próximo y el norte de África.',
    origen:'Osmán I fue un jefe de frontera del noroeste de Anatolia a comienzos del siglo XIV. Sus sucesores tomaron Bursa y pasaron a Europa; Murad I se expandió por los Balcanes y Bayezid I fue derrotado y capturado por Tamerlán en Ankara (1402), lo que abrió una década de guerra entre sus hijos.',
    trayectoria:'Mehmed II conquistó Constantinopla en 1453 y la convirtió en capital. Selim I incorporó Siria y Egipto (1516–1517) y Solimán el Magnífico llegó a Hungría, Bagdad y el Mediterráneo occidental. La sucesión, sin regla de primogenitura, se resolvía a menudo con la eliminación de los hermanos del nuevo sultán.',
    legado:'Desde finales del siglo XVI el gobierno pasó en buena parte a visires, como los Köprülü, y al harén. El fracaso ante Viena en 1683 abrió una etapa de retrocesos en los Balcanes, sellada por la paz de Karlowitz (1699). Selim III intentó modernizar el ejército a finales del siglo XVIII.',
    territorios:['Imperio otomano','Balcanes','Egipto','Siria','Bizancio y Oriente latino'],
    protagonistas:['MURAD1OSM','BAYEZID1OSM','MEHMED1OSM','MURAD2OSM','MEHMED2OSM','BAYEZID2OSM','SELIM1OSM','SULEIMAN1OSM','SELIM2OSM','MURAD3OSM','MEHMED4OSM','SELIM3OSM'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Rurikida': {
    resumen:'Los descendientes de Rúrik gobernaron los principados de la Rus durante siete siglos; su rama de Moscú reunió las tierras rusas y se extinguió con Fiódor I en 1598.',
    origen:'La tradición sitúa a Rúrik en Nóvgorod en el siglo IX. Sus descendientes gobernaron Kiev y, tras la fragmentación de la Rus y la invasión mongola, una red de principados sometidos a la Horda de Oro. Alejandro Nevski, príncipe de Nóvgorod y de Vladímir, venció a suecos y teutónicos y negoció con los mongoles.',
    trayectoria:'Daniel, hijo de Nevski, recibió Moscú. Iván I obtuvo de la Horda el derecho a recaudar tributos y Dmitri Donskói venció a los tártaros en Kulikovo (1380). Iván III incorporó Nóvgorod, dejó de pagar tributo a la Horda (1480) y se casó con Sofía Paleóloga.',
    legado:'Iván IV se coronó zar en 1547, conquistó Kazán y Astracán y gobernó con extrema violencia. Con la muerte de su hijo Fiódor I en 1598 terminó la dinastía en Moscú; siguieron el Período Tumultuoso y, en 1613, los Románov.',
    territorios:['Rusia'],
    protagonistas:['ALEXNEVSKY','DANIELMOSC','IVAN1KALITA','DMITRIDON','VASILY1MOSC','VASILY2MOSC','IVAN3MOSC','VASILY3MOSC','IVAN4RUS','FEODOR1RUS'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Jagellón': {
    resumen:'Grandes duques de Lituania que por la unión con Polonia en 1386 reinaron también en Cracovia y, a finales del siglo XV, en Bohemia y Hungría.',
    origen:'Jogaila, gran duque de Lituania, se bautizó y se casó en 1386 con Eduviges, reina de Polonia, tomando el nombre de Ladislao II. La unión personal le permitió vencer a la Orden Teutónica en Grunwald (1410) junto a su primo Vitautas.',
    trayectoria:'Ladislao III fue también rey de Hungría y murió en Varna (1444) contra los otomanos. Casimiro IV recuperó la Prusia occidental en 1466 y colocó a sus hijos en los tronos: Vladislao en Bohemia (1471) y Hungría (1490), y Juan Alberto, Alejandro y Segismundo I sucesivamente en Polonia.',
    legado:'Luis II, hijo de Vladislao, murió en Mohács (1526) y sus coronas pasaron a Fernando de Habsburgo, casado con su hermana Ana. Segismundo II Augusto firmó la Unión de Lublin (1569), que creó la Mancomunidad polaco-lituana, y murió sin hijos en 1572; desde entonces los reyes fueron electos.',
    territorios:['Polonia','Lituania','Polonia-Lituania','Bohemia','Hungría'],
    protagonistas:['LADI2','LADI3','CASI4','LADISLAO7HUN','JUAN1ALBERTO','ALEJANDRO1POL','SEGIS1JAG','LUIS2HUN','SEGIS2JAG','ANAJAG'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Piast': {
    resumen:'La primera dinastía polaca, de Miecislao I a Casimiro III el Grande, cuyas ramas siguieron gobernando ducados en Silesia y Mazovia durante siglos.',
    origen:'Miecislao I aceptó el cristianismo en 966 y Boleslao I fue coronado rey en 1025. Desde 1138 el reino se dividió entre los hijos de Boleslao III en ducados regionales, y la dignidad real quedó en suspenso durante casi dos siglos.',
    trayectoria:'Premislao II se coronó rey en 1295, pero fue asesinado al año siguiente. Ladislao I el Breve reunificó buena parte del reino y se coronó en Cracovia en 1320. Su hijo Casimiro III el Grande codificó leyes, fundó la universidad de Cracovia (1364) y amplió el reino hacia Rutenia.',
    legado:'Casimiro murió sin hijo varón en 1370 y la corona pasó a su sobrino Luis de Anjou, y después a los Jagellón. Las ramas silesias de los Piast, como los duques de Świdnica o de Brzeg, continuaron hasta 1675, la mayoría bajo soberanía bohemia.',
    territorios:['Polonia','Silesia','Mazovia'],
    protagonistas:['PREM2','LADI1','CASI3','ENRIQ2SWI','BOLESL'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
};
