import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL:              z.string().url(),
    SUPABASE_URL:              z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SORAKU_API_SECRET:         z.string().min(32),
    XENDIT_SECRET_KEY:         z.string().optional(),
    TRAKTEER_WEBHOOK_TOKEN:    z.string().optional(),
    NODE_ENV:                  z.enum(["development", "production", "test"]).default("development"),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL:              process.env.DATABASE_URL,
    SUPABASE_URL:              process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SORAKU_API_SECRET:         process.env.SORAKU_API_SECRET,
    XENDIT_SECRET_KEY:         process.env.XENDIT_SECRET_KEY,
    TRAKTEER_WEBHOOK_TOKEN:    process.env.TRAKTEER_WEBHOOK_TOKEN,
    NODE_ENV:                  process.env.NODE_ENV,
  },
})
