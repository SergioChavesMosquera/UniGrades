# UniGrades

Aplicación web para que estudiantes universitarios lleven el seguimiento de su progreso
académico: registrar materias por semestre, configurar los componentes de evaluación de
cada asignatura y registrar notas, con cálculo automático de promedios por materia, por
semestre y global acumulado.

Agnóstico a la institución: soporta cualquier universidad, programa y escala de
calificación. Este repositorio contiene la **versión web** (el móvil se abordará en un
repo separado, compartiendo la misma base de datos).

## Stack

| Capa          | Tecnología                    |
|---------------|-------------------------------|
| Framework     | Next.js (App Router) + TypeScript |
| Backend / BD  | Supabase (Postgres + Auth)    |
| Datos cliente | TanStack React Query          |
| i18n          | next-intl (español / inglés)  |
| Despliegue    | Vercel                        |

## Arquitectura (resumen)

- **Patrón de rutas tipo Framer:** landing pública en `/`, aplicación protegida bajo `/app`.
- **Las reglas de negocio viven en la base de datos** (constraints, triggers, vistas, RLS),
  no solo en el frontend. La base de datos es la autoridad.
- **Separación estricta backend/frontend:** la lógica de datos está en una capa de
  servicios tipada (`services/`); los componentes de UI son "tontos".
- **UI mínima deliberada** (blanco/negro) para priorizar el flujo; un rediseño futuro es
  solo frontend.

### Estructura de rutas
```
/                      Landing (pública)
/login                 Iniciar sesión (pública)
/signup                Crear cuenta (pública)
/app                   Dashboard de progreso (protegida)
/app/onboarding        Elegir/crear programa (protegida)
/app/semesters         Lista de semestres (protegida)
/app/semesters/[id]    Detalle de semestre: inscribir materias (protegida)
/app/subjects/[id]     Componentes de evaluación y notas (protegida)
```

### Reglas de negocio
- RN-1: un estudiante pertenece a exactamente un programa.
- RN-2: los porcentajes de los componentes de una materia suman 100 (modo flexible: se
  permite ir sumando, nunca pasar de 100).
- RN-3: no se puede inscribir la misma materia dos veces en el mismo semestre.
- RN-4: transiciones de estado válidas (una materia aprobada/reprobada no vuelve a en curso).
- RN-5: las notas están entre 0.0 y 5.0.
- RN-6: las tipologías de nivelación (ej. inglés) no cuentan en el promedio.
- RN-7: la calificación de un componente es el promedio de sus notas.
- RLS: cada usuario solo accede a sus propios datos.

## Puesta en marcha local

### Requisitos
- Node.js 20+ y npm.
- Un proyecto en [Supabase](https://supabase.com).

### Pasos
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear `.env.local` a partir de `.env.example` y completar con los datos de tu proyecto
   Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
   ```
3. Aplicar las migraciones SQL en el SQL Editor de Supabase, en orden
   (ver `supabase/README.md`):
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rules.sql`
   - `supabase/migrations/0003_seed.sql`
4. Correr en desarrollo:
   ```bash
   npm run dev
   ```
   La app queda en `http://localhost:3000`.

### Scripts
- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run start` — servir el build.
- `npm run lint` — ESLint.
- `npm run typecheck` — chequeo de tipos sin emitir.

## Despliegue (Vercel)
1. Subir el repositorio a GitHub.
2. Importar el repo en Vercel.
3. Configurar las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Desplegar. Vercel detecta Next.js automáticamente.

## Documentación del proceso
La construcción paso a paso está documentada en `bitacora/` (diario cronológico y esquema
de ebook), material base para la serie de contenido y la entrega de clase.

## Seguridad
- En el frontend solo se usa la **clave publicable** de Supabase; la seguridad real la
  impone Row Level Security en Postgres.
- La **clave secreta** nunca se versiona ni se usa en el cliente.
