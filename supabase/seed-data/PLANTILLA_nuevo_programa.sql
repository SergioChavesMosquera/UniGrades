-- =============================================================================
-- PLANTILLA — Agregar un programa (carrera) al catálogo público de UniGrades
-- =============================================================================
-- CÓMO USAR:
--   1. Copia TODO este archivo.
--   2. Cambia los valores marcados con  <-- CAMBIAR  por los de tu carrera.
--   3. En la sección de materias, pon una línea por materia.
--   4. Pégalo en el SQL Editor de Supabase y pulsa Run.
--
-- Es idempotente: si ya existe un programa público con ese nombre, no reinserta.
--
-- TIPOLOGÍAS: usa las 4 estándar. Marca cuenta_promedio = false SOLO para
-- Nivelación (inglés, matemáticas básicas, etc.). El resto en true.
--
-- Si una carrera usa tipologías con otros nombres, cámbialos abajo libremente.
-- =============================================================================

do $$
declare
  v_univ_id  uuid;
  v_prog_id  uuid;
  v_fund_id  uuid;
  v_disc_id  uuid;
  v_libre_id uuid;
  v_nivel_id uuid;

  -- ---------------------------------------------------------------------------
  -- DATOS DEL PROGRAMA  <-- CAMBIAR
  -- ---------------------------------------------------------------------------
  c_universidad  text := 'Universidad Nacional de Colombia';   -- <-- CAMBIAR si aplica
  c_programa     text := 'NOMBRE DE LA CARRERA AQUÍ';           -- <-- CAMBIAR
  c_facultad     text := 'Facultad de ...';                      -- <-- CAMBIAR
  c_total_cred   int  := 165;                                    -- <-- CAMBIAR (créditos totales)

  -- Créditos requeridos por tipología  <-- CAMBIAR
  c_cred_fund    int  := 51;
  c_cred_disc    int  := 81;
  c_cred_libre   int  := 33;
  c_cred_nivel   int  := 20;
begin
  -- No duplicar si ya existe.
  if exists (
    select 1 from public.programa
    where nombre = c_programa and es_publico = true
  ) then
    raise notice 'Ya existe el programa "%". No se hace nada.', c_programa;
    return;
  end if;

  -- Universidad (reutiliza si ya existe una pública con ese nombre).
  select id into v_univ_id
    from public.institucion
   where nombre = c_universidad and es_publico = true
   limit 1;

  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico)
    values (c_universidad, 'Colombia', true)
    returning id into v_univ_id;
  end if;

  -- Programa.
  insert into public.programa (institucion_id, nombre, facultad, total_creditos, es_publico)
  values (v_univ_id, c_programa, c_facultad, c_total_cred, true)
  returning id into v_prog_id;

  -- Tipologías (las 4 estándar; Nivelación NO cuenta para promedio).
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', c_cred_fund, true)  returning id into v_fund_id;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', c_cred_disc, true)     returning id into v_disc_id;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Libre Elección', c_cred_libre, true) returning id into v_libre_id;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', c_cred_nivel, false)    returning id into v_nivel_id;

  -- ---------------------------------------------------------------------------
  -- MATERIAS  <-- CAMBIAR / AGREGAR
  -- Formato de cada línea:
  --   (v_prog_id, <TIPOLOGIA>, 'codigo', 'Nombre de la materia', creditos, semestre),
  -- Donde <TIPOLOGIA> es una de: v_fund_id, v_disc_id, v_libre_id, v_nivel_id
  -- El semestre es el sugerido (1..10); usa 0 para materias de nivelación.
  -- El código puede ir vacío ('') si no lo tienes; no afecta los cálculos.
  -- ---------------------------------------------------------------------------
  insert into public.materia
    (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido)
  values
    (v_prog_id, v_fund_id,  '', 'Materia de ejemplo 1', 4, 1),   -- <-- CAMBIAR
    (v_prog_id, v_disc_id,  '', 'Materia de ejemplo 2', 3, 1),   -- <-- CAMBIAR
    (v_prog_id, v_libre_id, '', 'Libre elección',       3, 1),   -- <-- CAMBIAR
    (v_prog_id, v_nivel_id, '', 'Inglés I',             3, 0);   -- <-- ejemplo nivelación
    -- ... agrega todas las que necesites, separadas por coma; la última termina en ;

  raise notice 'Programa "%" agregado al catálogo.', c_programa;
end $$;
