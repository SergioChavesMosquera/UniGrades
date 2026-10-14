"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { signInWithEmail } from "@/services/auth";

export function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/app");
      router.refresh();
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
          required
        />
        <div style={{ marginTop: 8 }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>

      {error ? <p style={{ color: "#000", marginTop: 12 }}>⚠ {error}</p> : null}
    </div>
  );
}
