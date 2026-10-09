# Compatibilidad con Cloudflare

La app se puede compilar para Vercel o Cloudflare Workers con Static Assets.
El build de Vercel sigue siendo `npm run build`. Para Cloudflare se usa
`npm run build:cloudflare`: conserva la generación y auditoría SSG, fija
`VITE_HOSTING_PROVIDER=cloudflare`, desactiva Speed Insights y añade las
cabeceras de seguridad a `dist/_headers`.

## Prueba local

Con Node 24:

```sh
npm ci
npm run test:cloudflare
npm run build:cloudflare
npm run check:cloudflare
npm run preview:cloudflare
```

Con la preview abierta, en otra terminal:

```sh
node scripts/check-cloudflare-http.mjs http://127.0.0.1:8787
```

El mismo comando admite la URL de una preview remota y comprueba respuestas
reales de fichas, atlas, redirecciones, embeds, errores y assets.

La vista previa local usa el runtime de Workers. No necesita una cuenta ni
credenciales de Cloudflare. `npm run check:cloudflare` empaqueta en modo
dry-run: no publica el sitio.

CI comprueba ambos proveedores. Tras el build completo auditado de Vercel,
`build:cloudflare -- --reuse-generated` reutiliza los datos generados, pero
vuelve a compilar, prerenderizar y auditar todas las páginas. El build de
Cloudflare preserva el orden de ejecución de los chunks para que las fichas
SSG se hidraten correctamente; el empaquetado de Vercel queda sin cambios.

`cloudflare/routing.js` adapta las reglas de `vercel.json`. El orden importa:
`?atlas=1` sirve `/index.html`; una ficha sin ese parámetro sirve su HTML SSG.
Los capítulos, ES/EN, mapa completo, rutas antiguas y embeds conservan sus
URLs. `html_handling: none` evita que las reescrituras internas provoquen
redirecciones de `index.html` o cambios de barra final.

Las rutas públicas pasan primero por el Worker. Los bundles y datos
estáticos se sirven directamente como Static Assets. `_headers` protege
esas respuestas y el Worker aplica las políticas a las páginas reescritas.
Solo los embeds admitidos permiten marcos externos. Las API aún no
implementadas devuelven JSON 404 con `no-store`, nunca HTML del atlas.
Las rutas desconocidas devuelven el documento `404.html` con estado 404.

## Despliegue paralelo

`wrangler.jsonc` apunta exclusivamente a `eade-cloudflare-preview`, sin
dominios de producción. `DEPLOYMENT_ENV=preview` añade `noindex, nofollow`;
los assets directos en `workers.dev` también llevan `noindex`.
Los canonical y sitemaps mantienen `https://www.treeofeurope.eu`.

Una vez autorizada la cuenta:

```sh
npx wrangler login
npx wrangler whoami
npm run deploy:cloudflare:preview
```

Si hay varias cuentas, seleccionar la cuenta del proyecto explícitamente
mediante `CLOUDFLARE_ACCOUNT_ID`; no incorporar tokens al repositorio.
Conectar esta rama en Workers Builds también es posible: instalación con
`npm ci`, build `npm run build:cloudflare`, despliegue `npx wrangler deploy`.
El nombre del Worker en el panel debe coincidir con `wrangler.jsonc`.

Antes del corte de DNS comprobar en el despliegue remoto: ficha Carlos V
con y sin `?atlas=1`, historias y capítulos ES/EN, laboratorios, privacidad,
mapas, búsquedas, embeds desde otro origen, una URL inexistente y los
sitemaps. Conservar Vercel para poder volver atrás.

## Producción y monetización pendiente

La preparación no cambia DNS, nameservers, el proyecto de Vercel ni el
dominio público. La publicación definitiva requiere una configuración
separada con el nombre definitivo, `DEPLOYMENT_ENV=production` y el dominio
elegido. Si se cambian nameservers, copiar previamente todos los registros
DNS, incluidos los de correo. No convertir la configuración de preview en
producción accidentalmente.

El futuro backend puede añadirse bajo `/api/*`, con autenticación, Checkout,
webhook validado de Stripe, permisos persistidos y portal de cliente. La
confirmación de pago procede del webhook, no de la página de retorno. Las
claves secretas pertenecen a Workers Secrets y nunca a `VITE_*`. Los datos
premium deben servirse con autorización desde el backend, no ocultarse en
React mientras siguen descargándose públicamente.

Esta fase no incorpora cuentas, cobros, base de datos ni nueva analítica.
La página de privacidad se adapta al proveedor de cada build. Favoritos y
progreso conservan sus claves locales; conservar el mismo dominio y HTTPS
mantiene el acceso a ese almacenamiento después de la migración.

Documentación oficial: [Static Assets](https://developers.cloudflare.com/workers/static-assets/),
[routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/),
[HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/),
[headers](https://developers.cloudflare.com/workers/static-assets/headers/),
[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/).
