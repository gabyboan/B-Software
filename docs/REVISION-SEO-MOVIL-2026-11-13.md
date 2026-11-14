# Revisión de alertas SEO y móvil — 13/11/2026

Segunda revisión de las advertencias compartidas de Semrush y Seobility. Complementa la actualización de animaciones y repositorios documentada en `ACTUALIZACION-2026-11-13.md`.

## Correcciones

- Se elimina el breadcrumb de un solo elemento de la portada: Google requiere al menos dos. Las páginas internas conservan una única ruta válida, centralizada en el layout; se eliminan duplicados.
- LinkedIn profesional confirmado por Gabriel: https://www.linkedin.com/in/gabyboan/. Se incluye en el pie y en `sameAs`.
- Controles ES/EN, tecnologías, enlaces de proyectos, contacto y pie con objetivos de al menos 44 px de alto. Se ajustan tipografías de anotaciones, descripciones y etiquetas de móvil. Se comprueba el encabezado a 320 px.
- Descripción de portada más breve, coherente con la oferta publicada; traducción inglesa actualizada.
- Se mantiene español como idioma inicial del HTML. El inglés sigue disponible mediante selector, preferencia guardada o `?lang=en`; se evita reescribir automáticamente toda la página por el idioma del navegador.
- Se evita recorrer todo el documento para traducir la carga inicial en español y leer la posición de scroll antes de que sea necesaria. La galería móvil y el modo de movimiento reducido ya no fuerzan la medición de altura de todas las tarjetas al cambiar de idioma o tamaño.

## Interpretación de las alertas

| Alerta | Resultado |
| --- | --- |
| No se puede recuperar tamaño del DOM | Fallo de medición de esa herramienta. La inspección con navegador sí obtiene unas 634 etiquetas y profundidad máxima 15 antes de hidratar las secciones diferidas; no equivale a un DOM excesivo medido. |
| Móvil no compatible | Hay viewport adaptable y no hay desbordamiento en 320, 360, 390 y 768 px. Sí había textos pequeños y controles mejorables: se corrigen. |
| Datos estructurados | Error real del breadcrumb de portada corregido. JSON analizado y breadcrumbs internos cubiertos por regresiones. Lighthouse SEO 100 no validaba este requisito. No se garantiza elegibilidad para resultados enriquecidos. |
| Dos imágenes sin ALT | Los dos logos repetidos llevan `alt=""` de forma intencional y tienen texto de marca contiguo. Las imágenes de proyectos tienen descripciones. No se añade texto redundante para satisfacer un contador. |
| Meta de 144 caracteres | Google no fija ese máximo de caracteres; adapta el fragmento al dispositivo y puede reescribirlo. Se acorta por claridad editorial. |
| Hreflang ausente | No hay páginas HTML inglesas con URL independiente: el inglés es una traducción interactiva. No se declaran variantes inexistentes para satisfacer la herramienta. Crear versiones indexables separadas requiere una implementación adicional. |
| Faltan redes | Se añade LinkedIn real. YouTube, X, Instagram y Facebook no son requisitos generales de indexación ni se inventan cuentas. |
| 41 encabezados | Describen secciones, proyectos, servicios y preguntas. No existe un límite universal de encabezados; la estructura utiliza un H1. No se eliminan títulos útiles por una proporción automática. |
| Textos de enlace repetidos | Contacto, marca y navegación repetida cumplen funciones reales. Se mantiene el contexto semántico. |
| Pocos backlinks | No se verifica la cobertura del índice privado de Seobility. Cambiar CSS o comprar un dominio no crea referencias externas. Corresponde conseguir menciones reales y enlaces de proyectos/perfiles autorizados. |
| INP lento | La auditoría Lighthouse aporta TBT de laboratorio, no INP de usuarios reales. Se reducen recorridos y mediciones innecesarios y se prueban interacciones; para el percentil 75 real se necesita información de campo disponible en CrUX/Search Console o instrumentación de usuarios. |

## Dominio propio

Puede mejorar la identidad, la recordación y el uso de correo profesional. No repara los problemas técnicos ni da una mejora automática de ranking por sustituir `pages.dev`. Si se incorpora, hay que elegir una URL principal y configurar redirecciones, canonical, sitemap y Search Console. No se compra ningún dominio en esta revisión.

## Fuentes

- [Google: guía inicial de SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google: breadcrumbs y mínimo de dos elementos](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google: snippets y metadescripciones](https://developers.google.com/search/docs/appearance/snippet)
- [Google: versiones de idioma con URL independiente](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [W3C: imágenes decorativas y texto redundante](https://www.w3.org/WAI/tutorials/images/decorative/)
- [web.dev: medición de INP](https://web.dev/articles/inp)

## Validación

La batería completa posterior a los cambios principales arroja 51 pruebas aprobadas y una omitida intencionalmente para el calendario de escritorio en móvil. El ajuste final del pie pasa las cuatro regresiones específicas de SEO y usabilidad. Astro analiza 38 archivos sin errores, advertencias ni sugerencias; compilación de 10 rutas estáticas correcta.

Lighthouse móvil 13.6.0 sobre el dominio público, 13/11 a las 21:15 de Argentina:

| Medida | Inicio de la actualización | Primera publicación | Revisión final |
| --- | ---: | ---: | ---: |
| Rendimiento | 72 | 75 | 84 |
| Accesibilidad | 100 | 100 | 100 |
| Buenas prácticas | 100 | 100 | 100 |
| SEO | 92 | 100 | 100 |
| LCP | 1,91 s | 2,03 s | 1,46 s |
| TBT | 1802 ms | 1156 ms | 609 ms |
| Speed Index | 2,86 s | 2,64 s | 2,84 s |

CLS final: 0. Son tomas individuales con variación de red y CPU; el Speed Index no mejora frente a la primera publicación. Persisten avisos sobre trabajo del hilo principal, reflow y dependencias de red. El 100 de SEO solo acredita el conjunto de comprobaciones de Lighthouse.

Prueba de interacciones móvil a 390 px y CPU ralentizada cuatro veces: pestaña de tecnología 80 ms, menú hasta 40 ms y pregunta desplegable 88 ms; cambiar a inglés alcanzó 328 ms y volver a español 232 ms. Son duraciones de Event Timing de una secuencia de laboratorio, no el percentil 75 de INP real. La traducción completa sigue siendo una oportunidad pendiente; no se afirma que esté resuelta. Artefactos locales: `.review/lighthouse-audit-final.json`, `.review/interactions-corrected.json`.

Publicación final: [bsoftware.pages.dev](https://bsoftware.pages.dev/), despliegue [0f5a22bb](https://0f5a22bb.bsoftware.pages.dev/). Respuesta HTTP 200 y HTML idéntico a la compilación local (SHA-256 `4fdd826d607a19dc55662f8727d1af9f904461183a7789c599f5db6af887cc87`).
