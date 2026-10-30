import { AppNav } from "@/components/nav/AppNav";

/**
 * Layout protegido de /app.
 *
 * Seguridad (FEAT-003a): NO revalida la sesión aquí. El gate de autenticación de
 * /app lo cubre proxy.ts, que en CADA request llama a supabase.auth.getUser()
 * (round-trip real que revalida el token contra Supabase, no solo la cookie) y
 * redirige a /login si no hay sesión. Repetir getUser() en este layout era una
 * tercera llamada en serie (proxy -> layout -> page) que añadía latencia sin
 * aportar garantía extra: si el proxy deja pasar la request, ya hay sesión válida.
 * La única revalidación server adicional vive en app/app/page.tsx, donde el
 * user.id se necesita de todos modos para consultar el perfil del usuario.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
