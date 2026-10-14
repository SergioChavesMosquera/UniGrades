"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, locales, type Locale } from "./config";

/**
 * Server action: cambia el idioma guardándolo en una cookie de un año.
 * revalidatePath refresca la UI para que los textos se re-rendericen.
 */
export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
