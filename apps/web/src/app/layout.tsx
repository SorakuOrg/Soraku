import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Soraku Community — Komunitas Anime & Budaya Jepang Indonesia",
    template: "%s · Soraku",
  },
  description:
    "Platform komunitas non-profit untuk penggemar anime, manga, J-Music, VTuber, cosplay, dan budaya Jepang di Indonesia.",
  keywords: ["soraku", "komunitas anime", "anime indonesia", "j-culture", "vtuber"],
  authors: [{ name: "Soraku Community" }],
  creator: "Soraku Community",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://soraku.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Soraku Community",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#1c1e22" },
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
