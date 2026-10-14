import { createClient } from "@/lib/supabase/client";
import type { Usuario } from "@/types/domain";

/**
 * Servicios de perfil del usuario.
 */

export async function getProfile(userId: string): Promise<Usuario | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("usuario")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Usuario | null;
}

/**
 * Cierra el onboarding: asocia el programa al usuario (RN-1) y marca
 * onboarding_completo = true. A partir de aquí el usuario entra al dashboard.
 */
export async function completeOnboarding(input: {
  userId: string;
  programaId: string;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("usuario")
    .update({
      programa_id: input.programaId,
      onboarding_completo: true,
    })
    .eq("id", input.userId);
  if (error) throw error;
}
