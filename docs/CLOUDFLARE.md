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

La prueba publicada está en [Cloudflare](https://eade-cloudflare-preview.mmurielcagigal.workers.dev/es/). El [informe de verificación](./CLOUDFLARE-verification.json) recoge el paquete, las pruebas realizadas, la versión desplegada y el estado de DNS. Para repetir las comprobaciones HTTP: `node scripts/check-cloudflare-http.mjs https://eade-cloudflare-preview.mmurielcagigal.workers.dev`.

Fuentes oficiales consultadas el 16 de noviembre de 2026:

- [Static Assets: facturación y límites](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).
- [Límites de Workers](https://developers.cloudflare.com/workers/platform/limits/).
- [Tratamiento de URLs HTML](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).
- [Límites de Pages](https://developers.cloudflare.com/pages/platform/limits/).

## Dominio de producción

El entorno `production` usa el Worker `el-arbol-de-europa` y declara únicamente `treeofeurope.eu` y `www.treeofeurope.eu` como dominios propios. El comando explícito es `npm run deploy:cloudflare:production`; el comando de prueba sigue sin asociar dominios. Los hosts `workers.dev` conservan `noindex` incluso en ese entorno.

El 16 de noviembre se confirmó que el dominio usa OVH y mantiene DNSSEC activo. Se compararon sus quince registros con los de Cloudflare: dos son los servidores NS antiguos y trece corresponden a la web, verificaciones y correo. El escaneo automático omitió los dos CNAME de DKIM y el SRV de autodetección de Zimbra; se añadieron como DNS only. Los MX y las verificaciones se conservaron.

Los nuevos servidores asignados son `garret.ns.cloudflare.com` y `melina.ns.cloudflare.com`. No deben sustituir a los de OVH mientras siga vigente la firma DNSSEC anterior. La desactivación temporal y posterior reactivación de DNSSEC requiere autorización y respetar el TTL anterior, que puede llegar a 24 horas. Una firma DS antigua en caché produce SERVFAIL al validar claves del nuevo proveedor. No se trasladan el registro ni la renovación del dominio, y no se contratan planes de pago.

La publicación definitiva está disponible en `https://el-arbol-de-europa.mmurielcagigal.workers.dev/es/`, con ambos dominios propios asociados en Cloudflare. Sus dos registros importados de Vercel impedían la asociación; se conservaron cambiando sus nombres a `vercel-backup` y `vercel-www-backup`, dentro de la zona pendiente de Cloudflare. Cloudflare creó los registros gestionados de los dominios propios: hay quince registros en total. Los registros y servidores activos de OVH siguen sin cambiar. El dominio público continúa en Vercel hasta completar el traslado DNS.

El usuario autorizó expresamente la desactivación temporal y posterior reactivación de DNSSEC. La solicitud se confirmó en OVH el 16 de noviembre, hacia las 20:02 (Europe/Warsaw). Tras recargar, OVH muestra «Desactivando…» y el control queda deshabilitado. No se necesita otra autorización para continuar este mismo traslado y reactivar la protección.

Los servidores autoritativos `x.dns.eu` e `y.dns.eu` todavía publican el DS antiguo, con TTL de 86.400 segundos. El momento seguro no se calcula desde la solicitud: hay que observar su retirada y dejar caducar las posibles cachés antiguas. OVH indica unas 24 horas para desactivar DNSSEC y un plazo posterior de propagación al cambiar servidores. La [guía de OVH](https://docs.ovhcloud.com/en/guides/web-cloud/domains/dns-dnssec) explica también cómo publicar las claves de un proveedor DNS externo después del cambio. La migración del dominio y la reactivación de DNSSEC siguen pendientes; la web provisional está disponible.
