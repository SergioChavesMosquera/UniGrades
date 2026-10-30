import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button, Container } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <LanguageSwitcher />
        </div>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
            alignItems: "flex-start",
            marginTop: "var(--space-xl)",
          }}
        >
          <Logo variant="horizontal" height={48} />
          <h1
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(32px, 7vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg)",
            }}
          >
            {t("tagline")}
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-xs)",
              marginTop: "var(--space)",
            }}
          >
            <Link href="/signup">
              <Button variant="primary">{t("createAccount")}</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">{t("signIn")}</Button>
            </Link>
          </div>
        </section>
      </Container>

      <footer
        style={{
          marginTop: "auto",
          borderTop: "1px solid var(--border)",
          padding: "var(--space-lg) var(--space)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-xs)",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
            {t("footerDisclaimer")}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
            {t("footerRights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
