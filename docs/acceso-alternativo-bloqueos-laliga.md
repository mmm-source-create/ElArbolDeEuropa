# Acceso a la web durante los bloqueos de LaLiga

Estudio del 21 de noviembre de 2026.

## Diagnóstico

Los días de partido, los operadores españoles bloquean por orden judicial direcciones IP de Cloudflare. LaLiga lo pide contra las retransmisiones piratas, pero esas IPs las comparten miles de webs. La web se sirve desde Cloudflare, así que, mientras dura el bloqueo, quien navega con esos operadores no puede conectar: Safari dice que el servidor no responde y Chrome se queda cargando.

Lo comprobado el 21 de noviembre:

- **La web funciona.** Responde bien desde fuera, por IPv4 e IPv6, con y sin `www`.
- **DNS.** Cada resolutor DNS devuelve direcciones distintas de la misma red de Cloudflare (`188.114.96.0/23`):
  - Google da `.3` para `www` y `.0` para el dominio sin `www`;
  - Cloudflare y Quad9 dan `.11`;
  - OpenDNS da `.9`.
- **Bloqueo de hoy.** Según el rastreador público [hayahora.futbol](https://hayahora.futbol/), `188.114.96.3` y `188.114.97.3` están bloqueadas desde hoy a las 18:15 (hora española) en Digi, MasMóvil, Orange y Vodafone; en Movistar, no. A esa misma hora había 988 bloqueos activos en total, contando cada IP y operador por separado.
- **Frecuencia.** En las últimas semanas hubo bloqueos casi todos los fines de semana, y algunos días entre semana.
- **Solo Cloudflare.** De las IPs que sigue el rastreador, casi todas las que han estado bloqueadas son de Cloudflare. Vercel, GitHub Pages, CloudFront y BunnyCDN aparecen con un único episodio cada una, de madrugada, que parece una prueba del rastreador.
- **El DNS del dominio no se ve afectado.** Los servidores de nombres de Cloudflare (`garret` y `melina`) no figuran entre las IPs bloqueadas.

No se puede arreglar dentro de Cloudflare con el plan gratuito: no deja elegir las IPs, y las dedicadas o propias (BYOIP) son de planes empresariales.

## Restricciones

- **Vercel no sirve como alojamiento principal.** En noviembre agotó el millón de peticiones de su plan gratuito y suspendió la web; por eso se migró a Cloudflare (véase `docs/CLOUDFLARE.md`).
- **Tamaño.** La web generada ocupa unos 805 MB y unos 23 400 archivos, y crece con cada tanda de retratos.
- **Indexación.** Cualquier copia debe evitar el contenido duplicado: `noindex` o `canonical` hacia `www.treeofeurope.eu`.

## Opciones

| Opción | Cómo funciona | Coste | Ventajas | Inconvenientes |
|---|---|---|---|---|
| **A. CDN delante de Cloudflare** | `www` apunta a otro CDN (por ejemplo, bunny.net). Ese CDN pide las páginas a Cloudflare de servidor a servidor, cosa que el bloqueo no impide, y las sirve con sus propias IPs. | De pago por uso: en Europa, 0,01 $/GB (tarifa de bunny.net). Con el tráfico actual, unos pocos euros al mes. | Es automática: nadie tiene que hacer nada, ni cambiar de dirección. Cloudflare sigue siendo el origen y el despliegue no cambia. | Un pequeño gasto mensual. Hay que configurar el origen, la caché y las cabeceras. Y si algún día se bloquean también las IPs del CDN, vuelve el problema. |
| **B. Espejo en GitHub Pages** | Una copia estática en un subdominio, por ejemplo `espejo.treeofeurope.eu`, publicada en cada versión. | Gratis. | Sin coste y al margen de Cloudflare. | Hay que conocer la dirección alternativa. El límite es de 1 GB por sitio y la web ya ocupa 805 MB. No admite redirecciones ni cabeceras propias. |
| **C. Espejo en Vercel** | La misma copia, en el proyecto pausado de Vercel. | Gratis mientras no se pase del límite. | Despliegue conocido. | El mismo límite que ya se agotó. También hay que conocer la dirección. |
| **D. Volver a Vercel** | Todo el tráfico, en Vercel Pro. | 20 $ al mes. | Sin bloqueos en el historial. | Es lo más caro y deshace la migración. |

## Recomendación

La **opción A** es la única que resuelve el problema para cualquier visitante sin que tenga que saber nada. Vale la pena por un coste pequeño. Si se prefiere no pagar nada, la **opción B** sirve como salida de emergencia que se puede comunicar (por ejemplo, en redes sociales o en un aviso), pero no evita que la web principal falle durante los partidos, y el límite de 1 GB obliga a vigilar el tamaño.

Pasos para la opción A:

1. **Origen.** Crear en Cloudflare un nombre de origen, por ejemplo `origen.treeofeurope.eu`, asociado al mismo Worker (en `wrangler.jsonc`). No conviene usar la dirección `workers.dev` como origen: `cloudflare/worker.js` y `cloudflare/routing.js` le añaden `X-Robots-Tag: noindex`, y el CDN lo pasaría a `www`. Hay que comprobar que el origen nuevo no lleva esa cabecera, y que los buscadores no lo indexan porque sus páginas llevan `canonical` hacia `www`.
2. **Zona en el CDN.** Crear una zona en el CDN con ese origen:
   - certificado gratuito para `www.treeofeurope.eu` y `treeofeurope.eu`;
   - respeto de `Cache-Control` del origen;
   - las redirecciones 3xx sin guardar en caché más de lo que indique el origen;
   - paso de cabeceras de seguridad (CSP y HSTS).
3. **Prueba.** Probar el CDN con su dirección propia (`*.b-cdn.net`) con `scripts/check-cloudflare-http.mjs`: perfiles en español e inglés, Atlas, historias, imágenes y redirecciones.
4. **DNS.** En Cloudflare, cambiar `www` y la raíz a registros solo DNS (nube gris) hacia el CDN. El cambio se puede revertir en minutos con un TTL corto.
5. **Comprobar un día de partido.** Comprobar en [hayahora.futbol](https://hayahora.futbol/) qué IPs están bloqueadas y pedir a alguien con Digi, Orange o Vodafone que abra la web.

Mientras tanto, en casa sirve usar los datos móviles, Private Relay de iCloud o una VPN. Cambiar de DNS no sirve, porque el bloqueo es por IP.
