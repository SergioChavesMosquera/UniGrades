"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { signUpWithEmail } from "@/services/auth";

export function SignupForm() {
  const t = useTranslations("signup");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const data = await signUpWithEmail(email, password);
      if (data.session) {
        router.push("/app");
        router.refresh();
      } else {
        setInfo(t("confirmInfo"));
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{ maxWidth: 400, marginTop: "var(--space-lg)" }}>
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          label={t("email")}
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label={t("password")}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
          minLength={6}
          required
        />
        <div style={{ marginTop: "var(--space-xs)" }}>
          <Button type="submit" variant="primary" isLoading={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>

      {info ? (
        <p
          role="status"
          style={{
            marginTop: "var(--space)",
            marginBottom: 0,
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {info}
        </p>
      ) : null}
    </Card>
  );
}
