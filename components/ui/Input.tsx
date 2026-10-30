import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  /** Texto de error; cuando está presente marca el input como inválido. */
  error?: string;
};

/**
 * Input presentacional basado en tokens de diseño, con label opcional
 * y estado de error accesible. Componente "tonto".
 */
export function Input({
  label,
  id,
  error,
  style,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginBottom: 12,
      }}
    >
      {label ? <span style={{ fontSize: 13 }}>{label}</span> : null}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        style={{
          padding: "10px 12px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${error ? "var(--brand-danger)" : "var(--border)"}`,
          background: "var(--surface)",
          color: "var(--fg)",
          fontSize: 14,
          fontFamily: "inherit",
          ...style,
        }}
        {...props}
      />
      {error ? (
        <span
          id={errorId}
          style={{ fontSize: 12, color: "var(--brand-danger)" }}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
