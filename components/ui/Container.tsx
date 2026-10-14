import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

/**
 * Contenedor centrado con ancho máximo. Componente "tonto" de layout.
 */
export function Container({ children }: ContainerProps) {
  return (
    <div
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "32px var(--space)",
      }}
    >
      {children}
    </div>
  );
}
