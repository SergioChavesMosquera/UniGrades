"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme } from "@/lib/theme/actions";
import { themes, type Theme } from "@/lib/theme/config";

/**
 * Toggle de tema claro/oscuro. Mismo molde que LanguageSwitcher:
 * client + useTransition + server action que persiste la cookie.
 *
 * No existe un hook equivalente a useLocale para el tema, así que el estado
 * inicial del control se resuelve en este orden:
 *   1. prop `current` (si el server la pasa),
 *   2. data-theme del <html> (fijado en el layout, anti-FOUC),
 *   3. "light" como fallback cuando no hay elección explícita.
 *
 * El control muestra icono Lucide + texto (nunca solo color) para cumplir R7.5.
 */
export function ThemeToggle({ current }: { current?: Theme }) {
  const t = useTranslations("common");
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<Theme>(current ?? "light");

  // Sincroniza con el data-theme real del <html> tras montar en cliente,
  // cuando no se pasó `current` (p. ej. cookie ausente -> prefers-color-scheme).
  useEffect(() => {
    if (current) return;
    const attr = document.documentElement.dataset.theme;
    if (attr && (themes as readonly string[]).includes(attr)) {
      setActive(attr as Theme);
    }
  }, [current]);

  function toggle() {
    const next: Theme = active === "dark" ? "light" : "dark";
    setActive(next);
    startTransition(() => {
      setTheme(next);
    });
  }

  const isDark = active === "dark";
  // Al estar en claro ofrecemos pasar a oscuro, y viceversa.
  const label = isDark ? t("lightMode") : t("darkMode");

  return (
    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{t("theme")}:</span>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-label={label}
        title={label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          minHeight: "var(--tap-min)",
          minWidth: "var(--tap-min)",
          padding: "4px 10px",
          background: "var(--surface)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          cursor: pending ? "default" : "pointer",
          fontSize: 13,
        }}
      >
        {isDark ? (
          <Sun size={16} aria-hidden="true" />
        ) : (
          <Moon size={16} aria-hidden="true" />
        )}
        <span>{label}</span>
      </button>
    </div>
  );
}
