"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CalendarDays, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoutButton } from "@/components/LogoutButton";
import { AppThemeToggler } from "@/components/theme/AppThemeToggler";

const LINKS = [
  { href: "/app", key: "dashboard", Icon: LayoutDashboard },
  { href: "/app/semesters", key: "semesters", Icon: CalendarDays },
  { href: "/app/settings", key: "settings", Icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const t = useTranslations("nav");
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-[#272e38] dark:bg-[#0b0f14]/90">
        <nav
          aria-label={t("primary")}
          className="mx-auto flex max-w-[1200px] items-center justify-between"
        >
          {/* 1. Logo */}
          <Logo variant="horizontal" height={32} />

          {/* 2. Enlaces de Escritorio */}
          <ul className="hidden items-center gap-8 text-[14px] font-semibold md:flex">
            {LINKS.map(({ href, key, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`group relative flex items-center gap-2 py-2 transition-all duration-300 ${
                      active
                        ? "text-[#0b6b4f] dark:text-[#2ed8a3]"
                        : "text-gray-600 hover:text-gray-900 dark:text-[#9aa7b2] dark:hover:text-[#f7f8f5]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{t(key)}</span>

                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-500 ${
                        active
                          ? "w-full bg-[#0b6b4f] opacity-100 shadow-[0_0_8px_rgba(11,107,79,0.5)] dark:bg-[#2ed8a3] dark:shadow-[0_0_8px_#2ed8a3]"
                          : "w-0 bg-[#0b6b4f] opacity-0 group-hover:w-full group-hover:opacity-100 dark:bg-[#2ed8a3]"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 3. Controles de Escritorio + Menú Hamburguesa */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher />
              <AppThemeToggler variant="square" />
              <div className="ml-2 border-l border-gray-200 pl-4 dark:border-[#272e38]">
                <LogoutButton />
              </div>
            </div>

            {/* Botón de Hamburguesa */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:border-[#0b6b4f] hover:text-[#0b6b4f] dark:border-[#272e38] dark:text-[#f7f8f5] dark:hover:border-[#2ed8a3] dark:hover:text-[#2ed8a3] md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* 4. Menú Móvil */}
      {menuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 flex flex-col bg-white/95 px-6 py-8 backdrop-blur-md dark:bg-[#0b0f14]/95 md:hidden">
          <ul className="flex flex-col gap-6">
            {LINKS.map(({ href, key, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-4 text-xl font-bold transition-colors ${
                      active
                        ? "text-[#0b6b4f] dark:text-[#2ed8a3]"
                        : "text-gray-700 hover:text-gray-900 dark:text-[#9aa7b2] dark:hover:text-[#f7f8f5]"
                    }`}
                  >
                    <Icon size={24} />
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto flex flex-col gap-6 border-t border-gray-200 pt-6 dark:border-[#272e38]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-[#9aa7b2]">
                Configuración
              </span>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <AppThemeToggler variant="square" />
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </>
  );
}