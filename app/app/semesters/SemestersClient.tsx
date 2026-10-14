"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useCreateSemester, useSemesters } from "@/services/queries";

export function SemestersClient({ userId }: { userId: string }) {
  const t = useTranslations("semesters");
  const { data: semesters, isLoading } = useSemesters(userId);
  const createSemester = useCreateSemester();
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const orden = (semesters?.length ?? 0) + 1;
      await createSemester.mutateAsync({ userId, etiqueta: label, orden });
      setLabel("");
    } catch {
      setError(t("genericError"));
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <form onSubmit={handleCreate} style={{ maxWidth: 360, marginBottom: 32 }}>
        <Input
          id="label"
          label={t("newLabel")}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("newLabelPh")}
          required
        />
        <Button type="submit" variant="primary" disabled={createSemester.isPending}>
          {createSemester.isPending ? t("creating") : t("create")}
        </Button>
      </form>

      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>…</p>
      ) : !semesters || semesters.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>{t("empty")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {semesters.map((s) => (
            <li
              key={s.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                marginBottom: 8,
              }}
            >
              <span>{s.etiqueta}</span>
              <Link href={`/app/semesters/${s.id}`}>
                <Button variant="secondary">{t("open")}</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {error ? <p style={{ color: "#000", marginTop: 12 }}>⚠ {error}</p> : null}
    </div>
  );
}
