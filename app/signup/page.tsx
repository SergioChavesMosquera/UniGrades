import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui";
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
      <h1>{t("title")}</h1>
      <p style={{ color: "var(--muted)" }}>{t("subtitle")}</p>

      <SignupForm />

      <p style={{ marginTop: 24, color: "var(--muted)" }}>
        {t("haveAccount")} <Link href="/login">{t("goLogin")}</Link>
      </p>
      <p>
        <Link href="/">{tc("backHome")}</Link>
      </p>
    </Container>
  );
}
