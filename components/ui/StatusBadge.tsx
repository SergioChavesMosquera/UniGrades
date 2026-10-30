import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";

type Status = "good" | "risk" | "behind";

type StatusBadgeProps = {
  /**
   * Estado de la materia:
   * good → menta (`--brand-accent`), risk → ámbar (`--brand-warning`),
   * behind → coral (`--brand-danger`).
   */
  status: Status;
  /** Texto visible ya traducido vía i18n (la pantalla pasa el label). */
  label: string;
};

/**
 * Insignia de estado con icono + texto. El color NUNCA es el único medio
 * de transmitir información (R7.5): el texto siempre acompaña.
 * El icono es decorativo (`aria-hidden`); el significado lo da el label.
 * Componente "tonto": solo props.
 */
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config: Record<
    Status,
    { color: string; Icon: typeof CheckCircle2 }
  > = {
    good: { color: "var(--brand-accent)", Icon: CheckCircle2 },
    risk: { color: "var(--brand-warning)", Icon: AlertTriangle },
    behind: { color: "var(--brand-danger)", Icon: TrendingDown },
  };

  const { color, Icon } = config[status];

  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-xs)",
    padding: "4px 10px",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${color}`,
    color,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.2,
  };

  return (
    <span style={style}>
      <Icon aria-hidden="true" size={16} />
      {label}
    </span>
  );
}
