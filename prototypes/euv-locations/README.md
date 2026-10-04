# Laboratorio paralelo: EU V Locations

El Atlas sigue usando **EU V Provinces** (`src/MapChart_Map.svg`). Este
laboratorio compara esa geometría con la exportación **EU V Locations** sin
cambiar el mapa público. Los ensayos fechados generan capas propias a partir
de la base histórica y registran las correcciones que todavía no se han
integrado en el Atlas.

![Encuadre del prototipo](preview.png)

## Probarlo

Desde la raíz del repositorio, inicia Vite y abre
`/prototypes/euv-locations/`. Los mapas se muestran con el mismo encuadre;
puedes buscar un ID, pulsar una zona, arrastrar y ampliar. El mapa nuevo se
carga solo al visitar el laboratorio. No entra en el flujo habitual del Atlas.

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
| Bouillon y Cuijk | No se atribuyen por defecto a Luxemburgo o Brabante. Bouillon fue señorío aparte; Cuijk fue señorío distinto de Brabante, aunque Carlos V sí consta como su señor en el siglo XVI. | [Larousse: ducado de Bouillon](https://www.larousse.fr/encyclopedie/autre-region/duch%C3%A9_de_Bouillon/109685) y [archivo regional BHIC: Cuijk y Carlos V](https://www.bhic.nl/ontdekken/verhalen/cuijkse-heggenleggers-en-kartuizers-in-het-midden-van-de-zestiende-eeuw). |

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

### Dudas de esta entrega

- Falta una fecha documentada para incorporar el señorío de **Cuijk** como
  territorio propio de Carlos V. El archivo acredita su señorío a mediados
  del XVI; colorearlo como Brabante sería incorrecto. Permanece gris.
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
