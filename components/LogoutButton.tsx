"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { signOut } from "@/services/auth";

export function LogoutButton() {
  const t = useTranslations("dashboard");
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="secondary" onClick={handleLogout}>
      {t("logout")}
    </Button>
  );
}
