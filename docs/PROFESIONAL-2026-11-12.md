# B-Software: presentación y movimiento

Actualización realizada sobre `fix/react-case-animations` (`51bfa2c`), conservando la arquitectura interactiva en React, las capturas reales de Nido, los favicons y la marca compacta incorporados el 12 de noviembre.

## Proyectos como hojas de calendario

`CaseMotion.tsx` mantiene los tres artículos generados por Astro. En escritorio, cuando todo el contenido entra en la ventana, las tarjetas forman un calendario con anillas y giran sobre el borde superior. El desplazamiento controla directamente el ángulo; al subir, las hojas vuelven. Las pestañas y las flechas permiten elegir un proyecto sin interceptar el scroll o la rueda del usuario.

Las tarjetas inactivas quedan fuera de la navegación con teclado y del árbol de accesibilidad. Los enlaces de una hoja que está girando esperan a que termine el desplazamiento antes de recuperar el foco: así se evita que el enfoque nativo mueva el calendario a otra tarjeta durante un retroceso. En móvil, con zoom o ventanas pequeñas, y con movimiento reducido, los tres artículos conservan el orden de lectura normal. Sin JavaScript también se muestran completos y los controles que requieren JavaScript permanecen ocultos.

## Contadores mecánicos

La sección «Datos concretos. Sin métricas infladas.» utiliza placas divididas horizontalmente, inspiradas en un reloj mecánico de solapas. Los valores finales siguen siendo 4 productos, 3 casos, 7 servicios y 4 etapas. La animación se ejecuta una sola vez al aparecer, alterna el sentido del giro y termina en esos valores. Los lectores de pantalla reciben siempre los valores finales. Al redimensionar durante el movimiento, o al activar movimiento reducido, todas las placas se estabilizan inmediatamente.

## Presentación

Inter Variable se sirve desde el propio sitio. Se ajustaron la jerarquía tipográfica, los espacios, los colores, los bordes y las sombras de portada, proyectos y servicios. La disposición de escritorio se adapta también a una ventana útil de 1440 × 780. No se incorporaron imágenes del reloj de referencia ni servicios externos de animación.

## Comprobación

- `npm ci`, `npm run check` y `npm run build`.
- Playwright en escritorio y móvil: 45 pruebas aprobadas y una omitida intencionalmente (giro de escritorio en móvil); páginas, recursos, enlaces, formularios, ES/EN y accesibilidad.
- Movimiento real de las hojas mediante matrices 3D, avance y retroceso por teclado, enlaces de la tarjeta activa y contraste de los controles.
- Giro real de las solapas, valores finales, interrupción por cambio de tamaño y ausencia de repetición.
- Lectura completa a 320 px, movimiento reducido y funcionamiento sin JavaScript.

`npm run deploy:preview` utiliza la rama de Pages `professional-20261112`; `npm run deploy` publica en producción (`main`) del proyecto `bsoftware`.

## Publicación verificada

- Código de la versión: `84ef8b1555712c69f15dd1bbbce3cf1bd10d3b77`.
- Prueba pública final: https://9cd0865a.bsoftware.pages.dev/ (portada, giro y retroceso del calendario, foco estable y contadores aprobados).
- Producción: https://bsoftware.pages.dev/.
- Despliegue inmutable: https://f81c95b6.bsoftware.pages.dev/.
- El HTML de producción coincide byte por byte con el artefacto local aprobado: SHA-256 `daacaebd0c1ea7fc5003ec4d1b7106b0c9074b1b260cdeee79d33bfab1663447`.
- Código y cambios anteriores conservados en https://github.com/gabyboan/B-Software/pull/4 (borrador hacia `main`).
