"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, LayoutDashboard, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";

/**
 * Barra de navegación del área autenticada (/app). Componente "tonto": solo
 * enlaces y los controles presentacionales/acciones ya existentes
 * (LanguageSwitcher, ThemeToggle, LogoutButton) sin introducir lógica de datos
 * nueva (R12.6).
 *
 * Es un client component porque la detección de sección activa usa
 * usePathname (R12.3). El gate de sesión sigue viviendo en el server component
 * app/app/layout.tsx; este componente solo se monta por encima de {children}.
 *
 * Mobile-first: barra apilada y compacta en móvil, se expande en fila a ≥640px.
 * Todos los objetivos táctiles alcanzan --tap-min (44px) y no hay scroll
 * horizontal a 360px gracias a flex-wrap (R12.5).
 */

const LINKS = [
  { href: "/app", key: "dashboard", Icon: LayoutDashboard },
  { href: "/app/semesters", key: "semesters", Icon: CalendarDays },
  { href: "/app/settings", key: "settings", Icon: Settings },
] as const;

/**
 * Una sección está activa cuando la ruta coincide exactamente o es una
 * subruta. "/app" es el dashboard: solo activo en coincidencia exacta para no
 * marcarse en cada subruta de /app.
 */
function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const t = useTranslations("nav");
  const pathname = usePathname() ?? "";

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <nav
        aria-label={t("primary")}
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "var(--space-xs) var(--space)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-xs)",
        }}
      >
        <Link
          href="/app"
          aria-label="unigrades"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: "var(--tap-min)",
            textDecoration: "none",
            flex: "0 0 auto",
          }}
        >
          <Logo variant="horizontal" height={24} />
        </Link>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-xs)",
            flex: "1 1 auto",
          }}
        >
          {LINKS.map(({ href, key, Icon }) => {
            const active = isActive(pathname, href);
            const linkStyle: CSSProperties = {
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              minHeight: "var(--tap-min)",
              padding: "0 var(--space-xs)",
              borderRadius: "var(--radius-sm)",
              textDecoration: active ? "underline" : "none",
              textUnderlineOffset: 4,
              fontWeight: active ? 700 : 500,
              color: active ? "var(--primary)" : "var(--fg)",
              background: active ? "var(--bg)" : "transparent",
              whiteSpace: "nowrap",
            };
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  style={linkStyle}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{t(key)}</span>
                  {/* Indicador textual de sección activa (no solo color, R12.3). */}
                  {active ? (
                    <span aria-hidden="true" style={{ color: "var(--primary)" }}>
                      •
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-xs)",
            flex: "0 1 auto",
          }}
        >
          <LanguageSwitcher />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
