# Revisión de superficies territoriales · 7 de octubre de 2026

La ampliación fuera de 1400–1650 sustituía superficies existentes por núcleos de ciudades. Esta entrega corrige 28 series, incorpora 20 capas con fechas propias y mide 1712 celdas del SVG utilizado por el Atlas. El visor conjunto, el mapa personal y el inspector comparten la misma resolución territorial. La integración es reproducible e idempotente.

## Recuperación de superficies

Comparación de 1651 con las selecciones conservadoras de la entrega anterior. Las áreas son unidades SVG, no kilómetros cuadrados ni una certificación de frontera exacta. Se comprueban también los contornos y las cesiones: no se prolonga automáticamente la última geometría de 1650.

| Jurisdicción | Celdas antes | Celdas ahora | Superficie recuperada |
|---|---:|---:|---:|
| Castilla | 89 | 205 | 2.26× |
| León | 68 | 89 | 1.29× |
| Portugal | 52 | 73 | 1.34× |
| Aragón | 7 | 33 | 4.12× |
| Nápoles | 9 | 72 | 7.04× |
| Trinacria | 7 | 26 | 2.80× |
| Austria | 7 | 28 | 4.16× |
| Austria Interior | 8 | 49 | 5.74× |
| Tirol | 8 | 22 | 2.72× |
| Milán | 8 | 24 | 2.41× |
| Estados Pontificios | 8 | 46 | 5.93× |
| Condado de Borgoña | 5 | 11 | 2.35× |

Silesia pasa de los tres núcleos de Wrocław/Środa/Głogów a **46 celdas regionales** para la soberanía de la Corona después de 1392. Schweidnitz-Jauer conserva su incorporación posterior a los demás ducados. En 1742 la serie separa **42 celdas prusianas** —incluido el condado de Glatz— y **cinco austríacas**. La ocupación de 1741 no anticipa toda la Alta Silesia. Gran Polonia, Lusacia y Siewierz se excluyen. El gobierno superior de la Corona no borra la jurisdicción de los príncipes ni del obispo de Nysa.

En Austria se representan Estiria, Carintia y Carniola antes de Neuberg, sin inventar Austria Interior antes de 1379. El archivo tirolés confirma la cesión de 1363 a Rodolfo IV y sus hermanos; no se mantiene el 1365 de una página biográfica contradictoria. Carniola conserva el título señorial hasta 1363 y el ducal desde 1364. Se incorporan Rodolfo IV y Federico II de Babenberg, además de mandatos provinciales documentados de gobernantes existentes. Transilvania, Oltenia y Serbia septentrional tienen gobiernos separados; el cargo imperial no los genera por sí solo. Innviertel comienza en 1779.

Anatolia tiene series regionales de Bitinia y los beylicatos occidentales, Candar y la costa póntica, Karaman, las provincias orientales, Van y la frontera de Kars. El interregno de 1402 rompe la expansión occidental. Van distingue la presencia temporal de 1534, la pérdida de 1536, la conquista de 1548 y las capturas de Ahlat/Erciş en 1552. Kars distingue la cesión de 1565 y la campaña de 1604. Lesbos comienza en 1462. El HTML adjunto se usó como comparación: no se ejecutó ni se copiaron sus máscaras, que contenían adelantos de conquista y atribuciones dudosas.

En Iberia se distinguen Tarifa, Algeciras y Gibraltar en sus fechas; Gibraltar tiene una capa meriní separada de Granada entre 1333 y 1373. Puigcerdà se conserva en la jurisdicción catalana, Andorra queda separada y Rosellón se excluye después de 1659. Madeira y Azores no desaparecen al pasar de 1650 a 1651. Las cesiones milanesas aparecen en Piamonte, sin duplicar la superficie en ambos estados.

## Método y fuentes

Se inspeccionaron imágenes de los mapas históricos y el SVG con sus celdas etiquetadas, incluidos relieves e intersticios. La correspondencia con el mapa antiguo proporciona candidatos; no convierte la vecindad ni el nombre de una ciudad en prueba política. Cada selección fechada contiene su fuente y sus límites en `regional-extent-review.json`.

- [IGN · Atlas Nacional de España, Historia](https://www.ign.es/web/resources/acercaDe/libDigPub/06_Referencias_historicas_2020_20230601.pdf), mapas medievales de pp. 21–22.
- [German Historical Institute · crecimiento del dominio habsbúrgico](https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/the-growth-of-the-habsburg-empire) y [provincias en 1780](https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/administrative-divisions-of-the-habsburg-empire-1780).
- [Homann · Ducatus Silesiae, 1716](https://www.davidrumsey.com/luna/servlet/detail/RUMSEY~8~1~305907~90076292:Ducatus-Silesiae-), catálogo cartográfico; contraste con GHDI y documentación municipal. No se afirma haber podido inspeccionar la imagen original de este catálogo.
- [Atatürk Research Center · Türkiye Cumhuriyeti Tarihi I](https://atam.gov.tr/wp-content/uploads/2023/10/TURKIYE-CUMHURIYETI-TARIHI-1a.pdf), Harita 1–2, pp. PDF 1489–1490: expansión y pérdidas; distingue provincias y tributarios.
- TDV İslâm Ansiklopedisi, artículos sobre cada beylicato, Erzurum, Van, Kars, Karlowitz y Passarowitz, con localizadores individuales en las capas.
- Ministero della Cultura / SIAS para el reino de Sicilia; Regione Lombardia para las cesiones milanesas. Ayuntamiento de Algeciras y Ministerio de Patrimonio de Gibraltar para la alternancia del Estrecho.

Reproducción:

```sh
python3 prototypes/euv-locations/regional-extent-source.py
node prototypes/euv-locations/merge-map-expansions.mjs
# Con Shapely y svgpathtools, las dependencias del auditor geométrico existente:
python prototypes/euv-locations/build-regional-extent-cells.py
npm run audit:regional-extents
```

La auditoría registra el área, los límites y el centroide de cada celda aceptada; los eventos y fuentes se conservan en las series. Las pruebas verifican continuidad de superficie, fuentes, geometrías reales, reglas de gobierno personal y cesiones fechadas. `audit-regional-extents-report.json` se regenera durante la compilación.

## Qué sigue incompleto

La escala anual y las celdas grandes aproximan fronteras. Algunas celdas austríacas de Silesia cruzan el deslinde fluvial. Creta no permite aislar Souda y Spinalonga, venecianas hasta 1715. Serbia septentrional sigue limitada a seis celdas; la fase militar de 1683–1698, las cesiones parciales de Hamid/Teke y la sucesión provincial de Rum durante el interregno requieren mayor detalle. El primer Tirol anterior a 1300 y varios contornos italianos anteriores a 1400 siguen pendientes. En Iberia hacen falta las superficies almohades, la fragmentación posterior y el detalle de Alentejo y condados mallorquines continentales. Bucovina después de 1775 necesita una capa austríaca propia. Estos huecos no se atribuyen al vecino.

La ampliación **no constituye un mapa exhaustivo de Europa durante los 601 años**. El audit actual cuenta **53 entidades efectivas sin relleno**, **54 con mandatos parcialmente sin geometría** y **44 capas de núcleos limitados**. Estas categorías no se suman: una entidad puede estar representada en un año y carecer de geometría en otro. Tener una celda tampoco acredita tener toda la superficie. El mapa completo sigue disponible en `/es/mapa-completo?year=1530`; el selector de jurisdicción añade «Revisión de superficies regionales».

Prioridad de la siguiente revisión: 1) completar las superficies balcánicas y Moravia por períodos; 2) Iberia almohade/nazarí y la frontera del Estrecho anterior a 1400; 3) adquisiciones habsbúrgicas y provincias antes de 1379; 4) Italia medieval y señoríos franceses. Siempre revisar el área de cada ID y la autoridad efectiva antes de colorear.

### Entidades efectivas aún sin representación (53)

- Albret
- Alençon
- Angulema
- Anjou
- Annandale
- Ansbach
- Antioquía
- Aquitania
- Armagnac
- Armenia cilicia
- Bearne
- Berry
- Borbón
- Bulgaria
- Castellbó
- Champaña
- Clermont
- Curlandia
- Dreux
- Évreux
- Foix
- Forlì
- Gandía
- Georgia
- Guisa
- Hannover
- Imericia
- Imola
- Jerusalén
- Kajetia
- Kartli
- Kartli-Kajetia
- Kulmbach
- La Marche
- Mark
- Meißen
- Nassau
- Oldemburgo
- Orleans
- Penthièvre
- Pesaro
- Ravensberg
- Richmond
- Romaña
- Samtsje
- Sirmia
- Suabia
- Tarento
- Trípoli
- Turingia
- Valois
- Vendôme
- York

### Entidades con lagunas de mandatos o períodos

El JSON de cobertura especifica intervalos y personas. La lista incluye también los casos de núcleos limitados o cobertura temporal parcial, por lo que su tamaño no coincide con la cifra de 54 entidades con mandatos parcialmente cartografiados.

- Artois
- Auxerre
- Baden
- Baviera
- Borgoña
- Bosnia
- Brabante
- Brandeburgo
- Brunswick
- Brzeg
- Chipre
- Condado de Borgoña
- Croacia
- Dinamarca
- Epiro de los Tocco
- Escocia
- Eslavonia disputada (núcleos)
- Estados Pontificios
- Flandes
- Florencia
- Francia
- Gobierno de Bihar de Imre Czibak
- Gobierno de Temes de Péter Petrovics
- Gobierno de Temesvár de Bálint Török
- Granada
- Güeldres
- Henao
- Herzegovina
- Hesse
- Hesse-Darmstadt
- Hesse-Kassel
- Holanda
- Holstein
- Irlanda
- Limburgo
- Lorena
- Luxemburgo
- Mecklemburgo
- Milán
- Moldavia
- Moravia
- Morea
- Namur
- Nápoles
- Navarra
- Noruega
- Países Bajos
- Palatinado-Neoburgo
- Piamonte
- Ponthieu
- Rusia
- Saboya
- Sajonia
- Señorío de Ioannina
- Serbia
- Silesia
- Suecia
- Tirol
- Toscana
- Transilvania
- Trebisonda
- Valaquia
- Venecia
- Württemberg
- Zelanda
