"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
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
    <div style={{ maxWidth: 360, marginTop: 24 }}>
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
          minLength={6}
          required
        />
        <div style={{ marginTop: 8 }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>

      {error ? <p style={{ color: "#000", marginTop: 12 }}>⚠ {error}</p> : null}
      {info ? <p style={{ color: "var(--muted)", marginTop: 12 }}>{info}</p> : null}
    </div>
  );
}
