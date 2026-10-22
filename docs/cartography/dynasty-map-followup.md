# Dinastías, imágenes y lectura del mapa · 21 de octubre de 2026

La revisión parte de [los criterios del proyecto](political-unions.md) y de `src/content/mapReadingGuide.js`, incluyendo la revisión posterior de la integración de las monarquías en el mapa personal.

## Uniones y colores

- Gran Bretaña recibe `#945C52` desde 1707, distinto del inglés `#7A4F3B`. Hannover conserva su color durante la unión personal: no se introduce una unidad exterior permanente por compartir soberano. La convención continental de 1757 se conserva como contraejemplo a una fusión automática; las referencias y límites de esta decisión están en el documento de criterios.
- Polonia-Lituania mantiene 1569 como fecha documentada de política exterior común. No se adelanta todo el periodo a 1386 por la unión dinástica. Los mapas personales no cambian por esta comprobación.
- Schleswig entra en el conjunto exterior danés en 1721, con cuatro mandatos ducales documentados; Holstein en 1773, aprovechando el mandato existente. La ocupación de Schleswig de 1713–1720 y las partes de Gottorp anteriores no se convierten en integración jurídica. Los dos ducados mantienen su color personal.
- Saboya y Piamonte pasan a `#8175A7`, más distinguible del azul francés. Las reglas políticas y superficies territoriales no dependen del cambio de tono.

## Repeticiones y encuadre

`npm run audit:map-duplicates` recorre 1200–1800: 601 años, 3.802.339 celdas-año coloreadas y 47.261 celdas-año con superposición. No hay capas duplicadas de una misma identidad política. Las jurisdicciones distintas que coinciden en una celda se mantienen.

El inspector sí repetía autoridades cuando una restauración o un cambio de condición dejaba varios mandatos de la misma persona, entidad, título y función en un año. La comprobación inicial encontró 770 repeticiones incluso conservando condición y ámbito en la clave. La consolidación de la autoridad anual, incluidos los cambios de condición del mismo año, reúne 1.196 entradas-celda-año: quedan 4.068.634 entradas y cero duplicados. Se conservan los objetos originales de todos los mandatos y afirmaciones, sus intervalos, notas y pasajes citados. Ejemplos comprobados: Juan V en 1390, Felipe V en 1724 y Cristián Augusto de Zerbst en 1746. Los rivales, regentes y entidades distintas siguen separados.

El control del Sacro Imperio pasa a la barra superpuesta. Ya no añade una fila con relleno superior al contenedor del mapa. Su explicación aparece en la leyenda. Activar la capa no modifica las dimensiones de la superficie ni su cámara; el inspector sigue accesible.

## Casas y Ascania

Las fichas enlazan la casa de origen y sus ramas directas mediante el mismo componente de tarjeta que el catálogo: escudo, nombre, total, muestra de miembros y enlace. Se usa la clasificación genealógica explícita y las relaciones de ramas del proyecto, excluyendo las carpetas regionales. Las ramas intermedias enlazan en ambas direcciones. Las continuidades por matrimonio se distinguen de la afirmación de una ascendencia masculina única; Habsburgo-Lorena enlaza ambas casas de origen. Las fichas con linajes homónimos llevan una aclaración. Clermont-Lodève no se presenta como rama capeta por coincidir con el nombre de Clermont.

Los seis miembros previos de Ascania pertenecen al mismo linaje general, con ramas de Sajonia-Lauenburgo, Sajonia-Wittenberg, Anhalt-Dessau y Anhalt-Zerbst. No se convierten en una misma entidad territorial. Se añaden cinco Ascanios —Magnus I, Juan Jorge II, Leopoldo I, Juan Luis I y Federico Augusto— y Enriqueta Catalina de Orange-Nassau. Los nuevos parentescos y gobiernos tienen revisiones individuales en `src/evidence/dynastyMapReviews.js`.

La capa conjunta de Anhalt no permite entregar todas sus particiones al príncipe de Dessau: su mandato se registra, pero su superficie personal queda pendiente. Zerbst se limita a su celda y a la herencia de Jever cuando existe capa activa. No se atribuyen Bernburg o Ballenstedt a esos gobernantes. El título familiar de Juan Luis I no se transforma en soberanía sobre toda Anhalt.

## Imágenes y presentación

Se añaden los retratos propuestos de Jaime II y Catalina Micaela y los escudos de Saboya-Carignano, Pallars, Baux, Avesnes, FitzGerald, Bruce y Ascania. Los archivos compartidos siguen reutilizándose. El SVG de Pallars conserva su dibujo y elimina solo la corona exterior; el crédito identifica la adaptación. Avesnes usa la variante vectorial de recortes aportada por Manuel Muriel Cagigal y se acredita como uso autorizado en el Atlas, sin inventar una licencia libre ni procedencia de Wikimedia.

El resumen de la cabecera dinástica se centra con una regla que prevalece sobre la hoja general. La nota de créditos del catálogo tiene un margen positivo y queda fuera de la última tarjeta también al filtrar a una sola casa.

Las referencias de imágenes, autores, licencias y modificaciones están en `escudosCommons.js` e `imagenesPersonas.js`, visibles en las fichas y en Licencias. Las pruebas cubren las fechas danesas, los colores británicos, las relaciones entre casas, las fuentes nuevas y la conservación de los mandatos al consolidar las autoridades.
