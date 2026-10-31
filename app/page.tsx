import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AppThemeToggler } from "@/components/theme/AppThemeToggler";
import { AuroraText } from "@/components/ui/aurora-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-[#000000] dark:text-white">
      {/* Navegación superior */}
      <header className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Logo height={40} variant="horizontal" />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AppThemeToggler variant="square" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pt-8 pb-20">
        
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
              "text-[#0b6b4f]/20 dark:text-[#2ed8a3]/20"
            )}
          />
          {/* Esfera de brillo adaptada al tema */}
          <div className="absolute h-[400px] w-[600px] rounded-full bg-[#0b6b4f]/10 blur-[120px] dark:bg-[#2ed8a3]/10" />
        </div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
          
          {/* Badge con indicador de pulso */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-[#0b6b4f] dark:border-[#1A1A1A] dark:bg-[#0A0A0A] dark:text-[#2ed8a3]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0b6b4f] opacity-75 dark:bg-[#2ed8a3]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0b6b4f] dark:bg-[#2ed8a3]" />
            </span>
            {t("badge")}
          </div>

          {/* Título Principal */}
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-7xl lg:text-8xl dark:text-white">
            {t("heroTitle")} <br className="hidden md:block" />
            <div className="relative mt-2 inline-block overflow-visible md:mt-4">
              <AuroraText colors={["#0b6b4f", "#2ed8a3"]}>
                {t("heroTitleAccent")}
              </AuroraText>
            </div>
          </h1>

          {/* Subtítulo */}
          <p className="mt-8 max-w-2xl text-lg font-medium text-gray-600 md:text-xl dark:text-[#888888]">
            {t("heroSubtitle")}
          </p>

          {/* CTAs (Call to Actions) */}
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link href="/signup">
              <ShimmerButton background="#0d0f12" className="h-14 px-10 text-lg font-bold text-[#f7f8f5] transition-transform hover:scale-105" shimmerColor="#2ed8a3">
                {t("createAccount")}
              </ShimmerButton>
            </Link>
            
            <Link className="group flex items-center gap-2 text-lg font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-[#888888] dark:hover:text-white" href="/login">
              {t("signIn")}
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1"/>
            </Link>
          </div>
        </div>

        {/* Gradiente de salida inferior adaptado */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-[#000000]" />
      </main>

      <footer className="relative z-10 border-t border-gray-200 bg-white px-4 py-6 dark:border-[#1A1A1A] dark:bg-[#000000]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
          <p className="m-0 text-[13px] text-gray-500 dark:text-[#888888]">
            {t("footerDisclaimer")}
          </p>
          <p className="m-0 text-[13px] text-gray-500 dark:text-[#888888]">
            {t("footerRights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}