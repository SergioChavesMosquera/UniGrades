import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

/**
 * Input mínimo blanco/negro con label opcional. Componente "tonto".
 */
export function Input({ label, id, style, ...props }: InputProps) {
  return (
    <label
      htmlFor={id}
      style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}
    >
      {label ? <span style={{ fontSize: 13 }}>{label}</span> : null}
      <input
        id={id}
        style={{
          padding: "10px 12px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          background: "#ffffff",
          color: "#000000",
          fontSize: 14,
          fontFamily: "inherit",
          ...style,
        }}
        {...props}
      />
    </label>
  );
}
