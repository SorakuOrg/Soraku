import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/** @type {import('@next/mdx').NextMDXConfig} */
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // Support .mdx file extensions
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Drizzle + postgres.js perlu dijalankan di Node.js runtime (bukan Edge)
  serverExternalPackages: ["postgres", "drizzle-orm"],

  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Aktifkan instrumentation.ts (auto-migration, monitoring)
  },
};

export default withMDX(nextConfig);

