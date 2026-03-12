/**
 * env.ts — Soraku Community
 * Type-safe environment variable management via T3 Env + Zod.
 *
 * Import: import { env } from '@/env'
 *
 * ▸ Server vars : SUPABASE_SERVICE_ROLE_KEY, XENDIT_SECRET_KEY,
 *                 TRAKTEER_WEBHOOK_SECRET  (+ extras: bot, discord)
 * ▸ Client vars : NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL,
 *                 NEXT_PUBLIC_SUPABASE_ANON_KEY  (+ extras: app url, discord)
 *
 * NOTE: DATABASE_URL tidak dipakai — platform menggunakan Supabase JS client
 * (adminDb / createClient) bukan Drizzle secara aktif. Tambahkan kembali
 * DATABASE_URL ke sini jika Drizzle diaktifkan di masa mendatang.
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  // ─── SERVER — never exposed to browser ──────────────────────────────────────
  server: {
    // Supabase service role key — bypass RLS, server-only
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Xendit — opsional, aktifkan saat fitur pembayaran live
    XENDIT_SECRET_KEY:       z.string().min(1).optional(),
    XENDIT_WEBHOOK_TOKEN:    z.string().optional(),

    // Trakteer donation webhook
    TRAKTEER_WEBHOOK_SECRET: z.string().min(1).optional(),

    // Bot + internal
    SORAKU_API_SECRET:    z.string().min(1).optional(),
    BOT_WEBHOOK_URL:      z.string().url().optional(),
    BOT_WEBHOOK_SECRET:   z.string().min(1).optional(),
    OWNER_DISCORD_IDS:    z.string().optional(),
    DISCORD_INVITE_CODE:  z.string().optional(),

    // Legacy alias
    SUPABASE_SERVICE_KEY: z.string().optional(),
  },

  // ─── CLIENT — safe to expose to browser ─────────────────────────────────────
  client: {
    NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL:          z.string().url(),
    NEXT_PUBLIC_APP_URL:           z.string().url().optional(),
    NEXT_PUBLIC_DISCORD_INVITE:    z.string().optional(),
  },

  // ─── Runtime mapping ─────────────────────────────────────────────────────────
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY:  process.env.SUPABASE_SERVICE_ROLE_KEY,
    XENDIT_SECRET_KEY:          process.env.XENDIT_SECRET_KEY,
    XENDIT_WEBHOOK_TOKEN:       process.env.XENDIT_WEBHOOK_TOKEN,
    TRAKTEER_WEBHOOK_SECRET:    process.env.TRAKTEER_WEBHOOK_SECRET,
    SORAKU_API_SECRET:          process.env.SORAKU_API_SECRET,
    BOT_WEBHOOK_URL:            process.env.BOT_WEBHOOK_URL,
    BOT_WEBHOOK_SECRET:         process.env.BOT_WEBHOOK_SECRET,
    OWNER_DISCORD_IDS:          process.env.OWNER_DISCORD_IDS,
    DISCORD_INVITE_CODE:        process.env.DISCORD_INVITE_CODE,
    SUPABASE_SERVICE_KEY:       process.env.SUPABASE_SERVICE_KEY,

    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL:           process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DISCORD_INVITE:    process.env.NEXT_PUBLIC_DISCORD_INVITE,
  },

  skipValidation:        !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
