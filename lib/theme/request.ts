import { cookies } from "next/headers";
import { THEME_COOKIE, themes, type Theme } from "./config";

/**
 * Resuelve el tema activo desde la cookie (análogo a i18n/request.ts).
 * Devuelve null cuando no hay elección válida: en ese caso la UI debe
 * seguir prefers-color-scheme del sistema operativo.
 */
export async function getTheme(): Promise<Theme | null> {
  const store = await cookies();
  const value = store.get(THEME_COOKIE)?.value as Theme | undefined;

  return value && themes.includes(value) ? value : null;
}
