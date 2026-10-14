import { createClient } from "@/lib/supabase/client";
import type { Componente } from "@/types/domain";

/**
 * Servicios de componentes de evaluación de una inscripción (materia_usuario).
 * RN-2 (suma de porcentajes <= 100, y = 100 al cerrar) la impone la base de datos:
 * el trigger trg_porcentaje_max_100 rechaza pasar de 100.
 */

export async function listComponents(
  materiaUsuarioId: string
): Promise<Componente[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("componente")
    .select("*")
    .eq("materia_usuario_id", materiaUsuarioId)
    .order("orden", { ascending: true })
    .order("creado_en", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Componente[];
}

export async function addComponent(input: {
  materiaUsuarioId: string;
  nombre: string;
  porcentaje: number;
  orden: number;
}): Promise<Componente> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("componente")
    .insert({
      materia_usuario_id: input.materiaUsuarioId,
      nombre: input.nombre,
      porcentaje: input.porcentaje,
      orden: input.orden,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Componente;
}

export async function deleteComponent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("componente").delete().eq("id", id);
  if (error) throw error;
}
