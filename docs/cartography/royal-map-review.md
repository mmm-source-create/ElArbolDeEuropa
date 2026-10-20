# Revisión del mapa común y de sucesiones, 20 de octubre de 2026

## Casos revisados

| Caso | Resultado |
| --- | --- |
| Anjou, 1582 | Apanage francés de François desde la paz de 1576: tono francés y trama de dependencia, sin presentarlo como principado independiente. La fase regional iniciada en 1481 no borra esta concesión posterior. [BnF, Paix de Monsieur](https://catalogue.bnf.fr/ark%3A/12148/cb14603033f). |
| Matías, Silesia, 1611 | Su mandato ya existía. El relevo dentro del año dejaba a Rodolfo y Matías compitiendo por el color; ahora el entrante determina el color de esa misma jurisdicción. Ambos siguen disponibles en la consulta anual. |
| Papado y Venecia | Papado en gris claro amarillento; Venecia en azul, separado del verde otomano. |
| Brandeburgo y las Prusias | Brandeburgo-Prusia usa azul prusiano en el panorama desde 1618. Solo comprende la Prusia ducal efectivamente gobernada; Prusia Real y Warmia continúan con la Corona polaca. Antes de 1657 sigue visible la dependencia feudal de la Prusia ducal. |
| Nápoles y Sicilia borbónicas | Color exterior común para los gobiernos simultáneos de Carlos y Fernando; colores personales distintos. Se conserva la atribución republicana napolitana de 1799. No se anticipa el Reino de las Dos Sicilias de 1816. |
| Otakar II | Se reúnen sus gobiernos efectivos de Bohemia, Moravia y ducados austríacos; se añaden sus títulos de Estiria, Carintia y Carniola. Los ducados salen en 1276. No se anticipa la Corona bohemia constituida en 1348. |
| Luis I | Unión exterior Polonia-Hungría en 1370–1382, incluidos solo sus gobiernos propios. La regla contempla también la unión bajo Ladislao III en 1440–1444. |
| Ladislao, 1447 | Ladislao el Póstumo reúne Austria y Hungría; no es el Ladislao III muerto en Varna en 1444. En Polonia reina Casimiro IV desde 1447. |
| Bohemia, 1447 | Interregno, con dietas y ligas regionales: se añade una explicación institucional al inspector. Ladislao no se incorpora como rey de Bohemia hasta 1453. |
| Matías Corvino | Hungría, Croacia, Moravia y Silesia comparten conjunto exterior cuando hay gobierno efectivo; su título rival bohemio no le entrega Praga. La posterior unión Jagellón de Bohemia y Hungría se fecha en 1490–1526. |

## Interruptor del Sacro Imperio

La capa dorada se coloca encima del mapa sin modificar sus colores, tramas, autoridades ni selección. Al apagarla desaparece exclusivamente la superposición. Representa pertenencia jurídica aproximada, no dominio personal del emperador.

Se utiliza la cartografía institucional existente: **1512–1792**. Fuera de ese intervalo se explica que la reconstrucción no está disponible y se desactiva el control. No se extienden los círculos del siglo XVI a 1200 ni la referencia de 1792 a las guerras posteriores. Véase [la documentación del marco imperial](../CARTOGRAFIA_SACRO_IMPERIO.md).

## Sucesiones y títulos, 1200–1800

La comprobación comprende 22 series: Alemania (reyes de Romanos), pontificado, Francia, Inglaterra, Escocia, Gran Bretaña, Castilla, León, Aragón, Portugal, Navarra, Bohemia, Hungría, Polonia, Dinamarca, Noruega, Suecia, Nápoles, Sicilia/Trinacria, Prusia, Rusia y el Estado otomano. Se respeta la existencia histórica de cada título: Nápoles separado desde 1282, Prusia regia desde 1701, Rusia como zarato desde 1547, Gran Bretaña desde 1707 y Polonia hasta 1795. No se pretende inventariar aquí todos los señores, pretendientes ni principados de Europa.

El registro editorial independiente conserva **692 mandatos**, con persona, territorio, título y extremos anuales, y comprueba 11.493 años territoriales. No se reconstruye automáticamente durante la auditoría. La supresión de un reinado breve como Juan I de Francia, Guttorm o Fiódor II falla aunque otros soberanos cubran el mismo año. Los intervalos sin monarca tienen una explicación y referencia propias: repúblicas, interregnos y regencias suecas. Una reclamación no prueba control territorial.

Se incorporan 15 personas ausentes: Alfonso II, Sancho II, Enrique I y Alfonso VI de Portugal; Sverre, Haakon III, Guttorm e Inge II de Noruega, y los rivales bagler Erling y Felipe; Juana II de Nápoles; Borís Godunov, Fiódor II, Dmitri I y Vasili IV de Rusia. Los rivales conservan esa condición. El título de Sverre empieza en 1177; sus 23 años anteriores a 1200 quedan registrados como carentes de cartografía revisada, sin falsear el comienzo del reinado para ajustarlo al mapa. No se asigna a Dmitri una filiación Rúrikida basada en su identidad reclamada.

Se añaden además las regencias de Luisa de Guzmán y Pedro de Portugal, la administración del futuro Alfonso III, Manfredo como regente de Sicilia y la realeza titular de Conradino, el título alemán de Matías, el mandato austríaco de Federico III, los ducados de Otakar y la ocupación napolitana de Carlos VIII. Los datos distinguen al monarca, al regente y al titular apartado del poder. Alfonso VI conserva el título hasta 1683, pero no se pinta como gobernante efectivo después de su apartamiento.

Las nuevas afirmaciones tienen revisiones individuales y referencias en `royalCoverageReviews.js`, conectadas a la bibliografía pública. Las fichas existentes y el registro de sucesiones conservan las incertidumbres y condiciones ya documentadas; esta auditoría de continuidad no convierte todas sus afirmaciones en nuevas verificaciones biográficas.

Comprobación reproducible: `npm run audit:royal-successions`; casos de mapa y superposición en `tests/royal-map-review.test.mjs`.
