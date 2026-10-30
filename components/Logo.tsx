import type { CSSProperties } from "react";

type LogoVariant = "symbol" | "horizontal" | "mono";

type LogoProps = {
  /** Variante del logo: símbolo compacto, wordmark completo o monocromo. */
  variant: LogoVariant;
  /** Alto en px. Se fuerza un mínimo de 24px (R9.2). */
  height?: number;
};

/** Alto mínimo del logo en px (R9.2). */
const MIN_HEIGHT = 24;

/** Nombre de marca. No es copy de UI, así que NO pasa por i18n. */
const WORDMARK = "unigrades";

/**
 * Componente de logo presentacional ("tonto").
 *
 * Mientras no existan los assets finales de marca, renderiza un placeholder
 * consistente: el wordmark "unigrades" en la fuente de títulos (Sora) para no
 * romper el layout (R9.3). Cuando lleguen los assets, basta reemplazar el
 * contenido interno manteniendo esta misma firma de props.
 *
 * Variantes:
 * - symbol: marca compacta (primera letra "u") en color de marca.
 * - horizontal: wordmark completo en color de marca.
 * - mono: wordmark completo en `currentColor` para adaptarse al contexto.
 *
 * Respeta una "zona de respeto" (espacio libre alrededor) proporcional al alto.
 */
export function Logo({ variant, height = MIN_HEIGHT }: LogoProps) {
  const safeHeight = Math.max(MIN_HEIGHT, height);

  // La tipografía escala relativa al alto; la zona de respeto es ~25% del alto.
  const fontSize = Math.round(safeHeight * 0.6);
  const clearSpace = Math.round(safeHeight * 0.25);

  const isMono = variant === "mono";
  const color = isMono ? "currentColor" : "var(--brand-primary)";

  const wrapperStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    height: safeHeight,
    padding: clearSpace,
    boxSizing: "content-box",
    color,
    fontFamily: "var(--font-title)",
    fontWeight: 700,
    fontSize,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  if (variant === "symbol") {
    const symbolStyle: CSSProperties = {
      ...wrapperStyle,
      justifyContent: "center",
      width: safeHeight,
      padding: clearSpace,
    };
    return (
      <span role="img" aria-label={WORDMARK} style={symbolStyle}>
        {WORDMARK.charAt(0)}
      </span>
    );
  }

  return (
    <span role="img" aria-label={WORDMARK} style={wrapperStyle}>
      {WORDMARK}
    </span>
  );
}
