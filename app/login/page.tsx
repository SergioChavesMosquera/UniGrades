import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AppThemeToggler } from "@/components/theme/AppThemeToggler";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const t = useTranslations("login");
  const tc = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-[#000000] dark:text-white">
      {/* Navegación superior */}
      <header className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Logo variant="horizontal" height={32} />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AppThemeToggler variant="square" />
        </div>
      </header>

      {/* Contenido */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-20">
        {/* Fondo: patrón de puntos + esfera de brillo (igual que la landing) */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
              "text-[#0b6b4f]/20 dark:text-[#2ed8a3]/20"
            )}
          />
          <div className="absolute h-[360px] w-[520px] rounded-full bg-[#0b6b4f]/10 blur-[120px] dark:bg-[#2ed8a3]/10" />
        </div>

        <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-base font-medium text-gray-600 dark:text-[#888888]">
            {t("subtitle")}
          </p>

          <LoginForm />

          <p className="mt-10 text-sm text-gray-600 dark:text-[#888888]">
            {t("noAccount")}{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#0b6b4f] transition-colors hover:text-[#0d0f12] dark:text-[#2ed8a3] dark:hover:text-white"
            >
              {t("goSignup")}
            </Link>
          </p>

          <Link
            href="/"
            className="group mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md dark:border-[#1A1A1A] dark:bg-[#0A0A0A]/70 dark:text-gray-300 dark:hover:border-[#242424] dark:hover:bg-[#111111]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {tc("backHome").replace(/^←\s*/, "")}
          </Link>
        </div>
      </main>
    </div>
  );
}
