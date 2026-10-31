"use client";

import { useEffect, useState, useTransition } from "react";
import {
  AnimatedThemeToggler,
  type TransitionVariant,
} from "@/components/ui/animated-theme-toggler";
import { setTheme } from "@/lib/theme/actions";
import { themes, type Theme } from "@/lib/theme/config";

/**
 * Puente entre el toggler animado (MagicUI) y el sistema de tema del proyecto.
 *
 * El proyecto aplica el tema vía `data-theme` en <html> (resuelto en SSR desde
 * una cookie) y TODAS las variables CSS (--bg, --fg, …) dependen de ese atributo.
 * El AnimatedThemeToggler, por su cuenta, solo togglea la clase `.dark`, que
 * afecta únicamente a las utilidades `dark:` de Tailwind (la navbar) y deja el
 * resto de la página sin cambiar.
 *
 * Este wrapper lo usa en modo CONTROLADO y, en cada cambio:
 *   1. Actualiza `data-theme` del <html> al instante -> reestiliza toda la página.
 *   2. Mantiene la clase `.dark` sincronizada -> los estilos `dark:` siguen bien.
 *   3. Persiste la elección en la cookie vía la server action `setTheme`.
 */
function resolveInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.dataset.theme;
  if (attr && (themes as readonly string[]).includes(attr)) {
    return attr as Theme;
  }
  // Sin elección explícita: seguir el sistema operativo.
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefersDark ? "dark" : "light";
}

export function AppThemeToggler({
  variant = "square",
  className,
}: {
  variant?: TransitionVariant;
  className?: string;
}) {
  const [, startTransition] = useTransition();
  const [theme, setThemeState] = useState<Theme>("light");

  // Resolver el tema real tras montar (el server pudo no fijar data-theme).
  useEffect(() => {
    const initial = resolveInitialTheme();
    setThemeState(initial);
    applyThemeToDom(initial);
  }, []);

  function applyThemeToDom(next: Theme) {
    const root = document.documentElement;
    root.dataset.theme = next;
    root.classList.toggle("dark", next === "dark");
  }

  function handleChange(next: "light" | "dark") {
    setThemeState(next);
    applyThemeToDom(next);
    startTransition(() => {
      setTheme(next);
    });
  }

  return (
    <AnimatedThemeToggler
      variant={variant}
      className={className}
      theme={theme}
      onThemeChange={handleChange}
    />
  );
}
