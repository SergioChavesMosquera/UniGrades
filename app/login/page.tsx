import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui";
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
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>{t("subtitle")}</p>

      <LoginForm />

      <p style={{ marginTop: 24, color: "var(--muted)" }}>
        {t("noAccount")} <Link href="/signup">{t("goSignup")}</Link>
      </p>
      <p>
        <Link href="/">{tc("backHome")}</Link>
      </p>
    </Container>
  );
}
