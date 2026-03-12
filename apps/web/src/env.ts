/**
 * env.ts — Soraku Community
 * Type-safe environment variable management via T3 Env + Zod.
 *
 * Import: import { env } from '@/env'
 *
 * ▸ Server vars : DATABASE_URL, SUPABASE_SERVICE_ROLE_KEY, XENDIT_SECRET_KEY,
 *                 TRAKTEER_WEBHOOK_SECRET  (+ extras: bot, discord)
 * ▸ Client vars : NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL,
 *                 NEXT_PUBLIC_SUPABASE_ANON_KEY  (+ extras: app url, discord)
 *
 * System throws at build-time if required vars are missing or invalid.
 * Server vars are NEVER accessible in browser bundles.
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  // ─── SERVER — never exposed to browser ──────────────────────────────────────
  server: {
    // Drizzle ORM — PostgreSQL connection string (Supabase Transaction Pooler)
    // Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    DATABASE_URL: z.string().url('DATABASE_URL harus berupa URL PostgreSQL yang valid'),

    // Supabase service role key — bypass RLS, server-only
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY wajib diisi'),

    // Xendit payment gateway — opsional (aktifkan saat fitur pembayaran live)
    XENDIT_SECRET_KEY: z.string().min(1).optional(),

    // Trakteer donation webhook secret
    TRAKTEER_WEBHOOK_SECRET: z.string().min(1).optional(),

    // ── Internal (bot, discord, legacy) ──────────────────────────────────────
    SORAKU_API_SECRET:      z.string().min(1).optional(),
    BOT_WEBHOOK_URL:        z.string().url().optional(),
    BOT_WEBHOOK_SECRET:     z.string().min(1).optional(),
    XENDIT_WEBHOOK_TOKEN:   z.string().optional(),
    OWNER_DISCORD_IDS:      z.string().optional(),
    DISCORD_INVITE_CODE:    z.string().optional(),

    // Legacy alias — masih disupport sebagai fallback
    SUPABASE_SERVICE_KEY:   z.string().optional(),
  },

  // ─── CLIENT — safe to expose to browser ─────────────────────────────────────
  client: {
    // Supabase project URL
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url('NEXT_PUBLIC_SUPABASE_URL harus berupa URL yang valid'),

    // Supabase anon key — aman untuk client (RLS masih berlaku)
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string()
      .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi'),

    // URL publik aplikasi — dipakai untuk redirect, sitemap, OpenGraph
    NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL harus berupa URL yang valid'),

    // ── Internal client vars ──────────────────────────────────────────────────
    NEXT_PUBLIC_APP_URL:         z.string().url().optional(),
    NEXT_PUBLIC_DISCORD_INVITE:  z.string().optional(),
  },

  // ─── Runtime mapping — explicitly map process.env → typed env ───────────────
  runtimeEnv: {
    // Server
    DATABASE_URL:               process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY:  process.env.SUPABASE_SERVICE_ROLE_KEY,
    XENDIT_SECRET_KEY:          process.env.XENDIT_SECRET_KEY,
    TRAKTEER_WEBHOOK_SECRET:    process.env.TRAKTEER_WEBHOOK_SECRET,
    SORAKU_API_SECRET:          process.env.SORAKU_API_SECRET,
    BOT_WEBHOOK_URL:            process.env.BOT_WEBHOOK_URL,
    BOT_WEBHOOK_SECRET:         process.env.BOT_WEBHOOK_SECRET,
    XENDIT_WEBHOOK_TOKEN:       process.env.XENDIT_WEBHOOK_TOKEN,
    OWNER_DISCORD_IDS:          process.env.OWNER_DISCORD_IDS,
    DISCORD_INVITE_CODE:        process.env.DISCORD_INVITE_CODE,
    SUPABASE_SERVICE_KEY:       process.env.SUPABASE_SERVICE_KEY,

    // Client
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL:           process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DISCORD_INVITE:    process.env.NEXT_PUBLIC_DISCORD_INVITE,
  },

  /**
   * Nonaktifkan validasi di mode development jika ENV belum lengkap.
   * Set SKIP_ENV_VALIDATION=true di .env.local untuk skip saat lokal dev.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Membuat server vars benar-benar tidak bisa diakses di browser.
   * Next.js akan throw error jika server var diakses di client bundle.
   */
  emptyStringAsUndefined: true,
})
