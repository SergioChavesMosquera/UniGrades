"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import {
  useAddComponent,
  useComponentGrades,
  useComponents,
  useDeleteComponent,
  useSubjectGrade,
} from "@/services/queries";
import { ComponentGrades } from "./ComponentGrades";

export function SubjectComponentsClient({
  materiaUsuarioId,
}: {
  materiaUsuarioId: string;
}) {
  const t = useTranslations("subjects");
  const { data: components, isLoading } = useComponents(materiaUsuarioId);
  const { data: componentGrades } = useComponentGrades(materiaUsuarioId);
  const { data: subjectGrade } = useSubjectGrade(materiaUsuarioId);
  const addComponent = useAddComponent(materiaUsuarioId);
  const deleteComponent = useDeleteComponent(materiaUsuarioId);

  const [nombre, setNombre] = useState("");
  const [porcentaje, setPorcentaje] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const sum = (components ?? []).reduce((acc, c) => acc + Number(c.porcentaje), 0);
  const remaining = Math.round((100 - sum) * 100) / 100;

  let statusText = "";
  if (sum < 100) statusText = t("remaining", { n: remaining });
  else if (sum === 100) statusText = t("complete");
  else statusText = t("over");

  // Mapa componente_id -> calificación (promedio de sus notas).
  const gradeByComponent = new Map<string, number | null>();
  for (const cg of componentGrades ?? []) {
    gradeByComponent.set(cg.componente_id, cg.calificacion);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (sum + porcentaje > 100) {
      setError(t("overError"));
      return;
    }
    try {
      const orden = (components?.length ?? 0) + 1;
      await addComponent.mutateAsync({ materiaUsuarioId, nombre, porcentaje, orden });
      setNombre("");
      setPorcentaje(0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("RN-2") || msg.toLowerCase().includes("check")) {
        setError(t("overError"));
      } else {
        setError(t("genericError"));
      }
    }
  }

  function fmt(n: number | null | undefined): string {
    return n === null || n === undefined ? t("notYet") : String(n);
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ color: "var(--muted)" }}>{t("subtitle")}</p>

      {/* Nota de la materia (el "momento mágico": se calcula sola) */}
      <div
        style={{
          border: "2px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "16px",
          margin: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>{t("subjectGrade")}</strong>
        <span style={{ fontSize: 28, fontWeight: 700 }}>{fmt(subjectGrade)}</span>
      </div>

      {/* Indicador en vivo de la suma de porcentajes */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "12px 16px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>
          {t("sumLabel")}: {sum}%
        </strong>
        <span style={{ color: sum === 100 ? "#000" : "var(--muted)" }}>
          {statusText}
        </span>
      </div>

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            id="nombre"
            label={t("name")}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t("namePh")}
            required
          />
        </div>
        <div style={{ width: 120 }}>
          <Input
            id="porcentaje"
            label={t("percentage")}
            type="number"
            min={1}
            max={100}
            step="0.01"
            value={porcentaje}
            onChange={(e) => setPorcentaje(Number(e.target.value))}
            required
          />
        </div>
        <Button type="submit" variant="primary" disabled={addComponent.isPending}>
          {addComponent.isPending ? t("adding") : t("add")}
        </Button>
      </form>

      {error ? <p style={{ color: "#000", marginTop: 12 }}>⚠ {error}</p> : null}

      {isLoading ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>…</p>
      ) : !components || components.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>{t("none")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
          {components.map((c) => (
            <li
              key={c.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong>{c.nombre}</strong> · {c.porcentaje}% ·{" "}
                  {t("componentGrade")}: {fmt(gradeByComponent.get(c.id))}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => deleteComponent.mutate(c.id)}
                >
                  {t("remove")}
                </Button>
              </div>
              <ComponentGrades componenteId={c.id} materiaUsuarioId={materiaUsuarioId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
