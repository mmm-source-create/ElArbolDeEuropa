# Colores, uniones y gobiernos en el mapa

Revisión sistemática de las reglas existentes, 1200–1800. No se cambian mandatos, fuentes territoriales, geometrías, fechas de conquista ni atribuciones de celdas.

## Dos preguntas distintas

- **Europa en este año:** conjuntos de poder exterior documentados. Una monarquía compuesta puede compartir color y contorno sin convertirse en un Estado unitario.
- **Mapa personal:** gobiernos de la persona, con la misma integración política que el panorama. Una monarquía compuesta comparte color y sus reinos y provincias se consultan en el inspector. Forman unidades propias Portugal en 1580–1640 y la herencia borgoñona de los Países Bajos (sin dividirla en provincias). Las uniones personales pasajeras (Otakar II, Luis I, Ladislao el Póstumo, Matías Corvino, los Jagellón de Bohemia y Hungría) y los feudos franceses de los reyes de Inglaterra conservan su color.

Una persona, dinastía, alianza o dignidad imperial no crea automáticamente una agrupación. La pertenencia exige una regla explícita, un mandato soberano efectivo y activo y una superficie compatible con ese mandato. Los gobernadores, regentes y pretendientes no aportan miembros a una unión. Las distintas ramas austríacas no se funden si tienen gobiernos diferentes.

Las fechas son anuales e inclusivas. Una ruptura dentro del año puede conservar atribuciones simultáneas; no se inventa precisión diaria. Los feudos y tributarios conservan trama y gobierno propio incluso cuando su gobernante tiene otros dominios. Ocupación, disputa y reclamación no son incorporación. El color no resuelve celdas con distintas atribuciones.

## Inventario revisado

| Regla | Panorama | Mapa personal |
| --- | --- | --- |
| Monarquía Hispánica, desde 1516 | Dominios efectivos; Portugal solo 1580–1640; provincias neerlandesas según sus gobiernos y control fechados | España: Castilla-León, Aragón, Valencia, Cataluña, Mallorca, Navarra y los reinos italianos en un color; Portugal y Borgoña-Países Bajos aparte |
| Monarquía austríaca, desde 1526 | Dominios efectivos del mismo centro de gobierno, incluidos los Países Bajos austríacos cuando corresponda | Tierras austríacas, Corona de Bohemia, Corona húngara y dominios italianos en un color; Países Bajos austríacos aparte |
| Dinamarca-Noruega, desde 1537 | Dirección monárquica común tras la reorganización de 1536–1537 | Un color |
| Monarquía danesa y ducados | Schleswig desde 1721; Holstein desde 1773, solo con gobierno efectivo documentado | Los ducados conservan color propio y estatuto distinto del reino |
| Castilla-León, desde 1230 | Corona común | Un color; los títulos siguen separados en el inspector |
| Nueva Planta | Incluida en la monarquía, según el control documentado | Queda dentro de España; las fechas de 1707, 1715 y 1716 siguen en la regla |
| Administración austro-bohemia, desde 1749 | Incluida en la monarquía austríaca | Dentro de la monarquía austríaca |
| Corona de Aragón | Miembros gobernados efectivamente | Un color para los reinos gobernados por el mismo rey |
| Corona de Bohemia, desde 1348 | Tierras de la Corona, o monarquía austríaca cuando corresponda | Un color; las dietas provinciales se explican en el inspector |
| Corona de San Esteban | Gobiernos efectivos; separación transilvana fechada | Un color; Transilvania solo hasta su separación |
| Austria Interior, 1564–1618 | Rama con dirección propia durante la partición; no comparte color exterior con Viena o Tirol | Un color propio de la rama |
| Tierras austríacas | Tierras reunidas por el mismo gobernante | Un color; las particiones con otro gobernante no se funden |
| Brandeburgo-Prusia, 1618–1700 | Conjunto exterior; Prusia mantiene la trama de feudo polaco hasta 1657 | Un color, con la misma trama de feudo |
| Monarquía prusiana, 1701–1800 | Dominios efectivos | Un color; Silesia, Cléveris y las provincias se consultan en el inspector |
| Polonia-Lituania, desde 1569 | Mancomunidad; no absorber Curlandia o Prusia ducal | Un color; Curlandia y Prusia ducal siguen siendo feudos |
| Provincias Unidas | Gobierno exterior colectivo, según las fases regionales existentes | No suprimir los gobiernos provinciales; el cargo delegado conserva su trama |
| Estados borgoñones, desde 1384 | Dominios fechados, conservando las relaciones feudales | Un color, distinto del resto de reinos del soberano |
| Países Bajos, desde 1549 | Conjunto provincial, subordinado a una agrupación exterior mayor solo donde corresponda | Un color para todas las provincias gobernadas |
| Estados saboyanos | Dominios efectivos del príncipe | Un color |
| Dominios de los Tocco | Conjunto exterior existente | Un color |
| Trinacria-Atenas, 1355–1377 | Conjunto existente | Un color mientras dura el gobierno común |
| Dominios ingleses en Francia | Color exterior inglés, con condición feudal cuando corresponde | Feudos franceses: conservan su color y su trama |
| Sultanato ayubí | Regla de Saladino hasta 1193; no actúa durante 1200–1800 | No prolongar la unidad tras la sucesión |

La regla hispánica de los reinos peninsulares e italianos es la que da color a España en el mapa personal; la agrupación exterior completa añade Portugal y los Países Bajos solo en el panorama. Las uniones de Otakar II, Polonia-Hungría, Ladislao el Póstumo, Matías Corvino y los Jagellón de Bohemia-Hungría reúnen color solo en el panorama, como Portugal. El inventario ejecutable expone cada regla y su fuente con `politicalGroupingReview()`.

## Casos que no se agrupan automáticamente

- **Sacro Imperio:** dignidad y marco jurídico, no dominio territorial directo del emperador. Nunca se incorpora al color de una monarquía por compartir emperador.
- **Gran Bretaña-Hannover:** unión personal con capacidad política propia, sin regla de integración exterior automática. Inglaterra-Escocia antes de 1707 y las uniones nórdicas anteriores a 1537 tampoco se funden por compartir rey. Las fases territoriales ya documentadas de Gran Bretaña desde 1707 se conservan.
- **Polonia-Lituania antes de 1569, Polonia-Sajonia y otras coincidencias de coronas:** el monarca común no acredita por sí solo dirección política conjunta.
- **Suiza:** los pactos confederales y la agrupación de catálogo no autorizan a colorear toda la Suiza actual como un Estado unitario ni a atribuirla a un gobernante. Se conservan las jurisdicciones y pactos fechados existentes. Los cantones mantuvieron diplomacias y alianzas diferentes: [HLS, Diplomatie](https://hls-dhs-dss.ch/de/articles/026460/2011-07-14/).
- **Países Bajos de los archiduques, 1598–1621:** no se añaden al gobierno de Felipe III por proximidad dinástica. Se conservan sus mandatos y su conjunto propio; una delegación no prueba soberanía del delegante.
- **Hungría y Transilvania:** el color austríaco solo alcanza el gobierno efectivo documentado. No se extiende a la Hungría otomana, los Zápolya ni principados independientes o tributarios.

## Dibujo e inspección

El mapa rellena y traza cada celda con el mismo color. Al compartir color desaparece la separación visual interna en el panorama; no se elimina ninguna celda ni se alteran los nombres, mandatos o fuentes del inspector. La identidad del conjunto se conserva explícitamente junto a la identidad territorial; no se deduce que dos territorios pertenecen al mismo conjunto porque coincida su color.

El mosaico de investigación de «mapa completo» conserva las jurisdicciones de las capas para poder revisar atribuciones. No sustituye al panorama de conjuntos de poder exterior.

## Fuentes y comprobación

Las reglas antiguas conservan sus referencias. Las incorporaciones se apoyan en [RTP, Unión Ibérica](https://ensina.rtp.pt/artigo/a-uniao-iberica-apos-a-crise-dinastica-de-1580/), [Die Welt der Habsburger, Fernando I](https://www.habsburger.net/en/chapter/ferdinand-i-founder-austrian-habsburg-monarchy), [Universidad de Oslo, reorganización de Noruega](https://www.norgeshistorie.no/kirkestat/1108-selvstendighetstap-og-foreningstid.html), [Archivo de la Corona de Aragón, Nueva Planta](https://www.cultura.gob.es/archivos-aca/gl/actividades/documentos-para-la-historia-de-europa/nueva-planta.html), [Ministerio de Cultura, Mallorca en 1715](https://www.cultura.gob.es/actualidad/2014/12/20141218-mallorca.html) e [Instituto Huygens, Estados Generales](https://www.huygens.knaw.nl/en/resources/goetgevonden/).

`npm run audit:political-unions` recorre los 601 años y los mandatos activos de ambas vistas. Las pruebas de transiciones comparan las superficies con el mosaico territorial original y comprueban uniones, rupturas, ramas distintas, dependencias e integraciones internas. La regresión general existente sigue comprobando cada año las superficies y autoridades personales.

La revisión de octubre añade las uniones fechadas de Otakar II, Polonia-Hungría, Ladislao el Póstumo, Matías Corvino, los Jagellón de Bohemia-Hungría y Nápoles-Sicilia borbónicas. Véanse las fechas, exclusiones y fuentes en [la revisión del mapa y las sucesiones](royal-map-review.md). En un relevo de la misma jurisdicción dentro del año, el color sigue al entrante; el inspector anual conserva ambos titulares. Las rivalidades y corregencias no se resuelven mediante esta convención.

## Integración en el mapa personal, 20 de octubre de 2026

El mapa personal dejaba de ser legible en las monarquías compuestas: Felipe II tenía en 1585 veinticinco colores (Valencia, Cataluña, Mallorca, cada provincia neerlandesa…). Desde esta revisión sigue la misma integración política que el panorama, con unidades propias explícitas en `MAP_GROUP_REVIEW`:

- Felipe II en 1585: España (Castilla, Aragón, Navarra y los reinos italianos), Portugal y Borgoña-Países Bajos.
- Leopoldo I o María Teresa: monarquía austríaca (tierras austríacas, Bohemia, Hungría, Transilvania habsbúrgica y dominios italianos) y Países Bajos austríacos aparte.
- Monarquía prusiana, Dinamarca-Noruega, Polonia-Lituania desde 1569, Nápoles-Sicilia borbónicas, estados saboyanos y borgoñones: un color cada uno.
- Siguen separados, como Portugal: Otakar II, Luis I de Polonia y Hungría, Ladislao el Póstumo, Matías Corvino y los Jagellón de Bohemia-Hungría; los feudos franceses de los reyes de Inglaterra; las uniones personales que el panorama tampoco reúne (Inglaterra-Escocia antes de 1707, Gran Bretaña-Hannover, Kalmar, Navarra-Bearne-Foix).

Los señoríos borgoñones sin mandato propio (Charolais, Cuijk, Mâcon) toman el color de su conjunto. Gran Bretaña recibe desde 1707 un tono emparentado con el inglés pero distinto, y Hannover mantiene uno propio; los territorios sin color de paleta reciben un tono estable derivado de su nombre en lugar de un gris común que los hacía parecer un solo Estado.

## Revisión de Hannover, Polonia-Lituania y los ducados daneses, 21 de octubre de 2026

La revisión aplica los criterios de este documento y de la guía pública. No presupone que todas las uniones personales tuvieran el mismo funcionamiento.

- **Hannover–Gran Bretaña, 1714–1800:** se mantienen separados. La coordinación militar y los intereses del soberano no constituyen una dirección exterior única permanente. La convención de Klosterzeven de 1757 muestra una negociación específica del ejército continental mientras continuaba la guerra británica. Véanse [National Army Museum](https://www.nam.ac.uk/explore/seven-years-war) y el [registro del tratado en el archivo de Baja Sajonia](https://www.arcinsys.niedersachsen.de/arcinsys/showArchivalDescriptionDetails.action?archivalDescriptionId=3436399&request_locale=en). No se usa la mera falta de integración administrativa como argumento: el criterio del panorama sigue siendo la dirección exterior.
- **Polonia-Lituania antes de 1569:** las uniones y pactos anteriores se reconocen como antecedentes; no acreditan una unidad exterior continua que permita adelantar automáticamente el color en todos esos años. Se conserva 1569 como inicio documentado de política exterior común, según la [edición del acta y estudios del Parlamento polaco](https://wydawnictwo.sejm.gov.pl/publikacja/union-of-lublin-1569/). La revisión conserva los mapas personales existentes.
- **Schleswig desde 1721 y Holstein desde 1773:** se incorporan al conjunto exterior danés con mandatos fechados. [Lex](https://lex.dk/Slesvig-Holstens_historie_siden_1721) distingue la incorporación de la parte de Gottorp en Schleswig de la introducción de legislación o administración del reino, que no ocurrió, y fecha la reunión de Holstein en 1773. Esta regla no modifica las particiones anteriores ni el color personal de los ducados. La ocupación de 1713–1720 sigue siendo una fase distinta de la incorporación jurídica.

Saboya y Piamonte conservan su regla política y reciben un violeta más claro para distinguirse del azul francés. El cambio de paleta no crea una unión ni una frontera histórica.
