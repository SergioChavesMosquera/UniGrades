import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui";
import { LogoutButton } from "@/components/LogoutButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { createClient } from "@/lib/supabase/server";
import { OnboardingClient } from "./OnboardingClient";

/**
 * Onboarding (Task 7). Si el usuario ya lo completó, lo envía al dashboard.
 * Si no, muestra las dos vías: elegir del catálogo o crear su programa a mano.
 */
export default async function OnboardingPage() {
  const supabase = await createClient();
  const t = await getTranslations("onboarding");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("usuario")
    .select("onboarding_completo")
    .eq("id", user!.id)
    .maybeSingle();

  if (perfil?.onboarding_completo) {
    redirect("/app");
  }

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>{t("subtitle")}</p>

      <OnboardingClient userId={user!.id} />

      <div style={{ marginTop: 32 }}>
        <LogoutButton />
      </div>
    </Container>
  );
}
