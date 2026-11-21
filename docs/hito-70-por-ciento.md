# Hacia el 70 %: datos documentados y paridad entre español e inglés

Estado tras la 6.0.16 (21 de noviembre de 2026) y plan para el siguiente hito: **el 70 % de las afirmaciones documentadas con una fuente fiable y concreta, y la versión inglesa con la misma calidad y el mismo contenido que la española.**

## 1. Datos documentados

### Dónde estamos

El registro de afirmaciones (`src/evidence/claims.js`) cuenta fechas, padres, cónyuges, gobiernos y sucesiones de cada persona.

| | 6.0.15 | 6.0.16 |
|---|---:|---:|
| Afirmaciones | 13 134 | 13 134 |
| Documentadas con fuente | 5 248 (40,0 %) | 5 977 (45,5 %) |
| Pendientes de revisión | 7 195 | 6 466 |

Para llegar al 70 % hay que documentar unas **3 220 afirmaciones más**.

### Lo que da cada fuente

La 6.0.16 ha agotado prácticamente las fichas de autoridad de las bibliotecas nacionales:

- **GND** (Deutsche Nationalbibliothek): ya se aprovechó en la V5.25. Solo aporta lo de las personas añadidas después.
- **BnF**: su nota biográfica da años de reinado y filiación de reyes y grandes nobles («Roi de France (de 1226 à 1270), fils et successeur de Louis VIII…»).
- **Library of Congress**: solo fechas.
- **Neue Deutsche Biographie**: la genealogía de cada artículo identifica padre, madre y cónyuges con sus años. Solo cubre a quien tiene artículo en la NDB.

Las afirmaciones que siguen pendientes son sobre todo **parentescos (unas 3 500) y gobiernos (unos 1 400)**. Las fichas de autoridad no recogen la mayoría, aunque la persona tenga ficha.

### Plan para las próximas versiones

Ordenado por rendimiento esperado, con fuentes fiables y comprobación automática estricta (mismo nombre y mismos años, nunca una coincidencia aproximada):

1. **Diccionarios biográficos nacionales identificados** (DBE de la Real Academia de la Historia, DBI de Treccani, ODNB). Sus artículos empiezan por la filiación («Hijo de… y de…», «Nacque… da… e da…»). Unas 900 afirmaciones pendientes son de personas con artículo en el DBE o el DBI. Rendimiento esperado: 300–500.
2. **Foundation for Medieval Genealogy (Medieval Lands)**. Cada entrada de persona trae padres, matrimonios y fechas con su fuente primaria, y cubre casi toda la nobleza medieval del Atlas. Wikidata no la enlaza, así que hay que localizar las entradas por nombre y fechas en las páginas de cada casa. Rendimiento esperado: 1 500–2 500, sobre todo parentescos.
3. **Gobiernos**: listas de soberanos de obras de referencia por territorio (Britannica, Treccani, Historisches Lexikon Bayerns…), comparando año de inicio y de fin. Unas 1 400 afirmaciones de gobierno pendientes; rendimiento esperado: 600–900.
4. **Revisión editorial** de las discrepancias (`docs/versiones/V5.25-discrepancias.md` y `docs/versiones/6.0.16-discrepancias.md`). Cada caso exige decidir entre dos fuentes.

Con 1 a 3 se llegaría a cerca del 70 % en dos o tres versiones. **Wikipedia no sirve para esto**: desde la 6.0.16 no se cita como fuente de ningún dato.

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
|---|---:|---:|---:|
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

### Qué falta para estar seguros al 90 %

1. **Territorios.** Las fichas inglesas no muestran todavía la evolución política, las uniones ni las sucesiones. Esos textos existen solo en una traducción automática de baja calidad (por ejemplo, «Investments by the Habsburgs» por *investidura*). Hay que reescribir unas 390 evoluciones y 29 uniones. Esta versión ya muestra las notas, las pertenencias y los componentes.
2. **Notas de territorio menos frecuentes.** De 380 notas distintas, la 6.0.16 traduce a mano las 12 más repetidas (cubren 490 territorios). Las demás siguen sin mostrarse en inglés.
3. **Notas de gobierno y de sucesión de los lotes v6**: unos 6 000 textos traducidos automáticamente. Se puede revisar por patrones, como en esta versión, y con muestras de 50 por tanda hasta que la tasa de error baje del 5 %.
4. **Nombres.** El 5 % de los textos ingleses aún contiene alguna forma española o híbrida. Muchas son correctas en inglés (apellidos ibéricos, nombres franceses, alias), pero hay que repasar la lista.
5. **Una muestra nueva de 100 fichas** después de cada tanda. Con 100 fichas y 10 errores o menos, se puede afirmar con un 95 % de confianza que la tasa de error real está por debajo del 17 %. Para garantizar el 90 % con esa confianza hacen falta unas 200 fichas con 10 errores o menos.

El 100 % solo es alcanzable con revisión humana completa. Lo realista es llegar al 90 % con revisión por patrones y muestreo, y marcar como «Needs review» lo que no se haya revisado.
