"use client";

import { useLinkStatus } from "next/link";
import { Button } from "./Button";
import type { ComponentProps } from "react";

/**
 * Botón pensado para ir DENTRO de un <Link> de next/link.
 *
 * FEAT-003c: usa useLinkStatus() para reflejar el estado "pending" de la
 * navegación de forma inmediata al click (spinner + aria-busy) antes de que la
 * ruta destino termine de cargar. Así el usuario ve que su click fue registrado
 * aunque la navegación tarde. Fuera de un <Link>, pending siempre es false y el
 * botón se comporta como un Button normal.
 */
export function NavButton({
  isLoading,
  ...props
}: ComponentProps<typeof Button>) {
  const { pending } = useLinkStatus();
  return <Button isLoading={pending || isLoading} {...props} />;
}
