# Fronteras y continuidad · 8 de octubre de 2026

Esta entrega rehace **9 series** y añade **27 capas fechadas**. Una capa puede ser un episodio de ocupación o un gobierno rival: no son 27 Estados nuevos. El mapa individual y el laboratorio utilizan las mismas selecciones y exclusiones temporales. El HTML de referencia v7 se lee como material de comparación; no se ejecuta ni se importan automáticamente sus asignaciones.

## Cambios verificables

| Área | Revisión |
|---|---|
| Bulgaria medieval | Moesia y relieves balcánicos desde 1200; Varna desde 1201; expansión meridional de 1230 y contracción posterior. Vidin, Tarnovo y el despotado costero se separan con sus fechas. Las zonas de vasallaje de Epiro/Tesalónica y las reivindicaciones al norte del Danubio no se convierten en dominio directo. |
| Sirmia | Mačva, Belgrado, Usora/Soli y señoríos conservados por Dragutin. Se comprueban los contornos al sur del Sava; no se incorpora toda la Sirmia moderna por el nombre. |
| Hungría | Superficie medieval y relieves completos en el ámbito revisado; Croacia y Eslavonia tienen jurisdicción propia. Los gobiernos oriental y occidental conservan la identidad de Hungría, con una disputa identificable. Se separan Buda (1541), Temes (1552), Gyula (1566/1695), Várad (1660/1692) y el Banato imperial de 1716–1778. |
| Francia | Lyon, Bresse/Bugey/Gex, Foix, Bearne, el contorno comtois y Avignon siguen cortes independientes. Brétigny retira también Poitou y Rouergue. No se importan los estados suizos/alemanes coloreados como franceses en el ejemplo. |
| Feudos franceses | Aquitania, Anjou, Maine, Touraine, Champaña, Foix, Bearne y Armagnac tienen selecciones propias. Un feudo y la soberanía superior de la Corona pueden coexistir: sus solapamientos no certifican una independencia moderna. |
| Inglaterra y Gran Bretaña | Aquitania tiene mandatos ducales/principesco explícitos, incluido el Príncipe Negro; Normandía, Calais, París y Maine tienen ámbitos y episodios separados. Gibraltar distingue ocupación de cesión; Menorca cambia entre autoridades británica, francesa y española. |
| Hannover | El electorado mantiene un mandato separado del británico; Celle aparece desde 1705 y Bremen-Verden desde 1715. Se excluyen Bremen ciudad libre, Brunswick-Wolfenbüttel, Hildesheim y Osnabrück. |

Se añaden **Ivaylo e Iván Asen III**, sin parentescos inventados, con gobiernos rivales y citas individuales. Se completan los mandatos aquitanos de los reyes ingleses y los gobiernos imperiales del Banato. La provincia sigue siendo una administración territorial: sus soberanos conservan los títulos de emperador o archiduquesa sin convertirla en un reino.

Las selecciones recorren **superficies** del SVG, incluidos los grandes contornos de montañas; no colocan puntos sobre una lista de ciudades. Los topónimos ambiguos se contrastan visualmente: Crasna permanece al oeste de Transilvania, Koželj se localiza en Serbia, y el ámbito de Hannover se comprueba frente a los Estados vecinos.

## Límites y siguiente revisión

- La cobertura sigue siendo **regional y aproximada**. Los cortes anuales no reconstruyen todas las guarniciones, recapturas o cambios dentro de un mismo año. Nógrád y Esztergom necesitan afinar sus recuperaciones temporales; la insurrección de Rákóczi también necesita ámbitos propios.
- El Banato cambia de administración en 1778–1779. El mapa adopta 1779 como inicio del relleno húngaro, conservando la administración imperial hasta 1778.
- La tributación rural alrededor de Gyula antes de 1566 no equivale a la conquista de la fortaleza. El ámbito de Békés se representa de forma regional, sin dividir cada jurisdicción fiscal.
- Dobruja necesita precisar la transición de fines del siglo XIV y añadir mandatos personales de sus déspotas. La sucesión búlgara aún requiere Smilets y Chaka; esta entrega no inventa una cadena completa.
- Croacia medieval usa un marco interior: faltan los cambios detallados de Lika/Krbava y los dominios costeros. La pérdida regional de Sinj desde 1513 tiene discrepancias documentales con la fecha urbana de 1524, indicadas en la fuente.
- Los feudos franceses conservan instituciones y jurisdicciones superpuestas. Faltan confiscaciones y recuperaciones menores de Aquitania/Armagnac, el apanage de Anjou de 1576–1584 y un deslinde más fino del Comtat. La celda de Gibraltar excede el territorio cedido: necesita subdivisión geométrica.
- El [inventario de entidades sin relleno](atlas-unrepresented-inventory.md) cuenta mandatos personales ausentes; no cuenta todos los huecos físicos ni certifica que las entidades representadas tengan frontera completa.

La siguiente prioridad es completar **Dobruja y la sucesión búlgara**, las **recuperaciones de la frontera húngara** y los dominios costeros croatas. Después: **Meißen, Turingia, Suabia y Nassau**, antes de los apanages menores. Mantener fechas, fuentes y exclusiones precede a eliminar huecos visualmente.

## Reproducción y validación

```sh
python3 prototypes/euv-locations/frontier-source.py
node prototypes/euv-locations/merge-map-expansions.mjs
# Entorno geométrico existente con Shapely y svgpathtools
python prototypes/euv-locations/build-regional-extent-cells.py
npm test
npm run build
npm run audit:security
```

El generador utiliza `frontier-anchors.json` (la serie húngara anterior, conservada como entrada inmutable), `continuity-review.json` y la correspondencia geométrica vigente. Produce `frontier-review.json`; la fusión valida IDs, fuentes y fechas. La regeneración es idempotente. El inventario geométrico mide las 2387 celdas usadas por ambas revisiones y la auditoría comprueba todos los cortes añadidos. `tests/frontier-review.test.mjs` comprueba conquistas, cesiones, exclusiones de vecinos, rivalidad, mandatos personales y citas.

## Fuentes y pasajes

Cada capa y cada corrección mantienen sus fuentes en el inspector. Las referencias siguientes respaldan acontecimientos o ámbitos regionales; no pretenden certificar todas las líneas del SVG.

- [C. A. Macartney · Hungary: A Short History, Biblioteca Nacional de Hungría](https://mek.oszk.hu/02000/02086/02086.htm): Caps.1–5: reino medieval y partición; Karlowitz conserva el Banato otomano. Diferenciar el reino de Croacia y la administración separada del Banato.
- [Géza Dávid · TDV · Budin](https://islamansiklopedisi.org.tr/budin): Gobiernos rivales de 1526–1529; eyalato desde 1541; registro territorial de los sancados, conquista habsbúrgica de 1686. La incursión de 1526 no es anexión permanente de toda Hungría.
- [Academia de Ciencias de Hungría · History of Transylvania](https://mek.oszk.hu/03400/03407/html/): Vol.II: principado y Partium, frontera cambiante, Várad perdida en 1660; ocupación de 1551–1556 y dominación imperial posterior.
- [Géza Dávid · TDV · Tımışvar](https://islamansiklopedisi.org.tr/timisvar): Eyalato 1552–1716. El Banato no se cede con el resto de Hungría en 1699; su reincorporación administrativa a Hungría (1778–1779) se contrasta con Macartney.
- [Municipio de Gyula · Historia](https://gyula.hu/gyula/elet-gyulan/varosinformacio/varostortenet/): Ciudad y castillo de Fernando en la década de 1550; conquista otomana de 1566 y recuperación de 1695. La tributación rural anterior no implica la caída del castillo.
- [Mihai Maxim · TDV · Varad](https://islamansiklopedisi.org.tr/varad): Eyalato de Várad desde 1660; conquista imperial y fin de la administración otomana regional en 1692.
- [The National Archives · French lands of the English kings](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/): Normandía, Ponthieu, Calais y Aquitania; registros administrativos separados. Calais 1347–1558; último dominio continental desde 1453.
- [BnF · Longnon: royaume de France, 1429–1430](https://gallica.bnf.fr/ark:/12148/btv1b8446192m): Comparación visual de las superficies francesas, inglesas y borgoñonas durante la misión de Juana de Arco; no son las fronteras de Francia moderna.
- [BnF · Longnon: royaume de France, 1270](https://gallica.bnf.fr/ark:/12148/btv1b55010936b): Mapa histórico: dominio real, apanages y feudos diferenciados. El Delfinado queda fuera del reino francés.
- [BnF · Franchises du Dauphiné, jurées par Charles en 1349](https://ccfr.bnf.fr/portailccfr/ark:/16871/004D13A15103): Fol. 72, con cartas y tratados de 1349: transmisión del Delfinado y conservación de sus franquicias. El relieve regional aproxima el territorio, sin incluir Saboya ni Barcelonnette.
- [English Heritage · The Sieges of Dover](https://www.english-heritage.org.uk/sieges-of-dover): Pérdida de Normandía y Anjou por Juan en 1204; separar la identidad de los feudos del reino de Inglaterra.
- [Château de Versailles · Versailles et l’Espagne](https://www.chateauversailles.fr/decouvrir/histoire/les-grandes-dates/versailles-espagne): Conquista de Franco Condado en 1674 y cesión en 1678; nuevas plazas de Flandes. Distinguir conquista efectiva y ratificación.
- [Archives diplomatiques · Limites / Espagne](https://archivesdiplomatiques.diplomatie.gouv.fr/ark:/14366/x5lcmwfsd78p): Tratado de los Pirineos, 1659, y delimitación posterior. Puigcerdà y los relieves meridionales de Cerdaña no se ceden con el Rosellón.
- [Archives départementales de Meurthe-et-Moselle · Lettres de noblesse de Stanislas, 1766](https://archives.meurthe-et-moselle.fr/content/lettres-de-noblesse-donn%C3%A9es-par-le-roi-stanislas-le-13-janvier-1766): Incorporación de Lorena y Bar a Francia tras la muerte de Estanislao en 1766, no desde el inicio de su gobierno.
- [Musée de la Corse · La Citadelle](https://www.museudiacorsica.corsica/fr/la-citadelle/): Cesión genovesa de derechos en 1768; conquista francesa de Corte tras Ponte Novu en mayo de 1769. Reino anglocorso de 1794–1796: no soberanía francesa insular continua.
- [National Library of Scotland · Minto, private letters and dispatches, 1794–1796](https://manuscripts.nls.uk/repositories/2/archival_objects/51542): Correspondencia original del virrey de Córcega con el gobierno británico, 1794–1796. La escala anual reúne autoridades durante la recuperación francesa de 1796.
- [The Gascon Rolls Project · edición de los registros originales C61](https://www.gasconrolls.org/en/edition/calendars/C61_86/chronological.html): Introducción y registros 1373–1374: pérdida de Poitou/Saintonge, dimisión de Eduardo de Woodstock en octubre de 1372 y contracción de Aquitania.
- [Departamento de Ain · Chronologie](https://patrimoines.ain.fr/chronologie/liste/l-ain-en-dates-2/n%3A134): Tratado de Lyon de 1601: Bresse, Bugey, Valromey y Gex; Saluces permanece fuera de Francia.
- [Archives municipales d’Avignon · Réunion à la France](https://www.expositions-archives.avignon.fr/du-mont-de-pi%C3%A9t%C3%A9-au-cr%C3%A9dit-municipal): Decreto de 14 de septiembre de 1791: Avignon y Comtat Venaissin.
- [Académie de Lyon · Charte sapaudine, contexte historique](https://daac.ac-lyon.fr/docs/docs_charte_sapaudine/CONTEXTE%20HISTORIQUE%202.pdf): 10 de abril de 1312: cesión del poder político y judicial del arzobispo al rey; no anticipar Lyon antes de esta fecha.
- [Larousse · Comté de Foix](https://www.larousse.fr/encyclopedie/autre-region/Foix/119785): Reunión del condado a la Corona por Enrique IV en 1607, distinta de la unión de Bearne de 1620.
- [Archives communales de Pau · Série EE, Occitanica](https://www.occitanica.eu/items/show/3279): Instituciones bearnesas y reunión a Francia en 1620; se separa el vizcondado de la Bigorra y de la Baja Navarra.
- [Treccani · Armagnac](https://www.treccani.it/enciclopedia/armagnac_(Enciclopedia-Italiana)/): Condado gascón, extinción de la casa en 1497 y reunión de los dominios a Francia en 1607; el título no implica todas las tierras del partido político armagnac.
- [Universidad de Atenas · G. Arvaniti, relaciones bizantino-búlgaras (2018)](https://pergamos.lib.uoa.gr/uoa/dl/object/2819196/file.pdf): pp.27–45 y mapa p.106 (PDF p.111): expansión y contracción bajo los Asen; separar las áreas rayadas de vasallaje. No se adopta sin reserva su gran ámbito al norte del Danubio.
- [Museo Histórico de Veliko Tarnovo · Iglesia de los Cuarenta Mártires](https://tickets.museumvt.com/en/sites-tickets/holy-forty-martyr-s-church-and-the-great-laurel-monastic-complex?ulo=true): Inscripción original de Iván Asen II y victoria de 1230; Kaloyan muerto en 1207. Acredita autoridad y acontecimientos, no todos los contornos.
- [Museo de Knjaževac · Vidin y la región del Timok](https://pojmovnik.muzejknjazevac.org.rs/pojam/vidin/): Región entre Iskar y Timok; conquista otomana de Vidin en 1396. La celda de Koželj se verifica en Serbia, no por mera coincidencia del nombre.
- [Kemal Karpat · TDV · Dobruca](https://islamansiklopedisi.org.tr/dobruca): Principado de Balik, Dobrotitsa e Ivanko; expansión de 1359 y transición disputada de fines del XIV. No todo el territorio moderno ni una soberanía búlgara uniforme.
- [Municipio de Vidin · Historia de Vidin](https://old.vidin.bg/pages/Istoriq-na-Vidin-140): Estado de Iván Sratsimir y caída de 1396; no extender Vidin sobre toda Bulgaria.
- [Instituto Lexicográfico Miroslav Krleža · Ivan Asen III](https://www.enciklopedija.hr/clanak/ivan-asen-iii): Reinado rival 1279–1280.
- [Instituto Lexicográfico Miroslav Krleža · Stefan Dragutin](https://www.enciklopedija.hr/clanak/dragutin-stefan): 1284: Mačva con Belgrado y Usora; señoríos serbios retenidos desde 1282. No identifica este reino con toda la Sirmia geográfica al norte del Sava.
- [Instituto Lexicográfico Miroslav Krleža · Knin](https://www.enciklopedija.hr/clanak/knin): Centro del reino croata; conquista otomana en mayo de 1522; no todas las ciudades de la costa pertenecen a Croacia.
- [Instituto Lexicográfico Miroslav Krleža · Slavonija](https://www.enciklopedija.hr/clanak/slavonija): Condados medievales de Zagreb y Križevci; incorporación posterior de Varaždin y Virovitica; Požega, Vukovo y Sirmia pertenecen a Hungría, no a la Eslavonia medieval. Desde 1552 la frontera otomana separa el ámbito oriental.
- [Instituto Lexicográfico Miroslav Krleža · Cetinska krajina](https://www.enciklopedija.hr/clanak/cetinska-krajina): Pérdida de la región de Sinj desde 1513; el artículo de la ciudad ofrece 1524. El corte regional es aproximado y no resuelve cada fortaleza.
- [The Gascon Rolls Project · Introducción histórica](https://www.gasconrolls.org/fr/the-project/historical-introduction/index.html): Tratados de París y Brétigny; autoridad ducal y soberanía superior francesa no equivalen a propiedad del reino inglés.
- [The National Archives · Royal Marines and Utrecht](https://blog.nationalarchives.gov.uk/happy-350th-anniversary-royal-marines/): Captura de Gibraltar en 1704; cesión a la Corona británica por Utrecht en 1713. La celda excede la ciudad y fortificaciones: aproximación regional.
- [Consorcio Militar de Menorca · Ocupación francesa](https://www.consorciomilitarmenorca.com/es/la-ocupacion-francesa-de-menorca-1756-1763/): Dominio francés 1756–1763, intercalado entre los dominios británicos. Conquista española de 1782 y nuevo dominio británico desde 1798.
- [Gobierno de Baja Sajonia · Ascenso de Hannover](https://www.niedersachsen.de/startseite/land_leute/die_geschichte/geschichte_des_landes_niedersachsen/entstehung_des_absolutismus_und_aufstieg_kurhannovers/entstehung-des-absolutismus-und-aufstieg-kurhannovers-19813.html): Unión personal de 1714, no incorporación a Gran Bretaña; Bremen-Verden adquirido en 1715, título ratificado en 1719; Bentheim prendado desde 1752.
- [Municipio de Celle · Historia](https://www.celle.de/Stadt/%C3%9Cber-Celle/Stadtgeschichte/?La=1): Extinción de la rama de Celle y herencia en 1705; no adjudicar Lüneburg a Hannover desde 1692.
- [IRHT · Carta de Roger IV para Lézat, 1244](https://telma-chartes.irht.cnrs.fr/chartae-galliae.php/112340): Título de conde de Foix y homenaje al abad: las jurisdicciones señoriales y eclesiásticas pueden coexistir dentro de una celda; el título no acredita toda propiedad local.
- [FranceArchives · La Champagne au temps des comtes](https://francearchives.gouv.fr/fr/actualite/1166490060): Principado de Champaña y Brie: matrimonio de 1284 e integración progresiva; culminación de los derechos en 1361. No se confunde con todas las diócesis de Champagne.
