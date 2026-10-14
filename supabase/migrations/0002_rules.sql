-- =============================================================================
-- UniGrades — Migración 0002: Reglas de negocio (triggers, vistas, RLS)
-- =============================================================================
-- Implementa lo que no se puede expresar de forma declarativa:
--   RN-2 (porcentajes), RN-4 (transiciones de estado),
--   RN-6/RN-7 (vistas de promedios), y Row Level Security.
--
-- Nota RN-2 (modo flexible elegido): se permite que la suma de porcentajes de los
-- componentes de una materia_usuario sea PARCIAL (<100) mientras el estudiante los
-- configura, pero NUNCA puede SUPERAR 100. La exigencia de "exactamente 100" se
-- hace al cerrar (registrar notas / evaluar) mediante la función
-- fn_porcentajes_completos(), que la capa de aplicación invoca cuando corresponde.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- RN-2: la suma de porcentajes de una materia_usuario no puede superar 100.
-- Trigger BEFORE INSERT/UPDATE sobre componente.
-- -----------------------------------------------------------------------------
create or replace function public.trg_porcentaje_max_100()
returns trigger
language plpgsql
as $$
declare
  suma numeric(6,2);
begin
  select coalesce(sum(c.porcentaje), 0)
    into suma
    from public.componente c
   where c.materia_usuario_id = new.materia_usuario_id
     and c.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

  if (suma + new.porcentaje) > 100.0 then
    raise exception
      'RN-2: la suma de porcentajes (% + % = %) supera 100 para la materia_usuario %',
      suma, new.porcentaje, (suma + new.porcentaje), new.materia_usuario_id
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_componente_porcentaje_max on public.componente;
create trigger trg_componente_porcentaje_max
  before insert or update on public.componente
  for each row execute function public.trg_porcentaje_max_100();

-- Helper (RN-2 estricto "al cerrar"): devuelve true si los componentes suman 100.
-- La capa de aplicación la usa antes de permitir registrar notas / evaluar.
create or replace function public.fn_porcentajes_completos(p_materia_usuario_id uuid)
returns boolean
language sql
stable
as $$
  select coalesce(sum(c.porcentaje), 0) = 100.0
    from public.componente c
   where c.materia_usuario_id = p_materia_usuario_id;
$$;

-- -----------------------------------------------------------------------------
-- RN-4: una materia aprobada o reprobada no puede volver a en_curso.
-- Trigger BEFORE UPDATE sobre materia_usuario.
-- -----------------------------------------------------------------------------
create or replace function public.trg_estado_transicion()
returns trigger
language plpgsql
as $$
begin
  if old.estado in ('aprobada', 'reprobada')
     and new.estado = 'en_curso' then
    raise exception
      'RN-4: una materia % no puede volver a en_curso', old.estado
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_mu_estado_transicion on public.materia_usuario;
create trigger trg_mu_estado_transicion
  before update on public.materia_usuario
  for each row execute function public.trg_estado_transicion();

-- -----------------------------------------------------------------------------
-- Al crear un usuario en auth.users, crear su fila en public.usuario.
-- -----------------------------------------------------------------------------
create or replace function public.trg_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuario (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_auth_nuevo_usuario on auth.users;
create trigger trg_auth_nuevo_usuario
  after insert on auth.users
  for each row execute function public.trg_nuevo_usuario();

-- =============================================================================
-- VISTAS DE PROMEDIOS (RN-6, RN-7)
-- =============================================================================

-- RN-7: calificación de cada componente = promedio aritmético de sus notas.
create or replace view public.v_componente_calificacion as
select
  c.id                 as componente_id,
  c.materia_usuario_id as materia_usuario_id,
  c.porcentaje         as porcentaje,
  avg(n.valor)         as calificacion,   -- NULL si no tiene notas
  count(n.id)          as num_notas
from public.componente c
left join public.nota n on n.componente_id = c.id
group by c.id, c.materia_usuario_id, c.porcentaje;

-- Nota ponderada de cada materia_usuario = Σ(calificacion_componente × porcentaje/100).
-- Solo considera componentes que ya tienen al menos una nota.
create or replace view public.v_materia_promedio as
select
  mu.id          as materia_usuario_id,
  mu.usuario_id  as usuario_id,
  mu.semestre_id as semestre_id,
  mu.materia_id  as materia_id,
  mu.estado      as estado,
  m.creditos     as creditos,
  t.cuenta_promedio as cuenta_promedio,     -- RN-6
  round(
    sum(vcc.calificacion * vcc.porcentaje / 100.0)
      filter (where vcc.calificacion is not null)
  , 2) as nota_materia
from public.materia_usuario mu
join public.materia m   on m.id = mu.materia_id
join public.tipologia t on t.id = m.tipologia_id
left join public.v_componente_calificacion vcc
       on vcc.materia_usuario_id = mu.id
group by mu.id, mu.usuario_id, mu.semestre_id, mu.materia_id, mu.estado,
         m.creditos, t.cuenta_promedio;

-- Promedio por semestre: ponderado por créditos, excluyendo nivelación (RN-6).
create or replace view public.v_semestre_promedio as
select
  vmp.usuario_id,
  vmp.semestre_id,
  round(
    sum(vmp.nota_materia * vmp.creditos)
      filter (where vmp.cuenta_promedio and vmp.nota_materia is not null)
    / nullif(
        sum(vmp.creditos)
          filter (where vmp.cuenta_promedio and vmp.nota_materia is not null)
      , 0)
  , 2) as promedio_semestre,
  sum(vmp.creditos) filter (where vmp.estado = 'aprobada') as creditos_aprobados
from public.v_materia_promedio vmp
group by vmp.usuario_id, vmp.semestre_id;

-- Promedio global acumulado: ponderado por créditos, excluyendo nivelación (RN-6).
create or replace view public.v_promedio_global as
select
  vmp.usuario_id,
  round(
    sum(vmp.nota_materia * vmp.creditos)
      filter (where vmp.cuenta_promedio and vmp.nota_materia is not null)
    / nullif(
        sum(vmp.creditos)
          filter (where vmp.cuenta_promedio and vmp.nota_materia is not null)
      , 0)
  , 2) as promedio_global,
  sum(vmp.creditos) filter (where vmp.estado = 'aprobada') as creditos_aprobados
from public.v_materia_promedio vmp
group by vmp.usuario_id;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
-- Catálogo (institucion, programa, tipologia, materia): lectura para todos los
-- autenticados; escritura solo del dueño (creado_por) o filas propias.
-- Datos personales (usuario, semestre, materia_usuario, componente, nota): solo
-- el dueño (auth.uid()).
-- =============================================================================

alter table public.institucion     enable row level security;
alter table public.programa        enable row level security;
alter table public.tipologia       enable row level security;
alter table public.materia         enable row level security;
alter table public.usuario         enable row level security;
alter table public.semestre        enable row level security;
alter table public.materia_usuario enable row level security;
alter table public.componente      enable row level security;
alter table public.nota            enable row level security;

-- ---- Catálogo: lectura para autenticados ----
drop policy if exists sel_institucion on public.institucion;
create policy sel_institucion on public.institucion
  for select to authenticated using (true);

drop policy if exists ins_institucion on public.institucion;
create policy ins_institucion on public.institucion
  for insert to authenticated with check (creado_por = auth.uid());

drop policy if exists upd_institucion on public.institucion;
create policy upd_institucion on public.institucion
  for update to authenticated using (creado_por = auth.uid());

drop policy if exists del_institucion on public.institucion;
create policy del_institucion on public.institucion
  for delete to authenticated using (creado_por = auth.uid());

drop policy if exists sel_programa on public.programa;
create policy sel_programa on public.programa
  for select to authenticated using (true);

drop policy if exists ins_programa on public.programa;
create policy ins_programa on public.programa
  for insert to authenticated with check (creado_por = auth.uid());

drop policy if exists upd_programa on public.programa;
create policy upd_programa on public.programa
  for update to authenticated using (creado_por = auth.uid());

drop policy if exists del_programa on public.programa;
create policy del_programa on public.programa
  for delete to authenticated using (creado_por = auth.uid());

-- tipologia y materia: lectura para todos; escritura si el programa padre es propio.
drop policy if exists sel_tipologia on public.tipologia;
create policy sel_tipologia on public.tipologia
  for select to authenticated using (true);

drop policy if exists wr_tipologia on public.tipologia;
create policy wr_tipologia on public.tipologia
  for all to authenticated
  using (exists (select 1 from public.programa p
                 where p.id = tipologia.programa_id and p.creado_por = auth.uid()))
  with check (exists (select 1 from public.programa p
                 where p.id = tipologia.programa_id and p.creado_por = auth.uid()));

drop policy if exists sel_materia on public.materia;
create policy sel_materia on public.materia
  for select to authenticated using (true);

drop policy if exists wr_materia on public.materia;
create policy wr_materia on public.materia
  for all to authenticated
  using (exists (select 1 from public.programa p
                 where p.id = materia.programa_id and p.creado_por = auth.uid()))
  with check (exists (select 1 from public.programa p
                 where p.id = materia.programa_id and p.creado_por = auth.uid()));

-- ---- Datos personales: solo el dueño ----
drop policy if exists own_usuario on public.usuario;
create policy own_usuario on public.usuario
  for all to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists own_semestre on public.semestre;
create policy own_semestre on public.semestre
  for all to authenticated
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());

drop policy if exists own_materia_usuario on public.materia_usuario;
create policy own_materia_usuario on public.materia_usuario
  for all to authenticated
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());

-- componente: dueño vía materia_usuario.
drop policy if exists own_componente on public.componente;
create policy own_componente on public.componente
  for all to authenticated
  using (exists (select 1 from public.materia_usuario mu
                 where mu.id = componente.materia_usuario_id and mu.usuario_id = auth.uid()))
  with check (exists (select 1 from public.materia_usuario mu
                 where mu.id = componente.materia_usuario_id and mu.usuario_id = auth.uid()));

-- nota: dueño vía componente -> materia_usuario.
drop policy if exists own_nota on public.nota;
create policy own_nota on public.nota
  for all to authenticated
  using (exists (select 1
                 from public.componente c
                 join public.materia_usuario mu on mu.id = c.materia_usuario_id
                 where c.id = nota.componente_id and mu.usuario_id = auth.uid()))
  with check (exists (select 1
                 from public.componente c
                 join public.materia_usuario mu on mu.id = c.materia_usuario_id
                 where c.id = nota.componente_id and mu.usuario_id = auth.uid()));
