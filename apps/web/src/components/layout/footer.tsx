import Link from "next/link";
import Image from "next/image";
import { SORAKU_SOCIALS } from "@/components/icons/custom-icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main brand block */}
        <div className="max-w-sm">

          {/* "Made with tea by" */}
          <p className="mb-4 text-sm text-muted-foreground/50">
            Made with tea by
          </p>

          {/* Logo row — pakai logo.png mascot */}
          <Link href="/" className="mb-4 inline-flex items-center gap-3 group">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#1a1c20] border border-border/60 shadow-md">
              <Image
                src="/logo.png"
                alt="Soraku mascot"
                width={56}
                height={56}
                className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300"
                priority
              />
            </div>
            <span className="text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
              Soraku
            </span>
          </Link>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Soraku adalah komunitas non-profit budaya pop Jepang di Indonesia yang menyajikan
            berita, artikel, dan ruang kreatif bagi komunitas anime, manga, game, culture
            jepang, vtuber dan cosplayer.
          </p>

          {/* Social icons — dari SORAKU_SOCIALS, no inline SVG */}
          <div className="flex items-center gap-2.5">
            {SORAKU_SOCIALS.map(({ slug, name, href, icon: Icon }) => (
              <a
                key={slug}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground/70 transition-all hover:border-primary/50 hover:bg-primary/8 hover:text-foreground"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/30 pt-6 text-xs text-muted-foreground/40 sm:flex-row sm:items-center">
          <p>© 2023 – {new Date().getFullYear()} Soraku Community · Non-profit</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <span className="text-rose-400/70">♥</span> untuk komunitas Indonesia
          </p>
        </div>

      </div>
    </footer>
  );
}
