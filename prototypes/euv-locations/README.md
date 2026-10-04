# Laboratorio paralelo: EU V Locations

El Atlas sigue usando **EU V Provinces** (`src/MapChart_Map.svg`). Este
laboratorio compara esa geometría con la exportación **EU V Locations** sin
cambiar el mapa público. Los ensayos fechados generan capas propias a partir
de la base histórica y registran las correcciones que todavía no se han
integrado en el Atlas.

![Encuadre del prototipo](preview.png)

## Probarlo

Desde la raíz del repositorio, ejecuta `./node_modules/.bin/vite` y abre
`http://localhost:5173/prototypes/euv-locations/` (si Vite anuncia otro
puerto, usa ese número). Los mapas se muestran con el mismo encuadre;
puedes buscar un ID, pulsar una zona, arrastrar y ampliar. El mapa nuevo se
carga solo al visitar el laboratorio. No entra en el flujo habitual del Atlas.

También hay un **ensayo integrado en el Atlas**, sin cambiar el mapa normal:
`http://localhost:5173/es/?atlas=1&vista=mapa&mapa=locations-lab`.
Selecciona una persona y fija un año. El mapa conserva la búsqueda, la
biografía, el control temporal y el desplazamiento del Atlas. Los colores
proceden de las jurisdicciones ya trasladadas y, para los cinco titulares de
la sucesión borgoñona, de esa capa fechada; Cuijk y otros señoríos locales se
muestran solo en este ensayo. Un lugar gris no demuestra que careciera de
gobierno. La ruta normal del Atlas sigue cargando el SVG de Provinces.

El [ensayo de los dominios de Carlos V](carlos-v.html) añade un selector de
1506–1555 sobre el mapa nuevo. Permite comprobar qué cambia al adquirir las
coronas hispánicas, los territorios austríacos, Milán y los Países Bajos
septentrionales. Es una capa paralela: no altera `src/MapChart_Map.svg` ni los
colores del producto.

La [segunda entrega, la sucesión borgoñona](burgundian-succession.html),
recorre 1419–1555 desde Felipe el Bueno hasta Carlos V. Permite buscar una
*location* y comparar pérdidas, adquisiciones y transmisiones al cierre de
cada año. Un mismo morado identifica el conjunto político borgoñón, pero la
lista lateral conserva sus condados, ducados y señoríos como jurisdicciones
distintas.

El [visor de corredores territoriales](territorial-corridors.html)
traslada 52 jurisdicciones de Iberia, Italia, Centroeuropa, Polonia–Lituania, Francia e islas británicas con versiones anuales dentro de 1400–1650. Cada una
mantiene su propio color y alcance aunque comparta soberano con otra. El
visor permite seleccionar año, territorio e ID, consultar la corrección
documentada y centrar el mapa en la localidad buscada. Es una capa de
investigación separada de las dos anteriores.

![Carlos V en 1520: Austria todavía bajo su gobierno](carlos-v-1520.png)
![Carlos V en 1548: herencia hispánica y borgoñona, sin pintar el Imperio entero](carlos-v-1548.png)

El SVG recortado se reconstruye con:

```sh
python3 prototypes/euv-locations/crop_svg.py /ruta/a/MapChart_Map.svg
node --import ./tests/jsx-loader.mjs prototypes/euv-locations/audit-crosswalk.mjs
```

Para regenerar la capa de Carlos V, primero se extraen de la base sus
gobiernos fechados y las versiones del mapa actual. El paso geométrico
requiere `shapely` y `svgpathtools` en el entorno de trabajo; son herramientas
de generación, no dependencias del sitio:

```sh
node --import ./tests/jsx-loader.mjs prototypes/euv-locations/carlos-v-source.mjs
python3 prototypes/euv-locations/build-carlos-v-map.py --tags '/ruta/a/Texto pegado.txt'
python3 prototypes/euv-locations/render-carlos-v-svg.py 1548 /tmp/carlos-v-1548.svg
node --import ./tests/jsx-loader.mjs prototypes/euv-locations/burgundian-source.mjs
python3 prototypes/euv-locations/build-burgundian-map.py
node --import ./tests/jsx-loader.mjs prototypes/euv-locations/corridor-source.mjs
python3 prototypes/euv-locations/build-corridor-map.py
```

La exportación original no se incluye: el SVG adjunto por el usuario está en
`Downloads/MapChart_Map.svg`. El recorte conserva la atribución MapChart y el
laboratorio enlaza su licencia CC BY-SA 4.0.

## Encuadre comprobado

El `viewBox` es `475 15 315 240` en la proyección mundial original. Se fijó
mirando el resultado renderizado, con puntos de control en Islandia
(Keflavik, Isafjordur), norte de Noruega (Hammerfest), Urales (Pervouralsk),
Marruecos y Sáhara atlántico (Agadir, Dakhla), Egipto (Cairo), Tierra Santa
(Jerusalem) y Oriente Próximo/Medio (Baghdad, Isfahan). La ventana incluye
pequeños fragmentos árticos en los extremos superiores; eliminarlos exigiría
una máscara irregular y no reduciría de forma apreciable el peso.

El script descarta los paths fuera de la ventana, además de ajustar el
`viewBox`. Usa una caja conservadora para curvas y arcos: puede conservar
algún path apenas exterior, pero no debe perder geometría que cruce el borde.
Se desactivaron los trazos negros de cada location para evitar las rayas
internas que el Atlas no quiere mostrar.

## Tamaño y correspondencias

| | Provinces actual | Locations completo | Locations recortado |
|---|---:|---:|---:|
| Paths geográficos | 3.838 | 22.711 | 7.672 |
| SVG sin comprimir | 6,67 MB | 14,60 MB | 4,39 MB |
| Gzip aproximado | 2,16 MB | 4,43 MB | 1,24 MB |

El recorte nuevo **descarga menos bytes** que el SVG actual (1,24 frente a
2,16 MB comprimidos), pero contiene el doble de paths. No se ha demostrado
todavía que consuma menos memoria ni que el arrastre y el zoom sean más
fluidos; esa comparación debe medirse antes de sustituir el mapa público.

`crosswalk-report.json` registra el primer cruce de nombres: de **561** IDs
usados en `REINO_A_IDS` y `REINO_VERSIONES`, **245** existen literalmente en
el recorte. Los otros **316** necesitan una asociación geográfica, a menudo
uno-a-muchos. También los 245 coincidentes necesitan revisión visual e
histórica: un nombre igual no garantiza que una *location* cubra la misma
provincia, ni que una localidad equivalga a toda una jurisdicción.

## Primer cruce histórico: Carlos V

La lista de **7.201** IDs aportada por el usuario contiene **7.198** presentes
en el recorte. Los tres ausentes (`Bear_Island`, `Horta`,
`Santa_Cruz_Flores`) quedan fuera del encuadre. Todos los IDs coloreados en
este ensayo están en esa lista. El cruce usa las jurisdicciones fechadas de
`CARLOS5` en el Atlas, localiza las provincias antiguas y asigna una location
nueva si al menos el **55 % de su superficie** coincide con esas provincias.
Los cruces de 25–55 % se excluyen y quedan anotados en los datos para revisión.
Se muestrean curvas SVG, así que el porcentaje es una aproximación geométrica;
una coincidencia espacial no prueba dominio histórico.

`carlos-v-overrides.json` registra correcciones manuales con motivo, fecha y
fuente. Entre otras, separa Utrecht y Amersfoort de Holanda hasta 1528,
Middelburg como Zelanda, Tournai como adquisición de 1521, Malinas como
señorío distinto de Brabante y Venlo/Roermond como Güeldres desde 1543.
Retira Benevento (enclave papal), Cambrai (principado episcopal), Andorra,
Biella/Vercelli (Saboya) y Malta desde su cesión a la Orden en 1530. El
ducado francés de Borgoña queda gris: Carlos conservó el título, mientras
que el **Franco Condado** sí está en morado. El Sacro Imperio no se pinta
entero por el título de emperador. Austria y Tirol dejan de colorearse tras
su cesión a Fernando.

El ensayo mantiene tres colores para **conjuntos políticos diferentes**, no
uno por persona: dorado para las coronas hispánicas y Milán desde 1535,
morado para la herencia borgoñona y las adquisiciones neerlandesas, rojo para
los territorios austríacos durante su breve gobierno. En 1548 hay **636**
locations coloreadas y ningún conflicto entre esos tres grupos en los datos
generados. El número mide polígonos del SVG, no unidades políticas.

## Segunda entrega: la sucesión borgoñona

El [mapa interactivo](burgundian-succession.html) sigue cinco titulares:
Felipe III de Borgoña (1419–1466), Carlos el Temerario (1467–1476),
María de Borgoña (1477–1481), Felipe I (1482–1505) y Carlos V
(1506–1555). Son **instantáneas al cierre del año**, no una cronología
mensual. El origen de cada tramo está en `burgundian-source.json`: gobiernos
fechados de `PERSONAS`, versiones del mapa antiguo y suplementos locales
declarados en `burgundian-source.mjs`. El cruce geométrico reutiliza el umbral
de 55 %, pero los casos estudiados se corrigen en
`build-burgundian-map.py` y `carlos-v-overrides.json` con motivo y fuente.
Cada gris significa «no atribuido en este ensayo», no «sin dueño».

| Revisión | Resultado en el prototipo | Comprobación |
|---|---|---|
| Calais y Boulogne | Fuera de Ponthieu; no se colorean por el solapamiento del polígono antiguo. | [Archivos Nacionales británicos: Calais inglés hasta 1558](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/) y [Inventario de Hauts-de-France: condado de Boulogne](https://inventaire.hautsdefrance.fr/dossier/IA62005335). |
| Charolais | Condado separado de Borgoña; desaparece del conjunto habsbúrgico entre 1477 y 1492 y vuelve desde 1493. | [BnF: adquisición borgoñona](https://essentiels.bnf.fr/fr/article/d22e6192-1011-4527-bf32-5ea610af1df2-heraldique-son-apogee-armoiries-devises-et-emblemes) y [Archivos de Côte-d’Or: tratado de Senlis](https://archives.cotedor.fr/v2/site/AD21/Apprendre/Atelier_du_chancelier_Rolin/Paleographie/Groupe_confirmes/Documents_etudies_en_2008-2009/Documents_1_a_3_-_Le_traite_de_Senlis_23_mai_1493_). |
| Mâcon | Condado distinguido del ducado; se incorpora al conjunto borgoñón desde 1435 y se pierde tras 1476. | [Municipio de Mâcon, diagnóstico histórico](https://www.macon.fr/fileadmin/medias/03_MACON_ET_VOUS/Urbanisme/PLU/Revision_PLU_2022/01-08_PROJET_ARRETE_DE_REVISION_DU_PLU/01_-_RAPPORT_DE_PRESENTATION/01a.Diagnostic_et_Projet_de_PLU.pdf). |
| Malinas y Tournai | Malinas figura como señorío propio; Tournai solo en el tramo de Carlos V desde 1521. | [Archivo municipal de Malinas](https://stadsarchief.mechelen.be/vandaag-in-de-mechelse-geschiedenis-het-parlement-van-mechelen-1474-) y [museo municipal de Tournai](https://mhm.tournai.be/en/tournai-a-city-with-a-rich-military-past). |
| Besançon, Montbéliard y Saint-Claude | No se absorben en el Franco Condado por proximidad geográfica: ciudad libre, posesión de Württemberg y abadía con señorío propio, respectivamente. | [Inventario patrimonial de Besançon](https://inventaire-patrimoine.bourgognefranchecomte.fr/dossier/IA25000374), [municipio de Montbéliard](https://www.montbeliard.fr/mes-sorties-mes-activites/musees-de-montbeliard/musee-du-chateau-des-ducs-de-wurtemberg/le-circuit-historique-2/) y [nota histórica sobre Saint-Claude](https://www.newadvent.org/cathen/13341a.htm). |
| Bouillon y Cuijk | Bouillon no se atribuye por defecto a Luxemburgo. Cuijk se separa de Brabante y se añade como señorío propio de Carlos V desde 1509, con fecha de investidura todavía provisional. | [Larousse: ducado de Bouillon](https://www.larousse.fr/encyclopedie/autre-region/duch%C3%A9_de_Bouillon/109685), [historia local de Cuijk](https://www.canonvannederland.nl/nl/noord-brabant/grave/keteltje) y [BHIC: Cuijk y Carlos V](https://www.bhic.nl/ontdekken/verhalen/cuijkse-heggenleggers-en-kartuizers-in-het-midden-van-de-zestiende-eeuw). |

La diferencia entre heredar y gobernar se marca también en la interfaz:
Felipe I heredó en 1482 siendo menor; la fase hasta 1493 se muestra con
un tono de regencia y el gobierno personal desde 1494. El registro actual de
`PERSONAS` lo llama «efectivo» desde 1482 y queda señalado para corrección
editorial, no modificado a escondidas en este ensayo. Véanse el
[Rijksmuseum sobre Felipe](https://www.rijksmuseum.nl/en/collection/object/Portrait-of-Philip-the-Fair-Duke-of-Burgundy--abd4bb32d07bc58b59f99db5ad95195c)
y [Habsburger.net sobre su minoría y regencia](https://www.habsburger.net/en/chapter/philip-fair-child-guarantor-cohesion-burgundy).
En 1477–1493 los títulos disputados o nominales, especialmente Artois y el
Franco Condado, permanecen grises hasta su restitución, aunque la situación
en el terreno fue más compleja; el [tratado de Senlis](https://archives.cotedor.fr/v2/site/AD21/Apprendre/Atelier_du_chancelier_Rolin/Paleographie/Groupe_confirmes/Documents_etudies_en_2008-2009/Documents_1_a_3_-_Le_traite_de_Senlis_23_mai_1493_)
sirve como hito para el mapa anual.

### Señorío de Cuijk

El ID `Cuijk` figura bajo el **Señorío de Cuijk** de Carlos V de 1509 a 1555,
sin confundirse con el ducado de Brabante. La [cronología neerlandesa
aportada](https://nl.wikipedia.org/wiki/Land_van_Cuijk_(heerlijkheid)) da
1509 como comienzo; falta localizar la investidura primaria y por eso el
año sigue marcado como provisional. Según el [Canon local de
Grave](https://www.canonvannederland.nl/nl/noord-brabant/grave/keteltje),
Grave y Cuijk se empeñaron a Floris van Egmond en 1517: el color representa
señorío superior, **no administración directa** durante la prenda. Esa fuente
atribuye a **Felipe II** el pago de 20.000 florines que puso fin al empeño en
1549, en contra de la formulación que lo atribuye a Carlos V. Una [revisión
histórica sobre Cuijk](https://www.dbnl.org/tekst/_bij005196201_01/_bij005196201_01.pdf)
sitúa en 1549 su incorporación a Brabante. El prototipo conserva el señorío
como entidad diferenciada hasta la abdicación de 1555; no deduce de esa
incorporación que toda la etapa anterior fuera un ducado homogéneo.

### Tercera entrega: Iberia e Italia

`corridor-source.json` extrae las versiones de 26 jurisdicciones ibéricas e italianas del Atlas.
`build-corridor-map.py` cruza 143 polígonos provinciales con 940 locations
candidatas del SVG recortado y conserva cada cambio anual. El umbral del 55 %
produce **candidatos espaciales**, nunca prueba de soberanía. La auditoría y
las correcciones por ID, fecha, motivo y fuente quedan en
`corridor-locations.json` y `corridor-overrides.json`. El visor muestra una
jurisdicción cada vez; sus tonos no pretenden colorear todos los títulos de
una persona como un único Estado.

Se comprobaron específicamente estas transferencias:

| Región | Cambio en el prototipo | Fuente |
|---|---|---|
| Granada–Castilla | Gibraltar pasa en 1462; Antequera en 1410; Ronda en 1485 y Loja en 1486. Las conquistas se separan del cambio de toda la provincia antigua de Málaga o Granada. | [Gobierno de Gibraltar](https://www.gibraltar.gov.gi/maritime), [Ayuntamiento de Antequera](https://www.antequera.es/municipio/historia/) y [Treccani: España](https://www.treccani.it/enciclopedia/spagna_(Enciclopedia-Italiana)/). |
| Sicilia | Malta deja de colorearse con Trinacria en 1530, tras su cesión a la Orden de San Juan. | [Orden de Malta](https://www.orderofmalta.int/news/the-national-library-of-malta-celebrates-the-orders-past-and-present/). |
| Nápoles y Estados Pontificios | Benevento deja de atribuirse a Nápoles y aparece como enclave pontificio. | [Treccani: Benevento](https://www.treccani.it/enciclopedia/benevento_(Federiciana)/). |
| Milán y Piamonte | Biella se retira de Milán durante todo el ensayo y Vercelli desde 1427; ambas se asignan a la jurisdicción saboyana de Piamonte. | [Treccani: Biella](https://www.treccani.it/enciclopedia/biella_(Enciclopedia-Italiana)/) y [Vercelli](https://www.treccani.it/enciclopedia/vercelli_(Enciclopedia-Italiana)/). |
| Ferrara y Venecia | Rovigo pasa a Venecia en 1484; se registra la interrupción de la guerra de la Liga de Cambrai y su retorno en 1516. La devolución de Ferrara al papa en 1598 no arrastra Rovigo. | [Treccani: política veneciana](https://www.treccani.it/enciclopedia/venezia-e-la-politica-italiana-1454-1530_(Storia-di-Venezia)/). |
| Istria y Dalmacia venecianas | Se añaden Pola y Rovinj en la costa istriana; Zadar desde 1409; Šibenik, Split, Brač y Kotor desde 1420 con un criterio anual conservador. Trieste, el interior de Istria y Ragusa quedan fuera. `Zara` es otro ID del SVG: la ciudad dálmata se llama `Zadar`. | [Treccani: Istria](https://www.treccani.it/enciclopedia/istria_(Enciclopedia-Italiana)/), [Dalmacia](https://www.treccani.it/enciclopedia/dalmazia_(Enciclopedia-Italiana)/) y [campaña de 1420](https://www.treccani.it/enciclopedia/le-frontiere-navali_(Storia-di-Venezia)/). |
| Italia central | Parma solo aparece como ducado separado desde 1545; Florencia deja paso a Toscana en 1569; Ferrara y Urbino se integran en los Estados Pontificios en 1598 y 1631. Piombino, Mirandola y Guastalla se excluyen de Toscana o Módena cuando eran Estados separados. | [Treccani: Parma y Piacenza](https://www.treccani.it/enciclopedia/parma-e-piacenza-ducato-di_(Dizionario-di-Storia)/), [Piombino](https://www.treccani.it/enciclopedia/piombino-ed-elba-principato-di_(Dizionario-di-Storia)/) y [Mirandola](https://www.treccani.it/enciclopedia/mirandola_(Enciclopedia-Italiana)/). |

La revisión automática comprueba que ningún ID esté en dos jurisdicciones
del mismo corredor en los años de muestra. El gris puede significar que
falta un Estado en esta entrega, no que la zona careciera de gobierno. Los
archipiélagos atlánticos de Portugal y las posesiones orientales de Venecia
están en los datos si el recorte general los incluye, aunque el encuadre
regional inicial no los muestra todos; el buscador permite centrarlos.
Quedan pendientes de cotejo cartográfico fino Saluzzo, los enclaves
italianos, las fronteras del Reino de Granada y las situaciones de control
militar intermitente.

### Cuarta entrega: Centroeuropa

Se han añadido siete jurisdicciones al mismo visor: Austria danubiana,
Austria Interior, Tirol, Baviera, Palatinado electoral, las tierras de la
Corona de Bohemia y la Corona de San Esteban. El cruce suma ahora **33
jurisdicciones**, **222** polígonos provinciales antiguos y **1552** locations
candidatas. Estas cifras miden el trabajo geométrico del generador; no son
territorios históricos documentados individualmente. El selector muestra
la nota de alcance de cada jurisdicción junto con los IDs antiguos y los
nuevos. Se revisó el encuadre visual en Austria, Baviera y Hungría, además
de comprobar las transiciones fechadas en el navegador.

| Jurisdicción | Criterio aplicado | Fuentes |
|---|---|---|
| Austria y Austria Interior | El archiducado danubiano no absorbe Estiria, Carintia, Carniola ni el litoral. Pitten y Wiener Neustadt se mantienen con la rama estiria. Trieste se muestra desde 1400 por su sujeción de 1382; Rijeka desde 1466. | [Habsburger.net: división de Neuberg](https://www.habsburger.net/en/chapter/albrecht-iii-and-nascent-land-austria), [Trieste](https://www.habsburger.net/en/locations/trieste), [Treccani: Fiume](https://www.treccani.it/enciclopedia/fiume_res-fbec9b86-8bae-11dc-8e9d-0016357eee51_(Enciclopedia-Italiana)/). |
| Tirol | Lienz se retira de Austria Interior y entra en Tirol desde la herencia de Görz en 1500. Kufstein y Kitzbühel entran desde la conquista de 1504. Brixen, Bruneck y Cavalese quedan fuera de la capa secular por sus principados episcopales. | [Archivo del Land Tirol: Lienz](https://www.tirol.gv.at/fileadmin/themen/kunst-kultur/landesarchiv/downloads/TGQ34_OCR_Gesamt_homepage.pdf), [Kufstein y Kitzbühel](https://www.tirol.gv.at/kunst-kultur/landesarchiv/archiv-quelle/18/), [Brixen y Bruneck](https://www.tirol.gv.at/fileadmin/themen/kunst-kultur/landesarchiv/downloads/Grundsteueranschlag1508-1509.pdf), [Provincia de Trento: Cavalese](https://www.ufficiostampa.provincia.tn.it/content/download/18455/374120/file/Palazzo_Magnifica_Comunit%C3%A0_di_Fiemme.pdf). |
| Baviera y Palatinado | La capa bávara reunificada comienza en 1505; la Alta Palatinado pasa del elector a Baviera en 1628. Se excluyen los obispados de Freising y Passau, la ciudad imperial de Regensburg, las plazas de Salzburg y el estado separado de Pfalz-Neuburg. El Palatinado electoral excluye Speyer, Landau, Leiningen, Leuchtenberg, Pirmasens y, desde la partición de 1410, Zweibrücken. | [Historisches Lexikon Bayerns: arbitraje de 1505](https://www.historisches-lexikon-bayerns.de/Lexikon/K%C3%B6lner_Schiedsspruch%2C_30._Juli_1505), [Alta Palatinado](https://www.historisches-lexikon-bayerns.de/Lexikon/Landst%C3%A4nde_der_Oberpfalz), [Freising](https://www.historisches-lexikon-bayerns.de/Lexikon/Freising%2C_Bistum%3A_Politische_Geschichte_%28Sp%C3%A4tmittelalter%29), [Salzburg](https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_45331), [divisiones palatinas](https://www.historisches-lexikon-bayerns.de/Lexikon/Pf%C3%A4lzische_Teilungen). |
| Bohemia y Hungría | Bohemia designa aquí la **Corona**, incluidos Moravia y sectores silesios, no solo el reino estricto. La capa húngara agrupa la Corona de San Esteban antes de Mohács, con Croacia y Transilvania. Desde 1526 se deja gris: no se adjudican todo el reino medieval ni las tierras de la Sublime Puerta a un único titular. Zadar (1409), Šibenik (1420) y Rijeka (1466) se retiran del agregado húngaro cuando pasan a otras jurisdicciones. | [Habsburger.net: las nuevas coronas de Fernando I](https://www.habsburger.net/en/chapter/ferdinand-i-new-crowns-habsburgs), [Treccani: Dalmacia](https://www.treccani.it/enciclopedia/dalmazia_(Enciclopedia-Italiana)/), [Fiume](https://www.treccani.it/enciclopedia/fiume_res-fbec9b86-8bae-11dc-8e9d-0016357eee51_(Enciclopedia-Italiana)/). |

Los límites de las locations siguen siendo candidatos geométricos. En
particular, los pequeños señoríos de la Alta Palatinado, los derechos
seculares de los obispados alpinos, el valle del Ziller y la frontera
de Croacia necesitan cartografía jurisdiccional más fina. La partición
de Hungría después de 1526 exige capas separadas para Hungría real,
Transilvania y dominio otomano, con cambios fechados; el gris actual
expresa esa revisión pendiente, no ausencia de gobierno. El siguiente
corredor prioritario era Polonia–Lituania, ahora iniciado; siguen pendientes
estas excepciones alpinas y húngaras. Ninguna capa sustituye aún el mapa público.

### Quinta entrega: Polonia–Lituania

El visor añade **seis jurisdicciones** al corredor nororiental. Suma ahora
**39 jurisdicciones** en total. Esta capa no hereda sin más la versión
posterior a 1386 de `Polonia` en el Atlas, porque mezcla la Corona con
Mazovia antes de su incorporación, Pomerania occidental y señoríos
moldavos. Se distinguen Corona de Polonia, ducado de Mazovia, Prusia Real,
Prusia de la Orden, Prusia ducal y Gran Ducado de Lituania. Compartir
monarca o vínculo feudal no los funde en un solo territorio pintado.

| Cambio | Decisión cartográfica | Fuente |
|---|---|---|
| Mazovia | Rawa y Gostynin pasan a la Corona en 1462; Sochaczew permanece mazoviana hasta 1476, Płock hasta 1495 y el núcleo de Varsovia hasta 1526. | [Archivo Central de Actas Antiguas (AGAD)](https://agad.gov.pl/?page_id=486). |
| Prusia | La Segunda Paz de Toruń (1466) separa Prusia Real —incluidas Pomerelia, Chełmno, Warmia, Malbork, Elbląg y Dzierzgoń— del remanente de la Orden. La guerra de 1454–1466 deja varias plazas en gris porque el control cambió durante el conflicto. En 1525 el remanente se convierte en ducado, **feudo** polaco y no provincia administrada por la Corona. | [Fuente educativa polaca sobre los Jagellón](https://zpe.gov.pl/a/polskie-dynastie-jagiellonowie/D12LkQne7) y [texto de la Segunda Paz de Toruń reproducido en el portal público](https://zpe.gov.pl/a/prezentacja-multimedialna/DbYm1LK96). |
| Unión de Lublin | Podlasie, Volinia, Kiev y Bracław pasan del Gran Ducado a la Corona en la capa anual de 1569. Lituania conserva entidad propia y su núcleo no adopta automáticamente el color de Polonia. | [Registro de la Cancillería de la Corona, AGAD](https://agad.gov.pl/inwentarze/Metr_Korx.xml) y [documentos ucranianos conservados por AGAD](https://agad.gov.pl/?page_id=392). |

El mapa parte del solapamiento geométrico del **55 %** y aplica
correcciones fechadas por *location* en `corridor-overrides.json`. La
correspondencia visual se comprobó en el navegador para Prusia Real (1466),
la Corona y Lituania (1569). El norte prusiano, Mazovia y las transferencias
de 1569 tienen comprobaciones automáticas de fechas, IDs y exclusividad.
Quedan **pendientes** la frontera oriental del Gran Ducado, las oscilaciones
del litoral del mar Negro, la administración de Warmia y las ocupaciones
de la guerra de los Trece Años. Por eso se muestra solo el núcleo lituano
y la zona de las transferencias estudiadas; el gris no significa tierra
sin gobierno. El corredor termina en **1569**: de 1570 en adelante no
se proyecta una frontera inmutable sobre guerras posteriores.

### Sexta entrega: principados eclesiásticos y ensayo integrado

Los núcleos de **Brixen** y **Bruneck**, antes excluidos prudentemente del
Tirol secular, se muestran bajo un principado episcopal propio. **Trento** y
**Cavalese/Fiemme** forman una segunda capa; Fiemme conservaba autogobierno
local bajo la autoridad superior del príncipe-obispo. **Salzburgo**, **Hallein**,
**Laufen** y el enclave de **Mühldorf** forman la tercera. Las 8 locations
identificadas son puntos de partida, no fronteras completas de los tres
estados eclesiásticos. La fuente para Brixen y Bruneck es el [Archivo del
Land Tirol](https://www.tirol.gv.at/fileadmin/themen/kunst-kultur/landesarchiv/downloads/Grundsteueranschlag1508-1509.pdf); para Fiemme, la [Provincia autónoma de
Trento](https://www.ufficiostampa.provincia.tn.it/content/download/18455/374120/file/Palazzo_Magnifica_Comunit%C3%A0_di_Fiemme.pdf); y para Salzburgo, el [Historisches Lexikon Bayerns](https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_45331).

La vista integrada del Atlas carga el recorte solo al recibir
`mapa=locations-lab`. El resto de la interfaz sigue funcionando; el mapa
normal, las preferencias guardadas y las exportaciones no se sustituyen.
El ensayo usa únicamente un año fijado por el visitante para no superponer
gobiernos vitalicios. Se comprobó en el navegador Carlos V en 1548: Madrid y
Milán adoptan el color hispánico, Utrecht y Cuijk el borgoñón, mientras
Londres y Dijon quedan grises. Pulsar Madrid abre una ficha que indica la
jurisdicción trasladada y la precisión provisional de la geometría.

Sigue pendiente **Hungría desde 1526**: la capa medieval se interrumpe en
Mohács y no se convierte automáticamente en «Hungría real», Transilvania o
zona otomana. Esos tres sucesores requieren límites fechados y fuentes más
finas antes de colorearlos. También faltan pruebas comparativas de memoria y
fluidez en móvil antes de plantear la sustitución general del SVG.

### Séptima entrega: Francia e islas británicas

Diez jurisdicciones occidentales elevan el visor a **52**. No se combinan por
monarca: Inglaterra y Escocia mantienen colores y límites separados tras la
unión personal de 1603; el señorío de Man y el bailiazgo de Jersey conservan
su identidad. El mapa se inspeccionó visualmente en Francia e Inglaterra en
1500, y las transferencias fechadas tienen pruebas de IDs y exclusividad.

| Secuencia | Tratamiento en el laboratorio | Base documental |
|---|---|---|
| Francia | Las campañas de la Guerra de los Cien Años anteriores a 1453 permanecen grises hasta trazar ocupaciones locales. El ducado de Borgoña entra en el agregado francés en 1477, Provenza en 1486 y Bretaña en 1532. Béarn se incorpora desde 1620. Los feudos dentro de la monarquía todavía requieren una separación más fina. | [Archivos Nacionales británicos: tierras francesas de los reyes ingleses](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/), [Bibliothèque nationale de France: unión de Provenza](https://ccfr.bnf.fr/portailccfr/ark:/16871/004D22012314), [unión de Bretaña](https://ccfr.bnf.fr/portailccfr/ark:/16871/004D36F12606) y [Béarn](https://ccfr.bnf.fr/portailccfr/ark:/16871/004D36E13365). |
| Costa y enclaves | Calais se mantiene como plaza inglesa hasta 1557 y pasa a Francia desde 1558. Burdeos se muestra como plaza inglesa hasta 1450 y de nuevo en 1452; Bayonne solo hasta 1450. Jersey permanece separado de Francia y de Inglaterra, excepto su ocupación francesa de 1461–1467. | [Archivos Nacionales británicos](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/), [Gobierno de Jersey](https://www.gov.je/sitecollectiondocuments/life%20events/id%20citizenship%20test%20-%20jersey%20supplement%20-%2020190304.pdf). |
| Provenza y Saboya | El polígono antiguo de «Provenza» apuntaba erróneamente a Avignon y Nice. El nuevo núcleo utiliza Aix, Draguignan y Digne; Barcelonnette se atribuye a Saboya, que la recibió con el interior de Nice en 1388. | [Bibliothèque nationale de France: dedición de 1388](https://catalogue.bnf.fr/ark:/12148/cb12224467j). |
| Reinos británicos | Orkney y Shetland entran en Escocia desde 1469; Berwick es inglés hasta 1460, escocés en 1461–1481 e inglés desde 1482. Tórshavn no se muestra como Escocia. Man queda como señorío propio desde 1406. Gales está dentro del agregado inglés heredado, una simplificación que se desglosará. | [Historic Environment Scotland: Orkney](https://www.historicenvironment.scot/visit/all/maeshowe-chambered-cairn/history-and-stories/) y [Shetland](https://www.historicenvironment.scot/visit/all/jarlshof-prehistoric-and-norse-settlement/history-and-stories/), [Historic England: Berwick](https://historicengland.org.uk/listing/the-list/list-entry/1015520), [Manx National Heritage](https://manxnationalheritage.im/news/medieval-ring-declared-treasure/) y [Gobierno de las Islas Feroe](https://www.faroeislands.fo/the-big-picture/history-of-the-faroe-islands/historical-timeline). |
| Irlanda | Nueve locations señalan únicamente un núcleo urbano inglés en Dublin, Meath, Kildare y Louth. No forman una frontera continua de la *Pale*, ni representan el control inglés de toda la isla o la expansión Tudor. | [Investigación cartográfica irlandesa publicada por el Gobierno de Irlanda](https://assets.ireland.ie/documents/GIDC-SAIS_Vol_5_2_2_web_002.pdf), [archivo de Louth](https://louthcoco.ie/en/services/heritage/what_is_heritage/cultural/county_and_boroughs/). |

**Pendiente:** reconstruir la Francia feudal por gobiernos y ocupaciones
locales; separar Gales del agregado inglés antes de las leyes de unión;
fechar Noruega/Dinamarca, la expansión inglesa en Irlanda y las guerras del
siglo XVII. Un ID coincidente o un solapamiento del 55 % no prueban por sí
solos soberanía histórica. El laboratorio sigue siendo opcional y no
sustituye todavía el mapa habitual del Atlas.

### Dudas de esta entrega

- La fecha de investidura de **Cuijk en 1509** todavía necesita contraste con
  documentación primaria. Se muestra como hipótesis fechada, con la prenda
  administrativa de 1517–1549 explicada por separado.
- **Montreuil**, **Luxeuil** y algunos bordes de Ponthieu/Franco Condado
  siguen siendo candidatos por solapamiento y requieren cotejo de cartografía
  jurisdiccional fechada antes de pasar al producto.
- La restitución de 1493 y las ocupaciones de 1477–1492 no se pueden reducir
  siempre a un año y un único dueño efectivo. El estado anual conservador
  omite el control discutido; no presenta el vacío como ausencia histórica.
- El corredor es un ensayo trazable de varias etapas, no una garantía de que
  todas las fronteras de las 254 locations candidatas sean históricamente
  exactas. El mapa nuevo aún no sustituye el público.

### Límites que requieren otra pasada

- Esta es una transferencia desde provincias previas y una primera auditoría
  visual de Iberia, Italia y los Países Bajos. No es una reconstrucción de
  todas las fronteras locales de cada año. El señorío de Limburgo solo tiene
  una location identificada con seguridad en esta escala; Maastricht queda
  gris por jurisdicción compartida.
- No se incluyen posesiones americanas ni todos los presidios del norte de
  África. El recorte geográfico no debe interpretarse como el conjunto mundial
  de dominios de Carlos V.
- Las fechas de inicio se muestran por año completo. Los cambios dentro de un
  mismo año, los periodos de ocupación militar y las reclamaciones de derecho
  necesitan una capa temporal más fina y fuentes por location. La atribución
  de `Rovegno` queda suspendida hasta resolver su jurisdicción del siglo XVI.
- La siguiente fase debe cotejar las locations conflictivas contra cartografía
  académica fechada y documentos jurisdiccionales, además de probar fluidez y
  memoria en móvil antes de considerar una migración del Atlas.

Fuentes principales para las correcciones: [mundo de los Habsburgo](https://www.habsburger.net/en/chapter/charles-v-empire-which-sun-never-set),
[museo municipal de Tournai](https://mhm.tournai.be/en/tournai-a-city-with-a-rich-military-past),
[archivo municipal de Malinas](https://stadsarchief.mechelen.be/vandaag-in-de-mechelse-geschiedenis-het-parlement-van-mechelen-1474-),
[Canon de Güeldres](https://www.canonvannederland.nl/nl/gelderland/gelderland/van-graafschap-tot-hertogdom),
[Treccani sobre Benevento](https://www.treccani.it/enciclopedia/benevento_%28Federiciana%29/),
[Treccani sobre Vercelli](https://www.treccani.it/enciclopedia/vercelli_%28Enciclopedia-Italiana%29/)
y la [Orden de Malta](https://www.orderofmalta.int/news/the-national-library-of-malta-celebrates-the-orders-past-and-present/).

Las cifras de carga que muestra el navegador son orientativas de esa sesión;
no miden fluidez sostenida ni memoria móvil. El menor peso de transferencia no
compensa automáticamente el doble de nodos SVG.

## Decisión pendiente antes de migrar

1. Construir y revisar una tabla `provincia anterior → locations nuevas`
   para corredores piloto (Venecia–Milán, Borgoña/Países Bajos, Austria/Baviera).
2. Validar visualmente fronteras y por fechas con fuentes históricas. Los
   nombres de MapChart ayudan a localizar geometría, pero no prueban soberanía.
3. Medir primer dibujo, interacción y memoria en escritorio y móvil con
   territorios coloreados. Mantener la estética sin límites feudales negros.
4. Migrar por zonas solo si la precisión y el rendimiento mejoran de forma
   verificable; conservar el mapa actual como referencia durante la transición.
