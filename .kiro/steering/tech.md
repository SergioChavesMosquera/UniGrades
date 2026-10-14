# UniGrades — Stack y Convenciones Técnicas

## Stack
| Capa          | Elección                      | Razón                                             |
|---------------|-------------------------------|---------------------------------------------------|
| Framework     | Next.js (App Router) + TS     | Ideal para Vercel, SEO en landing, routing Framer |
| Backend/DB    | Supabase (Postgres + Auth)    | Relacional real, auth lista, escalable            |
| Datos cliente | TanStack React Query          | Cache, sync, estados de carga limpios             |
| Auth          | Supabase Auth                 | Email + Google OAuth                              |
| i18n          | next-intl                     | Español/inglés con selector                       |
| Formularios   | React Hook Form + Zod         | Validación robusta en cliente                     |
| Deploy        | Vercel                        | Cero-config con Next.js                           |

## Reglas de UI (deliberadamente mínima)
- Blanco y negro: fondo blanco, texto negro, botones negros con texto blanco.
- NO invertir esfuerzo en diseño todavía. La UI es funcional, no bonita.
- Objetivo: que un rediseño futuro sea SOLO frontend, sin tocar backend ni lógica.
- Usar componentes reutilizables simples (Button, Input, Container) para que el restyle
  sea un cambio centralizado.

## Separación backend/frontend (estricta)
- La lógica de datos vive en una **capa de servicios tipada** sobre el cliente Supabase.
- Los componentes de UI son "tontos": reciben datos y callbacks, no hablan directo con
  Supabase ni contienen reglas de negocio.
- Las reglas de negocio viven en Postgres (constraints, triggers, vistas, RLS), no en el
  frontend. El frontend valida para UX, pero la base de datos es la autoridad.

## Convenciones de código
- TypeScript estricto. Evitar `any`.
- ESLint + Prettier configurados; respetar sus reglas.
- Nombres de archivos de rutas y carpetas en inglés (convención Next.js). Textos de UI vía
  i18n (es/en).
- Validación de formularios con Zod; tipos derivados de los esquemas Zod cuando aplique.
- Datos remotos siempre vía React Query (nada de `useEffect` + `fetch` manual para datos).

## Estructura de rutas (patrón Framer)
```
/                      → Landing (pública)
/login                 → Iniciar sesión (pública)
/signup                → Crear cuenta (pública)
/app                   → Dashboard (protegida)
/app/onboarding        → Elegir/crear programa (protegida)
/app/semesters         → Lista de semestres (protegida)
/app/semesters/[id]    → Detalle de semestre (protegida)
/app/subjects/[id]     → Detalle de materia: componentes + notas (protegida)
/app/settings          → Perfil, idioma, programa (protegida)
```
Todo bajo `/app` requiere sesión (middleware redirige a `/login` si no hay sesión).

## Verificación tras cada cambio
- Correr build / type-check / lint tras cada cambio de código.
- Escribir y correr tests al agregar features o corregir bugs.
- Limpiar archivos temporales creados durante la verificación.

## Comandos (Windows PowerShell)
- Separador de comandos: `;` (no `&&`).
- Variables de entorno: `$env:NOMBRE` (no `%NOMBRE%`).
- NO ejecutar servidores de desarrollo en foreground desde el agente; indicar al usuario
  que corra `npm run dev` manualmente, o usar proceso en background.
