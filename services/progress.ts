import { createClient } from "@/lib/supabase/client";

/**
 * Servicios de progreso para el dashboard: avance por tipología de créditos y
 * lista de materias en curso. El promedio global y créditos aprobados se leen con
 * getGlobalAverage() (services/grades.ts).
 */

export type AvanceTipologia = {
  tipologia: string;
  creditos_requeridos: number;
  creditos_aprobados: number;
};

/**
 * Avance por tipología: créditos requeridos (del programa) vs créditos aprobados
 * por el usuario. Se calcula en el cliente a partir de tipologías + inscripciones
 * aprobadas con su materia.
 */
export async function getProgressByTypology(
  userId: string,
  programaId: string
): Promise<AvanceTipologia[]> {
  const supabase = createClient();

  // Tipologías del programa (requeridos).
  const { data: tipologias, error: eTip } = await supabase
    .from("tipologia")
    .select("id, nombre, creditos_requeridos")
    .eq("programa_id", programaId)
    .order("nombre");
  if (eTip) throw eTip;

  // Materias aprobadas del usuario, con créditos y tipología de la materia.
  const { data: aprobadas, error: eApr } = await supabase
    .from("materia_usuario")
    .select("materia(creditos, tipologia_id)")
    .eq("usuario_id", userId)
    .eq("estado", "aprobada");
  if (eApr) throw eApr;

  // Suma de créditos aprobados por tipología.
  const aprobadosPorTip = new Map<string, number>();
  for (const row of aprobadas ?? []) {
    const m = row.materia as unknown as {
      creditos: number;
      tipologia_id: string;
    } | null;
    if (!m) continue;
    aprobadosPorTip.set(
      m.tipologia_id,
      (aprobadosPorTip.get(m.tipologia_id) ?? 0) + m.creditos
    );
  }

  return (tipologias ?? []).map((t) => ({
    tipologia: t.nombre,
    creditos_requeridos: t.creditos_requeridos,
    creditos_aprobados: aprobadosPorTip.get(t.id) ?? 0,
  }));
}

export type MateriaEnCurso = {
  id: string;
  nombre: string;
  creditos: number;
  semestre: string;
};

/** Materias que el usuario tiene actualmente en curso. */
export async function getCurrentSubjects(
  userId: string
): Promise<MateriaEnCurso[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materia_usuario")
    .select("id, materia(nombre, creditos), semestre(etiqueta)")
    .eq("usuario_id", userId)
    .eq("estado", "en_curso");
  if (error) throw error;

  return (data ?? []).map((row) => {
    const m = row.materia as unknown as { nombre: string; creditos: number } | null;
    const s = row.semestre as unknown as { etiqueta: string } | null;
    return {
      id: row.id as string,
      nombre: m?.nombre ?? "—",
      creditos: m?.creditos ?? 0,
      semestre: s?.etiqueta ?? "—",
    };
  });
}
