"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui";
import {
  useDeleteEnrollment,
  useEnrollSubject,
  useEnrollments,
  useSemesterAverage,
  useUpdateEnrollmentState,
} from "@/services/queries";
import type { EstadoMateria, Materia } from "@/types/domain";

const ESTADOS: EstadoMateria[] = ["en_curso", "aprobada", "reprobada", "retirada"];

export function SemesterDetailClient({
  userId,
  semestreId,
  subjects,
}: {
  userId: string;
  semestreId: string;
  subjects: Pick<Materia, "id" | "nombre" | "creditos">[];
}) {
  const t = useTranslations("semesters");
  const ts = useTranslations("subjects");
  const { data: enrollments, isLoading } = useEnrollments(semestreId);
  const { data: semesterAvg } = useSemesterAverage(semestreId);
  const enroll = useEnrollSubject(semestreId);
  const updateState = useUpdateEnrollmentState(semestreId);
  const removeEnrollment = useDeleteEnrollment(semestreId);

  const [materiaId, setMateriaId] = useState("");
  const [estado, setEstado] = useState<EstadoMateria>("en_curso");
  const [error, setError] = useState<string | null>(null);

  function fail(e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("23505") || msg.toLowerCase().includes("duplicate")) {
      setError(t("duplicateError"));
    } else if (msg.includes("RN-4") || msg.includes("en_curso")) {
      setError(t("stateError"));
    } else {
      setError(t("genericError"));
    }
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!materiaId) return;
    try {
      await enroll.mutateAsync({ userId, materiaId, semestreId, estado });
      setMateriaId("");
      setEstado("en_curso");
    } catch (err) {
      fail(err);
    }
  }

  async function handleStateChange(id: string, nuevo: EstadoMateria) {
    setError(null);
    try {
      await updateState.mutateAsync({ id, estado: nuevo });
    } catch (err) {
      fail(err);
    }
  }

  const selectStyle = {
    padding: "10px 12px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "#fff",
    fontSize: 14,
  } as const;

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          border: "2px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "16px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>{t("semesterAverage")}</strong>
        <span style={{ fontSize: 28, fontWeight: 700 }}>
          {semesterAvg ?? t("notYet")}
        </span>
      </div>

      <h2>{t("enrollTitle")}</h2>
      <form
        onSubmit={handleEnroll}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
      >
        <select
          value={materiaId}
          onChange={(e) => setMateriaId(e.target.value)}
          style={{ ...selectStyle, minWidth: 280 }}
          required
        >
          <option value="">{t("selectSubject")}</option>
          {subjects.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} · {m.creditos} {t("credits")}
            </option>
          ))}
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoMateria)}
          style={selectStyle}
        >
          {ESTADOS.map((s) => (
            <option key={s} value={s}>
              {t(`estado.${s}`)}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary" disabled={enroll.isPending}>
          {enroll.isPending ? t("enrolling") : t("enroll")}
        </Button>
      </form>

      {error ? <p style={{ color: "#000", marginTop: 12 }}>⚠ {error}</p> : null}

      <h2 style={{ marginTop: 32 }}>{t("enrolled")}</h2>
      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>…</p>
      ) : !enrollments || enrollments.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>{t("noEnrollments")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {enrollments.map((en) => (
            <li
              key={en.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                marginBottom: 8,
              }}
            >
              <span style={{ flex: 1 }}>
                {en.materia?.nombre ?? "—"} · {en.materia?.creditos ?? 0} {t("credits")}
              </span>
              <Link href={`/app/subjects/${en.id}`}>
                <Button variant="secondary">{ts("configure")}</Button>
              </Link>
              <select
                value={en.estado}
                onChange={(e) =>
                  handleStateChange(en.id, e.target.value as EstadoMateria)
                }
                style={selectStyle}
              >
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {t(`estado.${s}`)}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                onClick={() => removeEnrollment.mutate(en.id)}
              >
                {t("remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
