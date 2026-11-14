# Actualización de portfolio, movimiento y SEO

Se parte de `2413a49`, la última versión publicada de `codex/profesional-bsoftware-20261112`, y se conservan el calendario de proyectos, las solapas mecánicas y el mapa interactivo. Rama de trabajo: `codex/motion-seo-20261113`.

## Diseño y movimiento

Referencia visual: https://www.breakthroughenergy.org/. Se adapta su escala tipográfica y el ritmo de aparición de contenido a la identidad de B-Software, usando las imágenes existentes del producto. La portada entra por etapas; los encabezados y servicios aparecen una sola vez al recorrer la página. Se suman progreso de lectura, progreso del calendario y respuestas suaves en botones e imágenes.

El contenido sigue visible en el HTML sin JavaScript. La preferencia de movimiento reducido cancela las entradas incluso si cambia durante la visita. Las animaciones nuevas usan Web Animations e IntersectionObserver, sin dependencias adicionales ni bucles permanentes de JavaScript.

Las tarjetas móviles conservan su entrada ya realizada al salir de pantalla. En el calendario, la hoja activa recupera prioridad de interacción y las hojas inactivas no interceptan clics. Se elimina una capa 3D innecesaria en reposo para conservar el desplazamiento y foco nativos. Los destinos de enlaces tienen margen propio, evitando que el encabezado fijo se desplace por el relleno global de scroll. El cambio de idioma conserva la posición de lectura.

## Repositorios revisados

Revisión de README, documentación y commits públicos el 13/11/2026:

| Repositorio | Evidencia | Cambio en el portfolio |
| --- | --- | --- |
| [Gestión RRHH](https://github.com/gabyboan/hesm-gestion-rrhh/commit/db147ca) | Último commit del 13/11; distribución privada 1.0.8.9 documentada | Versión vigente, Ficha y Licencias distribuidas, Horas Gremiales y corrección de condición/legajo en partes médicos. |
| [Legajo Digital](https://github.com/gabyboan/legajo-digital/commit/e21aca5) | Control de novedades integrado el 13/11 | Licencias, fichas por año, autoría e historial de correcciones; migración y permisos explícitos para novedades. Se retiran afirmaciones sobre módulos reservados. |
| [Consulta Horas](https://github.com/gabyboan/consulta-horas/commit/661cb24) | Actualización del 31/10 | Se precisa que Turnstile y el pase temporal no autentican la identidad del agente. |
| [Tiago Market](https://github.com/gabyboan/tiago-market/commit/3e5489c) | Historial y archivo de observaciones actualizado el 23/10 | Se explica la conservación de cambios y el archivo verificado de repeticiones. Sigue identificado como prototipo con demo ficticia. |
| [Perfil](https://github.com/gabyboan/gabyboan/commit/afe49bf) | Presentación actual del desarrollador | La presentación profesional publicada sigue siendo consistente con el perfil. |

No se verifican instalaciones privadas ni se cambian estos repositorios. Nido conserva el alcance ya publicado: no apareció un repositorio público adicional entre los seis repositorios del perfil.

## SEO y medición

Lighthouse 13.6.0, configuración móvil predeterminada. La medición inicial se tomó sobre `https://bsoftware.pages.dev/`. Es una auditoría técnica de laboratorio, no una medición de posiciones, visitas o conversiones de Google Search Console.

Se corrige un enlace de respaldo de WhatsApp que carecía de `href`, se incorporan breadcrumbs estructurados y se actualizan sitemap y `llms.txt`. Se corrigen los nombres accesibles de los controles ES/EN y del enlace de marca. La traducción limita su búsqueda de atributos a elementos relevantes.

Comparación sobre el mismo dominio público, el 13/11/2026 a las 20:38 y 21:02 de Argentina:

| Medida | Antes | Publicado |
| --- | ---: | ---: |
| SEO | 92 | 100 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 100 | 100 |
| Rendimiento | 72 | 75 |
| FCP | 1,1 s | 1,4 s |
| LCP | 1,9 s | 2,0 s |
| Bloqueo total (TBT) | 1802 ms | 1156 ms |
| Speed Index | 2,9 s | 2,6 s |

Son dos tomas de laboratorio individuales: el rendimiento varía con red y CPU y no representa Core Web Vitals de usuarios reales. El resultado no acredita posiciones ni indexación en Google. Los JSON originales quedan en `.review/lighthouse-before.json` y `.review/lighthouse-after-public.json` del entorno de trabajo. Persisten oportunidades de rendimiento, especialmente el trabajo de diseño durante la carga y las interacciones.

## Validación y publicación

Node 22.23.4. `npm ci`, `npm run check` y `npm run build`. Playwright comprueba páginas, recursos, accesibilidad, formularios, ES/EN, movimiento reducido, lectura sin JavaScript, calendario, solapas y progreso de lectura.

Resultado: 47 pruebas aprobadas y una omitida intencionalmente (el calendario de escritorio se presenta como lista en móvil). Astro revisó 37 archivos sin errores, advertencias ni sugerencias. Capturas finales de escritorio y móvil sin desbordamiento horizontal ni errores de JavaScript.

Publicado en [bsoftware.pages.dev](https://bsoftware.pages.dev/), despliegue inmutable [e00fe0c9](https://e00fe0c9.bsoftware.pages.dev/). La portada pública respondió HTTP 200 y su SHA-256 coincide con `dist/index.html`: `255698e0e54eae77cd4a2e223985b1aafa8b45fcb338730b8f7fbe2aa5f6ae09`.

`npm run deploy:preview` usa `motion-seo-20261113`; `npm run deploy` mantiene el proyecto de Cloudflare Pages `bsoftware` y su rama de producción `main`.
