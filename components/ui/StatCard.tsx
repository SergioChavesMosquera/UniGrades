import type { CSSProperties, ReactNode } from "react";
import { Card } from "./Card";

type StatCardProps = {
  /** Etiqueta descriptiva (texto ya traducido vía i18n). */
  label: string;
  /** Valor principal de la métrica (p. ej. un número o AnimatedNumber). */
  value: ReactNode;
  /** Texto auxiliar opcional bajo el valor. */
  hint?: string;
};

/**
 * Métrica grande con etiqueta, construida sobre Card.
 * El valor usa la clase `.num` para cifras monoespaciadas tabulares.
 * Componente "tonto": solo props.
 */
export function StatCard({ label, value, hint }: StatCardProps) {
  const labelStyle: CSSProperties = {
    fontSize: 13,
    color: "var(--muted)",
  };

  const valueStyle: CSSProperties = {
    fontSize: 32,
    fontWeight: 600,
    lineHeight: 1.1,
    color: "var(--fg)",
  };

  const hintStyle: CSSProperties = {
    fontSize: 12,
    color: "var(--muted)",
  };

  return (
    <Card
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}
    >
      <span style={labelStyle}>{label}</span>
      <span className="num" style={valueStyle}>
        {value}
      </span>
      {hint ? <span style={hintStyle}>{hint}</span> : null}
    </Card>
  );
}
