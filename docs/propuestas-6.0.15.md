# Propuestas 6.0.15

Dos recomendaciones pedidas para esta versión. Ninguna cambia todavía el Atlas.

## 1. Fechas más precisas: ¿merece la pena?

### El problema

Cada gobierno se guarda con años enteros e inclusivos (`desde`, `hasta`). El mapa es anual: en un año dado, gobierna quien tenga un mandato que lo incluya. Esto produce dos artefactos:

- **Años de sucesión compartidos.** El saliente y el entrante gobiernan «a la vez» ese año. En la base hay 1714 casos de este tipo sobre 2925 mandatos. El mapa ya los resuelve con una regla, la de dar el color al soberano que entra. Pero el inspector muestra a los dos, y si el relevo es entre dos personas de grupos distintos aparece la trama mezclada.
- **Solapes de una misma persona.** Son mandatos de una misma persona en dos territorios que se tocan en el año del cambio; hay 284. Por ejemplo:
  - Enrique III fue rey de Polonia de 1573 a 1575 y de Francia desde 1574. En realidad huyó de Cracovia en junio de 1574, días después de heredar Francia, y nunca gobernó los dos reinos a la vez.
  - Carlos I de Anjou figura en Sicilia hasta 1282 y en Nápoles desde 1282.
  - Felipe II tuvo Nápoles en 1554 y los Países Bajos en 1555, mientras Carlos V seguía en Castilla. Es el caso de 1555 que se arregla en esta versión con otra regla.

### Opciones

1. **Fechas completas opcionales en los mandatos.** Se añadirían `desdeFecha` y `hastaFecha` (AAAA-MM-DD) cuando la fuente las dé, sin quitar los años.
   - El inspector diría «rey de Francia desde el 30 de mayo de 1574».
   - El mapa anual elegiría a quien gobierna en una fecha de referencia del año. Por ejemplo, el 1 de julio, o el último día del año.
2. **Mapa por meses.** Exigiría fechas en todos los mandatos y multiplicaría por doce el cálculo del mosaico y la regresión. No compensa: la cartografía de base es regional y anual.
3. **Dejar los años y ampliar las reglas.** Es lo que se ha hecho hasta ahora (relevo, *jure uxoris*, entregas en vida del padre). Es barato, pero cada caso nuevo necesita otra regla.

### Recomendación

Sí merece la pena hacer la opción 1, por fases y sin el mapa por meses:

1. **Fase 1: datos.** Importar de Wikidata las fechas de inicio y fin de los cargos de soberano («position held», con sus calificadores), solo para personas ya identificadas con fiabilidad. Calculo que cubriría la mayoría de reyes y príncipes desde el siglo XIV, y menos en la Edad Media temprana. Cada fecha importada se revisa contra la fuente de la ficha.
2. **Fase 2: inspector y fichas.** Mostrar las fechas completas cuando existan.
3. **Fase 3: mapa.** En los años con dos mandatos de distinto titular, el color lo da quien gobierna en la fecha de referencia. Si falta la fecha, se mantiene la regla actual. Así desaparecerían los solapes de Enrique III y parecidos sin reglas específicas.

El coste mayor está en la fase 1, la revisión de datos. Las fases 2 y 3 son cambios acotados del inspector y de `governmentGroupsAt` y `europeMosaicAt`, con su prueba de regresión.

## 2. Por qué ramas conviene ampliar el árbol

La base tiene 2814 personas, de las que 1620 tienen al menos un gobierno; 460 de esos gobernantes no tienen ni padre ni madre enlazados. Con el mapa ya coloreado en todos los años, el desequilibrio se ve bien:

- **Mucho detalle:** Francia (200 personas), Inglaterra (134), Castilla (128), los Estados Pontificios (118), Baviera (104) y Portugal (103).
- **Mapa sin personas:** Persia (0), Marruecos y Túnez (0), Egipto (1) y Génova (2). Tampoco hay gobernantes para los nuevos territorios de Oriente Medio y Asia central.

Propuesta, por orden de prioridad:

1. **Enlazar antes que añadir.** Completar padre y madre de los 460 gobernantes que no tienen ninguno. Es lo que más mejora el árbol con menos personas nuevas, porque une ramas que hoy aparecen sueltas.
2. **Los grandes vecinos que ya están en el mapa.** El mapa ya los colorea sin una sola persona detrás:
   - Persia: safávidas, afsáridas, zand y qayar;
   - el Imperio otomano: ampliar los sultanes y sus madres y esposas, que enlazan con Venecia, Serbia y Polonia;
   - los mamelucos, en Egipto y Siria.
3. **El Báltico y el norte.** Ya tienen buena base (Suecia 74, Dinamarca 61, Noruega 47); conviene completar los Holstein-Gottorp, los Mecklemburgo y los Vasa polacos, que conectan con Rusia y Alemania.
4. **El Cáucaso:** los Bagrationi de Kartli, Kajetia e Imericia (Georgia tiene 23 personas). La Armenia cilicia ya tiene 29 y sirve de puente con Chipre y Antioquía.
5. **Italia republicana:** los dogos y las grandes familias de Génova, los Doria y los Spinola, frente a los 34 de Venecia, y los Saboya-Carignano.
6. **El Imperio, por casas medianas:** los Hesse (Hesse tiene 13, Hesse-Kassel y Hesse-Darmstadt 9 cada uno), los Brunswick-Luneburgo, origen de los Hannover (Brunswick tiene 13), y los Wurtemberg (22), todos con enlaces ya presentes en el árbol.

Cada ampliación debería llegar como en 6.0.7: con fuentes, nombres en los dos idiomas y una prueba que compruebe que no quedan personas sin enlazar.
