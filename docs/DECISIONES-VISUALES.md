# Nido, favicon y footer — 11/11/2026

## Nido: evidencia actual y carga liviana

La portada mostraba una captura anterior, sin las fotos ni la identidad actual.
El caso detallado todavía dibujaba una maqueta HTML/CSS. Ambos usan ahora
`NidoPreview.astro`, con capturas reales de la beta pública del 11/11/2026:

- Escritorio: 1440 × 1000, usado también en la tarjeta de portada.
- Móvil: 390 × 844, seleccionado con `<picture>` en el caso detallado.

Se eligieron imágenes WebP con carga diferida y dimensiones declaradas. Así se
puede mostrar el producto sin cargar otra aplicación Flutter dentro de un iframe,
añadir su JavaScript ni pedir permisos o una sesión al visitante del portfolio.
El enlace a la beta permite recorrer la versión disponible.

La fecha visible deja claro que se trata de evidencia de una versión. Las capturas
no se actualizan solas: después de un cambio visual en Nido se regeneran y revisan.
La URL con fecha evita que una imagen guardada en caché reemplace a la nueva.

```powershell
npm run capture:nido -- 2026-11-11
```

El script abre sesiones públicas nuevas, rechaza Analytics, espera al renderizado
de Flutter y captura ambas resoluciones. No inicia sesión ni publica propiedades.
Antes de usar otra fecha, revisar las dos imágenes y actualizar los nombres en
`NidoPreview.astro`, la imagen Open Graph y el texto de fecha del caso.

Las cuatro decisiones técnicas del caso conservan su explicación y agregan qué
requiere cada elección: pruebas por plataforma, validación de acceso, ciclo de
sesión y recorridos de uso. Una captura actual no acredita que todos esos flujos
estén validados; se conserva el estado de beta y la separación de próximos pasos.

## Favicon: la marca original dentro de un círculo

`npm run icons` exporta la B original desde `public/brand/logo-b.png` sobre un disco
blanco con esquinas transparentes. El margen interior evita recortar los extremos
del símbolo. No se redibuja ni se reemplaza la marca.

Se generan PNG de 48 px e ICO con imágenes de 16, 32 y 48 px para que el navegador
elija la resolución adecuada. La URL lleva `?v=brand-circle-2` para renovar el ícono
anterior. El acceso de Apple conserva su imagen de 180 px; iOS aplica su máscara.
`sharp` queda declarado y fijado como dependencia de desarrollo para reproducir
estas exportaciones, sin agregar código al navegador.

## Footer: contacto y enlaces legales visibles

Se reemplazaron las tres columnas de enlaces y los párrafos extensos por dos
filas: marca y contacto; autoría y navegación informativa. Los enlaces legales,
email, WhatsApp y GitHub siguen visibles, sin acordeones ni JavaScript. Servicios,
proyectos y proceso ya están en la navegación principal.

Se conserva la frase «Decisiones técnicas explicadas». Los enlaces admiten salto
de línea y tienen áreas de interacción de al menos 40 px. Las nuevas etiquetas y
las explicaciones del caso cuentan con traducción al inglés.

## Validación

- `astro check`: 32 archivos, sin errores ni advertencias.
- Build de producción: 10 páginas generadas.
- Playwright: 36 pruebas aprobadas, incluyendo navegación, accesibilidad,
  animaciones, enlaces internos y cambio de idioma en escritorio y móvil.
- Revisión adicional a 1440, 390 y 320 px: imágenes cargadas, sin desbordamiento
  horizontal y con captura móvil seleccionada en el detalle de Nido.
- Footer medido a 1440 px: de 341 a 186 px de alto; a 390 px: de 578 a 252 px.
- PNG con esquinas transparentes y contenedor ICO con tres tamaños verificados.

Las comprobaciones se ejecutaron con Node 22.23.4. Las pruebas corresponden al
portfolio; no amplían la validación funcional de la beta de Nido.
