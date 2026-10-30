import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

/**
 * Contenedor centrado con ancho máximo. Componente "tonto" de layout.
 * Lee todas sus medidas de tokens de diseño.
 */
export function Container({ children }: ContainerProps) {
  return (
    <div
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "var(--space-xl) var(--space)",
      }}
    >
      {children}
    </div>
  );
}
