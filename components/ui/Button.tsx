import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  /** Muestra un spinner y deshabilita el botón mientras una acción está en curso. */
  isLoading?: boolean;
};

/**
 * Botón presentacional basado en tokens de diseño.
 * primary: fondo `--primary`, texto `--primary-fg`.
 * secondary: fondo `--surface`, texto `--fg`, borde `--border`.
 * Componente "tonto": sin lógica de negocio.
 */
export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  style,
  className,
  children,
  ...props
}: ButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-xs)",
    minHeight: "var(--tap-min)",
    padding: "10px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
  };

  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: "var(--primary)",
      color: "var(--primary-fg)",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--fg)",
      borderColor: "var(--border)",
    },
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={className ? `ug-btn ${className}` : "ug-btn"}
      style={{
        ...base,
        ...variants[variant],
        ...(isDisabled ? { opacity: 0.6, cursor: "not-allowed" } : null),
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2
          aria-hidden="true"
          size={16}
          style={{ animation: "ug-spin 0.8s linear infinite" }}
        />
      ) : null}
      {children}
    </button>
  );
}
