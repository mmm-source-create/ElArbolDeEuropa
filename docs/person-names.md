# Criterio editorial de nombres · V5.36

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

`npm run audit:names` examina los 2723 registros españoles y las 48 ediciones inglesas: nombres vacíos, tratamientos de santidad en el encabezado, nombres regios sin contexto, sobrenombres repetidos, rutas de traducción y conservación de variantes y slugs revisados. Se ejecuta también antes de compilar.

La V5.36 aplica 39 ajustes editoriales explícitos, recogidos en `src/data/personNameReviews.js` y [el informe de revisión](audits/V5.36-nombres.json). Son 38 denominaciones revisadas y el sobrenombre español de Juana de Arco. No cambia fechas, gobiernos, parentescos ni geometrías. El examen es estructural y editorial; no afirma haber vuelto a verificar bibliográficamente cada nombre individual de la base. Los epítetos identificativos y las formas imperiales se revisan con excepciones expresas, sin convertirlos automáticamente en nuevos ordinales.

Al añadir una traducción, revisar también nombres de familiares, contemporáneos y evidencias; traducir títulos visibles y notas, conservar nombres de obras y sus enlaces, e incorporar las variantes famosas a la búsqueda. La generación rechaza texto editorial que carezca de traducción. El listado de personas en inglés y Retratos se alimentan de esas mismas fichas.
