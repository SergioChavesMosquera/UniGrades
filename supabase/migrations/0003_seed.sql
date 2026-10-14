-- =============================================================================
-- UniGrades — Migración 0003: Seed del catálogo (Ingeniería de Sistemas, UNAL)
-- =============================================================================
-- Carga como catálogo PÚBLICO (es_publico = true, creado_por = NULL):
--   1 universidad, 1 programa, 4 tipologías, y las materias de la malla 2A74.
-- Idempotente: si el programa ya existe, no vuelve a insertar.
--
-- Tipologías y cuenta_promedio (RN-6):
--   Fundamentación  -> cuenta
--   Disciplinar     -> cuenta
--   Libre Elección  -> cuenta
--   Nivelación      -> NO cuenta (Inglés I-IV, Matemáticas básicas, Lecto-escritura)
--
-- Nota: la rama obligatoria/optativa no se modela como columna separada en el MVP
-- (todas se tratan igual). Se puede añadir después sin romper nada.
-- =============================================================================

do $$
declare
  v_univ_id      uuid;
  v_prog_id      uuid;
  v_fund_id      uuid;
  v_disc_id      uuid;
  v_libre_id     uuid;
  v_nivel_id     uuid;
begin
  -- Evita duplicar si ya se corrió el seed.
  if exists (
    select 1 from public.programa
    where nombre = 'Ingeniería de Sistemas y Computación' and es_publico = true
  ) then
    raise notice 'Seed ya aplicado: el programa ya existe. Nada que hacer.';
    return;
  end if;

  -- Universidad (reutiliza si ya existe una pública con ese nombre).
  select id into v_univ_id
    from public.institucion
   where nombre = 'Universidad Nacional de Colombia' and es_publico = true
   limit 1;

  if v_univ_id is null then
    insert into public.institucion (nombre, sigla, pais, ciudad, es_publico)
    values ('Universidad Nacional de Colombia', 'UNAL', 'Colombia', 'Bogotá', true)
    returning id into v_univ_id;
  end if;

  -- Programa.
  insert into public.programa (institucion_id, nombre, facultad, total_creditos, es_publico)
  values (v_univ_id, 'Ingeniería de Sistemas y Computación', 'Facultad de Ingeniería', 167, true)
  returning id into v_prog_id;

  -- Tipologías.
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 51, true) returning id into v_fund_id;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 81, true) returning id into v_disc_id;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Libre Elección', 33, true) returning id into v_libre_id;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 20, false) returning id into v_nivel_id;

  -- Materias. (codigo, nombre, creditos, tipologia, semestre_sugerido)
  insert into public.materia
    (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido)
  values
    (v_prog_id, v_fund_id,  '1000004',    'Cálculo diferencial', 4, 1),
    (v_prog_id, v_disc_id,  '2025975',    'Introducción a la ingeniería de sistemas y computación', 3, 1),
    (v_prog_id, v_disc_id,  '2015734',    'Programación de computadores', 3, 1),
    (v_prog_id, v_disc_id,  '2016703',    'Pensamiento sistémico', 3, 1),
    (v_prog_id, v_libre_id, '1000089-B',  'Cátedra nacional de inducción y preparación para la vida universitaria', 2, 1),
    (v_prog_id, v_fund_id,  '1000019',    'Fundamentos de mecánica', 4, 2),
    (v_prog_id, v_fund_id,  '1000005',    'Cálculo integral', 4, 2),
    (v_prog_id, v_fund_id,  '1000003',    'Álgebra lineal', 4, 2),
    (v_prog_id, v_disc_id,  '2016375',    'Programación orientada a objetos', 3, 2),
    (v_prog_id, v_fund_id,  '1000017',    'Fundamentos de electricidad y magnetismo', 4, 3),
    (v_prog_id, v_fund_id,  '1000006',    'Cálculo en varias variables', 4, 3),
    (v_prog_id, v_fund_id,  '2025963',    'Matemáticas discretas I', 3, 3),
    (v_prog_id, v_disc_id,  '2016353',    'Bases de datos', 3, 3),
    (v_prog_id, v_disc_id,  '2016698',    'Elementos de computadores', 3, 3),
    (v_prog_id, v_fund_id,  '1000013',    'Probabilidad y estadística fundamental', 3, 4),
    (v_prog_id, v_fund_id,  '2015703',    'Ingeniería económica', 3, 4),
    (v_prog_id, v_fund_id,  '2025964',    'Matemáticas discretas II', 3, 4),
    (v_prog_id, v_disc_id,  '2016699',    'Estructuras de datos', 3, 4),
    (v_prog_id, v_disc_id,  '2016697',    'Arquitectura de computadores', 3, 4),
    (v_prog_id, v_disc_id,  '2025970',    'Modelos y simulación', 3, 5),
    (v_prog_id, v_disc_id,  '2015702',    'Gerencia y gestión de proyectos', 3, 5),
    (v_prog_id, v_disc_id,  '2025967',    'Redes de computadores', 3, 5),
    (v_prog_id, v_disc_id,  '2016701',    'Ingeniería de software I', 3, 5),
    (v_prog_id, v_fund_id,  '2015174',    'Introducción a la teoría de la computación', 3, 5),
    (v_prog_id, v_disc_id,  '2025971',    'Optimización', 3, 6),
    (v_prog_id, v_disc_id,  '2025982',    'Sistemas de información', 3, 6),
    (v_prog_id, v_fund_id,  '2015970',    'Métodos numéricos', 3, 6),
    (v_prog_id, v_disc_id,  '2016702',    'Ingeniería de software II', 3, 6),
    (v_prog_id, v_disc_id,  '2016696',    'Algoritmos', 3, 6),
    (v_prog_id, v_disc_id,  '2016707',    'Sistemas operativos', 3, 6),
    (v_prog_id, v_disc_id,  '2025960',    'Arquitectura de infraestructura y gobierno de TICs', 3, 7),
    (v_prog_id, v_disc_id,  '2025983',    'Modelos estocásticos y simulación en computación y comunicaciones', 3, 7),
    (v_prog_id, v_disc_id,  '2025994',    'Teoría de la información y sistemas de comunicaciones', 3, 7),
    (v_prog_id, v_disc_id,  '2016716',    'Arquitectura de software', 3, 7),
    (v_prog_id, v_disc_id,  '2025966',    'Introducción a los sistemas inteligentes', 3, 7),
    (v_prog_id, v_disc_id,  '2025968',    'Lenguajes de programación', 3, 7),
    (v_prog_id, v_disc_id,  '2024045',    'Taller de proyectos interdisciplinarios', 3, 8),
    (v_prog_id, v_disc_id,  '2025969',    'Computación paralela y distribuida', 3, 8),
    (v_prog_id, v_disc_id,  '2025972',    'Introducción a la criptografía y a la seguridad de la información', 3, 8),
    (v_prog_id, v_disc_id,  '2025995',    'Computación visual', 3, 8),
    (v_prog_id, v_disc_id,  '2016703-TG', 'Trabajo de grado', 6, 10),
    (v_prog_id, v_nivel_id, '1000001',    'Matemáticas básicas', 4, 0),
    (v_prog_id, v_nivel_id, '1000002-N',  'Lecto-escritura', 4, 0),
    (v_prog_id, v_nivel_id, '1000045',    'Inglés I', 3, 0),
    (v_prog_id, v_nivel_id, '1000046',    'Inglés II', 3, 0),
    (v_prog_id, v_nivel_id, '1000047',    'Inglés III', 3, 0),
    (v_prog_id, v_nivel_id, '1000048',    'Inglés IV', 3, 0);

  raise notice 'Seed aplicado: programa Ingeniería de Sistemas y Computación con 47 materias.';
end $$;
