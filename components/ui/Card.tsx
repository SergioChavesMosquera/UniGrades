import type { CSSProperties, ElementType, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** Etiqueta del elemento a renderizar (polimórfico). Por defecto "div". */
  as?: ElementType;
  className?: string;
  /** Estilos adicionales que se fusionan sobre los tokens base. */
  style?: CSSProperties;
};

/**
 * Contenedor base con esquinas redondeadas y sombra suave.
 * Lee todas sus medidas de tokens de diseño. Componente "tonto".
 */
export function Card({ children, as, className, style }: CardProps) {
  const Tag: ElementType = as ?? "div";

  const base: CSSProperties = {
    borderRadius: "var(--radius)",
    background: "var(--surface)",
    boxShadow: "var(--shadow-soft)",
    padding: "var(--space-lg)",
    border: "1px solid var(--border)",
  };

  return (
    <Tag className={className} style={{ ...base, ...style }}>
      {children}
    </Tag>
  );
}
