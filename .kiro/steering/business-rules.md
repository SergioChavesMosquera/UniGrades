# UniGrades — Reglas de Negocio (RN)

Estas reglas se implementan en la base de datos (Postgres/Supabase) como la autoridad.
El frontend puede validar para UX, pero la base de datos las hace cumplir.

## RN-1 — Un estudiante pertenece a exactamente un programa
- Entidades: `usuario`, `programa`.
- Implementación: FK `usuario.programa_id` NOT NULL. No puede existir usuario sin programa.

## RN-2 — Los porcentajes de los componentes de una materia suman 100
- Entidades: `componente`, `materia_usuario`.
- La suma de `componente_porcentaje` de todos los componentes de una misma
  `materia_usuario` debe ser exactamente 100.
- Implementación: **trigger** de validación (no se puede expresar con NOT NULL ni UNIQUE).

## RN-3 — No inscribir la misma materia dos veces en el mismo semestre
- Entidades: `materia_usuario`, `semestre`, `materia`.
- La combinación (`materia_usuario_materia_id`, `materia_usuario_semestre_id`) es única.
- Un mismo estudiante SÍ puede cursar la misma materia en semestres distintos (repetición).
- Implementación: constraint **UNIQUE**.

## RN-4 — El estado de una materia sigue transiciones definidas
- Entidad: `materia_usuario`.
- `materia_usuario_estado` ∈ { en_curso, aprobada, reprobada, retirada }.
- Una materia aprobada o reprobada NO puede volver a en_curso en el mismo registro.
- Implementación: **CHECK** para el dominio de valores + **trigger** para las transiciones.

## RN-5 — El valor de una nota está dentro del rango válido
- Entidad: `nota`.
- `nota_valor` entre 0.0 y 5.0 (escala colombiana estándar).
- Implementación: constraint **CHECK**.

## RN-6 — Las tipologías de nivelación no cuentan en el promedio
- Entidades: `tipologia`, `materia`, `nota`.
- Materias cuya tipología tiene `tipologia_cuenta_promedio = 0` (p. ej. Inglés I–IV en la
  UNAL) se excluyen del promedio global y por semestre.
- Implementación: columna `tipologia_cuenta_promedio` + lógica en las **vistas** de promedio.

## RN-7 — Un componente acumula múltiples notas; su calificación es el promedio
- Entidades: `componente`, `nota`.
- Un componente tiene 0..N notas (1:N). Su calificación = promedio aritmético de sus notas.
- Modela componentes acumulativos (p. ej. Talleres – 20 % con N entregas desconocidas).
- Implementación: **vista/función** de agregación.

## RLS — Aislamiento por usuario
- Cada usuario solo puede leer/escribir sus propios datos.
- Implementación: Row Level Security en todas las tablas con datos de usuario, usando
  `auth.uid()`.

## Modelo de datos (relaciones)
```
institucion     1─N  programa
programa        1─N  tipologia
programa        1─N  materia
tipologia       1─N  materia
usuario         N─1  programa
usuario         1─N  semestre
usuario         1─N  materia_usuario
materia         1─N  materia_usuario
semestre        1─N  materia_usuario
materia_usuario 1─N  componente
componente      1─N  nota
```
