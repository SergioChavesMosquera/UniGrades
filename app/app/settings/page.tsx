import { getTranslations } from "next-intl/server";
import { Card, Container } from "@/components/ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

/**
 * Ajustes (/app/settings). Idioma, tema y programa actual (solo lectura).
 * Pantalla "tonta": reutiliza LanguageSwitcher/ThemeToggle existentes y una
 * lectura de ruta del programa del usuario (como hacen otras páginas de /app).
 * No introduce lógica de cambio de programa (fuera de alcance).
 */
export default async function SettingsPage() {
  const supabase = await createClient();
  const t = await getTranslations("settings");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("usuario")
    .select("programa_id")
    .eq("id", user!.id)
    .maybeSingle();

  let programaNombre: string | null = null;
  if (perfil?.programa_id) {
    const { data: programa } = await supabase
      .from("programa")
      .select("nombre")
      .eq("id", perfil.programa_id)
      .maybeSingle();
    programaNombre = programa?.nombre ?? null;
  }

  return (
    <Container>
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>{t("subtitle")}</p>

      <div
        style={{
          marginTop: "var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)",
          maxWidth: 520,
        }}
      >
        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space)",
            flexWrap: "wrap",
          }}
        >
          <strong>{t("language")}</strong>
          <LanguageSwitcher />
        </Card>

        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space)",
            flexWrap: "wrap",
          }}
        >
          <strong>{t("theme")}</strong>
          <ThemeToggle />
        </Card>

        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space)",
            flexWrap: "wrap",
          }}
        >
          <strong>{t("program")}</strong>
          <span style={{ color: programaNombre ? "var(--fg)" : "var(--muted)" }}>
            {programaNombre ?? t("noProgram")}
          </span>
        </Card>
      </div>
    </Container>
  );
}
