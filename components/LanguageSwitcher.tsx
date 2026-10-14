"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/config";

/**
 * Selector de idioma es/en. Llama al server action que persiste la cookie.
 * Componente "tonto" en estilo; la lógica de idioma vive en lib/i18n.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  return (
    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{t("language")}:</span>
      <button
        type="button"
        onClick={() => change("es")}
        disabled={pending}
        style={{
          background: locale === "es" ? "#000" : "#fff",
          color: locale === "es" ? "#fff" : "#000",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => change("en")}
        disabled={pending}
        style={{
          background: locale === "en" ? "#000" : "#fff",
          color: locale === "en" ? "#fff" : "#000",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        EN
      </button>
    </div>
  );
}
