# Seguridad

Para comunicar una vulnerabilidad, utiliza [el informe privado de GitHub](https://github.com/mmm-source-create/ElArbolDeEuropa/security/advisories/new). Incluye la versión o commit, los pasos mínimos para reproducirla y su impacto. Evita publicar credenciales, datos personales o detalles explotables en una issue pública.

Se mantiene la versión más reciente de `main`. Las correcciones se revisan mediante pull request; no se garantiza un plazo de respuesta fijo. Los errores históricos o de contenido pueden comunicarse mediante «Reportar un error» en el Atlas.

`npm run audit:security` comprueba las cabeceras, la ausencia de contenido activo en el SVG local, patrones habituales de secretos y avisos de dependencias. Las vulnerabilidades de npm de nivel alto o crítico hacen fallar la validación; las demás siguen apareciendo para revisión. Estos controles complementan Secret Scanning de GitHub y las pruebas funcionales, sin garantizar ausencia de vulnerabilidades desconocidas.

Las variables `VITE_*` son públicas. No deben contener secretos. Los desafíos y el progreso se guardan en el navegador; no existe un servidor de cuentas ni una clasificación con resultados verificados.

Speed Insights se inicia una vez en la compilación de producción. Se eliminan los parámetros de consulta y fragmentos de las URL antes de enviar métricas. No se añaden búsquedas, semillas de desafíos ni progreso local a esos eventos.

La CSP permite el script local, el hash del aviso móvil y Vercel Live para las vistas previas; conserva los estilos en línea y las imágenes HTTPS/blob necesarias. Si cambia el aviso, actualiza el hash en `vercel.json` a partir de `scripts/security-policy.mjs`. La auditoría bloquea un hash desactualizado. La incrustación por otras webs requerirá una política específica cuando se implemente esa función.
