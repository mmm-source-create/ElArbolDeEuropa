// 6.0.15: histories for the ten houses with most members that had none, in
// Spanish (HISTORIA_DINASTIAS) and English (written into the v6 batch files by
// scripts/data/apply-house-histories-615.mjs).
const T = slug => `https://www.treccani.it/enciclopedia/${slug}/`;

const HOUSES = {
  'La Marck': {
    territorios: ['Cléveris', 'Mark', 'Jülich', 'Berg', 'Ravensberg'],
    protagonistas: ['ADOLF1CLEV', 'JOHN1CLEVES', 'JOHN3CLEVES', 'ANNECLEVES', 'WILHELM5CLEVES', 'JOHNWILLIAMCLEVES'],
    fuentes: [T('la-marck'), 'https://d-nb.info/gnd/141872225'],
    es: {
      resumen: 'Condes de la Marca, en Westfalia, que heredaron el condado de Cléveris y fueron duques de Cléveris desde 1417. En el siglo XVI reunieron Jülich, Berg y Ravensberg; su extinción en 1609 abrió la crisis sucesoria de Jülich-Cléveris.',
      origen: 'La familia descendía de los condes de Berg-Altena y tomó su nombre de la fortaleza de Mark, junto al Ruhr. En 1368 Adolfo de la Marca heredó por su madre el condado de Cléveris, en el bajo Rin, y su hijo Adolfo I fue elevado a duque por el emperador Segismundo en 1417.',
      trayectoria: 'Adolfo I se casó con María de Borgoña, hija de Juan sin Miedo, y sus descendientes se movieron en la órbita borgoñona: su hija María fue la madre de Luis XII. El matrimonio de Juan III con María, heredera de Jülich-Berg, reunió en 1521 un gran conjunto de territorios en el bajo Rin. Juan III y su hijo Guillermo V favorecieron un humanismo religioso intermedio entre Roma y la Reforma.',
      legado: 'Ana de Cléveris, hija de Juan III, fue en 1540 la cuarta esposa de Enrique VIII. Guillermo V perdió Güeldres ante Carlos V en 1543. Juan Guillermo, el último duque, murió sin hijos en 1609; Brandeburgo y el Palatinado-Neoburgo, casados con sus hermanas, se repartieron la herencia por el tratado de Xanten (1614).',
    },
    en: {
      summary: 'Counts of the Mark, in Westphalia, who inherited the county of Cleves and were dukes of Cleves from 1417. In the sixteenth century they united Jülich, Berg and Ravensberg; their extinction in 1609 opened the Jülich-Cleves succession crisis.',
      origin: 'The family descended from the counts of Berg-Altena and took its name from the castle of Mark, near the Ruhr. In 1368 Adolf of the Mark inherited the county of Cleves, on the lower Rhine, through his mother, and his son Adolf I was raised to duke by Emperor Sigismund in 1417.',
      history: 'Adolf I married Mary of Burgundy, daughter of John the Fearless, and his descendants moved in the Burgundian orbit: his daughter Mary was the mother of Louis XII. The marriage of John III to Maria, heiress of Jülich-Berg, brought together a large group of territories on the lower Rhine in 1521. John III and his son William V favoured a religious humanism midway between Rome and the Reformation.',
      legacy: 'Anne of Cleves, John III’s daughter, became Henry VIII’s fourth wife in 1540. William V lost Guelders to Charles V in 1543. John William, the last duke, died childless in 1609; Brandenburg and Palatinate-Neuburg, married to his sisters, divided the inheritance by the Treaty of Xanten (1614).',
    },
  },
  'Valois-Angulema': {
    territorios: ['Angulema', 'Francia'],
    protagonistas: ['CARLOSANG', 'MARGANGULEMA', 'FRAN1FRA', 'ENRIQ2FRA', 'CARLOS9FRA', 'ENRIQ3FRA'],
    fuentes: [T('valois'), 'https://www.britannica.com/topic/Valois-dynasty'],
    es: {
      resumen: 'Rama menor de los Valois-Orleans que heredó la corona francesa en 1515 con Francisco I y la conservó hasta la muerte de Enrique III en 1589.',
      origen: 'Juan de Orleans, hermano menor del poeta Carlos de Orleans, recibió el condado de Angulema. Su hijo Carlos se casó con Luisa de Saboya y fue padre de Margarita y de Francisco. Cuando Luis XII murió sin hijos varones en 1515, Francisco, su primo y yerno, era el heredero por la ley sálica.',
      trayectoria: 'Francisco I y su hijo Enrique II combatieron a Carlos V y a Felipe II en las guerras de Italia, que terminaron en 1559 con la paz de Cateau-Cambrésis. Margarita de Angulema, hermana del rey, fue reina de Navarra, escritora y protectora de humanistas y reformadores. La corte de los Valois-Angulema impulsó el Renacimiento francés en el valle del Loira y en Fontainebleau.',
      legado: 'Los tres hijos de Enrique II reinaron sucesivamente durante las guerras de religión, bajo la influencia de su madre, Catalina de Médici. Isabel de Valois fue reina de España y Margarita, reina de Navarra y de Francia. Con el asesinato de Enrique III en 1589 la corona pasó a su cuñado, Enrique de Borbón.',
    },
    en: {
      summary: 'A junior line of the Valois-Orléans that inherited the French crown in 1515 with Francis I and kept it until the death of Henry III in 1589.',
      origin: 'John of Orléans, younger brother of the poet Charles of Orléans, received the county of Angoulême. His son Charles married Louise of Savoy and was the father of Margaret and Francis. When Louis XII died without sons in 1515, Francis, his cousin and son-in-law, was heir under Salic law.',
      history: 'Francis I and his son Henry II fought Charles V and Philip II in the Italian wars, which ended in 1559 with the Peace of Cateau-Cambrésis. Margaret of Angoulême, the king’s sister, was Queen of Navarre, a writer and a patron of humanists and reformers. The court of the Valois-Angoulême promoted the French Renaissance in the Loire valley and at Fontainebleau.',
      legacy: 'The three sons of Henry II reigned in turn during the wars of religion, under the influence of their mother, Catherine de’ Medici. Elisabeth of Valois became Queen of Spain and Margaret Queen of Navarre and of France. With the murder of Henry III in 1589 the crown passed to his brother-in-law, Henry of Bourbon.',
    },
  },
  Colonna: {
    territorios: ['Estados Pontificios', 'Nápoles'],
    protagonistas: ['SCIARRACOLONNA', 'PAPA_MARTIN5', 'PROSPCOLONNA', 'VITTORIACOL', 'ASCANIOCOLONNA', 'MARCANTONIO2COL'],
    fuentes: [T('colonna'), 'https://www.britannica.com/topic/Colonna-family'],
    es: {
      resumen: 'Gran familia baronal romana, rival de los Orsini, que dio un papa, numerosos cardenales, condotieros al servicio de España y una de las grandes poetas del Renacimiento.',
      origen: 'Los Colonna aparecen en el siglo XI como señores de Colonna, en los montes Albanos, y de Palestrina. Su poder descansaba en castillos del Lacio, en clientelas urbanas y en su presencia en el colegio cardenalicio. Su enfrentamiento con los Orsini dividió Roma durante siglos.',
      trayectoria: 'Su choque con Bonifacio VIII culminó en 1303 en el atentado de Anagni, en el que participó Sciarra Colonna. En 1417 Oddone Colonna fue elegido papa como Martín V, lo que cerró el Cisma de Occidente, y reforzó el patrimonio familiar. En las guerras de Italia, Prospero y Fabrizio Colonna fueron generales del bando español.',
      legado: 'Vittoria Colonna, hija de Fabrizio, fue poeta y amiga de Miguel Ángel. Marcantonio II mandó las galeras pontificias en Lepanto (1571) y fue virrey de Sicilia. Los Colonna, como condestables del reino de Nápoles y príncipes de Paliano, siguieron entre las primeras familias de la nobleza romana.',
    },
    en: {
      summary: 'A great Roman baronial family, rival of the Orsini, which produced a pope, many cardinals, condottieri in Spanish service and one of the great poets of the Renaissance.',
      origin: 'The Colonna appear in the eleventh century as lords of Colonna, in the Alban Hills, and of Palestrina. Their power rested on castles in Lazio, urban clienteles and their presence in the College of Cardinals. Their feud with the Orsini divided Rome for centuries.',
      history: 'Their clash with Boniface VIII culminated in 1303 in the outrage of Anagni, in which Sciarra Colonna took part. In 1417 Oddone Colonna was elected pope as Martin V, ending the Western Schism, and strengthened the family estates. In the Italian wars Prospero and Fabrizio Colonna were generals on the Spanish side.',
      legacy: 'Vittoria Colonna, Fabrizio’s daughter, was a poet and a friend of Michelangelo. Marcantonio II commanded the papal galleys at Lepanto (1571) and was Viceroy of Sicily. As constables of the Kingdom of Naples and princes of Paliano, the Colonna remained among the first families of the Roman nobility.',
    },
  },
  Asen: {
    territorios: ['Bulgaria'],
    protagonistas: ['IVANASEN1BUL', 'KALOYANBUL', 'BORILBUL', 'IVANASEN2BUL', 'MICHAEL2ASENBUL', 'IVANASEN3BUL'],
    fuentes: ['https://www.britannica.com/place/Second-Bulgarian-empire', T('bisanzio')],
    es: {
      resumen: 'Dinastía que restauró el Estado búlgaro en 1185 con la rebelión de los hermanos Asen y Pedro. Bajo Iván Asen II, el segundo Imperio búlgaro dominó gran parte de los Balcanes.',
      origen: 'Los hermanos Teodoro (Pedro) y Asen encabezaron en 1185 una revuelta contra Bizancio en el norte de los Balcanes, con apoyo de los cumanos. Tárnovo se convirtió en la capital del nuevo Estado y la Iglesia búlgara recuperó su autonomía.',
      trayectoria: 'Kaloyan, hermano menor de los fundadores, obtuvo en 1204 una corona del papa Inocencio III y en 1205 derrotó en Adrianópolis al emperador latino Balduino I. Iván Asen II, hijo de Asen, venció al Epiro en Klokotnitsa (1230) y extendió su dominio desde el mar Negro hasta el Adriático.',
      legado: 'Tras la muerte de Iván Asen II en 1241, sus hijos menores reinaron bajo regencias y la invasión mongola debilitó el reino. Miguel II Asen fue asesinado en 1256 y la línea masculina perdió el trono; Iván Asen III, nieto de Iván Asen II, reinó brevemente entre 1279 y 1280 con apoyo bizantino. Las dinastías posteriores invocaron su parentesco con los Asen.',
    },
    en: {
      summary: 'The dynasty that restored the Bulgarian state in 1185 with the rebellion of the brothers Asen and Peter. Under Ivan Asen II the Second Bulgarian Empire dominated much of the Balkans.',
      origin: 'The brothers Theodore (Peter) and Asen led a revolt against Byzantium in the northern Balkans in 1185, supported by the Cumans. Tarnovo became the capital of the new state and the Bulgarian Church recovered its autonomy.',
      history: 'Kaloyan, the founders’ younger brother, obtained a crown from Pope Innocent III in 1204 and in 1205 defeated the Latin emperor Baldwin I at Adrianople. Ivan Asen II, Asen’s son, defeated Epirus at Klokotnitsa (1230) and extended his rule from the Black Sea to the Adriatic.',
      legacy: 'After Ivan Asen II died in 1241, his young sons reigned under regencies and the Mongol invasion weakened the kingdom. Michael II Asen was murdered in 1256 and the male line lost the throne; Ivan Asen III, Ivan Asen II’s grandson, reigned briefly in 1279–1280 with Byzantine support. Later dynasties invoked their kinship with the Asens.',
    },
  },
  'Poitiers-Antioquía': {
    territorios: ['Antioquía', 'Trípoli', 'Armenia'],
    protagonistas: ['BOHEMOND3ANT', 'BOHEMOND4ANT', 'BOHEMOND5ANT', 'BOHEMOND6ANT', 'PLAISANCEANT', 'BOHEMOND7TRIP'],
    fuentes: ['https://www.britannica.com/topic/House-of-Poitiers', 'https://www.britannica.com/topic/Antioch-medieval-principality-Turkey'],
    es: {
      resumen: 'Rama de los condes de Poitiers que gobernó el principado de Antioquía y, desde comienzos del siglo XIII, el condado de Trípoli, hasta su conquista por los mamelucos en 1268 y 1289.',
      origen: 'Raimundo de Poitiers, hijo del duque Guillermo IX de Aquitania y tío de Leonor de Aquitania, se casó en 1136 con Constanza, heredera de Antioquía. Su hijo Bohemundo III gobernó el principado durante más de cuarenta años.',
      trayectoria: 'Bohemundo IV obtuvo el condado de Trípoli y, tras una larga guerra con su sobrino armenio Raimundo Rubén, también Antioquía. Su hijo Felipe fue rey de Armenia por matrimonio y murió envenenado en 1226. Bohemundo VI se sometió a los mongoles de Hulagu en 1260, lo que le valió la excomunión.',
      legado: 'El sultán mameluco Baibars tomó Antioquía en 1268 y la destruyó. Bohemundo VII conservó Trípoli, donde murió sin hijos en 1287; la ciudad cayó en manos de los mamelucos en 1289. El título de príncipe de Antioquía pasó más tarde a miembros de la casa de Lusignan de Chipre.',
    },
    en: {
      summary: 'A branch of the counts of Poitiers that ruled the Principality of Antioch and, from the early thirteenth century, the County of Tripoli, until their conquest by the Mamluks in 1268 and 1289.',
      origin: 'Raymond of Poitiers, son of Duke William IX of Aquitaine and uncle of Eleanor of Aquitaine, married Constance, heiress of Antioch, in 1136. Their son Bohemond III ruled the principality for more than forty years.',
      history: 'Bohemond IV obtained the County of Tripoli and, after a long war with his Armenian nephew Raymond-Roupen, Antioch as well. His son Philip became King of Armenia by marriage and died of poison in 1226. Bohemond VI submitted to Hülegü’s Mongols in 1260, which earned him excommunication.',
      legacy: 'The Mamluk sultan Baybars took Antioch in 1268 and destroyed it. Bohemond VII kept Tripoli, where he died childless in 1287; the city fell to the Mamluks in 1289. The title of Prince of Antioch later passed to members of the Lusignan house of Cyprus.',
    },
  },
  'Della Rovere': {
    territorios: ['Estados Pontificios', 'Urbino'],
    protagonistas: ['PAPA_SIXTO4', 'PAPA_JULIO2', 'GIOVANNIDELLAROVERE', 'FRANCESCOROVEREURBINO', 'GUIDOBALDO2ROVERE', 'FRANCESCO2ROVERE'],
    fuentes: [T('della-rovere'), 'https://www.britannica.com/topic/della-Rovere-family'],
    es: {
      resumen: 'Familia de Savona que llegó al papado con Sixto IV y Julio II y gobernó el ducado de Urbino de 1508 a 1631.',
      origen: 'Francesco della Rovere, fraile franciscano de una modesta familia de Savona, en Liguria, fue elegido papa en 1471 con el nombre de Sixto IV. Promovió a sus sobrinos con cardenalatos, señoríos y matrimonios, y construyó en Roma la capilla Sixtina.',
      trayectoria: 'Su sobrino Giuliano fue elegido papa en 1503 como Julio II: recuperó por las armas las tierras de la Iglesia, encargó a Miguel Ángel la bóveda de la Sixtina y a Bramante la nueva basílica de San Pedro. Otro sobrino, Giovanni, se casó con la hermana del duque de Urbino, y su hijo Francesco Maria I heredó el ducado en 1508.',
      legado: 'Los duques della Rovere hicieron de Urbino y Pesaro cortes refinadas; Guidobaldo II encargó a Tiziano la Venus de Urbino. Francesco Maria II sobrevivió a su único hijo y, a su muerte en 1631, el ducado volvió a la Santa Sede. Su nieta Vittoria llevó las colecciones familiares a Florencia al casarse con Fernando II de Médici.',
    },
    en: {
      summary: 'A family from Savona that reached the papacy with Sixtus IV and Julius II and ruled the Duchy of Urbino from 1508 to 1631.',
      origin: 'Francesco della Rovere, a Franciscan friar from a modest family of Savona, in Liguria, was elected pope in 1471 as Sixtus IV. He advanced his nephews with cardinalates, lordships and marriages, and built the Sistine Chapel in Rome.',
      history: 'His nephew Giuliano was elected pope in 1503 as Julius II: he recovered the Church’s lands by force of arms, commissioned Michelangelo to paint the Sistine ceiling and Bramante to build the new St Peter’s. Another nephew, Giovanni, married the sister of the Duke of Urbino, and their son Francesco Maria I inherited the duchy in 1508.',
      legacy: 'The della Rovere dukes made Urbino and Pesaro refined courts; Guidobaldo II commissioned Titian’s Venus of Urbino. Francesco Maria II outlived his only son and, on his death in 1631, the duchy reverted to the Holy See. His granddaughter Vittoria took the family collections to Florence when she married Ferdinando II de’ Medici.',
    },
  },
  'Zähringen-Baden': {
    territorios: ['Baden'],
    protagonistas: ['CHRISTOPH1BADEN', 'ERNSTBADEN', 'KARL2BADEN', 'GEORGEFREDBADEN', 'KARLWILHELMBADEN', 'KARLFRIEDRICHBADEN'],
    fuentes: [T('baden'), 'https://www.britannica.com/place/Baden-historical-state-Germany'],
    es: {
      resumen: 'Rama de los Zähringen que gobernó el margraviato de Baden, en el alto Rin, dividido entre Baden-Baden y Baden-Durlach de 1535 a 1771 y reunido después por Carlos Federico.',
      origen: 'Los margraves de Baden descendían de Hermann, hijo del duque Bertoldo I de Zähringen, en el siglo XI. Su patrimonio, entre la Selva Negra y el Rin, creció por herencias y compras hasta que Cristóbal I lo reunió a finales del siglo XV.',
      trayectoria: 'Los hijos de Cristóbal se repartieron sus tierras, y en 1535 quedaron dos margraviatos: Baden-Baden, que siguió católico, y Baden-Durlach, luterano desde Carlos II (1556). Jorge Federico de Baden-Durlach combatió en la guerra de los Treinta Años del lado protestante y fue vencido en Wimpfen en 1622. Las guerras de Luis XIV arrasaron el país a finales del siglo XVII.',
      legado: 'Carlos III Guillermo fundó en 1715 Karlsruhe, nueva capital de Baden-Durlach. Su nieto Carlos Federico, príncipe ilustrado, abolió la servidumbre en 1783 y heredó en 1771 Baden-Baden al extinguirse la rama católica. En la época napoleónica Baden se convirtió en electorado y, en 1806, en gran ducado.',
    },
    en: {
      summary: 'A branch of the Zähringen that ruled the Margraviate of Baden on the upper Rhine, divided between Baden-Baden and Baden-Durlach from 1535 to 1771 and then reunited by Charles Frederick.',
      origin: 'The margraves of Baden descended from Hermann, son of Duke Berthold I of Zähringen, in the eleventh century. Their lands between the Black Forest and the Rhine grew through inheritances and purchases until Christopher I reunited them at the end of the fifteenth century.',
      history: 'Christopher’s sons divided his lands, and from 1535 there were two margraviates: Baden-Baden, which remained Catholic, and Baden-Durlach, Lutheran from Charles II (1556). George Frederick of Baden-Durlach fought on the Protestant side in the Thirty Years’ War and was defeated at Wimpfen in 1622. Louis XIV’s wars devastated the country at the end of the seventeenth century.',
      legacy: 'Charles III William founded Karlsruhe in 1715 as the new capital of Baden-Durlach. His grandson Charles Frederick, an enlightened prince, abolished serfdom in 1783 and in 1771 inherited Baden-Baden when the Catholic line died out. In the Napoleonic era Baden became an electorate and, in 1806, a grand duchy.',
    },
  },
  Avesnes: {
    territorios: ['Henao', 'Holanda', 'Zelanda'],
    protagonistas: ['BOUCHARDAVES', 'JOHN1AVES', 'JOHN2AVES', 'GUILLERMO3HENAO', 'GUIL4HOL', 'FELIPAHENAO'],
    fuentes: ['https://fmg.ac/Projects/MedLands/HAINAUT.htm', T('lussemburgo')],
    es: {
      resumen: 'Familia de Henao surgida del matrimonio discutido de Bouchard de Avesnes con Margarita de Flandes. Obtuvo Henao en 1257 y Holanda y Zelanda en 1299, y se extinguió en la línea masculina en 1345.',
      origen: 'Bouchard de Avesnes, noble de Henao que había recibido órdenes menores, se casó hacia 1212 con Margarita, hermana de la condesa Juana de Flandes. El matrimonio fue declarado nulo y los hijos, tachados de ilegítimos, se enfrentaron durante décadas a los hijos del segundo matrimonio de Margarita, los Dampierre.',
      trayectoria: 'El arbitraje de Luis IX de Francia (1246) dio Henao a los Avesnes y Flandes a los Dampierre. Juan I de Avesnes murió en 1257, antes que su madre. Su hijo Juan II heredó Henao en 1280 y, en 1299, los condados de Holanda y Zelanda, a través de su madre, hermana del rey Guillermo de Holanda.',
      legado: 'Guillermo I de Henao casó a sus hijas con los grandes de Europa: Felipa con Eduardo III de Inglaterra y Margarita con el emperador Luis IV de Baviera. Guillermo II murió en 1345 combatiendo a los frisones sin hijos, y la herencia pasó a Margarita y a los Wittelsbach, lo que originó la guerra de los Ganchos y los Bacalaos en Holanda.',
    },
    en: {
      summary: 'A Hainaut family born of Bouchard of Avesnes’s disputed marriage to Margaret of Flanders. It obtained Hainaut in 1257 and Holland and Zeeland in 1299, and died out in the male line in 1345.',
      origin: 'Bouchard of Avesnes, a Hainaut nobleman who had taken minor orders, married Margaret, sister of Countess Joan of Flanders, around 1212. The marriage was declared void, and the children, branded illegitimate, fought for decades against the sons of Margaret’s second marriage, the Dampierres.',
      history: 'The arbitration of Louis IX of France (1246) gave Hainaut to the Avesnes and Flanders to the Dampierres. John I of Avesnes died in 1257, before his mother. His son John II inherited Hainaut in 1280 and, in 1299, the counties of Holland and Zeeland, through his mother, sister of King William of Holland.',
      legacy: 'William I of Hainaut married his daughters to the great of Europe: Philippa to Edward III of England and Margaret to Emperor Louis IV of Bavaria. William II died childless in 1345 fighting the Frisians, and the inheritance passed to Margaret and the Wittelsbachs, which gave rise to the Hook and Cod wars in Holland.',
    },
  },
  'Valois-Orleans': {
    territorios: ['Orleans', 'Angulema', 'Francia', 'Milán'],
    protagonistas: ['LUISORLEANS', 'CARLOS1ORLEANS', 'JEANDUNOIS', 'JUANORLEANS', 'LUIS12FRA', 'CLAUDEFRA'],
    fuentes: [T('valois'), 'https://www.britannica.com/topic/Valois-dynasty'],
    es: {
      resumen: 'Rama de los Valois fundada por Luis, duque de Orleans, hermano de Carlos VI. Reclamó Milán por la herencia Visconti y llegó al trono de Francia en 1498 con Luis XII.',
      origen: 'Luis de Orleans recibió el ducado en 1392 y se casó con Valentina Visconti, hija del duque de Milán, que aportó Asti y los derechos de su familia. Su rivalidad con Juan sin Miedo por el gobierno del reino, durante la locura de Carlos VI, terminó con su asesinato en París en 1407.',
      trayectoria: 'Su hijo Carlos de Orleans, capturado en Azincourt en 1415, pasó veinticinco años prisionero en Inglaterra, donde escribió buena parte de su obra poética. Su hermanastro Jean de Dunois, el «bastardo de Orleans», luchó junto a Juana de Arco. Otro hijo, Juan, fue el fundador de la rama de Angulema.',
      legado: 'Luis, hijo del poeta, heredó la corona en 1498 como Luis XII y conquistó Milán en 1499 en nombre de la herencia Visconti. Al no tener hijos varones, casó a su hija Claudia con Francisco de Angulema, que le sucedió en 1515; con él la corona pasó a la rama de Angulema.',
    },
    en: {
      summary: 'A branch of the Valois founded by Louis, Duke of Orléans, brother of Charles VI. It claimed Milan through the Visconti inheritance and reached the throne of France in 1498 with Louis XII.',
      origin: 'Louis of Orléans received the duchy in 1392 and married Valentina Visconti, daughter of the Duke of Milan, who brought Asti and her family’s rights. His rivalry with John the Fearless for control of the kingdom during the madness of Charles VI ended with his murder in Paris in 1407.',
      history: 'His son Charles of Orléans, captured at Agincourt in 1415, spent twenty-five years as a prisoner in England, where he wrote much of his poetry. His half-brother Jean de Dunois, the “Bastard of Orléans”, fought alongside Joan of Arc. Another son, John, founded the Angoulême branch.',
      legacy: 'Louis, the poet’s son, inherited the crown in 1498 as Louis XII and conquered Milan in 1499 in the name of the Visconti inheritance. Having no sons, he married his daughter Claude to Francis of Angoulême, who succeeded him in 1515; with him the crown passed to the Angoulême branch.',
    },
  },
  Orsini: {
    territorios: ['Estados Pontificios', 'Nápoles'],
    protagonistas: ['MATTEOROSSOORS_GRANDE', 'PAPA_NICOLAS3', 'CLARICEORSINI', 'ALFONSINAORSINI', 'GIROLAMAORSINI', 'PAPA_BENEDICTO13'],
    fuentes: [T('orsini'), 'https://www.britannica.com/topic/Orsini-family'],
    es: {
      resumen: 'Familia baronal romana, rival de los Colonna, que dio tres papas, numerosos cardenales y condotieros y se emparentó con los Médici y los Farnesio.',
      origen: 'Los Orsini descendían de los Bobone, una familia romana del siglo XII. Matteo Rosso Orsini, senador de Roma en la década de 1240, defendió la ciudad frente al emperador Federico II y asentó el poder de la familia en el Lacio.',
      trayectoria: 'Su hijo Giovanni Gaetano fue elegido papa en 1277 como Nicolás III y favoreció abiertamente a sus parientes. Las ramas de Bracciano, Pitigliano, Gravina y Monterotondo extendieron sus feudos por los Estados Pontificios y el reino de Nápoles, y sus miembros sirvieron como condotieros a Venecia, Florencia y el papado.',
      legado: 'Clarice Orsini se casó con Lorenzo de Médici, y su hijo Juan fue el papa León X; su nuera Alfonsina, también Orsini, gobernó Florencia en nombre de su hijo Lorenzo. Girolama Orsini fue esposa de Pier Luigi Farnesio, primer duque de Parma. En 1724 Pietro Francesco Orsini fue elegido papa como Benedicto XIII.',
    },
    en: {
      summary: 'A Roman baronial family, rival of the Colonna, which produced three popes, many cardinals and condottieri and married into the Medici and the Farnese.',
      origin: 'The Orsini descended from the Bobone, a twelfth-century Roman family. Matteo Rosso Orsini, Senator of Rome in the 1240s, defended the city against Emperor Frederick II and established the family’s power in Lazio.',
      history: 'His son Giovanni Gaetano was elected pope in 1277 as Nicholas III and openly favoured his relatives. The branches of Bracciano, Pitigliano, Gravina and Monterotondo extended their fiefs across the Papal States and the Kingdom of Naples, and their members served Venice, Florence and the papacy as condottieri.',
      legacy: 'Clarice Orsini married Lorenzo de’ Medici, and their son Giovanni became Pope Leo X; their daughter-in-law Alfonsina, also an Orsini, governed Florence on behalf of her son Lorenzo. Girolama Orsini was the wife of Pier Luigi Farnese, first Duke of Parma. In 1724 Pietro Francesco Orsini was elected pope as Benedict XIII.',
    },
  },
};

export const CASAS_V615 = Object.fromEntries(Object.entries(HOUSES).map(([name, house]) => [name, {
  ...house.es, territorios: house.territorios, protagonistas: house.protagonistas, fuentes: house.fuentes,
}]));
export const CASAS_V615_EN = Object.fromEntries(Object.entries(HOUSES).map(([name, house]) => [name, {
  ...house.en, sources: house.fuentes.map(url => ({titulo: url.includes('treccani') ? 'Treccani' : 'Wikipedia', url})),
}]));
