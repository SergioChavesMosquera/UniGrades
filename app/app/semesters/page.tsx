import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { SemestersClient } from "./SemestersClient";

export default async function SemestersPage() {
  const supabase = await createClient();
  const t = await getTranslations("semesters");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Container>
      <p>
        <Link href="/app">{t("backToDashboard")}</Link>
      </p>
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>{t("subtitle")}</p>

      <SemestersClient userId={user!.id} />
    </Container>
  );
}
