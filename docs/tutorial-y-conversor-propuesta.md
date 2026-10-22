# Propuesta de tutorial y conversor de fechas

Estado a 22 de octubre de 2026: el tutorial incorpora la guía de lectura y los ocho recorridos previstos (33 pasos): persona, familia, tiempo, conexiones, mapas, filtros, casas y conservación de una exploración. El conversor de calendario queda descartado por ahora; el análisis de este documento se conserva como referencia y no se ha implementado.

## V1 implementada

Se entra desde Ayuda o desde «¿Primera visita? Abrir tutorial» cuando el árbol está vacío. Los tres recorridos iniciales mantienen sus cuatro pasos. Se añaden cinco recorridos que completan 33 pasos en español e inglés. Anterior y Siguiente cambian la explicación; los botones de práctica utilizan la búsqueda, la selección de personas, la ampliación familiar, los apartados de la ficha, el año y la cronología existentes.

El avance se guarda por recorrido en este navegador. Cerrar y reabrir permite reanudar el mismo paso sin repetir una acción. Una familia que ya está añadida no se vuelve a ampliar; si cambia la persona, los pasos dependientes del ejemplo permiten volver a Carlos V. Los filtros se retiran solo al pulsar el botón correspondiente. La guía se puede plegar, y la búsqueda, las fuentes y el salto a otra generación la pliegan para dejar visible su contenido. La cabecera y el cierre siguen accesibles al desplazarse. Escape devuelve el foco al control desde el que se abrió.

Los recorridos nuevos reutilizan las herramientas del Atlas: comparación de dos y tres generaciones, mapa personal, Europa, filtros por casa y gobierno, favoritos y exportación con vista previa. La inspección de regiones y el interruptor imperial son prácticas manuales con los controles reales. Las fichas de casas se abren en otra pestaña y conservan la exploración. El botón de filtros declara que retira los demás filtros; guardar un favorito es idempotente. La clave de guardado de V1 y sus identificadores se conservan para no perder el avance anterior.

Guía de lectura ofrece un índice y comparte el texto de Cómo leer el mapa con la explicación existente del proyecto. Controles explica ratón, pantalla táctil y teclado. La ayuda funciona también cuando el navegador impide guardar preferencias.

La entrega incorpora además el escudo vectorial solicitado de Montfort-Bretaña, los créditos de Manuel Muriel Cagigal y 54 retratos nuevos. La colección propuesta de Commons se revisa por persona y conserva los retratos que ya tenía el Atlas; cuando hay una alternativa anterior conocida se prefiere, como en Rodolfo IV, Ladislao el Póstumo, Wenceslao II y Alberto IV de Baviera. Las obras posteriores al personaje se distinguen de las representaciones contemporáneas. La fecha de digitalización no se presenta como fecha del cuadro.

Dos fichas de la colección no identifican al artista: Isabel de Luxemburgo y Carlos Martel conservan esa indicación. El archivo `Katharina of Bohemia.jpg` lleva la inscripción «Margareta Henrici … filia»; se utiliza para Margarita de Tirol, hija de Enrique de Bohemia, y el pie explica esta identificación por inscripción y la discrepancia del nombre del archivo. No se asigna a Catalina de Bohemia. Se descarta `Margaret of Austria Duchess of Bavaria (Landshut).jpg`, cuya inscripción comienza por Elisabeth, al no confirmar la identidad de Margarita de Austria. Estos archivos no se usan para alterar filiaciones, fechas o gobiernos del Atlas.

## Propuesta original (conservada como referencia)

Antes de esta V1, el Atlas ofrecía una ayuda con tres acciones sobre Carlos V: seleccionarlo, añadir su familia y elegir el año 1500. También incluía controles básicos y definiciones. La propuesta que sigue se conserva como referencia del diseño completado.

Habría dos formas de consultar el contenido: una guía completa con índice y ejemplos, y recorridos breves dentro del Atlas. Cada recorrido explicaría qué se quiere averiguar, propondría una acción y mostraría qué significa el resultado. El ejemplo común sería seguir las herencias de Carlos V; otros ejemplos permitirían practicar sin repetir siempre la misma ficha.

| Recorrido | Acciones que enseñaría | Resultado que debe comprenderse |
| --- | --- | --- |
| Encontrar y leer una persona | Buscar Carlos V, abrir la ficha y volver al Atlas | Diferenciar el resumen, los gobiernos y las fuentes |
| Recorrer una familia | Añadir familiares, seleccionar un progenitor, ampliar una rama y volver a centrar | Leer padres, parejas e hijos y recuperar la orientación |
| Conectar personas | Seleccionar entre dos y cinco personas y abrir Conectar personas | Distinguir un parentesco registrado de una coincidencia dinástica |
| Explorar un año | Elegir un año, abrir Cronología y pasar a Europa en este año | Comprender qué información depende del año seleccionado |
| Leer los mapas | Comparar el mapa personal con el común, consultar una región y activar el Sacro Imperio | Interpretar los colores, dependencias, disputas y superposición imperial según los criterios vigentes de Cómo leer el mapa |
| Filtrar sin perderse | Combinar casa y territorio, comparar Vinculados con Gobernaban en el año y retirar filtros | Entender por qué una persona aparece o desaparece de una selección |
| Seguir casas y sucesiones | Abrir una dinastía, consultar Casas de origen y ramas y entrar en una conexión | Separar filiación, transmisión matrimonial, pretensión y gobierno efectivo |
| Conservar una exploración | Marcar favoritos, compartir una vista y exportar el árbol | Saber qué se guarda localmente y qué recibe quien abre un enlace |

Cada recorrido tendría entre tres y cinco pasos, con Anterior, Siguiente, Salir y Reanudar. Cerrar la ayuda devolvería el foco al control desde el que se abrió. La guía no avanzaría por tiempo ni ejecutaría una acción solo al leer un paso. Los ejemplos que cambien una selección o un año lo harían mediante un botón explícito.

En ordenador se usaría un panel que permita seguir viendo el área de trabajo; en móvil, una presentación por pasos que deje accesible la acción correspondiente. Habría instrucciones equivalentes para ratón, pantalla táctil y teclado. Las capturas llevarían texto alternativo y nunca serían la única forma de explicar un control.

## Construcción del tutorial

Se ampliaría AtlasGuide y se aprovecharía el patrón de navegación de StoryAtlasGuide. Los pasos tendrían identificadores estables, texto traducible, condiciones de disponibilidad y acciones conectadas a las funciones existentes. Así se evitaría depender de coordenadas de pantalla o selectores frágiles.

La primera entrega reuniría la guía de lectura y los recorridos de búsqueda, familia y tiempo. Una segunda incorporaría mapas, filtros y conexiones. Favoritos, compartir y exportar completarían el conjunto. Cómo leer el mapa seguiría siendo la referencia única para los criterios históricos, para evitar explicaciones divergentes.

La aceptación se comprobaría con tareas concretas: encontrar una persona sin ayuda externa, explicar una diferencia entre sus dos mapas, conectar dos familiares y compartir el año elegido. Se probarían teclado, móvil, cierre a mitad de recorrido, reanudación y filtros que oculten al protagonista. El recorrido debe adaptarse si la familia ya está añadida o el usuario ha cambiado de persona.

## Utilidad del conversor

Un conversor juliano y gregoriano ayudaría a comparar cartas, tratados y acontecimientos fechados en lugares con calendarios diferentes. La adopción del calendario gregoriano no fue simultánea y la diferencia entre calendarios cambia con las reglas de los años bisiestos. La guía de [Manuscritos de la Universidad de Nottingham](https://www.nottingham.ac.uk/manuscriptsandspecialcollections/researchguidance/datingdocuments/juliangregorian.aspx) ilustra el problema con correspondencia y documentos de doble fecha.

Su utilidad inmediata sería menor para el mapa, cuya selección y gobiernos se expresan por años. Una fecha incompleta o aproximada no debe convertirse inventando un día y un mes. Cuando se incorpore más cronología diaria, el conversor tendría mayor valor junto a las fuentes y las fichas.

## Primera versión del conversor

La herramienta pediría día, mes, año y calendario de origen. Mostraría ambas fechas, con sus calendarios escritos, y permitiría invertir la dirección y copiar el resultado. El calendario de origen lo elegiría la persona que consulta la fuente; un territorio no determinaría automáticamente la respuesta.

Por ejemplo, el 10 de noviembre de 1583 juliano equivale al 20 de noviembre gregoriano. Una fecha gregoriana anterior al 15 de octubre de 1582 se identificaría como proléptica: aplica retrospectivamente las reglas de un calendario que todavía no se utilizaba.

El cálculo conservaría la fecha original. Convertir una fecha no verifica qué calendario empleó su fuente. La interpretación de años que comenzaban en marzo, fechas por reinado o festividades requeriría un tratamiento independiente.

## Viabilidad y límites

| Alcance | Viabilidad | Trabajo necesario |
| --- | --- | --- |
| Conversión entre dos calendarios elegidos explícitamente | Alta | Aritmética entera, validación, presentación y pruebas |
| Mostrar un equivalente junto a una fecha documentada de una ficha | Media | Registrar calendario de origen, precisión y procedencia en los datos |
| Deducir el calendario por lugar y año | Complejidad alta | Investigar adopciones por jurisdicción, excepciones y prácticas documentales |

La conversión básica podría ejecutarse localmente, sin cuentas, servidor ni API externa. Se usaría un número continuo de día como paso intermedio, con algoritmos válidos para todo el intervalo del Atlas. El [capítulo Calendars del Explanatory Supplement to the Astronomical Almanac](https://aa.usno.navy.mil/downloads/c15_usb_online.pdf), especialmente el apartado 15.11, proporciona una referencia para esos algoritmos. La fórmula abreviada de USNO para 1801–2099 no bastaría para cubrir 1200–1800.

Las pruebas incluirían conversiones de ida y vuelta, cambios de año, fin de mes y las diferencias de bisiestos en 1600, 1700 y 1800. La validación respetaría el calendario de entrada: el 29 de febrero de 1700 existe en el juliano y no en el gregoriano. No se usaría una suma fija de trece días ni la normalización automática de fechas inválidas del navegador.

Una primera versión se limitaría a esos dos calendarios matemáticos. Los días omitidos por una reforma local, el calendario sueco transitorio y otros estilos históricos necesitarían reglas documentadas adicionales. La conversión explícita sería una ampliación pequeña; la interpretación histórica automática sería un proyecto de investigación separado.

## Orden recomendado

Primero ampliaría el tutorial, porque mejora el acceso a todo lo ya construido. Después incorporaría el conversor básico desde Ayuda o Herramientas, manteniendo la selección explícita del calendario. La integración automática en las fichas dependería de disponer de fechas completas y calendarios documentados en los datos.
