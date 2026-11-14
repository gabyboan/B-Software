# Segunda revisión de rendimiento — 13/11/2026

## Cambios

- El diccionario inglés se descarga al solicitar EN o acercarse al control con puntero o foco. La primera visita en español evita esa descarga. El módulo principal de Layout baja de aproximadamente 94 KB a 6,3 KB sin comprimir; no representa todo el JavaScript de la página. El diccionario separado ocupa 91,7 KB sin comprimir.
- Una descarga demorada respeta la última selección de idioma y la guarda. Si falla la red, el contenido original en español continúa disponible.
- El observador del traductor deja de procesar sus propias sustituciones de texto. Se elimina un recálculo completo de diseño provocado por restaurar innecesariamente el desplazamiento.
- La barra de lectura reutiliza la altura calculada después del diseño y actualiza su rango al cambiar el tamaño de la ventana. Se evita la lectura inicial de altura inmediatamente después de preparar las animaciones.
- Se precarga la misma fuente Inter latina que utiliza el CSS, sin agregar una segunda fuente.
- El selector de anclaje de desplazamiento de la portada usa un atributo explícito en lugar de buscar descendientes con `:has()`.

## Verificación

Se incorporan regresiones para carga diferida, fallo de red, elección rápida EN/ES y progreso de lectura tras cambiar idioma o altura de ventana. La prueba de navegación de la galería espera a que termine el giro antes de abrir un enlace: seleccionar una pestaña durante la transición no significa que la hoja ya esté habilitada.

Astro: 39 archivos analizados, cero errores y advertencias. Compilación correcta de diez rutas estáticas.

Batería final completa: 57 pruebas aprobadas y una omisión intencional del calendario de escritorio en móvil. Incluye las rutas, enlaces, accesibilidad, formulario, interacción y animaciones con movimiento reducido.

Publicación verificada: [bsoftware.pages.dev](https://bsoftware.pages.dev/), despliegue [77255e49](https://77255e49.bsoftware.pages.dev/). HTTP 200; HTML idéntico a `dist/index.html`, SHA-256 `6366dbb4f4e0b46ba36d43d75f97b63038033cc174e9a607ac381cda5913db66`.

Una secuencia móvil local a 390 px con CPU ralentizada cuatro veces registró un máximo de Event Timing de 168 ms, frente a 304 ms en la toma anterior. Son muestras individuales. La carga asíncrona de inglés cambia la atribución temporal: estas cifras no miden por sí solas cuánto tarda en completarse la traducción ni acreditan INP real. Este último requiere datos de visitantes.

## Lighthouse sobre la publicación

Lighthouse móvil 13.6.0, misma configuración de categorías y dispositivo que la revisión anterior. Sin advertencias de ejecución. Artefacto local: `.review/lighthouse-performance-next.json`.

| Medida | Antes | Después |
| --- | ---: | ---: |
| Rendimiento | 84 | 89 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 1,46 s | 1,27 s |
| LCP | 1,46 s | 1,57 s |
| TBT | 609 ms | 417 ms |
| Speed Index | 2,84 s | 2,34 s |
| CLS | 0 | 0 |

Son tomas individuales con variación de red y CPU. El LCP sube ligeramente; no todas las métricas mejoran. Las puntuaciones no garantizan posicionamiento ni sustituyen la medición de INP de visitantes reales. Sigue habiendo trabajo de hidratación de componentes y traducción completa al seleccionar inglés.
