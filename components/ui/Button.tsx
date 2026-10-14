import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

/**
 * Botón mínimo blanco/negro.
 * primary: fondo negro, texto blanco. secondary: fondo blanco, borde negro.
 * Componente "tonto": sin lógica de negocio.
 */
export function Button({
  variant = "primary",
  style,
  ...props
}: ButtonProps) {
  const base = {
    padding: "10px 16px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
  } as const;

  const variants: Record<Variant, React.CSSProperties> = {
    primary: { background: "#000000", color: "#ffffff" },
    secondary: { background: "#ffffff", color: "#000000" },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      {...props}
    />
  );
}
