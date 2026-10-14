import { createClient } from "@/lib/supabase/client";
import type { EstadoMateria, Materia, MateriaUsuario, Semestre } from "@/types/domain";

/**
 * Servicios de semestres e inscripciones (materia_usuario).
 * La UI consume estas funciones vía hooks de React Query.
 */

// ---- Semestres ----

export async function listSemesters(userId: string): Promise<Semestre[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("semestre")
    .select("*")
    .eq("usuario_id", userId)
    .order("orden", { ascending: true })
    .order("creado_en", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Semestre[];
}

export async function getSemester(id: string): Promise<Semestre | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("semestre")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Semestre | null;
}

export async function createSemester(input: {
  userId: string;
  etiqueta: string;
  anio?: number | null;
  periodo?: number | null;
  orden: number;
}): Promise<Semestre> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("semestre")
    .insert({
      usuario_id: input.userId,
      etiqueta: input.etiqueta,
      anio: input.anio ?? null,
      periodo: input.periodo ?? null,
      orden: input.orden,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Semestre;
}

// ---- Inscripciones (materia_usuario) ----

/** Inscripción con los datos de la materia asociada (para mostrar nombre/créditos). */
export type Inscripcion = MateriaUsuario & {
  materia: Pick<Materia, "id" | "nombre" | "creditos" | "codigo"> | null;
};

export async function listEnrollments(semestreId: string): Promise<Inscripcion[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materia_usuario")
    .select("*, materia(id, nombre, creditos, codigo)")
    .eq("semestre_id", semestreId)
    .order("creado_en", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Inscripcion[];
}

/**
 * Inscribe una materia en un semestre con un estado inicial.
 * RN-3 (no duplicar materia/semestre) la impone la base de datos (UNIQUE);
 * si se viola, Supabase devuelve error de duplicado (code 23505).
 */
export async function enrollSubject(input: {
  userId: string;
  materiaId: string;
  semestreId: string;
  estado: EstadoMateria;
}): Promise<MateriaUsuario> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materia_usuario")
    .insert({
      usuario_id: input.userId,
      materia_id: input.materiaId,
      semestre_id: input.semestreId,
      estado: input.estado,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as MateriaUsuario;
}

/**
 * Cambia el estado de una inscripción.
 * RN-4 (no volver a en_curso desde aprobada/reprobada) la impone un trigger;
 * si se viola, la base de datos rechaza con error.
 */
export async function updateEnrollmentState(
  id: string,
  estado: EstadoMateria
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("materia_usuario")
    .update({ estado })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteEnrollment(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("materia_usuario").delete().eq("id", id);
  if (error) throw error;
}
