# Recuperación de animaciones con React

- Isla React ArchitectureMap: cuatro productos, selección mediante botones y teclado, detalle anunciado con aria-live y conexiones SVG animadas.
- Isla React CaseMotion: entrada vertical y apilado sticky cuando cada tarjeta cabe en pantalla. Los casos altos y las pantallas móviles conservan el flujo de lectura.
- HTML renderizado en servidor; hidratación al acercarse al viewport. Observadores y listeners se liberan al desmontar.
- Se respeta prefers-reduced-motion, incluidos cambios durante la sesión.
- Se recupera movimiento de las conexiones en el diagrama de la página RRHH.

Verificación: astro check sin errores ni advertencias; build estático de las diez páginas; pruebas Playwright en escritorio y móvil, incluida accesibilidad y enlaces internos. Captura local: .review/cases-desktop.png.

Publicado el 11/11/2026 en https://bsoftware.pages.dev/ con la cuenta correcta de Cloudflare. Despliegue inmutable: https://c67493f3.bsoftware.pages.dev/. Rama subida mediante Git; la integración GitHub rechaza la creación de PR con 403.

Para publicar con la cuenta correcta: npm ci, npm run check, npm run build y npm run deploy. Requiere Node >=22.23.4.
