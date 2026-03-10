// GET  /api/notifications  — list notif user (polling 30s dari client)
// PATCH /api/notifications — mark as read
//
// TODO Kaizo — buat tabel di Supabase:
// ─────────────────────────────────────────────────────────────
// CREATE TABLE notifications (
//   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
//   type       TEXT NOT NULL CHECK (type IN ('event','blog','gallery','badge','mention','system','premium')),
//   title      TEXT NOT NULL,
//   body       TEXT NOT NULL,
//   href       TEXT,
//   read       BOOLEAN DEFAULT false,
//   created_at TIMESTAMPTZ DEFAULT now()
// );
// ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "user_own" ON notifications USING (auth.uid() = user_id);
// CREATE INDEX ON notifications(user_id, read, created_at DESC);
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS } from "@/lib/notifications";

export async function GET() {
  // TODO Kaizo: ganti dengan query Supabase untuk user yang sedang login
  return NextResponse.json(
    { data: MOCK_NOTIFICATIONS, error: null },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  // TODO Kaizo: UPDATE notifications SET read=true WHERE user_id=... AND id IN (ids)
  return NextResponse.json({ data: body, error: null });
}
