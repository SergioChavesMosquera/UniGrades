import { createClient } from "@/lib/supabase/client";
import type { Nota } from "@/types/domain";

/**
 * Servicios de notas y lectura de las vistas de promedio.
 * RN-5 (valor 0.0–5.0) la impone un CHECK en la base de datos.
 * RN-7 (calificación del componente = promedio de sus notas) la calcula la vista
 * v_componente_calificacion. Las vistas de promedio excluyen nivelación (RN-6).
 */

// ---- Notas ----

export async function listGrades(componenteId: string): Promise<Nota[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("nota")
    .select("*")
    .eq("componente_id", componenteId)
    .order("creado_en", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Nota[];
}

export async function addGrade(input: {
  componenteId: string;
  nombre: string;
  valor: number;
}): Promise<Nota> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("nota")
    .insert({
      componente_id: input.componenteId,
      nombre: input.nombre,
      valor: input.valor,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Nota;
}

export async function deleteGrade(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("nota").delete().eq("id", id);
  if (error) throw error;
}

// ---- Lecturas de vistas (calificaciones calculadas) ----

export type ComponenteCalificacion = {
  componente_id: string;
  materia_usuario_id: string;
  porcentaje: number;
  calificacion: number | null;
  num_notas: number;
};

/** Calificación (promedio de notas) de cada componente de una inscripción. */
export async function getComponentGrades(
  materiaUsuarioId: string
): Promise<ComponenteCalificacion[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_componente_calificacion")
    .select("*")
    .eq("materia_usuario_id", materiaUsuarioId);
  if (error) throw error;
  return (data ?? []) as ComponenteCalificacion[];
}

/** Nota ponderada de una materia (inscripción). */
export async function getSubjectGrade(
  materiaUsuarioId: string
): Promise<number | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_materia_promedio")
    .select("nota_materia")
    .eq("materia_usuario_id", materiaUsuarioId)
    .maybeSingle();
  if (error) throw error;
  return (data?.nota_materia as number | null) ?? null;
}

/** Promedio ponderado de un semestre (excluye nivelación). */
export async function getSemesterAverage(
  semestreId: string
): Promise<number | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_semestre_promedio")
    .select("promedio_semestre")
    .eq("semestre_id", semestreId)
    .maybeSingle();
  if (error) throw error;
  return (data?.promedio_semestre as number | null) ?? null;
}

/** Promedio global acumulado del usuario (excluye nivelación). */
export async function getGlobalAverage(userId: string): Promise<{
  promedio_global: number | null;
  creditos_aprobados: number | null;
} | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_promedio_global")
    .select("promedio_global, creditos_aprobados")
    .eq("usuario_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as {
    promedio_global: number | null;
    creditos_aprobados: number | null;
  } | null;
}
