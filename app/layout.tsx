import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getTheme } from "@/lib/theme/request";

const sora = Sora({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-sora",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UniGrades",
  description:
    "Lleva el seguimiento de tus notas, promedios y avance académico en un solo lugar.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  // Resolver el tema en el servidor para evitar FOUC (R6.4). Si es null
  // (sin cookie), se omite data-theme y el CSS cae en prefers-color-scheme (R6.5).
  const theme = await getTheme();

  return (
    <html
      lang={locale}
      data-theme={theme ?? undefined}
      className={`${sora.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
