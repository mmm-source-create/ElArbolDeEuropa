# Criterio editorial de nombres · V5.37

El nombre público es una forma historiográfica breve en el idioma de la página. La titulatura oficial va en los cargos, y los sobrenombres y variantes siguen siendo buscables. La regla se publica también en Fuentes y metodología, en español e inglés, desde `src/content/personNamingPolicy.js`.

## Orden de decisión

1. Identificar a la persona y sus fuentes antes de escoger una forma lingüística. Mantener su ID.
2. Usar el exónimo establecido en cada historiografía: Juan / John, Nicolás Maquiavelo / Niccolò Machiavelli. No traducir automáticamente nombres italianos o apellidos.
3. En soberanos, conservar el ordinal histórico y añadir su reino si hace falta contexto: Luis I de Hungría / Louis I of Hungary. El reino corresponde a ese ordinal, no necesariamente al primer cargo del registro. Wenceslao III es de Bohemia; Jaime II es de Aragón, aunque ambos tuvieron otras coronas con otras numeraciones.
4. No inventar un ordinal para igualar idiomas. El inglés llama habitualmente John al rey español Juan I de Inglaterra. En el catálogo inglés figura John of England; King John y John Lackland siguen siendo variantes.
5. Separar sobrenombre y nombre cuando existe un ordinal o identificación suficiente. Pedro I de Rusia / Peter I of Russia lleva el Grande / the Great en el campo propio. Lo mismo se aplica a Catalina II y Federico II. Juana de Arco lleva la Doncella de Orleans / the Maid of Orléans.
6. Mantener todas las coronas y numeraciones en los gobiernos y variantes: Carlos V y Carlos I designan a una persona. No concatenar su titulatura completa en cada tarjeta ni deducir territorios a partir del nombre.
7. Los tratamientos san/santa no encabezan las fichas generales. Se conservan como variantes y se explican en la biografía. Los papas usan su nombre pontificio, con su nombre anterior como variante cuando esté documentado.
8. Conservar identificadores, relaciones y enlaces publicados. Añadir el nombre anterior a `aliases` y fijar el antiguo `slug` al cambiar `nombre`.

En español, el artículo de un sobrenombre va en minúscula y los términos significativos llevan mayúscula: el Grande, la Doncella de Orleans. Véase [FundéuRAE: escritura de apodos y alias](https://www.fundeu.es/recomendacion/apodos-alias-escritura/). En inglés se usa la forma inglesa asentada, sin trasladar literalmente todos los epítetos españoles.

## Excepciones explícitas

Carlos V / Charles V y Maximiliano I / Maximilian I son formas imperiales consolidadas. Matías Corvino / Matthias Corvinus y Carlos de Durazzo / Charles of Durazzo identifican bien a personas con trayectorias y numeraciones distintas. Los sultanes otomanos conservan la forma regnal convencional, como Solimán I / Suleiman I; «el Magnífico» y «the Magnificent» quedan separados, y «the Lawgiver» permanece como variante.

Se admiten epítetos identificativos cuando no existe un ordinal consolidado o la forma identifica una rama particular: Enrique el Joven, Sten Sture el Viejo y el Joven, Martín el Joven, y varias denominaciones tradicionales de gobernantes rumanos. Cada caso tiene una explicación en `HISTORICAL_NAME_EXCEPTIONS`. Un epíteto incorporado a esta forma identificativa no vuelve a mostrarse debajo del nombre.

La separación entre nombre, título y epíteto es una decisión editorial del Atlas, no una supuesta norma universal de los historiadores. Se apoya en usos institucionales como [William I y su sobrenombre en la Casa Real británica](https://www.royal.uk/william-the-conqueror?page=1), [John y Lackland en Westminster Abbey](https://www.westminster-abbey.org/abbey-commemorations/royals/john) y [Louis XIV, título y Sun King en Versalles](https://en.chateauversailles.fr/discover/history/great-characters/louis-xiv). Para Juana, [L’Osservatore Romano documenta la Doncella de Orleans](https://www.osservatoreromano.va/es/news/2024-07/dcm-007/la-formidable-doncella.html).

## Revisión de la base y nuevas incorporaciones

`npm run audit:names` examina los 2724 registros españoles y las 156 ediciones inglesas: nombres vacíos, tratamientos de santidad en el encabezado, nombres regios sin contexto, sobrenombres repetidos, rutas de traducción y conservación de variantes y slugs revisados. Se ejecuta también antes de compilar.

La V5.36 aplica 39 ajustes editoriales explícitos, recogidos en `src/data/personNameReviews.js` y [el informe de revisión](audits/V5.36-nombres.json). Son 38 denominaciones revisadas y el sobrenombre español de Juana de Arco. No cambia fechas, gobiernos, parentescos ni geometrías. El examen es estructural y editorial; no afirma haber vuelto a verificar bibliográficamente cada nombre individual de la base. Los epítetos identificativos y las formas imperiales se revisan con excepciones expresas, sin convertirlos automáticamente en nuevos ordinales.

Al añadir una traducción, revisar también nombres de familiares, contemporáneos y evidencias; traducir títulos visibles y notas, conservar nombres de obras y sus enlaces, e incorporar las variantes famosas a la búsqueda. La generación rechaza texto editorial que carezca de traducción. El listado de personas en inglés y Retratos se alimentan de esas mismas fichas.

## Revisión peninsular · V5.37

Se han repasado los 116 registros de soberanos vinculados a gobiernos regios de Portugal, Castilla, León, Aragón, Valencia, Navarra, Mallorca, Granada y al-Ándalus presentes en la base, incluida la pretensión navarra de Blanca II. El examen incluye reyes por matrimonio y titulares; esa inclusión no los convierte en gobernantes efectivos. Las reinas consortes sin gobierno propio no se equiparan a reinas reinantes. La edición inglesa incorpora las 107 fichas que faltaban: las 116 personas del conjunto tienen ya una ficha completa en inglés, dentro de un total de 155.

- En español se mantienen los exónimos asentados: Alfonso, Juan, Pedro, Eduardo y Sebastián de Portugal. En inglés se emplean Afonso, John y Peter; también Denis of Portugal, Edward of Portugal, Henry of Portugal y Sebastian of Portugal, sin imponerles un ordinal solo porque lo lleve su ficha española. Duarte, Dinis y los ordinales alternativos siguen como variantes buscables.
- Felipe III de Navarra / Philip III of Navarre y Juan III de Navarra / John III of Navarre identifican el reino al que pertenece el ordinal. Évreux y Albret permanecen en la casa, las variantes y la explicación de su realeza por matrimonio.
- Enrique IV de Francia / Henry IV of France conserva Enrique III / Henry III de Navarra como variante. Pedro I de Brasil / Pedro I of Brazil conserva Pedro IV de Portugal / Pedro IV of Portugal; el encabezado no concatena las dos numeraciones. Se mantienen los enlaces publicados.
- Boabdil se muestra en el campo de sobrenombre de Muhammad XII de Granada. Muley Hacén y el Zagal siguen siendo buscables. Las numeraciones de los últimos nazaríes varían entre estudios: la ficha distingue expresamente las alternativas sin crear otra persona con el mismo soberano. Se conserva la numeración convencional utilizada por el Atlas.
- María de Padilla sustituye el nombre confundido «Constanza María de Padilla», conservando la antigua URL. Isabel de Mallorca lleva «Reina» en su gobierno pretendido y mantiene la condición de pretensión.

Los otros ordinales de las coronas compartidas permanecen buscables: Carlos I de España, Felipe I, II y III de Portugal, Fernando V de Castilla, Jaime I y Pedro I de Sicilia o Alfonso I de Nápoles. La búsqueda del atlas reconoce también Charles V, para que el ejemplo del tutorial inglés encuentre a Carlos V.

Las traducciones conservan todos los gobiernos, fechas, parentescos, fuentes, controversias documentales y secciones extensas disponibles en la ficha española. `audit:names` comprueba también que ningún registro del conjunto peninsular carezca de traducción completa. Este examen editorial de los registros existentes no constituye un catálogo nuevo de todas las dinastías y sucesiones anteriores al período del Atlas.

Referencias de las decisiones particulares: [coronación de Juana II y Felipe III, Gobierno de Navarra / Universidad Pública de Navarra](https://academica-e.unavarra.es/entities/publication/91d1a28d-7db8-4ece-9101-27fe95466a5e); [Sebastian y sus variantes, British Museum](https://www.britishmuseum.org/collection/term/BIOG114939); [María de Padilla y sus hijos, investigación publicada en Edad Media](https://revistas.uva.es/index.php/edadmedia/es/article/view/557/534); [Carlos IV y las abdicaciones de Aranjuez y Bayona, Banco de España](https://coleccion.bde.es/wca/es/secciones/coleccion/obras/carlos-iv-p_177.html); [discusión académica de las cronologías nazaríes](https://uvadoc.uva.es/bitstream/10324/76635/3/edadmedia_26_459-502.pdf).


## Nuevas incorporaciones bilingües · octubre de 2026

Las personas, casas e historias nuevas se entregan completas en español e inglés en la misma PR, incluidos textos extensos, notas, evidencias, créditos y enlaces. Las cien traducciones de fichas anteriores se cuentan aparte de las incorporaciones.

Los exónimos también se aplican a la nobleza: Juan Amor Tarnowski conserva Jan Amor Tarnowski como variante y como nombre inglés. Tadeo Kościuszko conserva Tadeusz Kościuszko en inglés y en las variantes; la forma española está documentada en el [Museo Lázaro Galdiano](https://www.museolazarogaldiano.es/fondos/tadeo-kosciusko).
