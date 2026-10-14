import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { createClient } from "@/lib/supabase/server";
import { SubjectComponentsClient } from "./SubjectComponentsClient";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getTranslations("subjects");

  // Inscripción (RLS garantiza que sea del usuario) + materia + semestre.
  const { data: inscripcion } = await supabase
    .from("materia_usuario")
    .select("id, semestre_id, materia(nombre)")
    .eq("id", id)
    .maybeSingle();

  if (!inscripcion) notFound();

  const materia = inscripcion.materia as unknown as { nombre: string } | null;

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>
      <p>
        <Link href={`/app/semesters/${inscripcion.semestre_id}`}>
          {t("backToSemester")}
        </Link>
      </p>
      <h1>{materia?.nombre ?? "—"}</h1>
      <h2>{t("componentsTitle")}</h2>

      <SubjectComponentsClient materiaUsuarioId={inscripcion.id} />
    </Container>
  );
}
