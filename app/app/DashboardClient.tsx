"use client";

import { useTranslations } from "next-intl";
import { Card, ProgressRing, StatCard, StatusBadge } from "@/components/ui";
import {
  useCurrentSubjects,
  useGlobalAverage,
  useProgressByTypology,
} from "@/services/queries";

export function DashboardClient({
  userId,
  programaId,
}: {
  userId: string;
  programaId: string;
}) {
  const t = useTranslations("dashboard");
  const tEstado = useTranslations("semesters.estado");
  const { data: global } = useGlobalAverage(userId);
  const { data: progress } = useProgressByTypology(userId, programaId);
  const { data: current } = useCurrentSubjects(userId);

  return (
    <div
      style={{
        marginTop: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-xl)",
      }}
    >
      {/* Tarjetas de resumen */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-md)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <StatCard
            label={t("globalGpa")}
            value={global?.promedio_global ?? t("notYet")}
          />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <StatCard
            label={t("approvedCredits")}
            value={global?.creditos_aprobados ?? 0}
          />
        </div>
      </div>

      {/* Avance por tipología */}
      <section>
        <h2>{t("progressByType")}</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {(progress ?? []).map((p) => {
            const pct =
              p.creditos_requeridos > 0
                ? Math.min(
                    100,
                    Math.round(
                      (p.creditos_aprobados / p.creditos_requeridos) * 100
                    )
                  )
                : 0;
            return (
              <Card
                key={p.tipologia}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-lg)",
                }}
              >
                <div style={{ color: "var(--brand-primary)", flexShrink: 0 }}>
                  <ProgressRing value={pct} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{p.tipologia}</strong>
                  <div style={{ color: "var(--muted)", marginTop: 4 }}>
                    {t("ofCredits", {
                      approved: p.creditos_aprobados,
                      required: p.creditos_requeridos,
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Materias en curso */}
      <section>
        <h2>{t("currentCourses")}</h2>
        {!current || current.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>{t("noCurrent")}</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {current.map((c) => (
              <Card
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "var(--space-md)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-md)",
                    flexWrap: "wrap",
                  }}
                >
                  <StatusBadge status="good" label={tEstado("en_curso")} />
                  <span>
                    {c.nombre} ·{" "}
                    <span className="num">{c.creditos}</span> {t("credits")}
                  </span>
                </div>
                <span style={{ color: "var(--muted)" }}>{c.semestre}</span>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
