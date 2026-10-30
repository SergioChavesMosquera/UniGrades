import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container, NavButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";

/**
 * Dashboard de progreso (Task 11). Muestra promedio global, créditos aprobados,
 * avance por tipología y materias en curso. Si falta onboarding, redirige.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard");

  // FEAT-003a: única revalidación de sesión server dentro de /app (además del
  // proxy). getUser() revalida el token contra Supabase; el user.id se necesita
  // para consultar el perfil, así que esta llamada no es redundante. El gate de
  // /app ya lo cubre proxy.ts, por eso app/app/layout.tsx ya no repite getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("usuario")
    .select("onboarding_completo, programa_id, email")
    .eq("id", user!.id)
    .maybeSingle();

  if (perfil && !perfil.onboarding_completo) {
    redirect("/app/onboarding");
  }

  return (
    <Container>
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>
        {t("sessionAs", { email: perfil?.email ?? user?.email ?? "" })}
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/app/semesters">
          <NavButton variant="primary">{t("goSemesters")}</NavButton>
        </Link>
      </div>

      {perfil?.programa_id ? (
        <DashboardClient userId={user!.id} programaId={perfil.programa_id} />
      ) : null}
    </Container>
  );
}
