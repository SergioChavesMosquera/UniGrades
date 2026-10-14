# Base de datos — UniGrades (Supabase)

Migraciones SQL versionadas del esquema de UniGrades. Son la **fuente de verdad** del
modelo de datos y las reglas de negocio (RN-1..RN-7 + RLS).

## Archivos (aplicar en orden)
1. `migrations/0001_schema.sql` — esquema base: 9 tablas, FKs y constraints declarativas
   (RN-1, RN-3, RN-4 CHECK, RN-5).
2. `migrations/0002_rules.sql` — triggers (RN-2 máx 100 + helper de "100 exacto",
   RN-4 transiciones de estado, auto-creación de perfil al registrarse), vistas de
   promedios (RN-6 exclusión de nivelación, RN-7 promedio por componente) y Row Level
   Security en todas las tablas.
3. `migrations/0003_seed.sql` — seed del catálogo público: Universidad Nacional +
   programa Ingeniería de Sistemas y Computación (4 tipologías + 47 materias de la malla
   2A74). Idempotente: si el programa ya existe, no reinserta.

> La plantilla para cargar más carreras está en `supabase/seed-data/plantilla-malla.xlsx`
> (Excel con listas desplegables + la malla de Sistemas ya cargada como ejemplo).

## Cómo aplicar (forma fácil, recomendada para empezar)
1. Entra al panel de Supabase → tu proyecto → **SQL Editor**.
2. Abre un archivo de migración de esta carpeta, copia TODO su contenido.
3. Pégalo en el SQL Editor y pulsa **Run**.
4. Repite en orden (0001, luego 0002, luego 0003).

Las migraciones usan `create ... if not exists`, así que se pueden volver a ejecutar sin
romper lo ya creado.

## Cómo aplicar (vía CLI, opcional, más adelante)
Requiere linkear el proyecto con la contraseña de la base de datos:
```powershell
supabase link --project-ref vyhnnhmgcxktsuzouhkn
supabase db push
```
> El CLI pide la contraseña de la base de datos (no la clave publicable). No la guardes en
> el repo.

## Notas de seguridad
- Solo se usa la **clave publicable** (`sb_publishable_...`) en el frontend; la seguridad
  real la impone RLS en Postgres.
- La **clave secreta** (`sb_secret_...`) nunca va en el frontend ni en el repo.
