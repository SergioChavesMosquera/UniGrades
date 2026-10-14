import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { createClient } from "@/lib/supabase/server";
import { SemesterDetailClient } from "./SemesterDetailClient";

export default async function SemesterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getTranslations("semesters");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Semestre (RLS garantiza que sea del usuario; si no, no vuelve nada).
  const { data: semestre } = await supabase
    .from("semestre")
    .select("id, etiqueta")
    .eq("id", id)
    .maybeSingle();

  if (!semestre) notFound();

  // Programa del usuario para listar sus materias en el selector.
  const { data: perfil } = await supabase
    .from("usuario")
    .select("programa_id")
    .eq("id", user!.id)
    .maybeSingle();

  if (!perfil?.programa_id) redirect("/app/onboarding");

  const { data: subjects } = await supabase
    .from("materia")
    .select("id, nombre, creditos")
    .eq("programa_id", perfil.programa_id)
    .order("semestre_sugerido", { ascending: true, nullsFirst: false })
    .order("nombre");

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>
      <p>
        <Link href="/app/semesters">{t("backToSemesters")}</Link>
      </p>
      <h1>{semestre.etiqueta}</h1>

      <SemesterDetailClient
        userId={user!.id}
        semestreId={semestre.id}
        subjects={subjects ?? []}
      />
    </Container>
  );
}
