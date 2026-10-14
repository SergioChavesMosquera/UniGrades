"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import {
  useAddSubject,
  useCompleteOnboarding,
  useCreateOwnProgram,
  usePrograms,
  useSubjects,
} from "@/services/queries";

type Mode = "catalog" | "own";

export function OnboardingClient({ userId }: { userId: string }) {
  const t = useTranslations("onboarding");
  const [mode, setMode] = useState<Mode>("catalog");
  const [error, setError] = useState<string | null>(null);

  function fail(e: unknown) {
    setError(e instanceof Error ? e.message : t("errorGeneric"));
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Button
          variant={mode === "catalog" ? "primary" : "secondary"}
          onClick={() => setMode("catalog")}
        >
          {t("chooseCatalog")}
        </Button>
        <Button
          variant={mode === "own" ? "primary" : "secondary"}
          onClick={() => setMode("own")}
        >
          {t("createOwn")}
        </Button>
      </div>

      {mode === "catalog" ? (
        <CatalogMode userId={userId} onError={fail} />
      ) : (
        <OwnMode userId={userId} onError={fail} />
      )}

      {error ? <p style={{ color: "#000", marginTop: 16 }}>⚠ {error}</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Camino A: elegir del catálogo
// ---------------------------------------------------------------------------
function CatalogMode({
  userId,
  onError,
}: {
  userId: string;
  onError: (e: unknown) => void;
}) {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const { data: programs, isLoading } = usePrograms();
  const [selected, setSelected] = useState<string | null>(null);
  const { data: subjects } = useSubjects(selected);
  const complete = useCompleteOnboarding();

  async function use() {
    if (!selected) return;
    try {
      await complete.mutateAsync({ userId, programaId: selected });
      router.push("/app");
      router.refresh();
    } catch (e) {
      onError(e);
    }
  }

  if (isLoading) return <p style={{ color: "var(--muted)" }}>…</p>;
  if (!programs || programs.length === 0)
    return <p style={{ color: "var(--muted)" }}>{t("noPrograms")}</p>;

  return (
    <div>
      <label style={{ display: "block", marginBottom: 16 }}>
        <span style={{ fontSize: 13 }}>{t("selectProgram")}</span>
        <br />
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(e.target.value || null)}
          style={{
            marginTop: 4,
            padding: "10px 12px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            background: "#fff",
            fontSize: 14,
            minWidth: 320,
          }}
        >
          <option value="">—</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
              {p.institucion ? ` · ${p.institucion.nombre}` : ""}
            </option>
          ))}
        </select>
      </label>

      {selected && subjects ? (
        <div style={{ marginBottom: 16 }}>
          <strong>{t("subjectsPreview")}</strong>
          <ul style={{ marginTop: 8, maxHeight: 260, overflow: "auto" }}>
            {subjects.map((s) => (
              <li key={s.id}>
                {s.semestre_sugerido ? `[${t("semester")} ${s.semestre_sugerido}] ` : ""}
                {s.nombre} · {s.creditos} {t("credits")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button
        variant="primary"
        onClick={use}
        disabled={!selected || complete.isPending}
      >
        {complete.isPending ? t("finishing") : t("useThisProgram")}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Camino B: crear a mano
// ---------------------------------------------------------------------------
function OwnMode({
  userId,
  onError,
}: {
  userId: string;
  onError: (e: unknown) => void;
}) {
  const t = useTranslations("onboarding");
  const router = useRouter();

  const [uni, setUni] = useState("");
  const [prog, setProg] = useState("");
  const [created, setCreated] = useState<{
    programaId: string;
    tipologiaId: string;
  } | null>(null);

  const [subjects, setSubjects] = useState<{ nombre: string; creditos: number }[]>([]);
  const [subjName, setSubjName] = useState("");
  const [subjCredits, setSubjCredits] = useState(3);

  const createProgram = useCreateOwnProgram();
  const addSubj = useAddSubject();
  const complete = useCompleteOnboarding();

  async function doCreateProgram(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await createProgram.mutateAsync({
        universidadNombre: uni,
        programaNombre: prog,
        userId,
      });
      setCreated(res);
    } catch (err) {
      onError(err);
    }
  }

  async function doAddSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!created || !subjName) return;
    try {
      await addSubj.mutateAsync({
        programaId: created.programaId,
        tipologiaId: created.tipologiaId,
        nombre: subjName,
        creditos: subjCredits,
      });
      setSubjects((prev) => [...prev, { nombre: subjName, creditos: subjCredits }]);
      setSubjName("");
      setSubjCredits(3);
    } catch (err) {
      onError(err);
    }
  }

  async function finish() {
    if (!created) return;
    try {
      await complete.mutateAsync({ userId, programaId: created.programaId });
      router.push("/app");
      router.refresh();
    } catch (err) {
      onError(err);
    }
  }

  if (!created) {
    return (
      <form onSubmit={doCreateProgram} style={{ maxWidth: 420 }}>
        <Input
          id="uni"
          label={t("ownUniversity")}
          value={uni}
          onChange={(e) => setUni(e.target.value)}
          placeholder={t("ownUniversityPh")}
          required
        />
        <Input
          id="prog"
          label={t("ownProgram")}
          value={prog}
          onChange={(e) => setProg(e.target.value)}
          placeholder={t("ownProgramPh")}
          required
        />
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          {t("createProgramFirst")}
        </p>
        <Button type="submit" variant="primary" disabled={createProgram.isPending}>
          {t("createProgram")}
        </Button>
      </form>
    );
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <form onSubmit={doAddSubject}>
        <Input
          id="subjName"
          label={t("subjectName")}
          value={subjName}
          onChange={(e) => setSubjName(e.target.value)}
          required
        />
        <Input
          id="subjCredits"
          label={t("subjectCredits")}
          type="number"
          min={0}
          value={subjCredits}
          onChange={(e) => setSubjCredits(Number(e.target.value))}
          required
        />
        <Button type="submit" variant="secondary" disabled={addSubj.isPending}>
          {t("addSubject")}
        </Button>
      </form>

      <div style={{ marginTop: 24 }}>
        <strong>{t("yourSubjects")}</strong>
        {subjects.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>{t("noSubjectsYet")}</p>
        ) : (
          <ul style={{ marginTop: 8 }}>
            {subjects.map((s, i) => (
              <li key={i}>
                {s.nombre} · {s.creditos} {t("credits")}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <Button
          variant="primary"
          onClick={finish}
          disabled={subjects.length === 0 || complete.isPending}
        >
          {complete.isPending ? t("finishing") : t("finish")}
        </Button>
      </div>
    </div>
  );
}
