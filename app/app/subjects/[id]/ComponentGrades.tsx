"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useAddGrade, useDeleteGrade, useGrades } from "@/services/queries";

/**
 * Gestión de notas de un componente (RN-7: su calificación es el promedio).
 * Agregar/quitar una nota recalcula los promedios al instante (invalidación en los hooks).
 */
export function ComponentGrades({
  componenteId,
  materiaUsuarioId,
}: {
  componenteId: string;
  materiaUsuarioId: string;
}) {
  const t = useTranslations("subjects");
  const { data: grades, isLoading } = useGrades(componenteId);
  const addGrade = useAddGrade(componenteId, materiaUsuarioId);
  const deleteGrade = useDeleteGrade(componenteId, materiaUsuarioId);

  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (valor < 0 || valor > 5) {
      setError(t("rangeError"));
      return;
    }
    try {
      await addGrade.mutateAsync({ componenteId, nombre, valor });
      setNombre("");
      setValor(0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("check")) setError(t("rangeError"));
      else setError(t("genericError"));
    }
  }

  return (
    <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: "2px solid var(--border)" }}>
      <strong style={{ fontSize: 13 }}>{t("gradesTitle")}</strong>

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginTop: 8 }}
      >
        <div style={{ flex: 1, minWidth: 160 }}>
          <Input
            id={`gn-${componenteId}`}
            label={t("gradeName")}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t("gradeNamePh")}
            required
          />
        </div>
        <div style={{ width: 130 }}>
          <Input
            id={`gv-${componenteId}`}
            label={t("gradeValue")}
            type="number"
            min={0}
            max={5}
            step="0.1"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            required
          />
        </div>
        <Button type="submit" variant="primary" disabled={addGrade.isPending}>
          {t("addGrade")}
        </Button>
      </form>

      {error ? <p style={{ color: "#000", marginTop: 8 }}>⚠ {error}</p> : null}

      {isLoading ? null : !grades || grades.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 8 }}>{t("noGrades")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
          {grades.map((g) => (
            <li
              key={g.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span>
                {g.nombre}: <strong>{g.valor}</strong>
              </span>
              <button
                type="button"
                onClick={() => deleteGrade.mutate(g.id)}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {t("removeGrade")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
