# Colores, uniones y gobiernos en el mapa

Revisión sistemática de las reglas existentes, 1200–1800. No se cambian mandatos, fuentes territoriales, geometrías, fechas de conquista ni atribuciones de celdas.

## Dos preguntas distintas

- **Europa en este año:** conjuntos de poder exterior documentados. Una monarquía compuesta puede compartir color y contorno sin convertirse en un Estado unitario.
- **Mapa personal:** gobiernos jurídicos de la persona. Las identidades conservan su color; solo una integración administrativa documentada reúne también sus colores.

Una persona, dinastía, alianza o dignidad imperial no crea automáticamente una agrupación. La pertenencia exige una regla explícita, un mandato soberano efectivo y activo y una superficie compatible con ese mandato. Los gobernadores, regentes y pretendientes no aportan miembros a una unión. Las distintas ramas austríacas no se funden si tienen gobiernos diferentes.

Las fechas son anuales e inclusivas. Una ruptura dentro del año puede conservar atribuciones simultáneas; no se inventa precisión diaria. Los feudos y tributarios conservan trama y gobierno propio incluso cuando su gobernante tiene otros dominios. Ocupación, disputa y reclamación no son incorporación. El color no resuelve celdas con distintas atribuciones.

## Inventario revisado

| Regla | Panorama | Mapa personal |
| --- | --- | --- |
| Monarquía Hispánica, desde 1516 | Dominios efectivos; Portugal solo 1580–1640; provincias neerlandesas según sus gobiernos y control fechados | Castilla-León, Aragón, Portugal, Navarra y los demás gobiernos conservan su identidad |
| Monarquía austríaca, desde 1526 | Dominios efectivos del mismo centro de gobierno, incluidos los Países Bajos austríacos cuando corresponda | Austria, Bohemia, Moravia, Hungría y demás gobiernos separados, salvo integración documentada |
| Dinamarca-Noruega, desde 1537 | Dirección monárquica común tras la reorganización de 1536–1537 | Identidades de ambos reinos |
| Castilla-León, desde 1230 | Corona común | Se conserva el conjunto integrado ya establecido; los títulos siguen separados |
| Nueva Planta | Incluida en la monarquía, según el control documentado | Aragón y Valencia desde 1707, Mallorca desde 1715, Cataluña desde 1716; Navarra queda fuera |
| Administración austro-bohemia, desde 1749 | Incluida en la monarquía austríaca | Integración administrativa existente; Hungría queda fuera |
| Corona de Aragón | Miembros gobernados efectivamente | Reinos y principado separados hasta las integraciones fechadas |
| Corona de Bohemia, desde 1348 | Tierras de la Corona, o monarquía austríaca cuando corresponda | Dietas y gobiernos provinciales separados hasta 1749 |
| Corona de San Esteban | Gobiernos efectivos; separación transilvana fechada | Reinos y gobiernos separados |
| Austria Interior, 1564–1618 | Rama con dirección propia durante la partición; no comparte color exterior con Viena o Tirol | Gobiernos territoriales separados |
| Tierras austríacas | Tierras reunidas por el mismo gobernante | Identidades propias; no borrar las particiones dinásticas |
| Brandeburgo-Prusia, 1618–1700 | Conjunto exterior; Prusia mantiene la trama de feudo polaco hasta 1657 | Gobiernos propios |
| Monarquía prusiana, 1701–1800 | Dominios efectivos | Identidades provinciales; el título real no prueba integración de cada provincia |
| Polonia-Lituania, desde 1569 | Mancomunidad; no absorber Curlandia o Prusia ducal | Corona y Gran Ducado separados |
| Provincias Unidas | Gobierno exterior colectivo, según las fases regionales existentes | No suprimir los gobiernos provinciales; el cargo delegado conserva su trama |
| Estados borgoñones, desde 1384 | Dominios fechados, conservando las relaciones feudales | Ducados y condados separados |
| Países Bajos, desde 1549 | Conjunto provincial, subordinado a una agrupación exterior mayor solo donde corresponda | Gobiernos provinciales separados |
| Estados saboyanos | Dominios efectivos del príncipe | Gobiernos con estatuto propio |
| Dominios de los Tocco | Conjunto exterior existente | Condado y despotado separados |
| Trinacria-Atenas, 1355–1377 | Conjunto existente | Ducados y reino con instituciones propias |
| Dominios ingleses en Francia | Color exterior inglés, con condición feudal cuando corresponde | Gobiernos territoriales y tramas existentes |
| Sultanato ayubí | Regla de Saladino hasta 1193; no actúa durante 1200–1800 | No prolongar la unidad tras la sucesión |

La antigua regla hispánica restringida a los reinos peninsulares e italianos queda subordinada a la agrupación exterior completa; ya no reúne los colores personales por sí sola. El inventario ejecutable expone cada regla y su fuente con `politicalGroupingReview()`.

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
