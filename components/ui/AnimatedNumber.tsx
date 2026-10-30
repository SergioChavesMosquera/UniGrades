"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  /** Valor objetivo a mostrar. */
  value: number;
  /** Decimales con los que se formatea el número. Por defecto 1. */
  decimals?: number;
  /** Duración del tween en milisegundos. Por defecto 500. */
  duration?: number;
  /** Clases extra; se combinan con `.num` (mono + tabular-nums). */
  className?: string;
};

/**
 * Muestra un número y anima la transición cuando el valor CAMBIA
 * (R11.1), usando `requestAnimationFrame` sin dependencias externas.
 *
 * - En el primer montaje fija el valor inicial (no anima en la carga).
 * - Respeta `prefers-reduced-motion: reduce`: fija el valor sin tween (R11.4).
 * - SSR-safe: no accede a `window` durante el render; sólo en efectos.
 *
 * Componente "tonto": sólo props, sin lógica de negocio.
 */
export function AnimatedNumber({
  value,
  decimals = 1,
  duration = 500,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState<number>(value);
  const previousRef = useRef<number>(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = previousRef.current;
    const to = value;
    previousRef.current = value;

    // Sin cambio real: nada que animar.
    if (from === to) {
      setDisplay(to);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Movimiento reducido o sin rAF disponible: fija el valor final.
    if (
      prefersReducedMotion ||
      duration <= 0 ||
      typeof window === "undefined" ||
      typeof window.requestAnimationFrame !== "function"
    ) {
      setDisplay(to);
      return;
    }

    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      // Easing suave (easeOutCubic) para un conteo discreto.
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(step);
      } else {
        setDisplay(to);
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [value, duration]);

  const formatted = display.toFixed(Math.max(0, decimals));

  return <span className={`num ${className ?? ""}`.trim()}>{formatted}</span>;
}
