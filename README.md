# 🌸 Soraku Community — Monorepo

> Platform komunitas anime & budaya Jepang berbasis Indonesia.

## Struktur

```
SorakuCommunity/Soraku
├── apps/
│   ├── web/          ← Next.js 16 (platform utama) [AKTIF]
│   ├── stream/       ← Web streaming (planned)
│   └── mobile/       ← React Native app (planned)
├── services/
│   └── bot/          ← Discord bot (planned — move dari repo lama)
├── packages/
│   ├── ui/           ← Shared UI components (planned)
│   ├── types/        ← Shared TypeScript types (planned)
│   └── config/       ← Shared config (eslint, tsconfig)
└── docs/
    └── PLAN.md       ← Koordinasi tim
```

## Tim

| Nama  | Role                         |
|-------|------------------------------|
| Riu   | Owner & Koordinator          |
| Sora  | Core / Full Stack Lead       |
| Bubu  | Front-end Developer          |
| Kaizo | Back-end Developer           |

## Tech Stack (apps/web)

- **Framework**: Next.js 16 App Router · React 19 · TypeScript strict
- **Styling**: Tailwind CSS 4 · Glassmorphism design system
- **UI**: Radix UI primitives (shadcn pattern)
- **Auth & DB**: Supabase (Auth + PostgreSQL + RLS + Storage)
- **Deployment**: Vercel

## Development

```bash
# Install dependencies (dari root)
pnpm install

# Jalankan web app
pnpm dev

# Build semua
pnpm build
```

## Git Pattern

```bash
git add -A -- ':!.github/workflows/ci.yml'
git commit -m "feat(ui): deskripsi singkat"
git push origin master
```

---

*空 · Langitku · Est. 2023*
