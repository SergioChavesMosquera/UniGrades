"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Card, StatusBadge } from "@/components/ui";
import { celebrate } from "@/lib/celebrate";
import {
  useDeleteEnrollment,
  useEnrollSubject,
  useEnrollments,
  useSemesterAverage,
  useUpdateEnrollmentState,
} from "@/services/queries";
import type { EstadoMateria, Materia } from "@/types/domain";

const ESTADOS: EstadoMateria[] = ["en_curso", "aprobada", "reprobada", "retirada"];

/**
 * Mapeo de estado de materia a estado visual del StatusBadge (icono + texto,
 * nunca solo color — R7.5):
 *   aprobada  → good   (menta)
 *   en_curso  → good   (menta, va bien)
 *   reprobada → behind (coral)
 *   retirada  → risk   (ámbar)
 */
const ESTADO_BADGE: Record<EstadoMateria, "good" | "risk" | "behind"> = {
  en_curso: "good",
  aprobada: "good",
  reprobada: "behind",
  retirada: "risk",
};

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

  async function handleStateChange(
    id: string,
    nuevo: EstadoMateria,
    previo: EstadoMateria
  ) {
    setError(null);
    try {
      await updateState.mutateAsync({ id, estado: nuevo });
      // Celebración SOLO en la transición real a "aprobada" (no al ver una ya
      // aprobada): efecto de presentación, no altera datos ni el flujo (R11.5).
      if (nuevo === "aprobada" && previo !== "aprobada") {
        celebrate();
      }
    } catch (err) {
      fail(err);
    }
  }

  const selectStyle = {
    minHeight: "var(--tap-min)",
    padding: "10px 12px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--fg)",
    fontSize: 14,
  } as const;

  return (
    <div style={{ marginTop: "var(--space-lg)" }}>
      <Card
        style={{
          marginBottom: "var(--space-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--space)",
        }}
      >
        <strong>{t("semesterAverage")}</strong>
        <span className="num" style={{ fontSize: 28, fontWeight: 700 }}>
          {semesterAvg ?? t("notYet")}
        </span>
      </Card>

      <h2>{t("enrollTitle")}</h2>
      <form
        onSubmit={handleEnroll}
        style={{
          display: "flex",
          gap: "var(--space-xs)",
          flexWrap: "wrap",
          alignItems: "center",
        }}
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

      {error ? (
        <p style={{ color: "var(--brand-danger)", marginTop: 12 }}>⚠ {error}</p>
      ) : null}

      <h2 style={{ marginTop: "var(--space-xl)" }}>{t("enrolled")}</h2>
      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>…</p>
      ) : !enrollments || enrollments.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>{t("noEnrollments")}</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-xs)",
          }}
        >
          {enrollments.map((en) => (
            <Card
              key={en.id}
              as="li"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--space)",
                flexWrap: "wrap",
                padding: "var(--space) var(--space-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-xs)",
                  flexWrap: "wrap",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <StatusBadge
                  status={ESTADO_BADGE[en.estado]}
                  label={t(`estado.${en.estado}`)}
                />
                <span>
                  {en.materia?.nombre ?? "—"} ·{" "}
                  <span className="num">{en.materia?.creditos ?? 0}</span>{" "}
                  {t("credits")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-xs)",
                  flexWrap: "wrap",
                }}
              >
                <Link href={`/app/subjects/${en.id}`}>
                  <Button variant="secondary">{ts("configure")}</Button>
                </Link>
                <select
                  value={en.estado}
                  onChange={(e) =>
                    handleStateChange(
                      en.id,
                      e.target.value as EstadoMateria,
                      en.estado
                    )
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
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
