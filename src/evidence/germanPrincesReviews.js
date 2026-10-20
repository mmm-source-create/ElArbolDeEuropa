// V5.34 · Electores, duques y landgraves del siglo XVIII que faltaban en la
// cobertura alemana, y Felipe V como soberano de los Países Bajos españoles.
const DB = gnd => `https://www.deutsche-biographie.de/pnd${gnd}.html`;
const ndb = (name, gnd, locator) => ({title: `Neue Deutsche Biographie · ${name}`, url: `${DB(gnd)}#ndbcontent`, locator});
const adb = (name, gnd, locator) => ({title: `Allgemeine Deutsche Biographie · ${name}`, url: `${DB(gnd)}#adbcontent`, locator});
const lagis = (name, id, locator) => ({title: `Hessische Biografie · ${name}`, url: `https://lagis.hessen.de/de/personen/hessische-biografie/alle-eintraege/${id}`, locator});

const SOURCES = Object.freeze({
  max3: ndb('Maximilian III. Joseph', '118579436', 'NDB 16 (1990), pp. 485–487 (Alois Schmid). Cabecera: elector de Baviera desde 1745, * 28.3.1727 Múnich, † 30.12.1777 Múnich. Genealogía: padre el emperador Carlos VII; madre María Amalia, hija del emperador José I.'),
  karlTheodor: ndb('Karl (IV.) Theodor', '118560190', 'NDB 11 (1977), pp. 252–258 (Peter Fuchs). Cabecera: elector palatino desde 1742 y de Pfalzbayern desde 1777. Biografía: la muerte de Carlos Felipe lo hace a finales de 1742 elector palatino y duque de Neoburgo y Jülich-Berg; herencia bávara de 1777/1778.'),
  max4: ndb('Maximilian I., König von Bayern', '118579428', 'NDB 16 (1990), pp. 487–490 (Eberhard Weis). Cabecera: rey de Baviera desde 1806, como elector Maximiliano IV José; * 27.5.1756 Mannheim, † 1825. Biografía: duque de Zweibrücken en 1795; en febrero de 1799 asume Pfalzbayern como elector; Baviera es reino desde el 1.1.1806.'),
  max4Adb: adb('Maximilian Josef I., König von Baiern', '118579428', 'ADB 21 (1885), pp. 31–39 (Karl Theodor von Heigel). Muerte de Carlos Teodoro el 16.2.1799 y toma inmediata del gobierno; tratado separado del 24.8.1801 que cede a Francia los territorios palatinos ya ocupados y garantiza la orilla derecha; tras la paz de Presburgo (26.12.1805) renuncia a Wurzburgo y a Berg.'),
  karlPhilipp: ndb('Karl (III.) Philipp', '118720953', 'NDB 11 (1977), pp. 250–252 (Hans Schmidt). Cabecera: elector palatino, * 4.11.1661 Neuburg, † 31.12.1742 Mannheim. Biografía: la muerte de su hermano Juan Guillermo en 1716 le da la dignidad electoral; sus tierras son el Palatinado, Neoburgo, Jülich, Berg y Ravenstein.'),
  karlAlexander: ndb('Karl Alexander', '100636209', 'NDB 11 (1977), pp. 266–267 (Bernd Wunder). Cabecera: duque de Württemberg, * 24.1.1684 Stuttgart, † 12.3.1737 Ludwigsburg. Biografía: la extinción de la línea principal de Stuttgart en 1733 le da el ducado; muere tras tres años de gobierno. Genealogía: hijos Carlos Eugenio, Luis Eugenio y Federico Eugenio.'),
  karlEugen: ndb('Karl Eugen', '118560158', 'NDB 11 (1977), pp. 267–269 (Robert Uhland). Cabecera: duque de Württemberg, * 11.2.1728 Bruselas, † 24.10.1793 Hohenheim. Genealogía: padre Carlos Alejandro; regencias de Carlos Rodolfo de Württemberg-Neuenstadt hasta el verano de 1738 y de Carlos Federico de Württemberg-Oels hasta 1744; sus hermanos le suceden en 1793 y 1795. Biografía: mayoría de edad anticipada el 4.2.1744.'),
  ludwigEugen: adb('Ludwig Eugen, regierender Herzog von Württemberg', '101076614', 'ADB 19 (1884), pp. 598–599 (Otto von Alberti). Nace el 6.1.1731, tercer hijo del duque Carlos Alejandro; sube al trono tras la muerte de su hermano el 24.10.1793 y muere el 20.5.1795.'),
  friedrichEugen: ndb('Friedrich Eugen', '117753416', 'NDB 5 (1961), p. 595 s. (Robert Uhland). Cabecera: duque de Württemberg, * 21.1.1732 Stuttgart, † 23.12.1797 Hohenheim. Genealogía: padre Carlos Alejandro; hijos, entre otros, el rey Federico I y Sofía (zarina María, casada en 1776 con Pablo I). Biografía: lugarteniente de Montbéliard desde 1786.'),
  friedrichEugenAdb: adb('Friedrich Eugen', '117753416', 'ADB 8 (1878), pp. 53–55 (P. Stälin). Tras la muerte de su hermano Luis Eugenio, en mayo de 1795, pasa a ser duque reinante.'),
  friedrichWurtt: ndb('Friedrich I., König von Württemberg', '118703218', 'NDB 5 (1961), pp. 596–598 (Robert Uhland). Cabecera: * 6.11.1754 Treptow/Rega, † 30.10.1816 Stuttgart. Genealogía: padre el duque Federico Eugenio. Biografía: accede al gobierno el 23.12.1797; elector en 1803 y rey desde el 1.1.1806.'),
  friedrichSchweden: ndb('Friedrich I., Landgraf von Hessen-Kassel, König von Schweden', '118535803', 'NDB 5 (1961), p. 507 s. (Wolf von Both). Landgrave de Hesse-Kassel a la muerte de su padre en 1730; su hermano Guillermo VIII es lugarteniente (Statthalter) de Hesse-Kassel desde 1730.'),
  wilhelm8: adb('Wilhelm VIII., Landgraf von Hessen-Kassel', '118632914', 'ADB 43 (1898), pp. 60–64 (Hugo Brunner). Nace en marzo de 1682 y muere el 1.2.1760; hijo del landgrave Carlos. En 1730 su hermano, ya landgrave, lo nombra lugarteniente y regente con poderes casi ilimitados; gobierna así 21 años, hasta que en 1751 la muerte del hermano le da el gobierno propio.'),
  friedrich2HK: ndb('Friedrich II., Landgraf von Hessen-Kassel', '130249424', 'NDB 5 (1961), pp. 508–509 (Wolf von Both). Cabecera: * 14.8.1720 Kassel, † 31.10.1785 Weißenstein. Genealogía: padre el landgrave Guillermo VIII; hijo el elector Guillermo I. Biografía: accede al gobierno en 1760.'),
  wilhelm9: adb('Wilhelm I., Kurfürst von Hessen', '118807323', 'ADB 43 (1898), pp. 64–75 (Herman von Petersdorff). Guillermo IX, landgrave (elector como Guillermo I), nace el 3.6.1743 en Kassel y muere el 27.2.1821; hijo del landgrave Federico II; asume el gobierno de todo Hesse-Kassel en octubre de 1785 y la dignidad electoral en 1803.'),
  ludwig6: lagis('Ludwig VI., Landgraf von Hessen-Darmstadt', '1343', 'Datos: * 25.1.1630 Darmstadt, † 24.4.1678 Darmstadt; padre el landgrave Jorge II. Biografía: asume el gobierno en 1661.'),
  ludwig7: lagis('Ludwig VII., Landgraf von Hessen-Darmstadt', '16116', 'Datos: * 22.6.1658 Darmstadt, † 31.8.1678 Gotha; padre el landgrave Luis VI. Biografía: la muerte de su padre lo llama al gobierno en abril de 1678; muere en agosto.'),
  ernstLudwig: ndb('Ernst Ludwig, Landgraf von Hessen-Darmstadt', '100455840', 'NDB 4 (1959), p. 612 s. (Friedrich Knöpp). Cabecera: * 15.12.1667 Gotha, † 12.9.1739 Jägersburg. Genealogía: padre Luis VI, que sucede en 1661; hermanastro Luis VII, que sucede en 1678; hijo Luis VIII, que sucede en 1739. Biografía: sucede a Luis VII, que solo gobernó cuatro meses, bajo la regencia de su madre hasta el 6.2.1688.'),
  ludwig8: lagis('Ludwig VIII., Landgraf von Hessen-Darmstadt', '1344', 'Datos: * 5.4.1691 Darmstadt, † 17.10.1768 Darmstadt; padre el landgrave Ernesto Luis. Trayectoria: le sucede en 1739 como príncipe reinante.'),
  ludwig9: ndb('Ludwig IX., Landgraf von Hessen-Darmstadt', '102119686', 'NDB 15 (1987), pp. 392–394 (Jürgen Rainer Wolf). Cabecera: * 15.12.1719 Darmstadt, † 6.4.1790 Pirmasens. Genealogía: padre Luis VIII, que sucede en 1739; hijo el gran duque Luis I. Biografía: asume el gobierno a la muerte de Luis VIII, el 17.10.1768.'),
  ludwig10: ndb('Ludwig I., Großherzog von Hessen und bei Rhein', '118729446', 'NDB 15 (1987), p. 395 s. (Eckhart G. Franz). Cabecera: gran duque desde 1806, antes, desde 1790, Luis X landgrave de Hesse-Darmstadt; * 14.6.1753 Prenzlau, † 6.4.1830 Darmstadt. Genealogía: padre Luis IX. Biografía: título granducal el 13.8.1806.'),
  friedrichWilhelmMeck: adb('Friedrich Wilhelm, Herzog von Mecklenburg-Schwerin', '102111898', 'ADB 7 (1878), pp. 557–558 (Fromm). Nace el 28.3.1675; sucede en Schwerin a su tío Cristián Luis I el 21.6.1692; el compromiso de Hamburgo de 1701 deja Strelitz a Adolfo Federico II; muere en Maguncia el 31.7.1713.'),
  karlLeopold: ndb('Karl Leopold, Herzog von Mecklenburg-Schwerin', '101509758', 'NDB 11 (1977), pp. 239–240 (Hildegard Thierfelder). Cabecera: * 26.11.1678 Grabow, † 28.11.1747 Dömitz. Genealogía: padre Federico de Mecklemburgo-Schwerin (Grabow); hermanos Federico Guillermo y Cristián Luis II. Biografía: suspendido del gobierno en 1728; su hermano Cristián Luis II es nombrado comisario imperial.'),
  christianLudwig2: ndb('Christian Ludwig II., Herzog von Mecklenburg-Schwerin', '102111847', 'NDB 3 (1957), p. 228 s. (Heinz Maybaum). Cabecera: * 1683 Grabow, † 30.5.1756. Genealogía: padre Federico de Mecklemburgo-Schwerin (1638–1688); hijo Federico el Piadoso. Biografía: administrador del país en 1728 y comisario imperial en 1733 en lugar de su hermano suspendido; le sucede a su muerte en 1747.'),
  friedrichMeck: adb('Friedrich, Herzog von Mecklenburg-Schwerin', '100619258', 'ADB 7 (1878), p. 558 (Fromm). Nace el 9.11.1717; sucede a su padre Cristián Luis II el 30.5.1756; muere sin hijos el 24.4.1785.'),
  friedrichFranz: adb('Friedrich Franz I., Großherzog von Mecklenburg-Schwerin', '101509766', 'ADB 7 (1878), pp. 558–560 (Fromm). Nace el 10.12.1756; sucede a su tío el duque Federico el 24.4.1785; gran duque desde el 17.6.1815; muere el 1.2.1837.'),
  karlFriedrich: ndb('Karl Friedrich, Markgraf von Baden', '118560166', 'NDB 11 (1977), pp. 221–223 (Klaus Gerteis). Cabecera: margrave, elector desde 1803 y gran duque desde 1806; * 22.11.1728 Karlsruhe, † 10.6.1811 Karlsruhe. Genealogía: nieto del margrave Carlos III Guillermo de Baden-Durlach. Biografía: gobierno desde 1746, con administración tutelar desde 1738; herencia de Baden-Baden en 1771.'),
  peter3: ndb('Peter III.', '118740180', 'NDB 20 (2001), p. 226 s. (Harm Klueting). Carlos Pedro Ulrico, duque de Holstein-Gottorp y heredero de su parte de Holstein; tutela de su tío Adolfo Federico; tras su muerte, su esposa, la emperatriz Catalina II, asume la parte ducal y en 1773, por el tratado de Tsárskoye Seló, la cambia por Oldemburgo y Delmenhorst.'),
  peter3Adb: adb('Peter, Herzog von Holstein-Gottorp', '118740180', 'ADB 25 (1887), pp. 469–473 (Ferdinand von Krogh). Su padre, el duque Carlos Federico, muere en junio de 1739 y el hijo, de once años, le sucede como duque de Gottorp bajo tutela; gobierna la parte gottorpiana de Holstein desde San Petersburgo.'),
  saldern: {title: 'Dansk Biografisk Leksikon · Caspar von Saldern', url: 'https://biografiskleksikon.lex.dk/Caspar_von_Saldern', locator: 'Negociación del canje (mageskifte) de la parte gottorpiana de Holstein, que Catalina II aplaza hasta la mayoría de edad del gran duque Pablo; la entrega se hace en el castillo de Kiel el 16.11.1773, con Saldern como representante de Pablo.'},
  mageskiftet: {title: 'Lex · Caspar von Saldern', url: 'https://lex.dk/Caspar_von_Saldern', locator: 'Por el canje de 1773 el rey danés pasa a ser duque de todo Holstein y cede Oldemburgo-Delmenhorst a la casa gottorpiana.'},
  maxEmanuel: ndb('Maximilian II. Emanuel', '11857941X', 'NDB 16 (1990), pp. 480–485 (Ludwig Hüttl). Gobernador general de los Países Bajos españoles desde 1691; reconoce a Felipe V como heredero y en febrero de 1701 abre las plazas a las tropas francesas; tras Ramillies (23.5.1706) la mayor parte de los Países Bajos y Bruselas pasan a los aliados; en junio de 1711 Felipe V lo nombra soberano de los Países Bajos españoles, donde solo retiene Namur, Luxemburgo, Charleroi y Nieuport.'),
});

const REVIEWED_AT = '2026-10-20';
const review = (keys, note, extra = {}) => ({certainty: 'documented', sources: keys.map(key => SOURCES[key]), note, reviewedAt: REVIEWED_AT, editor: 'El Árbol de Europa', ...extra});
const born = (keys, date, note) => review(keys, note, date ? {exactDate: date} : {});

const netherlands = review(['maxEmanuel'], 'Soberano de la provincia como rey de España desde la muerte de Carlos II hasta que en junio de 1711 transfiere los Países Bajos españoles a Maximiliano II Manuel; desde 1706 los aliados ocupan la mayor parte del territorio, como recogen las fases del mapa.');
const bourbonNetherlands = review(['maxEmanuel'], 'Soberano de la provincia como rey de España hasta la transferencia de junio de 1711; Namur y Luxemburgo siguen en manos borbónicas y pasan entonces a Maximiliano II Manuel.');

export const GERMAN_PRINCES_REVIEWS = Object.freeze({
  // Baviera y Palatinado
  'person:MAX3JOSEBAV:birth': born(['max3'], '1727-03-28', 'Nace en Múnich el 28 de marzo de 1727.'),
  'person:MAX3JOSEBAV:death': born(['max3'], '1777-12-30', 'Muere en Múnich el 30 de diciembre de 1777.'),
  'person:MAX3JOSEBAV:father': review(['max3'], 'Hijo del emperador Carlos VII.'),
  'person:MAX3JOSEBAV:mother': review(['max3'], 'Hijo de María Amalia, hija del emperador José I.'),
  'person:MAX3JOSEBAV:government:Baviera:1745:1777:Elector': review(['max3'], 'Elector de Baviera desde 1745 hasta su muerte en 1777.'),
  'person:CARLOS3PHILIPPAL:government:Palatinado:1716:1742:Elector': review(['karlPhilipp'], 'Elector palatino desde la muerte de su hermano en 1716 hasta la suya, el 31 de diciembre de 1742.'),
  'person:CARLOS3PHILIPPAL:government:Jülich:1716:1742:Duque': review(['karlPhilipp'], 'Jülich forma parte de las tierras que hereda en 1716.'),
  'person:CARLOS3PHILIPPAL:government:Berg:1716:1742:Duque': review(['karlPhilipp'], 'Berg forma parte de las tierras que hereda en 1716.'),
  'person:CARLOSTEODOROPAL:government:Palatinado:1742:1799:Elector': review(['karlTheodor'], 'Elector palatino desde finales de 1742 hasta su muerte en febrero de 1799.'),
  'person:CARLOSTEODOROPAL:government:Jülich:1742:1799:Duque': review(['karlTheodor'], 'Duque de Jülich-Berg desde finales de 1742.'),
  'person:CARLOSTEODOROPAL:government:Berg:1742:1799:Duque': review(['karlTheodor'], 'Duque de Jülich-Berg desde finales de 1742.'),
  'person:CARLOSTEODOROPAL:government:Baviera:1777:1799:Elector': review(['karlTheodor', 'max3'], 'Hereda Baviera por la muerte sin hijos de Maximiliano III José, el 30 de diciembre de 1777, y gobierna Pfalzbayern hasta 1799.'),
  'person:MAX4JOSEBAV:birth': born(['max4'], '1756-05-27', 'Nace en Mannheim el 27 de mayo de 1756.'),
  'person:MAX4JOSEBAV:death': review(['max4'], 'Muere en Nymphenburg en octubre de 1825.'),
  'person:MAX4JOSEBAV:government:Baviera:1799:1806:Elector': review(['max4', 'max4Adb'], 'Elector de Pfalzbayern desde la muerte de Carlos Teodoro (16 de febrero de 1799); rey desde el 1 de enero de 1806.'),
  'person:MAX4JOSEBAV:government:Palatinado:1799:1803:Elector': review(['max4Adb'], 'Elector palatino desde 1799; en 1801 cede a Francia los territorios de la orilla izquierda y conserva la orilla derecha hasta la reordenación de 1803.'),
  'person:MAX4JOSEBAV:government:Berg:1799:1806:Duque': review(['max4Adb'], 'Duque de Berg desde 1799; renuncia a Berg en el reparto que sigue a la paz de Presburgo.'),

  // Württemberg
  'person:KARLALEXWURTT:birth': born(['karlAlexander'], '1684-01-24', 'Nace en Stuttgart el 24 de enero de 1684.'),
  'person:KARLALEXWURTT:death': born(['karlAlexander'], '1737-03-12', 'Muere en Ludwigsburg el 12 de marzo de 1737.'),
  'person:KARLALEXWURTT:government:Württemberg:1733:1737:Duque': review(['karlAlexander'], 'Duque desde la extinción de la línea principal en 1733 hasta su muerte en 1737.'),
  'person:KARLEUGENWURTT:birth': born(['karlEugen'], '1728-02-11', 'Nace en Bruselas el 11 de febrero de 1728.'),
  'person:KARLEUGENWURTT:death': born(['karlEugen'], '1793-10-24', 'Muere en Hohenheim el 24 de octubre de 1793.'),
  'person:KARLEUGENWURTT:father': review(['karlEugen'], 'Hijo del duque Carlos Alejandro.'),
  'person:KARLEUGENWURTT:government:Württemberg:1737:1793:Duque': review(['karlEugen'], 'Duque desde 1737, bajo regencia hasta su emancipación en 1744, y hasta su muerte en 1793.'),
  'person:LUDWIGEUGENWURTT:birth': born(['ludwigEugen'], '1731-01-06', 'Nace el 6 de enero de 1731; la ficha de autoridad recoge también 1728 como variante.'),
  'person:LUDWIGEUGENWURTT:death': born(['ludwigEugen'], '1795-05-20', 'Muere el 20 de mayo de 1795.'),
  'person:LUDWIGEUGENWURTT:father': review(['ludwigEugen', 'karlAlexander'], 'Tercer hijo del duque Carlos Alejandro.'),
  'person:LUDWIGEUGENWURTT:government:Württemberg:1793:1795:Duque': review(['ludwigEugen'], 'Duque desde la muerte de su hermano en octubre de 1793 hasta la suya en mayo de 1795.'),
  'person:FREDEUGENWURTT:birth': born(['friedrichEugen'], '1732-01-21', 'Nace en Stuttgart el 21 de enero de 1732.'),
  'person:FREDEUGENWURTT:death': born(['friedrichEugen'], '1797-12-23', 'Muere en Hohenheim el 23 de diciembre de 1797.'),
  'person:FREDEUGENWURTT:father': review(['friedrichEugen'], 'Hijo del duque Carlos Alejandro.'),
  'person:FREDEUGENWURTT:government:Württemberg:1795:1797:Duque': review(['friedrichEugen', 'friedrichEugenAdb'], 'Duque desde mayo de 1795 hasta su muerte en diciembre de 1797.'),
  'person:FRED2WURTT:birth': born(['friedrichWurtt'], '1754-11-06', 'Nace en Treptow el 6 de noviembre de 1754.'),
  'person:FRED2WURTT:death': born(['friedrichWurtt'], '1816-10-30', 'Muere en Stuttgart el 30 de octubre de 1816.'),
  'person:FRED2WURTT:father': review(['friedrichWurtt'], 'Hijo del duque Federico Eugenio.'),
  'person:FRED2WURTT:government:Württemberg:1797:1803:Duque': review(['friedrichWurtt'], 'Duque desde el 23 de diciembre de 1797; elector desde 1803.'),
  'person:SOPHIADOROTHEAWURTT:father': review(['friedrichEugen'], 'Sofía, después zarina María Fiódorovna, figura entre los hijos de Federico Eugenio, casada en 1776 con Pablo I.'),

  // Hesse-Kassel
  'person:FEDERICO1SUE:government:Hesse-Kassel:1730:1751:Landgrave': review(['friedrichSchweden', 'wilhelm8'], 'Landgrave desde la muerte de su padre en 1730 hasta la suya en 1751; gobierna por medio de su hermano Guillermo como lugarteniente.'),
  'person:WILHELM8HESSEKASS:birth': review(['wilhelm8'], 'Nace en marzo de 1682 (12 de marzo en estilo antiguo, 22 en estilo nuevo).'),
  'person:WILHELM8HESSEKASS:death': born(['wilhelm8'], '1760-02-01', 'Muere el 1 de febrero de 1760.'),
  'person:WILHELM8HESSEKASS:father': review(['wilhelm8'], 'Sexto hijo del landgrave Carlos.'),
  'person:WILHELM8HESSEKASS:government:Hesse-Kassel:1730:1751:Regente': review(['wilhelm8', 'friedrichSchweden'], 'Lugarteniente y regente de Hesse-Kassel en nombre de su hermano desde 1730 hasta 1751.'),
  'person:WILHELM8HESSEKASS:government:Hesse-Kassel:1751:1760:Landgrave': review(['wilhelm8'], 'Landgrave desde la muerte de su hermano en 1751 hasta la suya en 1760.'),
  'person:FRED2HESSEKASS:birth': born(['friedrich2HK'], '1720-08-14', 'Nace en Kassel el 14 de agosto de 1720.'),
  'person:FRED2HESSEKASS:death': born(['friedrich2HK'], '1785-10-31', 'Muere en Weißenstein el 31 de octubre de 1785.'),
  'person:FRED2HESSEKASS:father': review(['friedrich2HK'], 'Hijo del landgrave Guillermo VIII.'),
  'person:FRED2HESSEKASS:government:Hesse-Kassel:1760:1785:Landgrave': review(['friedrich2HK'], 'Landgrave desde 1760 hasta su muerte en 1785.'),
  'person:WILHELM9HESSEKASS:birth': born(['wilhelm9'], '1743-06-03', 'Nace en Kassel el 3 de junio de 1743.'),
  'person:WILHELM9HESSEKASS:death': born(['wilhelm9'], '1821-02-27', 'Muere en Kassel el 27 de febrero de 1821.'),
  'person:WILHELM9HESSEKASS:father': review(['wilhelm9', 'friedrich2HK'], 'Hijo del landgrave Federico II.'),
  'person:WILHELM9HESSEKASS:government:Hesse-Kassel:1785:1803:Landgrave': review(['wilhelm9'], 'Landgrave desde octubre de 1785; elector desde 1803.'),

  // Hesse-Darmstadt
  'person:LUDWIG6HESSEDARM:birth': born(['ludwig6'], '1630-01-25', 'Nace en Darmstadt el 25 de enero de 1630.'),
  'person:LUDWIG6HESSEDARM:death': born(['ludwig6'], '1678-04-24', 'Muere en Darmstadt el 24 de abril de 1678.'),
  'person:LUDWIG6HESSEDARM:father': review(['ludwig6'], 'Hijo del landgrave Jorge II.'),
  'person:LUDWIG6HESSEDARM:government:Hesse-Darmstadt:1661:1678:Landgrave': review(['ludwig6', 'ernstLudwig'], 'Landgrave desde 1661 hasta su muerte en abril de 1678.'),
  'person:LUDWIG7HESSEDARM:birth': born(['ludwig7'], '1658-06-22', 'Nace en Darmstadt el 22 de junio de 1658.'),
  'person:LUDWIG7HESSEDARM:death': born(['ludwig7'], '1678-08-31', 'Muere en Gotha el 31 de agosto de 1678.'),
  'person:LUDWIG7HESSEDARM:father': review(['ludwig7'], 'Único hijo del primer matrimonio de Luis VI.'),
  'person:LUDWIG7HESSEDARM:government:Hesse-Darmstadt:1678:1678:Landgrave': review(['ludwig7', 'ernstLudwig'], 'Landgrave entre abril y agosto de 1678.'),
  'person:ERNSTLUDWIGHESSEDARM:birth': born(['ernstLudwig'], '1667-12-15', 'Nace en Gotha el 15 de diciembre de 1667.'),
  'person:ERNSTLUDWIGHESSEDARM:death': born(['ernstLudwig'], '1739-09-12', 'Muere en Jägersburg el 12 de septiembre de 1739.'),
  'person:ERNSTLUDWIGHESSEDARM:father': review(['ernstLudwig'], 'Hijo de Luis VI y de su segunda esposa, Isabel Dorotea de Sajonia-Gotha.'),
  'person:ERNSTLUDWIGHESSEDARM:government:Hesse-Darmstadt:1678:1739:Landgrave': review(['ernstLudwig'], 'Landgrave desde 1678, bajo regencia materna hasta 1688, hasta su muerte en 1739.'),
  'person:LUDWIG8HESSEDARM:birth': born(['ludwig8'], '1691-04-05', 'Nace en Darmstadt el 5 de abril de 1691.'),
  'person:LUDWIG8HESSEDARM:death': born(['ludwig8'], '1768-10-17', 'Muere en Darmstadt el 17 de octubre de 1768.'),
  'person:LUDWIG8HESSEDARM:father': review(['ludwig8', 'ernstLudwig'], 'Hijo del landgrave Ernesto Luis.'),
  'person:LUDWIG8HESSEDARM:government:Hesse-Darmstadt:1739:1768:Landgrave': review(['ludwig8', 'ludwig9'], 'Landgrave desde 1739 hasta su muerte el 17 de octubre de 1768.'),
  'person:LUDWIG9HESSEDARM:birth': born(['ludwig9'], '1719-12-15', 'Nace en Darmstadt el 15 de diciembre de 1719.'),
  'person:LUDWIG9HESSEDARM:death': born(['ludwig9'], '1790-04-06', 'Muere en Pirmasens el 6 de abril de 1790.'),
  'person:LUDWIG9HESSEDARM:father': review(['ludwig9'], 'Hijo del landgrave Luis VIII.'),
  'person:LUDWIG9HESSEDARM:government:Hesse-Darmstadt:1768:1790:Landgrave': review(['ludwig9'], 'Landgrave desde 1768 hasta su muerte en 1790.'),
  'person:LUDWIG10HESSEDARM:birth': born(['ludwig10'], '1753-06-14', 'Nace en Prenzlau el 14 de junio de 1753.'),
  'person:LUDWIG10HESSEDARM:death': born(['ludwig10'], '1830-04-06', 'Muere en Darmstadt el 6 de abril de 1830.'),
  'person:LUDWIG10HESSEDARM:father': review(['ludwig10'], 'Hijo del landgrave Luis IX.'),
  'person:LUDWIG10HESSEDARM:government:Hesse-Darmstadt:1790:1806:Landgrave': review(['ludwig10'], 'Landgrave como Luis X desde 1790; gran duque desde agosto de 1806.'),

  // Mecklemburgo-Schwerin
  'person:FREDWILMECKSCHW:birth': born(['friedrichWilhelmMeck'], '1675-03-28', 'Nace el 28 de marzo de 1675.'),
  'person:FREDWILMECKSCHW:death': born(['friedrichWilhelmMeck'], '1713-07-31', 'Muere en Maguncia el 31 de julio de 1713.'),
  'person:FREDWILMECKSCHW:father': review(['karlLeopold'], 'Hermano de Carlos Leopoldo y de Cristián Luis II, hijos de Federico de Mecklemburgo-Grabow.'),
  'person:FREDWILMECKSCHW:government:Mecklemburgo:1692:1713:Duque': review(['friedrichWilhelmMeck'], 'Duque en Schwerin desde el 21 de junio de 1692 hasta su muerte en 1713.'),
  'person:CHARLESLEOPOLDMECK:government:Mecklemburgo:1729:1747:Duque': review(['karlLeopold', 'christianLudwig2'], 'Suspendido del gobierno en 1728, conserva el título hasta su muerte en 1747 mientras su hermano administra el país.'),
  'person:CHRISTIANLUDWIG2MECK:birth': review(['christianLudwig2'], 'Nace en Grabow en mayo de 1683; las fuentes difieren en el día.'),
  'person:CHRISTIANLUDWIG2MECK:death': born(['christianLudwig2'], '1756-05-30', 'Muere el 30 de mayo de 1756.'),
  'person:CHRISTIANLUDWIG2MECK:father': review(['christianLudwig2'], 'Hijo del duque Federico (1638–1688), de la rama de Grabow.'),
  'person:CHRISTIANLUDWIG2MECK:government:Mecklemburgo:1728:1747:Regente': review(['christianLudwig2', 'karlLeopold'], 'Administrador desde 1728 y comisario imperial desde 1733 durante la suspensión de su hermano.'),
  'person:CHRISTIANLUDWIG2MECK:government:Mecklemburgo:1747:1756:Duque': review(['christianLudwig2'], 'Duque desde la muerte de su hermano en 1747 hasta la suya en 1756.'),
  'person:FRED2MECKSCHW:birth': born(['friedrichMeck'], '1717-11-09', 'Nace el 9 de noviembre de 1717.'),
  'person:FRED2MECKSCHW:death': born(['friedrichMeck'], '1785-04-24', 'Muere el 24 de abril de 1785.'),
  'person:FRED2MECKSCHW:father': review(['friedrichMeck', 'christianLudwig2'], 'Hijo del duque Cristián Luis II.'),
  'person:FRED2MECKSCHW:government:Mecklemburgo:1756:1785:Duque': review(['friedrichMeck'], 'Duque desde el 30 de mayo de 1756 hasta su muerte el 24 de abril de 1785.'),
  'person:FREDFRANZ1MECK:birth': born(['friedrichFranz'], '1756-12-10', 'Nace el 10 de diciembre de 1756.'),
  'person:FREDFRANZ1MECK:death': born(['friedrichFranz'], '1837-02-01', 'Muere el 1 de febrero de 1837.'),
  'person:FREDFRANZ1MECK:government:Mecklemburgo:1785:1815:Duque': review(['friedrichFranz'], 'Duque desde el 24 de abril de 1785; gran duque desde el 17 de junio de 1815.'),

  // Baden
  'person:KARLFRIEDRICHBADEN:birth': born(['karlFriedrich'], '1728-11-22', 'Nace en Karlsruhe el 22 de noviembre de 1728.'),
  'person:KARLFRIEDRICHBADEN:death': born(['karlFriedrich'], '1811-06-10', 'Muere en Karlsruhe el 10 de junio de 1811.'),
  'person:KARLFRIEDRICHBADEN:government:Baden:1738:1803:Margrave': review(['karlFriedrich'], 'Margrave desde 1738, con administración tutelar hasta 1746; une Baden-Baden en 1771 y es elector desde 1803.'),

  // Holstein
  'person:PETER3RUS:government:Holstein:1739:1762:Duque': review(['peter3', 'peter3Adb'], 'Duque de la parte gottorpiana de Holstein desde junio de 1739 hasta su muerte en 1762.'),
  'person:PAUL1RUS:government:Holstein:1762:1773:Duque': review(['peter3', 'saldern'], 'Heredero de la parte ducal de Holstein, administrada por Catalina II, hasta su entrega a Dinamarca en Kiel el 16 de noviembre de 1773.'),
  'person:CHRISTIAN7DEN:government:Holstein:1773:1808:Duque': review(['mageskiftet', 'saldern'], 'Duque de todo Holstein desde el canje de 1773 hasta su muerte en 1808.'),

  // Países Bajos españoles
  'person:FEL5ESP:government:Brabante:1700:1711:Duque': netherlands,
  'person:FEL5ESP:government:Limburgo:1700:1711:Duque': netherlands,
  'person:FEL5ESP:government:Güeldres:1700:1711:Duque': netherlands,
  'person:FEL5ESP:government:Flandes:1700:1711:Conde': netherlands,
  'person:FEL5ESP:government:Henao:1700:1711:Conde': netherlands,
  'person:FEL5ESP:government:Señorío de Malinas:1700:1711:Señor': netherlands,
  'person:FEL5ESP:government:Luxemburgo:1700:1711:Duque': bourbonNetherlands,
  'person:FEL5ESP:government:Namur:1700:1711:Conde': bourbonNetherlands,
});
