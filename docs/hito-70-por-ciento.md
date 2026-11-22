# Hacia el 70 %: datos documentados y paridad entre español e inglés

Estado tras la 6.0.22 (22 de noviembre de 2026) y plan para el siguiente hito: **el 70 % de las afirmaciones documentadas con una fuente fiable y concreta, y la versión inglesa con la misma calidad y el mismo contenido que la española.**

## 1. Datos documentados

### Dónde estamos

El registro de afirmaciones (`src/evidence/claims.js`) cuenta fechas, padres, cónyuges, gobiernos y sucesiones de cada persona.

| | 6.0.15 | 6.0.16 | 6.0.17 | 6.0.18 | 6.0.19 | 6.0.20 | 6.0.21 | 6.0.22 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Afirmaciones | 13 134 | 13 134 | 13 134 | 13 134 | 13 134 | 13 134 | 13 134 | 13 134 |
| Documentadas con fuente | 5 248 (40,0 %) | 5 977 (45,5 %) | 6 803 (51,8 %) | 6 842 (52,1 %) | 6 847 (52,1 %) | 6 994 (53,3 %) | 7 923 (60,3 %) | 8 231 (62,7 %) |
| Pendientes de revisión | 7 195 | 6 466 | 5 640 | 5 601 | 5 595 | 5 448 | 4 519 | 4 213 |

La 6.0.19 añade 23 límites precisos de 14 mandatos y cuatro relaciones familiares con fuentes propias. El balance de esa entrega fue de **6 847 documentadas, 458 aproximadas, 59 discutidas, 175 inferidas y 5 595 pendientes** (13 134 en total). Las precisiones de mandatos ya documentados no se cuentan como nuevas afirmaciones.

La 6.0.20 añade **147 afirmaciones documentadas de 97 personas**: 75 gobiernos o pontificados, 39 filiaciones, 32 afirmaciones de matrimonio (incluidas sus direcciones inversas cuando estaban pendientes) y un fallecimiento. Son 31 fuentes específicas consultadas. El balance actual es de **6 994 documentadas, 458 aproximadas, 59 discutidas, 175 inferidas y 5 448 pendientes**. El total sigue en 13 134; faltan **2 200** documentadas para alcanzar el 70 %. No se incorporan personas nuevas ni se cuentan traducciones como documentación nueva.

Las series revisadas son los pontífices del Vaticano, soberanos y regentes de Suecia, reyes croata-húngaros y Jagellón, monarcas escoceses y ramas de los Wittelsbach. Las fechas que contradicen el catálogo o solo acreditan otro título siguen pendientes. El detalle y las exclusiones constan en [la revisión de 6.0.20](reports/6.0.20-documentacion.md).

La 6.0.21 añade **929 afirmaciones documentadas de 573 personas**:

- 911 de una tercera pasada por Medieval Lands:
  - listas de hijos con párrafo propio;
  - identificación con un año seguro y un pariente nombrado;
  - gobiernos con frase de acceso;
  - las dos caras de cada matrimonio;
- 18 del Dizionario Biografico degli Italiani.

El balance es de **7 923 documentadas (60,3 %), 458 aproximadas, 59 discutidas, 175 inferidas y 4 519 pendientes**. Faltan **unas 1 270** para el 70 %. Detalle en [las notas de 6.0.21](releases/6.0.21.md) y [sus discrepancias](versiones/6.0.21-discrepancias.md).

La 6.0.22 añade **308 afirmaciones documentadas**:

- 250 del Diccionario Biográfico Español de la RAH;
- 47 de las biografías nacionales de Suecia, Noruega y Dinamarca;
- 6 de Medieval Lands;
- 5 fechas corregidas tras comprobar la identidad de la persona.

Faltan **unas 965** para el 70 %. Las fechas comparadas, las corregidas y las que se dejan para revisión están en [6.0.22-fechas.md](versiones/6.0.22-fechas.md).

### Lo que da cada fuente

La 6.0.16 ha agotado prácticamente las fichas de autoridad de las bibliotecas nacionales:

- **GND** (Deutsche Nationalbibliothek): ya se aprovechó en la V5.25. Solo aporta lo de las personas añadidas después.
- **BnF**: su nota biográfica da años de reinado y filiación de reyes y grandes nobles («Roi de France (de 1226 à 1270), fils et successeur de Louis VIII…»).
- **Library of Congress**: solo fechas.
- **Neue Deutsche Biographie**: la genealogía de cada artículo identifica padre, madre y cónyuges con sus años. Solo cubre a quien tiene artículo en la NDB.

Las afirmaciones que siguen pendientes son sobre todo **parentescos (unas 2 400) y gobiernos (unos 1 100)**, más 420 nacimientos y 540 fallecimientos. Las fichas de autoridad no recogen la mayoría, aunque la persona tenga ficha.

### Plan para las próximas versiones

Ordenado por rendimiento esperado, con fuentes fiables y comprobación automática estricta (mismo nombre y mismos años, nunca una coincidencia aproximada):

1. **Hecho en la 6.0.17:**
   - **Medieval Lands** dio 741 afirmaciones, menos de lo previsto. Solo se identifican las personas con los dos años de vida seguros, y Medieval Lands apenas llega más allá de 1500.
   - **El DBI** dio 89 filiaciones.
   - **El DBE de la Real Academia de la Historia** no se puede consultar de forma automática desde su nueva web.
2. **Ampliar Medieval Lands a personas con un solo año seguro.** Hecho en la 6.0.18 a través de la lista de hijos de un progenitor identificado. Aportó solo 35 afirmaciones: casi todas las personas sin años seguros tampoco tienen progenitores identificados.
   - **Selección inicial de la 6.0.18:** unos 180 gobiernos de coronas compuestas (Croacia con Hungría; Barcelona, Valencia y Mallorca con Aragón; León con Castilla) cuyas fichas fechan la corona principal. La 6.0.20 documenta una parte de los croatas mediante pasajes que nombran expresamente esa corona. El resto exige comprobación territorio por territorio.
3. **Gobiernos**: listas de soberanos de obras de referencia por territorio (Britannica, Treccani, Historisches Lexikon Bayerns…), comparando año de inicio y de fin. Unas 1 400 afirmaciones de gobierno pendientes; rendimiento esperado: 600–900.
4. **Revisión editorial** de las discrepancias (`docs/versiones/V5.25-discrepancias.md` y `docs/versiones/6.0.16-discrepancias.md`). Cada caso exige decidir entre dos fuentes.

5. **Hecho en la 6.0.21:** Medieval Lands da ya lo que puede dar con reglas estrictas (911 afirmaciones más). Lo pendiente se concentra en:
   - personas de los siglos XVI–XVIII;
   - Europa oriental;
   - gobiernos de coronas compuestas.

   El DBE de la RAH carga sus biografías desde una interfaz no documentada. Antes de consultarla de forma automática hay que pedir autorización o buscar otra vía.

6. **Hecho en la 6.0.22:**
   - la RAH (con permiso);
   - el SBL, el NBL y el DBL.

   Quedan por usar:
   - el Dictionary of Irish Biography, que bloquea las consultas automáticas;
   - las obras de Europa oriental y del Cáucaso: los Bagrationi suman unas 320 afirmaciones pendientes y Medieval Lands apenas los cubre.

7. **Siglos XVI–XVIII**, que Medieval Lands no cubre: genealogías de la NDB ampliadas, el ODNB y las obras de referencia nacionales (Dansk Biografisk Leksikon, Svenskt biografiskt lexikon, Polski Słownik Biograficzny), artículo por artículo.

La siguiente selección debe ampliar las series territoriales y las genealogías nominales que todavía aportan datos, y resolver los casos discrepantes con una segunda fuente. El progreso se mide con afirmaciones pendientes realmente documentadas; el número de fuentes añadidas a una biografía no sustituye ese recuento. Desde la 6.0.16 no se cita Wikipedia como fuente de ningún dato.

## 2. Traducción al inglés

### Cómo se mide

- `npm run audit:english-parity` compara, sobre la web generada (`dist/`), cada página española con la inglesa:
  - longitud;
  - años que aparecen en una y no en la otra;
  - palabras españolas en el texto inglés.
- `npm run audit:v6-english` sigue comprobando que todo está traducido y detecta frases degradadas conocidas.
- **Muestra revisada a mano**: 40 fichas al azar, comparando el texto español con el inglés.

### Resultados de la 6.0.16

Páginas sin ninguna diferencia detectada (`docs/reports/english-parity.json`):

| | Páginas | Antes de la 6.0.16 | Después |
|---|---:|---:|---:| --- |
| Personas | 2 814 | 0 | 2 637 (94 %) |
| Dinastías | 521 | 502 | 504 (97 %) |
| Territorios | 1 041 | 14 | 16 (2 %) |
| Historias | 44 | 14 | 14 (32 %) |
| **Total** | **4 420** | **530 (12 %)** | **3 171 (72 %)** |

- **Personas.** Antes, todas las fichas fallaban por el historial editorial, que en inglés era una frase genérica. Las 145 que aún pierden algún año lo hacen casi siempre por notas de gobierno que no se muestran traducidas.
- **Territorios.** La página inglesa sigue sin la evolución política, las uniones y la sucesión explicada.
- **Historias.** La página española lista las fuentes de cada personaje y la inglesa remite a la ficha española.

En la muestra de 40 fichas había errores claros en 9 o 10 antes de las correcciones:
- nombres sin traducir;
- frases sin sentido («Dignity was elective: its mandate allows to follow…»);
- un resumen que decía lo contrario que el español (Clemente V);
- pies de retrato en español.

Es decir, en torno a un **75 % de fichas sin ningún error**. Las correcciones de esta versión atacan esas categorías en todo el corpus.

Una segunda muestra, de 60 fichas elegidas al azar en la web ya generada, da 13 o 14 páginas con algún error, es decir, alrededor de un **77 % de fichas impecables**. Los errores que quedan son:

- nombres de pila españoles en mitad del texto («Theobaldo I», «Inés de Beaujeu», «John Jacobo»);
- topónimos españoles («Monferrato»);
- pies de retrato con el título de la obra en español;
- y, en uno de cada veinte textos, frases traducidas sin sentido («Alexander V's brother was promoted during one of his expulsions»).

Casi todos son de los textos largos traducidos automáticamente en la V6. Los resúmenes escritos a mano no tienen errores en ninguna de las dos muestras.

### Resultados de la 6.0.21

- Páginas sin diferencias detectadas: **94 %** (4 154 de 4 420). Antes eran el 76,7 %.
- Territorios: 928 de 1 041, frente a 244. Las fichas inglesas muestran ya la sucesión ordenada, los relevos explicados, las crisis y los acontecimientos, traducidos a mano.
- Lo que queda:
  - 55 fichas de personas pierden algún año (antes, 144). Casi siempre es por notas y localizadores de la evidencia sin versión inglesa: de unos 3 900 textos de ese tipo, la 6.0.21 traduce a mano los 111 más repetidos.
  - 25 historias.
  - 82 territorios con páginas más cortas, sobre todo porque les faltan notas de gobierno.

### Resultados de la 6.0.22

- Páginas sin diferencias detectadas: **95,9 %** (4 238 de 4 420).
- Territorios: 976 de 1 041. Todas las notas de territorio están traducidas y se muestra el rango del territorio.
- Historias: 37 de 44. Las páginas inglesas listan ya todas las fuentes de sus personajes.

### Qué falta para estar seguros al 90 %

1. **Territorios.** Las fichas inglesas no muestran todavía la evolución política, las uniones ni las sucesiones. Esos textos existen solo en una traducción automática de baja calidad (por ejemplo, «Investments by the Habsburgs» por *investidura*). Hay que reescribir unas 390 evoluciones y 29 uniones. Esta versión ya muestra las notas, las pertenencias y los componentes.
2. **Notas de territorio menos frecuentes.** De 380 notas distintas, la 6.0.16 traduce a mano las 12 más repetidas (cubren 490 territorios). Las demás siguen sin mostrarse en inglés.
3. **Notas de gobierno y de sucesión de los lotes v6**: unos 6 000 textos traducidos automáticamente. Se puede revisar por patrones, como en esta versión, y con muestras de 50 por tanda hasta que la tasa de error baje del 5 %.
4. **Nombres.** El 5 % de los textos ingleses aún contiene alguna forma española o híbrida. Muchas son correctas en inglés (apellidos ibéricos, nombres franceses, alias), pero hay que repasar la lista.
5. **Una muestra nueva de 100 fichas** después de cada tanda. Con 100 fichas y 10 errores o menos, se puede afirmar con un 95 % de confianza que la tasa de error real está por debajo del 17 %. Para garantizar el 90 % con esa confianza hacen falta unas 200 fichas con 10 errores o menos.

El 100 % solo es alcanzable con revisión humana completa. Lo realista es llegar al 90 % con revisión por patrones y muestreo, y marcar como «Needs review» lo que no se haya revisado.
