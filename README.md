# B-Software

[![Astro](https://img.shields.io/badge/Astro-5-111111?logo=astro)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-publicado-f38020?logo=cloudflare&logoColor=white)](https://bsoftware.pages.dev/)
[![SEO](https://img.shields.io/badge/SEO-sitemap_robots_llms-22c55e)](https://bsoftware.pages.dev/sitemap.xml)

Sitio publico de B-Software para presentar servicios, productos reales y
capacidad tecnica en desarrollo web, sistemas internos, aplicaciones operativas,
automatizaciones, observabilidad y despliegues modernos.

## Enlaces

- Sitio publicado: https://bsoftware.pages.dev/
- GitHub: https://github.com/gabyboan
- Contacto: gabrielboan14@gmail.com

## Que muestra

- Servicios de desarrollo web y software empresarial.
- Portfolio con proyectos institucionales, operativos y portales publicos.
- Metadata para compartir en LinkedIn, GitHub, WhatsApp y plataformas freelance.
- `robots.txt`, `sitemap.xml`, `llms.txt` y datos estructurados Schema.org.
- Verificacion de Google Search Console por archivo HTML y meta tag.

## Proyectos destacados

| Proyecto | Tipo | Stack principal | Repositorio |
| --- | --- | --- | --- |
| Legajo Digital | Sistema interno | Next.js, React, Supabase | [gabyboan/legajo-digital](https://github.com/gabyboan/legajo-digital) |
| HESM Gestion RRHH | Escritorio operativo | Flutter, Riverpod, Supabase | [gabyboan/hesm-gestion-rrhh](https://github.com/gabyboan/hesm-gestion-rrhh) |
| Consulta Horas | Portal publico + API | Cloudflare Pages, Worker, Turnstile | [gabyboan/consulta-horas](https://github.com/gabyboan/consulta-horas) |
| Suplencias Propuesta | Aplicacion operativa | Flutter, Dart, Supabase, PostgreSQL | [gabyboan/app-suplencias-propuesta](https://github.com/gabyboan/app-suplencias-propuesta) |

`Suplencias Propuesta` se incluye como producto en desarrollo activo: ya cuenta
con autenticacion, roles, conexion con Supabase y documentacion publica sin
credenciales ni datos reales.

## Tecnologias

- Astro 5
- Tailwind CSS 4
- Cloudflare Pages
- Wrangler

## Desarrollo

```bash
npm install
npm run dev
```

## Compilacion

```bash
npm run build
```

La salida estatica se genera en `dist/`.

## Despliegue

```bash
npm run build
npx wrangler pages deploy dist --project-name bsoftware --commit-dirty=true
```

Configuracion recomendada en Cloudflare Pages:

- Framework: Astro
- Comando de compilacion: `npm run build`
- Directorio de salida: `dist`
- Node.js: 20 o superior

## Higiene

No subir archivos de diseno fuente, zips exportados, credenciales ni tokens de
servicios externos. El repositorio ignora esos artefactos locales desde
`.gitignore`.
