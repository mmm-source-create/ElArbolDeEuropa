# Propuesta · Orientación y navegación

Respuesta a la opinión recibida: «no sabe muy bien dónde ir» y «qué tiene que
hacer». Revisión hecha sobre el sitio en tema claro y oscuro, en escritorio y
móvil, recorriendo portada, Atlas, Personas, Dinastías, Territorios, Historias
y Desafío.

## Diagnóstico

1. **Cuatro niveles de pestañas en el Atlas.** Navegación del sitio (Atlas,
   Personas…) → escena (Atlas / Europa en este año) → vista (Árbol / Mapa /
   Árbol y mapa) → paneles y herramientas. Cada nivel parece igual de
   importante y ninguno dice cuál es el primer paso.
2. **El árbol se queda en una persona.** Tras elegir a alguien, el árbol muestra
   una sola tarjeta y la ampliación de la familia vive en la sección Familia de
   la ficha, fuera de la vista. Era el punto en el que más gente se detenía.
3. **Textos que remitían a controles que ya no existen** («pulsa “Añadir
   familia”»), y notas técnicas en los filtros que explicaban el modelo de
   datos en vez de ayudar a elegir.
4. **Los índices empiezan por el final del interés.** Personas abre con
   «Abd al-Wahid al-Rashid» por orden alfabético; Dinastías y Territorios
   mostraban una cifra sin unidad; Historias mezcla recorridos disponibles con
   «Próximamente».
5. **Señales visuales poco fiables**: rojos y dorados ilegibles en oscuro,
   controles del mapa invisibles, más de treinta tamaños de letra.

## Cambios incluidos en esta entrega

- **Siguiente paso**: con una sola persona en el árbol aparece una sugerencia
  flotante «Añade la familia de X (+N) · o elige un año».
- **Textos corregidos** en el inicio del Atlas y en el resumen de selección.
- **Barra del Atlas reducida a búsqueda y año**: Comparar, Favoritos, Ayuda,
  Paneles y Herramientas pasan a iconos con etiqueta flotante.
- **Filtros sin notas de modelo de datos**: «Vinculados / Gobernaban en el año»
  como selector visible; la explicación de las relaciones políticas pasa a
  Ayuda → Leer fichas.
- **Cifras con unidad** en Dinastías y Territorios («102 personas»).
- **Contraste**: 0 textos por debajo de WCAG AA en las páginas revisadas, en
  ambos temas; escala tipográfica única de ocho tamaños.
- **Esqueletos fieles** al contenido real del Atlas y de cada catálogo.

## Propuestas pendientes de decisión

Ordenadas por impacto estimado frente a esfuerzo.

### 1. Tres puertas claras en la portada · implementada en [V5.20](V5.20.md)

Sustituir los dos botones del héroe por tres tarjetas de intención:

| Quiero… | Lleva a | Primer estado |
|---|---|---|
| Explorar una familia | Atlas con buscador enfocado | sugerencias de personas |
| Ver Europa en un año | Europa en este año, 1500 | mapa coloreado |
| Leer una historia | Historias | la más corta primero |

Cada puerta usa un verbo, no el nombre de una sección.

### 2. Un único nivel de pestañas en el Atlas · implementada en [V5.20](V5.20.md)

- Unificar escena y vista en un solo selector: **Familia · Mapa · Europa en un
  año · Línea temporal**. «Árbol y mapa» pasa a ser una opción de diseño en
  Paneles, no una pestaña.
- La navegación del sitio se queda como está; dentro del Atlas solo hay un
  selector visible.

### 3. Migas de contexto en el Atlas (medio, bajo)

Una línea bajo la barra: «Carlos V › familia cercana (14) › 1520», con cada
tramo clicable para deshacer ese paso. Responde a «dónde estoy» sin abrir
ningún panel.

### 4. Índice de Personas con puntos de entrada (alto, medio)

- Orden por defecto «Destacadas» (con retrato o biografía extensa), con
  alternativa A–Z.
- Filtros en chips: **Siglo** (XIII–XVIII), **Papel** (monarcas, consortes,
  papas, gobernadores, cultura) y **Región**.
- Índice alfabético lateral en escritorio para saltar de letra.

### 5. Dinastías y Territorios (medio, bajo)

- Selector de orden: «Más personas · A–Z · Con historia».
- En territorios, agrupar por región (Península ibérica, Italia, Imperio…)
  como ya hace el filtro del Atlas.
- «Ver ficha» y «Abrir en el Atlas» como dos acciones visibles en la tarjeta.

### 6. Historias (medio, bajo)

- Separar «Disponibles» y «En preparación» en dos bloques; las segundas al final
  y sin enlace aparente.
- Mostrar duración estimada y progreso guardado («Capítulo 3 de 11»).
- Destacar una «para empezar» de cinco minutos.

### 7. Desafío (bajo, bajo)

- El nivel de cronista y los modos ya orientan bien. Añadir debajo de cada modo
  la duración típica («2 min», «sin límite») y un «Continuar» si hay partida.

### 8. Ayuda contextual (medio, medio)

- Primer uso del Atlas: tres marcas numeradas sobre la interfaz real (buscar,
  añadir familia, elegir año) en lugar de un diálogo aparte; se cierra al
  completar el primer paso.

## Cómo medir

- Porcentaje de visitas al Atlas que pasan de 1 a más de 1 persona en el árbol.
- Tiempo hasta la primera selección de año.
- Clics en «Siguiente paso» frente a ampliaciones desde la ficha.
- Sesiones que empiezan en un índice y terminan en una ficha o en el Atlas.
