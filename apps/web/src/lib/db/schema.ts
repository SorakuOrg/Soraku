// Drizzle schema — schema soraku
// Semua kolom lowercase tanpa underscore (sesuai konvensi DB soraku)
// Tambah tabel di sini sesuai kebutuhan

import { pgSchema, uuid, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const soraku = pgSchema('soraku')

export const users = soraku.table('users', {
  id:              uuid('id').primaryKey(),
  username:        text('username'),
  displayname:     text('displayname'),
  avatarurl:       text('avatarurl'),
  bio:             text('bio'),
  coverurl:        text('coverurl'),
  role:            text('role').notNull().default('USER'),
  supporterrole:   text('supporterrole'),
  supportersince:  timestamp('supportersince', { withTimezone: true }),
  supporteruntil:  timestamp('supporteruntil', { withTimezone: true }),
  supportersource: text('supportersource'),
  sociallinks:     jsonb('sociallinks').default({}),
  isprivate:       boolean('isprivate').default(false),
  isbanned:        boolean('isbanned').default(false),
  createdat:       timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedat:       timestamp('updatedat', { withTimezone: true }).defaultNow(),
})
