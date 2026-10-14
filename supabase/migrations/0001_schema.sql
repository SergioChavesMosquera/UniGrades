-- =============================================================================
-- UniGrades — Migración 0001: Esquema base
-- =============================================================================
-- Crea las 9 entidades del modelo relacional con sus claves, FKs y constraints
-- que SÍ se pueden expresar de forma declarativa:
--   RN-1 (programa obligatorio por usuario), RN-3 (no duplicar materia/semestre),
--   RN-4 (dominio de estados vía CHECK), RN-5 (nota 0.0–5.0 vía CHECK).
-- Los triggers (RN-2, RN-4 transiciones), vistas (RN-6, RN-7) y RLS van en 0002.
--
-- Convención de nombres: tablas y columnas en español (dominio del proyecto).
-- Catálogo institucional (institucion, programa, tipologia, materia) es compartido:
-- puede venir precargado (es_publico = true) o creado por un usuario.
-- =============================================================================

-- Para generación de UUIDs (gen_random_uuid viene con pgcrypto en Postgres de Supabase).
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- INSTITUCION — maestra: universidades soportadas
-- -----------------------------------------------------------------------------
create table if not exists public.institucion (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  sigla       text,
  pais        text,
  ciudad      text,
  es_publico  boolean not null default true,  -- true: catálogo; false: creada por usuario
  creado_por  uuid references auth.users (id) on delete set null,
  creado_en   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- PROGRAMA — maestra: carrera dentro de una universidad
-- -----------------------------------------------------------------------------
create table if not exists public.programa (
  id              uuid primary key default gen_random_uuid(),
  institucion_id  uuid not null references public.institucion (id) on delete cascade,
  nombre          text not null,
  facultad        text,
  total_creditos  smallint not null default 0 check (total_creditos >= 0),
  es_publico      boolean not null default true,
  creado_por      uuid references auth.users (id) on delete set null,
  creado_en       timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- TIPOLOGIA — maestra: categoría de materia dentro de un programa.
-- cuenta_promedio = false excluye del promedio (RN-6, p. ej. nivelación/Inglés).
-- -----------------------------------------------------------------------------
create table if not exists public.tipologia (
  id                  uuid primary key default gen_random_uuid(),
  programa_id         uuid not null references public.programa (id) on delete cascade,
  nombre              text not null,
  creditos_requeridos smallint not null default 0 check (creditos_requeridos >= 0),
  cuenta_promedio     boolean not null default true,  -- RN-6
  creado_en           timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- MATERIA — maestra: asignatura del programa con semestre sugerido (roadmap)
-- -----------------------------------------------------------------------------
create table if not exists public.materia (
  id                     uuid primary key default gen_random_uuid(),
  programa_id            uuid not null references public.programa (id) on delete cascade,
  tipologia_id           uuid not null references public.tipologia (id) on delete restrict,
  codigo                 text,
  nombre                 text not null,
  creditos               smallint not null default 3 check (creditos >= 0),
  nota_minima_aprobacion numeric(3,1) not null default 3.0
                           check (nota_minima_aprobacion >= 0.0 and nota_minima_aprobacion <= 5.0),
  semestre_sugerido      smallint,
  creado_en              timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- USUARIO — perfil del estudiante. PK = id de auth.users (Supabase Auth).
-- RN-1: programa_id NOT NULL (se asigna al completar el onboarding).
-- -----------------------------------------------------------------------------
create table if not exists public.usuario (
  id                   uuid primary key references auth.users (id) on delete cascade,
  programa_id          uuid references public.programa (id) on delete restrict, -- RN-1 (se refuerza al cerrar onboarding)
  nombre               text,
  apellido             text,
  email                text,
  codigo_estudiantil   text,
  avatar_url           text,
  idioma               text not null default 'es' check (idioma in ('es', 'en')),
  onboarding_completo  boolean not null default false,
  creado_en            timestamptz not null default now()
);

comment on column public.usuario.programa_id is
  'RN-1: debe quedar NOT NULL al completar onboarding. Permitido NULL solo durante el registro inicial.';

-- -----------------------------------------------------------------------------
-- SEMESTRE — transaccional: período académico real cursado por el estudiante
-- -----------------------------------------------------------------------------
create table if not exists public.semestre (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references public.usuario (id) on delete cascade,
  etiqueta    text not null,              -- p. ej. "2024-2"
  anio        smallint,
  periodo     smallint check (periodo in (1, 2)),
  orden       smallint not null default 1,
  creado_en   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- MATERIA_USUARIO — asociativa: inscripción de una materia en un semestre.
-- RN-3: UNIQUE(materia_id, semestre_id). RN-4: CHECK de estado.
-- -----------------------------------------------------------------------------
create table if not exists public.materia_usuario (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references public.usuario (id) on delete cascade,
  materia_id  uuid not null references public.materia (id) on delete restrict,
  semestre_id uuid not null references public.semestre (id) on delete cascade,
  estado      text not null default 'en_curso'
                check (estado in ('en_curso', 'aprobada', 'reprobada', 'retirada')), -- RN-4
  creado_en   timestamptz not null default now(),
  constraint uq_materia_semestre unique (materia_id, semestre_id)                     -- RN-3
);

-- -----------------------------------------------------------------------------
-- COMPONENTE — evaluación configurada por el estudiante para una inscripción.
-- RN-2 (suma de porcentajes = 100) se valida con trigger en 0002.
-- -----------------------------------------------------------------------------
create table if not exists public.componente (
  id                 uuid primary key default gen_random_uuid(),
  materia_usuario_id uuid not null references public.materia_usuario (id) on delete cascade,
  nombre             text not null,
  porcentaje         numeric(5,2) not null check (porcentaje > 0 and porcentaje <= 100),
  nota_minima        numeric(3,1) check (nota_minima >= 0.0 and nota_minima <= 5.0),
  orden              smallint not null default 1,
  creado_en          timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- NOTA — calificación individual dentro de un componente.
-- RN-5: valor entre 0.0 y 5.0. RN-7: la calificación del componente es su promedio.
-- -----------------------------------------------------------------------------
create table if not exists public.nota (
  id             uuid primary key default gen_random_uuid(),
  componente_id  uuid not null references public.componente (id) on delete cascade,
  nombre         text not null,
  valor          numeric(3,1) not null check (valor >= 0.0 and valor <= 5.0),  -- RN-5
  fecha_registro date,
  observacion    text,
  creado_en      timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Índices de apoyo para los JOINs y filtros frecuentes.
-- -----------------------------------------------------------------------------
create index if not exists idx_programa_institucion on public.programa (institucion_id);
create index if not exists idx_tipologia_programa   on public.tipologia (programa_id);
create index if not exists idx_materia_programa     on public.materia (programa_id);
create index if not exists idx_materia_tipologia    on public.materia (tipologia_id);
create index if not exists idx_usuario_programa     on public.usuario (programa_id);
create index if not exists idx_semestre_usuario     on public.semestre (usuario_id);
create index if not exists idx_mu_usuario           on public.materia_usuario (usuario_id);
create index if not exists idx_mu_semestre          on public.materia_usuario (semestre_id);
create index if not exists idx_mu_materia           on public.materia_usuario (materia_id);
create index if not exists idx_componente_mu        on public.componente (materia_usuario_id);
create index if not exists idx_nota_componente      on public.nota (componente_id);
