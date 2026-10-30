import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuroraText } from "@/components/ui/aurora-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f14] text-[#f7f8f5]">
      {/* Hero oscuro casi negro con patrón de puntos sutil de fondo (MagicUI). */}
      <section className="relative flex flex-1 flex-col overflow-hidden">
        <DotPattern
          className={cn(
            "text-[#2ed8a3]/25",
            "[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]"
          )}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[960px] flex-1 flex-col px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" height={40} />
            <LanguageSwitcher />
          </div>

          <div className="flex flex-1 flex-col items-start justify-center gap-6 py-16">
            <h1 className="m-0 [font-family:var(--font-title)] text-[clamp(40px,9vw,72px)] leading-[1.02] font-bold tracking-[-0.03em]">
              {t("heroTitle")}{" "}
              <AuroraText colors={["#2ed8a3", "#0b6b4f", "#2ed8a3"]}>
                {t("heroTitleAccent")}
              </AuroraText>
            </h1>

            <p className="m-0 max-w-[48ch] text-[clamp(16px,2.6vw,20px)] text-[#9aa7b2]">
              {t("heroSubtitle")}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <ShimmerButton
                  shimmerColor="#2ed8a3"
                  background="#0d0f12"
                  className="ug-btn text-[#f7f8f5]"
                >
                  {t("createAccount")}
                </ShimmerButton>
              </Link>
              <Link
                href="/login"
                className="ug-btn inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-[#f7f8f5] transition-colors hover:bg-white/5"
              >
                {t("signIn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#272e38] px-4 py-6">
        <div className="mx-auto flex max-w-[960px] flex-col gap-2">
          <p className="m-0 text-[13px] text-[#9aa7b2]">
            {t("footerDisclaimer")}
          </p>
          <p className="m-0 text-[13px] text-[#9aa7b2]">
            {t("footerRights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
