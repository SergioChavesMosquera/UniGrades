import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button, Container } from "@/components/ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>
      <h1>UniGrades</h1>
      <p style={{ color: "var(--muted)", maxWidth: 520 }}>{t("tagline")}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <Link href="/signup">
          <Button variant="primary">{t("createAccount")}</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">{t("signIn")}</Button>
        </Link>
      </div>
    </Container>
  );
}
