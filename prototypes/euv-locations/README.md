# Laboratorio paralelo: EU V Locations

El Atlas sigue usando **EU V Provinces** (`src/MapChart_Map.svg`). Este
laboratorio compara esa geometría con la exportación **EU V Locations** sin
cambiar ni los datos históricos ni el mapa público.

![Encuadre del prototipo](preview.png)

## Probarlo

Desde la raíz del repositorio, inicia Vite y abre
`/prototypes/euv-locations/`. Los mapas se muestran con el mismo encuadre;
puedes buscar un ID, pulsar una zona, arrastrar y ampliar. El mapa nuevo se
carga solo al visitar el laboratorio. No entra en el flujo habitual del Atlas.

El SVG recortado se reconstruye con:

```sh
python3 prototypes/euv-locations/crop_svg.py /ruta/a/MapChart_Map.svg
node --import ./tests/jsx-loader.mjs prototypes/euv-locations/audit-crosswalk.mjs
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
