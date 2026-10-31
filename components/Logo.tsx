import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  height?: number;
  /** "horizontal" = icono + nombre; "icon" = solo el icono. */
  variant?: "horizontal" | "icon";
  className?: string;
  href?: string;
}

/**
 * Logo de UniGrades: icono cuadrado + nombre de marca.
 *
 * El nombre usa la fuente de títulos del proyecto (Sora, vía --font-title),
 * negrita y tracking apretado. En hover el icono gira levemente y el nombre
 * pasa al verde de marca (menta en oscuro). Mismo patrón que la navbar guía.
 */
export function Logo({
  height = 40,
  variant = "horizontal",
  className = "",
  href = "/",
}: LogoProps) {
  return (
    <Link href={href} className={`group flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/icon.png"
        alt="UniGrades"
        width={height}
        height={height}
        priority
        className="rounded-lg object-contain transition-transform duration-500 ease-out group-hover:rotate-12"
        style={{ height: `${height}px`, width: `${height}px` }}
      />
      {variant === "horizontal" && (
        <span
          className="font-bold tracking-tighter text-gray-900 transition-colors duration-300 group-hover:text-[#0b6b4f] dark:text-white dark:group-hover:text-[#2ed8a3]"
          style={{
            fontFamily: "var(--font-title, var(--font-sans))",
            fontSize: `${Math.round(height * 0.5)}px`,
          }}
        >
          UniGrades
        </span>
      )}
    </Link>
  );
}
