import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  const t = useTranslations("signup");
  const tc = useTranslations("common");

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>

      <div style={{ marginTop: "var(--space-lg)" }}>
        <Logo variant="horizontal" height={32} />
      </div>

      <h1
        style={{
          fontFamily: "var(--font-title)",
          margin: "var(--space-lg) 0 var(--space-xs)",
          color: "var(--fg)",
        }}
      >
        {t("title")}
      </h1>
      <p style={{ margin: 0, color: "var(--muted)" }}>{t("subtitle")}</p>

      <SignupForm />

      <p style={{ marginTop: "var(--space-lg)", color: "var(--muted)" }}>
        {t("haveAccount")} <Link href="/login">{t("goLogin")}</Link>
      </p>
      <p>
        <Link href="/">{tc("backHome")}</Link>
      </p>
    </Container>
  );
}
