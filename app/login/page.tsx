import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const t = useTranslations("login");
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

      <LoginForm />

      <p style={{ marginTop: "var(--space-lg)", color: "var(--muted)" }}>
        {t("noAccount")} <Link href="/signup">{t("goSignup")}</Link>
      </p>
      <p>
        <Link href="/">{tc("backHome")}</Link>
      </p>
    </Container>
  );
}
