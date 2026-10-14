import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button, Container } from "@/components/ui";
import { LogoutButton } from "@/components/LogoutButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";

/**
 * Dashboard de progreso (Task 11). Muestra promedio global, créditos aprobados,
 * avance por tipología y materias en curso. Si falta onboarding, redirige.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard");

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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>
        {t("sessionAs", { email: perfil?.email ?? user?.email ?? "" })}
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/app/semesters">
          <Button variant="primary">{t("goSemesters")}</Button>
        </Link>
        <LogoutButton />
      </div>

      {perfil?.programa_id ? (
        <DashboardClient userId={user!.id} programaId={perfil.programa_id} />
      ) : null}
    </Container>
  );
}
