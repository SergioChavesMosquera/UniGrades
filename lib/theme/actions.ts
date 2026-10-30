"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { THEME_COOKIE, themes, type Theme } from "./config";

/**
 * Server action: cambia el tema guardándolo en una cookie de un año.
 * revalidatePath refresca la UI para que data-theme se re-renderice.
 */
export async function setTheme(theme: Theme) {
  if (!themes.includes(theme)) return;

  const store = await cookies();
  store.set(THEME_COOKIE, theme, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
