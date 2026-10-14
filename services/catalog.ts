import { createClient } from "@/lib/supabase/client";
import type { Materia, Programa, Tipologia } from "@/types/domain";

/**
 * Servicios de catálogo: lectura de programas y materias (camino A) y creación
 * de un programa propio con materias (camino B). La UI consume estas funciones;
 * nunca habla con Supabase directamente.
 */

export type ProgramaConUniversidad = Programa & {
  institucion: { nombre: string } | null;
};

/** Programas visibles para el usuario (públicos del catálogo + los suyos propios). */
export async function listPrograms(): Promise<ProgramaConUniversidad[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programa")
    .select("*, institucion(nombre)")
    .order("nombre");
  if (error) throw error;
  return (data ?? []) as ProgramaConUniversidad[];
}

/** Materias de un programa, ordenadas por semestre sugerido. */
export async function listSubjectsByProgram(programaId: string): Promise<Materia[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materia")
    .select("*")
    .eq("programa_id", programaId)
    .order("semestre_sugerido", { ascending: true, nullsFirst: false })
    .order("nombre");
  if (error) throw error;
  return (data ?? []) as Materia[];
}

export async function listTypologiesByProgram(
  programaId: string
): Promise<Tipologia[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipologia")
    .select("*")
    .eq("programa_id", programaId)
    .order("nombre");
  if (error) throw error;
  return (data ?? []) as Tipologia[];
}

/**
 * Camino B: crea un programa propio (privado) con una universidad y una tipología
 * genérica por defecto. Devuelve el id del programa creado.
 * Las materias se agregan después con addSubject().
 */
export async function createOwnProgram(input: {
  universidadNombre: string;
  programaNombre: string;
  userId: string;
}): Promise<{ programaId: string; tipologiaId: string }> {
  const supabase = createClient();

  // Universidad propia (privada).
  const { data: inst, error: eInst } = await supabase
    .from("institucion")
    .insert({
      nombre: input.universidadNombre,
      es_publico: false,
      creado_por: input.userId,
    })
    .select("id")
    .single();
  if (eInst) throw eInst;

  // Programa propio (privado).
  const { data: prog, error: eProg } = await supabase
    .from("programa")
    .insert({
      institucion_id: inst.id,
      nombre: input.programaNombre,
      es_publico: false,
      creado_por: input.userId,
    })
    .select("id")
    .single();
  if (eProg) throw eProg;

  // Tipología genérica inicial (el usuario puede crear más después).
  const { data: tip, error: eTip } = await supabase
    .from("tipologia")
    .insert({
      programa_id: prog.id,
      nombre: "General",
      creditos_requeridos: 0,
      cuenta_promedio: true,
    })
    .select("id")
    .single();
  if (eTip) throw eTip;

  return { programaId: prog.id, tipologiaId: tip.id };
}

/** Camino B: agrega una materia a un programa propio. */
export async function addSubject(input: {
  programaId: string;
  tipologiaId: string;
  nombre: string;
  creditos: number;
  semestreSugerido?: number | null;
}): Promise<Materia> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materia")
    .insert({
      programa_id: input.programaId,
      tipologia_id: input.tipologiaId,
      nombre: input.nombre,
      creditos: input.creditos,
      semestre_sugerido: input.semestreSugerido ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Materia;
}
