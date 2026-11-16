# Publicación gratuita en Cloudflare

Esta adaptación retoma la preparación de octubre (`a73d8a3`, propuesta #43) para la versión 6.0.6. Vercel agotó el millón de CDN Requests incluido en Hobby y suspendió la web el 15 de noviembre de 2026. El cambio se prepara sin contratar planes de pago.

## Límites y diseño

Las peticiones a Static Assets de Cloudflare son gratuitas e ilimitadas. Workers Free permite 100.000 ejecuciones diarias, 20.000 archivos por versión y 25 MiB por archivo. Los límites de funciones no deben confundirse con los de archivos estáticos.

La preparación anterior ejecutaba un Worker antes de servir todas las páginas. Esta versión sirve directamente los HTML prerenderizados, las imágenes, los datos y las secciones públicas. Solo las redirecciones heredadas, los embeds y los casos sin archivo estático llegan al Worker. Un volumen de peticiones a esas rutas todavía podría agotar su cuota diaria; no se promete disponibilidad ilimitada de funciones.

Las variantes `?atlas=1` reciben el mismo HTML estático. `readInitialPage` descarta sus datos para iniciar el Atlas, sin hidratar la ficha. La URL, el dominio y los datos locales del navegador pueden conservarse en la migración.

Para reducir el número de archivos, los metadatos ingleses se leen del JSON que ya contiene cada HTML SSG. El empaquetado comprueba que ambos datos coinciden, conserva todas las fichas y genera un índice de rutas. Los clientes actuales acceden directamente al HTML estático; el Worker mantiene los antiguos endpoints JSON para pestañas abiertas anteriormente. Las copias locales con sufijo « 2» y los informes de auditoría quedan fuera del paquete. No se borran de sus carpetas originales.

## Verificación y despliegue de prueba

Con Node 24:

```sh
npm ci
node --import ./tests/jsx-loader.mjs --test tests/cloudflare-free.test.mjs tests/security-v2152.test.mjs
npm run build:cloudflare
npm run check:cloudflare
npm run preview:cloudflare
```

`build:cloudflare -- --reuse-generated` reutiliza únicamente los metadatos previamente generados y auditados. Vuelve a compilar, prerenderizar y auditar todos los HTML. El resultado aislado está en `.cloudflare/assets`; `.cloudflare/report.json` contiene recuentos, tamaño y margen de archivos. El empaquetado falla si supera los límites gratuitos.

El build de Vercel permanece disponible. El build de Cloudflare desactiva Speed Insights y adapta Privacidad en español e inglés al alojamiento real. Las cabeceras conservan el hash autorizado del aviso de pantalla y las excepciones de embeds.

`wrangler.jsonc` apunta a `eade-cloudflare-preview`, sin dominios de producción ni cuenta preseleccionada. Las respuestas de preview llevan `noindex, nofollow`. Tras autorizar la cuenta, verificar su identidad antes de ejecutar `npm run deploy:cloudflare:preview`.

Antes de cambiar DNS: revisar perfiles ES/EN, historias y capítulos, Atlas con `?atlas=1`, mapa completo, búsqueda, privacidad, imágenes, desafío, embeds, redirecciones y errores 404 en la URL remota. Después se puede configurar el dominio original. Conservar Vercel como alternativa; no modificar ni eliminar registros de correo al cambiar DNS.

Fuentes oficiales consultadas el 16 de noviembre de 2026:

- [Static Assets: facturación y límites](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).
- [Límites de Workers](https://developers.cloudflare.com/workers/platform/limits/).
- [Tratamiento de URLs HTML](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).
- [Límites de Pages](https://developers.cloudflare.com/pages/platform/limits/).
