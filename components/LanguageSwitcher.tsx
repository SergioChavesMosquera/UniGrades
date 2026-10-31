"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Flag } from "@/components/ui/Flag";
import { setLocale } from "@/lib/i18n/actions";
import { locales, type Locale } from "@/lib/i18n/config";

/**
 * Selector de idioma es/en como dropdown con bandera + nombre.
 *
 * Botón-trigger: bandera del idioma activo, su código y un chevron que rota al
 * abrir. Al desplegar muestra la lista de idiomas (bandera + nombre completo)
 * con un check en el activo. Cierra al hacer clic fuera o con Escape.
 *
 * La lógica de idioma (cookie) vive en lib/i18n; aquí solo UI + server action.
 */

const NAME_KEY: Record<Locale, "spanish" | "english"> = {
  es: "spanish",
  en: "english",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function change(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md disabled:opacity-60 dark:border-[#272e38] dark:bg-[#0b0f14]/70 dark:text-[#f7f8f5] dark:hover:border-[#3a434f] dark:hover:bg-[#14191f]"
      >
        <Flag locale={locale} size={18} />
        <span className="uppercase tracking-wide">{locale}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 dark:text-[#9aa7b2] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-[#272e38] dark:bg-[#14191f] dark:ring-white/5"
          style={{ animation: "ug-lang-in 160ms ease-out" }}
        >
          {locales.map((code) => {
            const active = locale === code;
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => change(code)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ${
                    active
                      ? "bg-[#0b6b4f]/10 font-semibold text-[#0b6b4f] dark:bg-[#2ed8a3]/10 dark:text-[#2ed8a3]"
                      : "text-gray-700 hover:bg-gray-100 dark:text-[#f7f8f5] dark:hover:bg-[#1c232b]"
                  }`}
                >
                  <Flag locale={code} size={20} />
                  <span className="flex-1">{t(NAME_KEY[code])}</span>
                  {active ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
