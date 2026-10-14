"use client";

import { useTranslations } from "next-intl";
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
  const { data: global } = useGlobalAverage(userId);
  const { data: progress } = useProgressByTypology(userId, programaId);
  const { data: current } = useCurrentSubjects(userId);

  const card = {
    border: "2px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "16px",
    flex: 1,
    minWidth: 200,
  } as const;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Tarjetas de resumen */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={card}>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{t("globalGpa")}</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {global?.promedio_global ?? t("notYet")}
          </div>
        </div>
        <div style={card}>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            {t("approvedCredits")}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {global?.creditos_aprobados ?? 0}
          </div>
        </div>
      </div>

      {/* Avance por tipología */}
      <h2 style={{ marginTop: 32 }}>{t("progressByType")}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {(progress ?? []).map((p) => {
          const pct =
            p.creditos_requeridos > 0
              ? Math.min(
                  100,
                  Math.round((p.creditos_aprobados / p.creditos_requeridos) * 100)
                )
              : 0;
          return (
            <li
              key={p.tipologia}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <strong>{p.tipologia}</strong>
                <span style={{ color: "var(--muted)" }}>
                  {t("ofCredits", {
                    approved: p.creditos_aprobados,
                    required: p.creditos_requeridos,
                  })}
                </span>
              </div>
              {/* Barra de progreso en blanco/negro */}
              <div
                style={{
                  height: 10,
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ width: `${pct}%`, height: "100%", background: "#000" }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Materias en curso */}
      <h2 style={{ marginTop: 32 }}>{t("currentCourses")}</h2>
      {!current || current.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>{t("noCurrent")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {current.map((c) => (
            <li
              key={c.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {c.nombre} · {c.creditos} {t("credits")}
              </span>
              <span style={{ color: "var(--muted)" }}>{c.semestre}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
