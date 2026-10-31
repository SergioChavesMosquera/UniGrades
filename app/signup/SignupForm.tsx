"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
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

  const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#0b6b4f] focus:bg-white focus:ring-4 focus:ring-[#0b6b4f]/10 dark:border-[#242424] dark:bg-[#111111] dark:text-white dark:placeholder:text-[#555] dark:focus:border-[#2ed8a3] dark:focus:bg-[#0d0d0d] dark:focus:ring-[#2ed8a3]/10";
  const labelClass =
    "mb-2 block text-left text-[13px] font-semibold text-gray-700 dark:text-gray-300";

  return (
    <div className="relative mt-10 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:border-[#1A1A1A] dark:bg-[#0A0A0A] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
      {/* Borde animado sutil (acento, no superficie) */}
      <BorderBeam
        size={140}
        duration={9}
        colorFrom="#0b6b4f"
        colorTo="#2ed8a3"
        borderWidth={1.5}
      />

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "password-error" : undefined}
            className={fieldClass}
          />
          {error ? (
            <p
              id="password-error"
              className="mt-2 text-left text-xs font-medium text-[#ff5c5c]"
            >
              {error}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d0f12] text-sm font-bold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-[#0d0f12] dark:hover:bg-gray-100"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>

      {info ? (
        <p
          role="status"
          className="relative z-10 mt-5 rounded-xl border border-[#0b6b4f]/20 bg-[#0b6b4f]/5 px-4 py-3 text-left text-[13px] font-medium text-[#0b6b4f] dark:border-[#2ed8a3]/20 dark:bg-[#2ed8a3]/5 dark:text-[#2ed8a3]"
        >
          {info}
        </p>
      ) : null}
    </div>
  );
}
