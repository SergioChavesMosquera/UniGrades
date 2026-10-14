-- =============================================================================
-- UniGrades — Migración 0004: Seed de programas del catálogo (generado desde Excel)
-- =============================================================================
-- Carreras cargadas como catálogo público. Idempotente por programa.
-- Libre Elección NO se incluye (decisión de producto). Nivelación común copiada
-- a las carreras que no tenían nivelación propia. total_creditos = suma de lo
-- cargado (se ajusta después). Tipologías normalizadas.
-- =============================================================================

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Ingeniería Química' and es_publico = true) then
    raise notice 'Ya existe: Ingeniería Química'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Ingeniería Química', 160, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '1000024', 'Principios de química', 3, 1),
    (v_prog_id, v_tip_0, '1000025', 'Laboratorio de técnicas básicas en química', 3, 1),
    (v_prog_id, v_tip_0, '1000004', 'Cálculo diferencial', 4, 1),
    (v_prog_id, v_tip_0, '-', 'Optativa - Herramientas de la Ingeniería', 3, 1),
    (v_prog_id, v_tip_1, '2015718', 'Introducción a la Ingeniería Química', 3, 1),
    (v_prog_id, v_tip_0, '1000026', 'Principios de análisis químico', 3, 2),
    (v_prog_id, v_tip_0, '1000003', 'Álgebra lineal', 4, 2),
    (v_prog_id, v_tip_0, '1000005', 'Cálculo integral', 4, 2),
    (v_prog_id, v_tip_0, '1000019', 'Fundamentos de mecánica', 4, 2),
    (v_prog_id, v_tip_1, '2015708', 'Balance de materia', 3, 2),
    (v_prog_id, v_tip_0, '1000027', 'Laboratorio de principios de análisis químico', 3, 3),
    (v_prog_id, v_tip_0, '1000025', 'Biología molecular y celular', 3, 3),
    (v_prog_id, v_tip_0, '1000006', 'Cálculo en varias variables', 4, 3),
    (v_prog_id, v_tip_0, '1000017', 'Fundamentos de electricidad y magnetismo', 4, 3),
    (v_prog_id, v_tip_1, '2015741', 'Termodinámica', 3, 3),
    (v_prog_id, v_tip_0, '1000028', 'Principios de química inorgánica', 3, 4),
    (v_prog_id, v_tip_0, '1000013', 'Probabilidad y Estadística fundamental', 3, 4),
    (v_prog_id, v_tip_0, '1000007', 'Ecuaciones diferenciales', 4, 4),
    (v_prog_id, v_tip_1, '2015714', 'Fluidos', 3, 4),
    (v_prog_id, v_tip_1, '2015735', 'Taller 1', 1, 4),
    (v_prog_id, v_tip_1, '2015740', 'Termodinámica química', 3, 4),
    (v_prog_id, v_tip_0, '1000030', 'Principios de química orgánica', 3, 5),
    (v_prog_id, v_tip_0, '2015970', 'Métodos numéricos', 3, 5),
    (v_prog_id, v_tip_1, '2015743', 'Transferencia de calor', 4, 5),
    (v_prog_id, v_tip_1, '2015276', 'Manejo de sólidos', 3, 5),
    (v_prog_id, v_tip_1, '2015707', 'Balance de energía y equilibrio químico', 3, 5),
    (v_prog_id, v_tip_0, '1000010', 'Laboratorio de principios de química orgánica', 2, 6),
    (v_prog_id, v_tip_0, '2015703', 'Ingeniería económica', 3, 6),
    (v_prog_id, v_tip_1, '2015744', 'Transferencia de masa', 3, 6),
    (v_prog_id, v_tip_1, '2015736', 'Taller 2', 1, 6),
    (v_prog_id, v_tip_1, '2015721', 'Laboratorio de propiedades termodinámicas y de transporte', 3, 6),
    (v_prog_id, v_tip_1, '-', 'Optativa - Termodinámica', 3, 6),
    (v_prog_id, v_tip_0, '-', 'Optativa - Ciencias Económicas y Administrativas', 3, 7),
    (v_prog_id, v_tip_0, '2015702', 'Gerencia y gestión de proyectos', 3, 7),
    (v_prog_id, v_tip_1, '2015731', 'Operaciones de separación', 3, 7),
    (v_prog_id, v_tip_1, '2015719', 'Laboratorio de fluidos, sólidos y transferencia de calor', 3, 7),
    (v_prog_id, v_tip_1, '2015716', 'Ingeniería de reacciones químicas', 3, 7),
    (v_prog_id, v_tip_1, '-', 'Optativa - Materiales', 3, 8),
    (v_prog_id, v_tip_1, '2015710', 'Control de procesos', 3, 8),
    (v_prog_id, v_tip_1, '2015720', 'Laboratorio de operaciones de separación, reacción y control', 3, 8),
    (v_prog_id, v_tip_1, '-', 'Optativa - Procesos Químicos y Bioquímicos', 3, 8),
    (v_prog_id, v_tip_1, '2015713', 'Diseño de procesos químicos y bioquímicos', 3, 8),
    (v_prog_id, v_tip_1, '2015737', 'Taller de proyectos interdisciplinarios', 3, 9),
    (v_prog_id, v_tip_1, '2015712', 'Diseño de plantas y equipos', 3, 9),
    (v_prog_id, v_tip_1, '2015715', 'Ingeniería de procesos', 3, 9),
    (v_prog_id, v_tip_1, '2015289', 'Trabajo de grado', 6, 10),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Ingeniería Química (51 materias)';
end $$;

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Enfermería' and es_publico = true) then
    raise notice 'Ya existe: Enfermería'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Enfermería', 145, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '1000041', 'Química Básica', 3, 1),
    (v_prog_id, v_tip_0, '2016576', 'Morfofisiología I', 3, 1),
    (v_prog_id, v_tip_1, '', 'Optativa - Epistemología, historia y modelos de enfermería', 4, 1),
    (v_prog_id, v_tip_0, '', 'Optativa I - Ciencias Basicas: Psicología del ciclo vital', 2, 1),
    (v_prog_id, v_tip_0, '1000042', 'Bioquímica Básica', 3, 2),
    (v_prog_id, v_tip_0, '2016575', 'Microbiología', 3, 2),
    (v_prog_id, v_tip_0, '2017937', 'Fundamentos Psicosociales y Culturales del Cuidado', 4, 2),
    (v_prog_id, v_tip_0, '2017967', 'Optativa de Fundamentación de Salud Pública', 4, 2),
    (v_prog_id, v_tip_0, '', 'Optativa-Ciencias Básicas: Familia y Salud', 2, 2),
    (v_prog_id, v_tip_0, '2016569', 'Farmacología', 3, 3),
    (v_prog_id, v_tip_0, '2016007', 'Fundamentos en Administración en Salud', 4, 3),
    (v_prog_id, v_tip_1, '2017966', 'Prácticas y Habilidades Clínicas Básicas', 6, 3),
    (v_prog_id, v_tip_0, '', 'Optativa II - Ciencias Básicas', 2, 4),
    (v_prog_id, v_tip_0, '', 'Optativa - Salud Pública', 2, 4),
    (v_prog_id, v_tip_1, '2016578', 'Prácticas y Habilidades Clínicas Avanzadas', 6, 4),
    (v_prog_id, v_tip_0, '2015782', 'Optativa - Proceso Investigativo I', 2, 4),
    (v_prog_id, v_tip_0, '', 'Optativa III - Ciencias Básicas', 3, 5),
    (v_prog_id, v_tip_1, '', 'Enfermería I', 8, 5),
    (v_prog_id, v_tip_1, '', 'Optativa I - Cuidado y Práctica de Enfermería', 2, 5),
    (v_prog_id, v_tip_0, '', 'Optativa - Proceso Investigativo II', 3, 5),
    (v_prog_id, v_tip_0, '', 'Optativa IV - Ciencias Básicas', 2, 6),
    (v_prog_id, v_tip_0, '', 'Optativa V - Ciencias Básicas', 2, 6),
    (v_prog_id, v_tip_1, '', 'Enfermería II', 8, 6),
    (v_prog_id, v_tip_1, '', 'Optativa II - Cuidado y Práctica de Enfermería', 2, 6),
    (v_prog_id, v_tip_1, '', 'Optativa - Proceso Investigativo y Trabajo de Grado', 2, 6),
    (v_prog_id, v_tip_1, '', 'Enfermería III', 8, 7),
    (v_prog_id, v_tip_1, '', 'Optativa III - Cuidado y Práctica de Enfermería', 2, 7),
    (v_prog_id, v_tip_1, '2017935', 'Fundamentos de Investigación en Enfermería', 2, 7),
    (v_prog_id, v_tip_1, '', 'Enfermería IV', 8, 8),
    (v_prog_id, v_tip_1, '', 'Optativa - Cuidado y Práctica de Enfermería', 2, 8),
    (v_prog_id, v_tip_1, '', 'Enfermería V', 8, 9),
    (v_prog_id, v_tip_1, '', 'Enfermería VI', 8, 10),
    (v_prog_id, v_tip_1, '2017974', 'Trabajo de grado', 6, 10),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Enfermería (38 materias)';
end $$;

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Geografía' and es_publico = true) then
    raise notice 'Ya existe: Geografía'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Geografía', 236, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '2015238', 'Geografía física', 4, 1),
    (v_prog_id, v_tip_0, '2015240', 'Geografía humana', 4, 1),
    (v_prog_id, v_tip_0, '2015271', 'Fundamentos de las ciencias sociales', 3, 1),
    (v_prog_id, v_tip_0, '2015250', 'Introducción al trabajo científico', 3, 1),
    (v_prog_id, v_tip_0, '2015225', 'Cartografía general', 4, 1),
    (v_prog_id, v_tip_0, '2028623', 'Estadística para geógrafos', 3, 2),
    (v_prog_id, v_tip_0, '2015266', 'Tecnologías de la información geográfica', 4, 2),
    (v_prog_id, v_tip_0, '2015233', 'Fotointerpretación', 3, 2),
    (v_prog_id, v_tip_0, '2015253', 'Métodos cualitativos', 3, 2),
    (v_prog_id, v_tip_0, '2027927', 'Geografía de Colombia', 3, 2),
    (v_prog_id, v_tip_0, '2028624', 'Fundamentos de geología para geografía', 3, 3),
    (v_prog_id, v_tip_0, '2027915', 'Edafogeografía', 3, 3),
    (v_prog_id, v_tip_0, '2028775', 'Colombia contemporánea', 3, 3),
    (v_prog_id, v_tip_0, '2015249', 'Introducción a la sociología', 3, 3),
    (v_prog_id, v_tip_0, '2015270', 'Fundamentos de economía', 3, 3),
    (v_prog_id, v_tip_0, '2015610', 'Introducción a la historia', 3, 3),
    (v_prog_id, v_tip_0, '2015630', 'Métodos históricos', 3, 3),
    (v_prog_id, v_tip_0, '2015631', 'Paleografía', 3, 3),
    (v_prog_id, v_tip_0, '2015979', 'Análisis del discurso I', 3, 3),
    (v_prog_id, v_tip_0, '2015634', 'Archivística', 3, 3),
    (v_prog_id, v_tip_0, '2015256', 'Pensamiento sociológico latinoamericano', 3, 3),
    (v_prog_id, v_tip_0, '2015613', 'Historia contemporánea I', 3, 3),
    (v_prog_id, v_tip_0, '2015614', 'Historia contemporánea II', 3, 3),
    (v_prog_id, v_tip_1, '2015248', 'Historia del pensamiento geográfico', 3, 4),
    (v_prog_id, v_tip_1, '2015252', 'Meteorología básica', 3, 4),
    (v_prog_id, v_tip_1, '2015237', 'Geografía económica', 3, 4),
    (v_prog_id, v_tip_1, '2027691', 'Geografías del turismo', 3, 4),
    (v_prog_id, v_tip_1, '2015243', 'Geografía urbana', 3, 4),
    (v_prog_id, v_tip_1, '2015235', 'Geografía de género', 3, 4),
    (v_prog_id, v_tip_1, '2015239', 'Geografía histórica', 3, 4),
    (v_prog_id, v_tip_1, '2015242', 'Geografía rural', 3, 4),
    (v_prog_id, v_tip_1, '2015234', 'Geografía cultural', 3, 4),
    (v_prog_id, v_tip_1, '2015241', 'Geografía política', 3, 4),
    (v_prog_id, v_tip_1, '2015236', 'Geografía de la población', 3, 4),
    (v_prog_id, v_tip_1, '2015227', 'Cibergeografía', 3, 4),
    (v_prog_id, v_tip_1, '2027698', 'Geografía y Humanidades: arte, cine y literatura', 3, 4),
    (v_prog_id, v_tip_1, '2027928', 'Geografía de América Latina', 3, 4),
    (v_prog_id, v_tip_1, '2015267', 'Teoría de la geografía contemporánea', 3, 5),
    (v_prog_id, v_tip_1, '2015228', 'Climatología', 3, 5),
    (v_prog_id, v_tip_1, '2015245', 'Geomorfología 1', 3, 5),
    (v_prog_id, v_tip_1, '2015247', 'Hidrogeografía', 3, 5),
    (v_prog_id, v_tip_1, '2015276', 'Biogeografía', 3, 5),
    (v_prog_id, v_tip_1, '2028621', 'Espacios marinos y costeros I', 3, 5),
    (v_prog_id, v_tip_1, '2015255', 'Ordenamiento territorial y ambiental', 3, 5),
    (v_prog_id, v_tip_1, '2015147', 'Análisis del paisaje', 3, 5),
    (v_prog_id, v_tip_1, '2015148', 'Ambiente biogeofísico e impacto socioeconómico', 3, 5),
    (v_prog_id, v_tip_1, '2015258', 'Riesgos naturales', 3, 5),
    (v_prog_id, v_tip_1, '2015230', 'Ecología política', 3, 5),
    (v_prog_id, v_tip_1, '2015268', 'Teoría del Desarrollo y Planificación Territorial', 3, 5),
    (v_prog_id, v_tip_1, '2015257', 'Profundización en SIG', 3, 5),
    (v_prog_id, v_tip_1, '2015264', 'SIG participativo', 3, 5),
    (v_prog_id, v_tip_1, '2015263', 'Sensores remotos', 3, 5),
    (v_prog_id, v_tip_1, '2015226', 'Cartografía temática', 3, 5),
    (v_prog_id, v_tip_1, '2015251', 'Laboratorio de investigación', 3, 6),
    (v_prog_id, v_tip_1, '2015246', 'Geomorfología 2', 3, 6),
    (v_prog_id, v_tip_1, '2027662', 'Espacios marinos y costeros II', 3, 6),
    (v_prog_id, v_tip_1, '2015260', 'Seminario en geografía física', 3, 6),
    (v_prog_id, v_tip_1, '2015261', 'Seminario en geografía humana', 3, 6),
    (v_prog_id, v_tip_1, '2015259', 'Seminario ambiental', 3, 6),
    (v_prog_id, v_tip_1, '2027929', 'Seminario en Geotecnologías', 3, 6),
    (v_prog_id, v_tip_1, '2015269', 'Trabajo de campo', 6, 7),
    (v_prog_id, v_tip_1, '2015274', 'Trabajo de Grado: Trabajo investigativo', 10, 8),
    (v_prog_id, v_tip_1, '2015275', 'Trabajo de Grado: Asignaturas de Posgrado', 10, 8),
    (v_prog_id, v_tip_1, '2028087', 'Trabajo de Grado: Prácticas de Extensión (Pasantía)', 10, 8),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Geografía (69 materias)';
end $$;

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Medicina Veterinaria' and es_publico = true) then
    raise notice 'Ya existe: Medicina Veterinaria'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Medicina Veterinaria', 184, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '-', 'Introducción a las ciencias veterinarias', 3, 1),
    (v_prog_id, v_tip_0, '-', 'Bioética y bienestar en la salud animal', 1, 1),
    (v_prog_id, v_tip_0, '-', 'Química básica', 3, 1),
    (v_prog_id, v_tip_0, '-', 'Biología optativa', 3, 1),
    (v_prog_id, v_tip_0, '-', 'Histología y embriología', 4, 2),
    (v_prog_id, v_tip_0, '-', 'Anatomía comparada', 5, 2),
    (v_prog_id, v_tip_0, '-', 'Bioquímica básica', 3, 2),
    (v_prog_id, v_tip_0, '-', 'Biofísica', 2, 2),
    (v_prog_id, v_tip_0, '-', 'Biología molecular avanzada', 2, 3),
    (v_prog_id, v_tip_0, '-', 'Fisiología', 5, 3),
    (v_prog_id, v_tip_1, '-', 'Suelos y plantas', 2, 3),
    (v_prog_id, v_tip_1, '-', 'Inmunología', 2, 3),
    (v_prog_id, v_tip_0, '-', 'Bioestadística fundamental', 3, 3),
    (v_prog_id, v_tip_0, '-', 'Genética', 3, 4),
    (v_prog_id, v_tip_1, '-', 'Virología', 3, 4),
    (v_prog_id, v_tip_1, '-', 'Bacteriología y micología', 3, 4),
    (v_prog_id, v_tip_1, '-', 'Parasitología', 4, 4),
    (v_prog_id, v_tip_1, '-', 'Nutrición', 2, 4),
    (v_prog_id, v_tip_1, '-', 'Semiología', 5, 5),
    (v_prog_id, v_tip_1, '-', 'Farmacología', 4, 5),
    (v_prog_id, v_tip_1, '-', 'Sociedades rurales', 2, 5),
    (v_prog_id, v_tip_1, '-', 'Imagenología', 1, 5),
    (v_prog_id, v_tip_1, '-', 'Mecanismos de enfermedad', 4, 5),
    (v_prog_id, v_tip_1, '-', 'Cirugía I', 4, 6),
    (v_prog_id, v_tip_1, '-', 'Patología sistémica', 4, 6),
    (v_prog_id, v_tip_1, '-', 'Patología clínica', 4, 6),
    (v_prog_id, v_tip_1, '-', 'Políticas agropecuarias', 2, 6),
    (v_prog_id, v_tip_1, '-', 'Sistemas de producción I', 2, 6),
    (v_prog_id, v_tip_1, '-', 'Cirugía II', 2, 7),
    (v_prog_id, v_tip_1, '-', 'Epidemiología', 3, 7),
    (v_prog_id, v_tip_1, '-', 'Medicina aviar', 3, 7),
    (v_prog_id, v_tip_1, '-', 'Planeación y evaluación de empresas', 2, 7),
    (v_prog_id, v_tip_1, '-', 'Extensión rural', 2, 7),
    (v_prog_id, v_tip_1, '-', 'Toxicología', 3, 7),
    (v_prog_id, v_tip_1, '-', 'Sistemas de producción II', 2, 7),
    (v_prog_id, v_tip_1, '-', 'Medicina interna de rumiantes', 2, 8),
    (v_prog_id, v_tip_1, '-', 'Medicina interna de pequeños', 4, 8),
    (v_prog_id, v_tip_1, '-', 'Salud pública', 4, 8),
    (v_prog_id, v_tip_1, '-', 'Teriogenología', 2, 8),
    (v_prog_id, v_tip_1, '-', 'Salud de hato', 4, 8),
    (v_prog_id, v_tip_1, '-', 'Medicina interna de equinos', 2, 9),
    (v_prog_id, v_tip_1, '-', 'Medicina interna de silvestres', 2, 9),
    (v_prog_id, v_tip_1, '-', 'Medicina interna de porcinos', 2, 9),
    (v_prog_id, v_tip_1, '-', 'Teriogenología aplicada', 2, 9),
    (v_prog_id, v_tip_1, '-', 'Clínica de grandes animales', 8, 10),
    (v_prog_id, v_tip_1, '-', 'Clínica de pequeños animales', 8, 10),
    (v_prog_id, v_tip_1, '-', 'Clínica de la reproducción', 8, 10),
    (v_prog_id, v_tip_1, '-', 'Rotación por laboratorios', 8, 10),
    (v_prog_id, v_tip_1, '-', 'Trabajo de grado', 10, 12),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Medicina Veterinaria (54 materias)';
end $$;

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Diseño Gráfico' and es_publico = true) then
    raise notice 'Ya existe: Diseño Gráfico'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Diseño Gráfico', 188, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '2016104', 'Teoría de la mirada', 3, 1),
    (v_prog_id, v_tip_1, '2016075', 'Historia del diseño gráfico: De la imagen a la palabra', 3, 1),
    (v_prog_id, v_tip_1, '2016099', 'Taller forma y estructura', 5, 1),
    (v_prog_id, v_tip_1, '2016065', 'Expresión visual', 2, 1),
    (v_prog_id, v_tip_1, '2016070', 'Fundamentos tecnológicos: Formatos y medidas', 2, 1),
    (v_prog_id, v_tip_0, '2016081', 'Palabra e imagen', 3, 2),
    (v_prog_id, v_tip_1, '2016076', 'Historia del diseño gráfico: De las artes al diseño', 3, 2),
    (v_prog_id, v_tip_1, '2016102', 'Taller signo y letra', 5, 2),
    (v_prog_id, v_tip_1, '2016066', 'Figura humana y representación', 3, 2),
    (v_prog_id, v_tip_1, '2016071', 'Fundamentos tecnológicos: Tipometría', 3, 2),
    (v_prog_id, v_tip_0, '2016064', 'Estética y teoría de la imagen', 3, 3),
    (v_prog_id, v_tip_1, '2016077', 'Historia del diseño gráfico: De los ismos a los medios', 3, 3),
    (v_prog_id, v_tip_1, '2016103', 'Taller tipografía, composición y diagramación', 5, 3),
    (v_prog_id, v_tip_1, '2016061', 'Bocetación e ilustración', 3, 3),
    (v_prog_id, v_tip_1, '2016063', 'Esquemática básica', 2, 3),
    (v_prog_id, v_tip_1, '2016068', 'Fotografía I', 3, 3),
    (v_prog_id, v_tip_1, '2016069', 'Fundamentos tecnológicos: Color y producción', 3, 3),
    (v_prog_id, v_tip_1, '2016105', 'Teoría de la comunicación visual I', 3, 4),
    (v_prog_id, v_tip_1, '2016918', 'Fotografía II', 3, 4),
    (v_prog_id, v_tip_1, '2016084', 'Fundamentos tecnológicos: Producción en medios impresos', 3, 4),
    (v_prog_id, v_tip_1, '2016083', 'Fundamentos tecnológicos: Producción en medios digitales', 3, 4),
    (v_prog_id, v_tip_1, '2016106', 'Teoría de la comunicación visual II', 3, 5),
    (v_prog_id, v_tip_1, '2016074', 'Historia del diseño gráfico: Contextos del diseño en Colombia', 3, 5),
    (v_prog_id, v_tip_1, '2016101', 'Taller orientación y diseño de información', 5, 5),
    (v_prog_id, v_tip_1, '2016100', 'Taller identidad e imagen coordinada', 5, 5),
    (v_prog_id, v_tip_1, '2016060', 'Aplicaciones gráficas tridimensionales', 3, 5),
    (v_prog_id, v_tip_1, '2016079', 'Imagen dinámica', 3, 5),
    (v_prog_id, v_tip_1, '2016062', 'Fotografía III', 3, 5),
    (v_prog_id, v_tip_0, '2016086', 'Seminario de investigación y proyecto de diseño', 3, 6),
    (v_prog_id, v_tip_1, '2016095', 'Taller de énfasis teoría, historia y estética I', 3, 6),
    (v_prog_id, v_tip_1, '2016087', 'Taller de énfasis ilustración I', 3, 6),
    (v_prog_id, v_tip_1, '2016093', 'Taller de énfasis animación y narrativas audiovisuales I', 3, 6),
    (v_prog_id, v_tip_1, '2016089', 'Taller de énfasis imagen fotográfica I', 3, 6),
    (v_prog_id, v_tip_1, '2016097', 'Taller de énfasis tipografía y diagramación I', 3, 6),
    (v_prog_id, v_tip_1, '2016091', 'Taller de énfasis multimedia e imagen digital I', 3, 6),
    (v_prog_id, v_tip_1, '2016096', 'Taller de énfasis teoría, historia y estética II', 3, 7),
    (v_prog_id, v_tip_1, '2016088', 'Taller de énfasis ilustración II', 3, 7),
    (v_prog_id, v_tip_1, '2016094', 'Taller de énfasis animación y narrativas audiovisuales II', 3, 7),
    (v_prog_id, v_tip_1, '2016090', 'Taller de énfasis imagen fotográfica II', 3, 7),
    (v_prog_id, v_tip_1, '2016098', 'Taller de énfasis tipografía y diagramación II', 3, 7),
    (v_prog_id, v_tip_1, '2016092', 'Taller de énfasis multimedia e imagen digital II', 3, 7),
    (v_prog_id, v_tip_1, '2015304', 'Trabajo de grado proyecto de diseño', 6, 8),
    (v_prog_id, v_tip_1, '2015304', 'Trabajo de grado práctica profesional', 6, 8),
    (v_prog_id, v_tip_1, '2015305', 'Trabajo de grado asignaturas de posgrado', 6, 8),
    (v_prog_id, v_tip_0, '2016072', 'Gestión cultural y empresarial en las artes', 3, 0),
    (v_prog_id, v_tip_0, '2016073', 'Herencias: una mirada a la historia de las artes', 3, 0),
    (v_prog_id, v_tip_0, '2016082', 'Problemas contemporáneos de las artes', 3, 0),
    (v_prog_id, v_tip_0, '2016085', 'Responsabilidad socio-ambiental de las artes', 3, 0),
    (v_prog_id, v_tip_0, '2029618', 'El arte y la cultura en América Latina: historia y sentidos', 3, 0),
    (v_prog_id, v_tip_0, '2029054', 'Arte y paisaje', 3, 0),
    (v_prog_id, v_tip_0, '2016139', 'Música y sociedad en Colombia', 3, 0),
    (v_prog_id, v_tip_0, '2016131', 'Apreciación musical', 3, 0),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Diseño Gráfico (57 materias)';
end $$;

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Ingeniería Industrial' and es_publico = true) then
    raise notice 'Ya existe: Ingeniería Industrial'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Ingeniería Industrial', 150, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '1000004', 'Cálculo diferencial', 4, 1),
    (v_prog_id, v_tip_0, '2015811', 'Sociología especial: industrial y del trabajo', 3, 1),
    (v_prog_id, v_tip_0, '2026805', 'Introducción a la ingeniería industrial', 3, 1),
    (v_prog_id, v_tip_0, '2015734', 'Programación de computadores', 3, 1),
    (v_prog_id, v_tip_0, '1000005', 'Cálculo integral', 4, 2),
    (v_prog_id, v_tip_0, '1000003', 'Álgebra lineal', 4, 2),
    (v_prog_id, v_tip_0, '2016615', 'Taller de invención y creatividad', 3, 2),
    (v_prog_id, v_tip_0, '2016375', 'Programación orientada a objetos', 3, 2),
    (v_prog_id, v_tip_0, '1000006', 'Cálculo en varias variables', 4, 3),
    (v_prog_id, v_tip_0, '1000019', 'Fundamentos de mecánica', 4, 3),
    (v_prog_id, v_tip_0, '-', 'Optativa - Economía general', 3, 3),
    (v_prog_id, v_tip_0, '2026488', 'Taller de herramientas y problemas en ingeniería industrial', 3, 3),
    (v_prog_id, v_tip_0, '2027877', 'Probabilidad fundamental', 4, 3),
    (v_prog_id, v_tip_0, '1000007', 'Ecuaciones diferenciales', 4, 4),
    (v_prog_id, v_tip_0, '1000017', 'Fundamentos de electricidad y magnetismo', 4, 4),
    (v_prog_id, v_tip_0, '-', 'Optativa - Sistema de costos', 4, 4),
    (v_prog_id, v_tip_0, '-', 'Optativa - Gestión empresarial', 3, 4),
    (v_prog_id, v_tip_1, '2025993', 'Taller de ciencia y tecnología de materiales', 4, 4),
    (v_prog_id, v_tip_1, '-', 'Optativa - Modelos y simulación', 3, 5),
    (v_prog_id, v_tip_1, '-', 'Optativa - Optimización', 3, 5),
    (v_prog_id, v_tip_1, '2025986', 'Ingeniería económica y análisis de riesgo', 3, 5),
    (v_prog_id, v_tip_1, '2016619', 'Taller de procesos químicos y biotecnológicos', 3, 5),
    (v_prog_id, v_tip_1, '2016618', 'Taller de procesos metalmecánicos', 3, 5),
    (v_prog_id, v_tip_0, '2027878', 'Inferencia estadística fundamental', 4, 5),
    (v_prog_id, v_tip_1, '2025987', 'Modelos estocásticos para procesos de manufactura y sistemas de servicio', 3, 6),
    (v_prog_id, v_tip_1, '-', 'Optativa - Gerencia y gestión de proyectos', 3, 6),
    (v_prog_id, v_tip_1, '-', 'Optativa - Finanzas', 3, 6),
    (v_prog_id, v_tip_1, '2016613', 'Taller de ergonomía e ingeniería de métodos', 4, 6),
    (v_prog_id, v_tip_1, '-', 'Optativa - Control y gestión de calidad', 3, 6),
    (v_prog_id, v_tip_1, '2025988', 'Taller de simulación de procesos de manufactura y sistemas de servicios', 3, 7),
    (v_prog_id, v_tip_1, '-', 'Optativa - Sistemas de información', 3, 7),
    (v_prog_id, v_tip_1, '2016609', 'Seguridad industrial', 3, 7),
    (v_prog_id, v_tip_1, '2016614', 'Taller de ingeniería de la producción', 4, 7),
    (v_prog_id, v_tip_1, '2016616', 'Taller de metodología de la investigación', 3, 7),
    (v_prog_id, v_tip_1, '2016605', 'Logística', 3, 8),
    (v_prog_id, v_tip_1, '-', 'Optativa - Gestión tecnológica', 3, 8),
    (v_prog_id, v_tip_1, '-', 'Optativa - Gerencia de recursos humanos', 3, 8),
    (v_prog_id, v_tip_1, '2016612', 'Taller de diseño de plantas', 4, 8),
    (v_prog_id, v_tip_1, '2025990', 'Trabajo de grado', 6, 10),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Ingeniería Industrial (44 materias)';
end $$;

do $$
declare
  v_univ_id uuid;
  v_prog_id uuid;
  v_tip_0 uuid;
  v_tip_1 uuid;
  v_tip_2 uuid;
begin
  if exists (select 1 from public.programa where nombre = 'Ingeniería Mecatrónica' and es_publico = true) then
    raise notice 'Ya existe: Ingeniería Mecatrónica'; return;
  end if;

  select id into v_univ_id from public.institucion where nombre = 'Universidad Nacional de Colombia' and es_publico = true limit 1;
  if v_univ_id is null then
    insert into public.institucion (nombre, pais, es_publico) values ('Universidad Nacional de Colombia', 'Colombia', true) returning id into v_univ_id;
  end if;

  insert into public.programa (institucion_id, nombre, total_creditos, es_publico)
  values (v_univ_id, 'Ingeniería Mecatrónica', 168, true) returning id into v_prog_id;

  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Fundamentación', 0, true) returning id into v_tip_0;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Disciplinar', 0, true) returning id into v_tip_1;
  insert into public.tipologia (programa_id, nombre, creditos_requeridos, cuenta_promedio)
  values (v_prog_id, 'Nivelación', 0, false) returning id into v_tip_2;

  insert into public.materia (programa_id, tipologia_id, codigo, nombre, creditos, semestre_sugerido) values
    (v_prog_id, v_tip_0, '1000004', 'Cálculo diferencial', 4, 1),
    (v_prog_id, v_tip_0, '2015734', 'Programación de computadores', 3, 1),
    (v_prog_id, v_tip_0, '1000019', 'Fundamentos de mecánica', 4, 1),
    (v_prog_id, v_tip_1, '2016488', 'Taller de ingeniería electrónica', 2, 1),
    (v_prog_id, v_tip_1, '2018408', 'Investigación y desarrollo sostenible', 3, 1),
    (v_prog_id, v_tip_0, '2015711', 'Dibujo básico', 3, 1),
    (v_prog_id, v_tip_0, '1000005', 'Cálculo integral', 4, 2),
    (v_prog_id, v_tip_0, '1000003', 'Álgebra lineal', 4, 2),
    (v_prog_id, v_tip_0, '1000017', 'Fundamentos de electricidad y magnetismo', 4, 2),
    (v_prog_id, v_tip_1, '2016469', 'Circuitos eléctricos I', 3, 2),
    (v_prog_id, v_tip_1, '2017278', 'Tecnología mecánica básica', 3, 2),
    (v_prog_id, v_tip_0, '1000006', 'Cálculo varias variables', 4, 3),
    (v_prog_id, v_tip_0, '1000013', 'Probabilidad y estadística fundamental', 3, 3),
    (v_prog_id, v_tip_1, '2018376', 'Programación orientada a objetos', 3, 3),
    (v_prog_id, v_tip_1, '2016468', 'Electrónica análoga I', 3, 3),
    (v_prog_id, v_tip_1, '2017270', 'Principios de estática', 3, 3),
    (v_prog_id, v_tip_0, '1000024', 'Principios de química', 3, 3),
    (v_prog_id, v_tip_0, '1000007', 'Ecuaciones diferenciales', 4, 4),
    (v_prog_id, v_tip_1, '2016498', 'Señales y sistemas I', 3, 4),
    (v_prog_id, v_tip_1, '2016698', 'Estructura de datos', 3, 4),
    (v_prog_id, v_tip_1, '2017271', 'Principios de dinámica', 3, 4),
    (v_prog_id, v_tip_0, '2010188', 'Variable compleja', 4, 5),
    (v_prog_id, v_tip_0, '-', 'Optativa física', 3, 5),
    (v_prog_id, v_tip_1, '2016480', 'Electrónica digital I', 4, 5),
    (v_prog_id, v_tip_1, '2024045', 'Taller de proyectos interdisciplinarios', 3, 5),
    (v_prog_id, v_tip_1, '2017272', 'Resistencia de materiales', 3, 5),
    (v_prog_id, v_tip_1, '2017275', 'Ciencia e ingeniería de materiales', 3, 5),
    (v_prog_id, v_tip_0, '2015703', 'Ingeniería económica', 3, 6),
    (v_prog_id, v_tip_1, '-', 'Optativa - Automatización, control y robótica', 3, 6),
    (v_prog_id, v_tip_1, '2017287', 'Sensores y actuadores', 3, 6),
    (v_prog_id, v_tip_1, '2025967', 'Redes de computadores', 3, 6),
    (v_prog_id, v_tip_1, '2017282', 'Diseño mecatrónico', 3, 6),
    (v_prog_id, v_tip_1, '2017273', 'Optativa - Ingeniería de materiales y procesos de manufactura', 3, 6),
    (v_prog_id, v_tip_0, '-', 'Optativa - Informática y herramientas de ingeniería', 3, 6),
    (v_prog_id, v_tip_0, '-', 'Optativa - Ciencias económicas y administrativas', 3, 7),
    (v_prog_id, v_tip_1, '2025951', 'Control', 4, 7),
    (v_prog_id, v_tip_1, '-', 'Optativa - Automatización, control y robótica', 3, 7),
    (v_prog_id, v_tip_1, '2016486', 'Microcontroladores I', 3, 7),
    (v_prog_id, v_tip_1, '2017270', 'Robótica', 4, 8),
    (v_prog_id, v_tip_1, '-', 'Optativa - Automatización, control y robótica', 3, 8),
    (v_prog_id, v_tip_1, '2017288', 'Servomecanismos', 3, 8),
    (v_prog_id, v_tip_1, '2017286', 'Proyecto aplicado de investigación, innovación y desarrollo tecnológico', 4, 9),
    (v_prog_id, v_tip_1, '2017281', 'Automatización de procesos de manufactura', 3, 9),
    (v_prog_id, v_tip_1, '-', 'Trabajo de grado', 12, 10),
    (v_prog_id, v_tip_2, '1000002-N', 'Lecto-escritura', 4, 0),
    (v_prog_id, v_tip_2, '1000045', 'Inglés I', 3, 0),
    (v_prog_id, v_tip_2, '1000046', 'Inglés II', 3, 0),
    (v_prog_id, v_tip_2, '1000047', 'Inglés III', 3, 0),
    (v_prog_id, v_tip_2, '1000048', 'Inglés IV', 3, 0);
  raise notice 'Programa agregado: Ingeniería Mecatrónica (49 materias)';
end $$;

