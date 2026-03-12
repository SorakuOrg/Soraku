import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SORAKU_API_SECRET:         z.string().min(1).optional(),
    BOT_WEBHOOK_URL:           z.string().url().optional(),
    BOT_WEBHOOK_SECRET:        z.string().min(1).optional(),
    XENDIT_SECRET_KEY:         z.string().optional(),
    XENDIT_WEBHOOK_TOKEN:      z.string().optional(),
    TRAKTEER_WEBHOOK_TOKEN:    z.string().optional(),
    OWNER_DISCORD_IDS:         z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL:          z.string().url(),
    NEXT_PUBLIC_APP_URL:           z.string().url(),
    NEXT_PUBLIC_DISCORD_INVITE:    z.string().optional(),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY,
    SORAKU_API_SECRET:             process.env.SORAKU_API_SECRET,
    BOT_WEBHOOK_URL:               process.env.BOT_WEBHOOK_URL,
    BOT_WEBHOOK_SECRET:            process.env.BOT_WEBHOOK_SECRET,
    XENDIT_SECRET_KEY:             process.env.XENDIT_SECRET_KEY,
    XENDIT_WEBHOOK_TOKEN:          process.env.XENDIT_WEBHOOK_TOKEN,
    TRAKTEER_WEBHOOK_TOKEN:        process.env.TRAKTEER_WEBHOOK_TOKEN,
    OWNER_DISCORD_IDS:             process.env.OWNER_DISCORD_IDS,
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL:           process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DISCORD_INVITE:    process.env.NEXT_PUBLIC_DISCORD_INVITE,
  },
})
