"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueries } from "@tanstack/react-query";
import { Card, ProgressRing, StatusBadge } from "@/components/ui";
import { BentoGrid } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { getGlobalAverage } from "@/services/grades";
import { getCurrentSubjects, getProgressByTypology } from "@/services/progress";

/** True si el usuario pidió movimiento reducido (R11.4). SSR-safe. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Cifra del dashboard. Usa NumberTicker (MagicUI) para animar hacia el valor,
 * pero respeta `prefers-reduced-motion`: en ese caso muestra la cifra fija con
 * `.num` (mono + tabular-nums). Componente de presentación, sin lógica de datos.
 */
function StatTicker({
  value,
  fallback,
  decimalPlaces = 0,
}: {
  value: number | null | undefined;
  fallback: string;
  decimalPlaces?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (value == null) {
    return <span className="num text-4xl font-bold">{fallback}</span>;
  }
  if (reduced) {
    return (
      <span className="num text-4xl font-bold">
        {value.toFixed(decimalPlaces)}
      </span>
    );
  }
  return (
    <NumberTicker
      value={value}
      decimalPlaces={decimalPlaces}
      className="text-4xl font-bold text-[var(--fg)] dark:text-[var(--fg)]"
    />
  );
}

export function DashboardClient({
  userId,
  programaId,
}: {
  userId: string;
  programaId: string;
}) {
  const t = useTranslations("dashboard");
  const tEstado = useTranslations("semesters.estado");

  // FEAT-003b: las 3 queries del dashboard se lanzan EN PARALELO con useQueries
  // (antes eran 3 useQuery independientes que React Query ya paraleliza, pero
  // useQueries lo hace explícito y evita el waterfall de renders). Se conservan
  // las queryKey EXACTAS de services/queries.ts (global-average / progress-typology
  // / current-subjects) reutilizando sus mismas funciones de servicio, sin tocar
  // services/queries.ts.
  const [{ data: global }, { data: progress }, { data: current }] = useQueries({
    queries: [
      {
        queryKey: ["global-average", userId],
        queryFn: () => getGlobalAverage(userId),
      },
      {
        queryKey: ["progress-typology", userId, programaId],
        queryFn: () => getProgressByTypology(userId, programaId),
      },
      {
        queryKey: ["current-subjects", userId],
        queryFn: () => getCurrentSubjects(userId),
      },
    ],
  });

  return (
    <div
      style={{
        marginTop: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-xl)",
      }}
    >
      {/* Tarjetas de resumen: BentoGrid (MagicUI) con BorderBeam de acento y
          cifras animadas con NumberTicker respetando movimiento reducido. */}
      <BentoGrid className="grid-cols-1 auto-rows-auto sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 [grid-column:auto]">
          <BorderBeam
            size={60}
            duration={8}
            colorFrom="var(--brand-primary)"
            colorTo="var(--brand-accent)"
          />
          <p className="m-0 text-sm text-[var(--muted)]">{t("globalGpa")}</p>
          <div className="mt-2">
            <StatTicker
              value={global?.promedio_global ?? null}
              fallback={t("notYet")}
              decimalPlaces={1}
            />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 [grid-column:auto]">
          <p className="m-0 text-sm text-[var(--muted)]">
            {t("approvedCredits")}
          </p>
          <div className="mt-2">
            <StatTicker
              value={global?.creditos_aprobados ?? 0}
              fallback={t("notYet")}
              decimalPlaces={0}
            />
          </div>
        </div>
      </BentoGrid>

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
