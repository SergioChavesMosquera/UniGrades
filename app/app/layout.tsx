import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout protegido de /app. Gate de sesión en server (defensa en profundidad
 * además del middleware). La redirección al onboarding se decide por página
 * (ver app/app/page.tsx), ya que el onboarding también vive bajo /app.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
