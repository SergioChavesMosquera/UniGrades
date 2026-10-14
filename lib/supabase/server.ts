import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para contexto server (RSC, route handlers, server actions).
 * Lee/escribe la sesión en cookies. En Server Components el set de cookies puede
 * fallar silenciosamente; el middleware se encarga de refrescar la sesión.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Invocado desde un Server Component sin acceso de escritura a cookies.
            // El middleware refresca la sesión, así que es seguro ignorar aquí.
          }
        },
      },
    }
  );
}
