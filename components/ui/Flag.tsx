"use client";

import { useId } from "react";
import type { Locale } from "@/lib/i18n/config";

/**
 * Banderas SVG inline para el selector de idioma.
 *
 * Emojis de bandera NO se renderizan en Windows (muestra el código regional
 * como texto, p. ej. "GB"), así que se dibujan como SVG. Se ven igual en todos
 * los sistemas, sin dependencias ni archivos externos. Las esquinas se redondean
 * con un clip cuyo id es único por instancia (useId) para no colisionar cuando
 * hay varias banderas en el DOM a la vez (trigger + menú).
 */

function FlagES({ size }: { size: number }) {
  const clip = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0 rounded-[3px]"
    >
      <clipPath id={clip}>
        <rect width="24" height="24" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="24" height="24" fill="#c60b1e" />
        <rect y="6" width="24" height="12" fill="#ffc400" />
      </g>
    </svg>
  );
}

function FlagGB({ size }: { size: number }) {
  const clip = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0 rounded-[3px]"
    >
      <clipPath id={clip}>
        <rect width="24" height="24" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="24" height="24" fill="#012169" />
        {/* Diagonales blancas */}
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#fff" strokeWidth="4.8" />
        {/* Diagonales rojas */}
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#c8102e" strokeWidth="2" />
        {/* Cruz blanca */}
        <path d="M12 0 V24 M0 12 H24" stroke="#fff" strokeWidth="8" />
        {/* Cruz roja */}
        <path d="M12 0 V24 M0 12 H24" stroke="#c8102e" strokeWidth="4.8" />
      </g>
    </svg>
  );
}

export function Flag({ locale, size = 18 }: { locale: Locale; size?: number }) {
  return locale === "es" ? <FlagES size={size} /> : <FlagGB size={size} />;
}
