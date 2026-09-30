# Revisión cartográfica de Borgoña y los Países Bajos

La primera cartografía de V4.2 cometía un error inequívoco: usaba el identificador `Zealand` del SVG para el condado neerlandés de Zelanda. Ese polígono es la isla danesa donde se encuentra Copenhague. También faltaban territorios de la herencia borgoñona y las incorporaciones posteriores de Carlos V. Esta revisión corrige la correspondencia y amplía los gobiernos registrados; no pretende reconstruir fronteras exactas con un mapa regional genérico.

| Territorio | Inicio registrado para Carlos V | Región disponible en el SVG | Fundamento |
| --- | ---: | --- | --- |
| Condado de Borgoña | 1506 | Aval, Millieu, Amont | Restitución a la casa de Austria en Senlis (1493); sucesión personal inferida. |
| Artois | 1506 | Upper_Artois, Lower_Artois | Senlis (1493); sucesión personal inferida. |
| Namur | 1506 | Namur | Derecho sucesorio adquirido en 1421; toma de posesión tras la muerte de Juan III en 1429. |
| Luxemburgo | 1506 | East_Luxembourg, West_Luxembourg | Ducado incorporado al patrimonio borgoñón en 1443. |
| Frisia | 1524 | Friesland | Los derechos adquiridos en 1515 se distinguieron del acuerdo general de 1524. |
| Utrecht | 1528 | **Sin polígono propio** | Transferencia del poder temporal episcopal. |
| Overijssel | 1528 | Overijssel | Reconocimiento de Carlos V como señor. |
| Drente | 1536 | Drenthe | Incorporación al poder de Carlos V. |
| Groninga | 1536 | Ommelanden | Representación regional parcial de la ciudad y sus alrededores. |
| Güeldres | 1543 | Gelderland | Tratado de Venlo. |
| Zelanda | 1506 | **Sin polígono propio** | Se mantiene la afirmación histórica, pero no se pinta la isla danesa `Zealand`. |

El ducado francés de Borgoña siguió bajo la Corona francesa tras la muerte de Carlos el Temerario. El título ducal reclamado por sus descendientes no se usa para colorear ese ducado; el Franco Condado es otra entidad. Para cada año, el mapa presenta únicamente los gobiernos efectivos registrados, y el panel de evidencia señala como inferidos los extremos de intervalos deducidos de sucesiones generales.

La V4.3 profundiza esta corrección: elimina la antigua figura compuesta del ducado y fecha cada feudo por separado, incluidos Nevers, Rethel, Auxerre y Ponthieu. Véase la [auditoría de cien etiquetas y la secuencia de titulares](CARTOGRAFIA_BORGONA.md).

Los límites del SVG no permiten distinguir Zelanda, Utrecht, Zutphen o Malinas con precisión. Tampoco permiten convertir `Ommelanden` en un contorno completo de Groninga. La solución honesta es mostrar esos nombres en la ficha o la leyenda y dejar el área sin color hasta sustituir o ampliar la geometría. El mapa actual tampoco ofrece un deslinde preciso de cada provincia en todas las fechas de la revuelta neerlandesa.

Fuentes para contrastar: [Rijksmuseum, armas de las provincias en la alegoría de la abdicación](https://www.rijksmuseum.nl/en/collection/object/Allegory-on-the-Abdication-of-Emperor-Charles-v-in-Brussels--2cb744f2469fe62413bb6aab920d4e03); [BnF, tratado de Senlis](https://ccfr.bnf.fr/portailccfr/ark:/16871/004a80306914); [Gobierno de Luxemburgo, historia del ducado](https://luxembourg.public.lu/dam-assets/publications/tout-savoir-sur-le-grand-duche-de-luxembourg/tout-savoir-sur-le-grand-duche-de-luxembourg-en.pdf); [Citadelle de Namur, historia del condado](https://citadelle.namur.be/sites/default/files/uploads/la%20citadelle%20de%20Namur.pdf); [DBNL, acuerdo de Frisia](https://www.dbnl.org/tekst/_gid001193001_01/_gid001193001_01_0055.php); [Het Utrechts Archief, 1528](https://www.archieven.nl/nl/zoeken?miadt=39&miaet=14&micode=BIBLIO_BOEK&minr=40665930&mivast=0&miview=ldt&mizig=307); [Canon de Overijssel](https://www.canonvannederland.nl/nl/overijssel/overijssel/oversticht); [Canon de Drente](https://www.canonvannederland.nl/nl/page/99041/kinkhorst); [Canon de Groninga](https://www.canonvannederland.nl/nl/groningen/groningen/habsburgs-gezag); [Rijksmuseum, guerras de Güeldres](https://www.rijksmuseum.nl/en/collection/node/Gelderse%2Boorlogen--e8ad752027a7c20d0e2cbf9568e18ca8).
