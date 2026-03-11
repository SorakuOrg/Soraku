
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { SORAKU_SOCIALS } from "@/components/icons/custom-icons";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Sosial Media — Soraku Community",
  description: "Temukan dan ikuti Soraku Community di berbagai platform sosial media.",
};

// Deskripsi singkat per platform
const PLATFORM_DESC: Record<string, string> = {
  discord:   "Server komunitas utama — chat, event, ngobrol bareng",
  instagram: "Foto kegiatan, fanart, dan update terbaru",
  facebook:  "Halaman resmi Soraku Community",
  x:         "Update cepat, diskusi, dan thread anime",
  tiktok:    "Video pendek — review, fun facts, clip anime",
  youtube:   "Video panjang, nonton bareng, dan konten kreator",
  bluesky:   "Alternatif Twitter bebas iklan",
};

const PLATFORM_LABEL: Record<string, string> = {
  discord:   "Gabung Server",
  instagram: "Follow",
  facebook:  "Like Page",
  x:         "Follow",
  tiktok:    "Follow",
  youtube:   "Subscribe",
  bluesky:   "Follow",
};

export default function SocialPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary/70">
          Temukan Kami
        </p>
        <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Soraku di{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Sosial Media
          </span>
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground">
          Ikuti perjalanan Soraku Community di berbagai platform dan jadi bagian dari
          percakapan komunitas anime &amp; Jepang Indonesia.
        </p>
      </div>

      {/* Grid sosmed */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SORAKU_SOCIALS.map(({ slug, name, href, icon: Icon }) => (
          <li key={slug}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Icon */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground/30 transition-colors group-hover:text-primary/50" />
              </div>

              {/* Info */}
              <div>
                <p className="mb-1 font-semibold text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  {PLATFORM_DESC[slug] ?? "Ikuti kami di platform ini"}
                </p>
              </div>

              {/* CTA */}
              <span className="mt-auto text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                {PLATFORM_LABEL[slug] ?? "Kunjungi"} →
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Footer note */}
      <p className="mt-12 text-center text-sm text-muted-foreground/40">
        Semua akun di atas adalah akun resmi Soraku Community · Hati-hati terhadap akun palsu
      </p>
    </div>
  );
}
