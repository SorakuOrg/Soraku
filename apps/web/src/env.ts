/**
 * env.ts — Soraku Community
 * Type-safe environment variable management via T3 Env + Zod.
 *
 * Import: import { env } from '@/env'
 *
 * ▸ Server : DATABASE_URL, SUPABASE_SERVICE_ROLE_KEY, XENDIT_SECRET_KEY,
 *            TRAKTEER_WEBHOOK_SECRET, SORAKU_API_SECRET, BOT_*, API_URL
 * ▸ Client : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *            NEXT_PUBLIC_SITE_URL
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Drizzle ORM — Supabase Transaction Pooler (port 6543)
    // Format: postgresql://postgres.[ref]:[password]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
    DATABASE_URL: z.string().url().optional(),

    // Supabase — server only
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SUPABASE_SERVICE_KEY:      z.string().optional(), // legacy alias

    // Payment
    XENDIT_SECRET_KEY:       z.string().min(1).optional(),
    XENDIT_WEBHOOK_TOKEN:    z.string().optional(),
    TRAKTEER_WEBHOOK_SECRET: z.string().min(1).optional(),

    // Central API (services/api) — URL untuk koneksi ke services/api
    // Dev: http://localhost:4000 | Prod: https://soraku-api.vercel.app
    API_URL: z.string().url().default('http://localhost:4000'),

    // Bot + internal
    SORAKU_API_SECRET:   z.string().min(1).optional(),
    BOT_WEBHOOK_URL:     z.string().url().optional(),
    BOT_WEBHOOK_SECRET:  z.string().min(1).optional(),
    OWNER_DISCORD_IDS:   z.string().optional(),
    DISCORD_INVITE_CODE: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL:          z.string().url(),
    NEXT_PUBLIC_APP_URL:           z.string().url().optional(),
    NEXT_PUBLIC_DISCORD_INVITE:    z.string().optional(),
  },

  runtimeEnv: {
    DATABASE_URL:               process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY:  process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SERVICE_KEY:       process.env.SUPABASE_SERVICE_KEY,
    XENDIT_SECRET_KEY:          process.env.XENDIT_SECRET_KEY,
    XENDIT_WEBHOOK_TOKEN:       process.env.XENDIT_WEBHOOK_TOKEN,
    TRAKTEER_WEBHOOK_SECRET:    process.env.TRAKTEER_WEBHOOK_SECRET,
    API_URL:                    process.env.API_URL,
    SORAKU_API_SECRET:          process.env.SORAKU_API_SECRET,
    BOT_WEBHOOK_URL:            process.env.BOT_WEBHOOK_URL,
    BOT_WEBHOOK_SECRET:         process.env.BOT_WEBHOOK_SECRET,
    OWNER_DISCORD_IDS:          process.env.OWNER_DISCORD_IDS,
    DISCORD_INVITE_CODE:        process.env.DISCORD_INVITE_CODE,

    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL:           process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DISCORD_INVITE:    process.env.NEXT_PUBLIC_DISCORD_INVITE,
  },

  skipValidation:         !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
