// GET /api/partnerships — daftar partner Soraku
// TODO Kaizo: buat tabel partnerships di Supabase
//
// CREATE TABLE partnerships (
//   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name       TEXT NOT NULL,
//   logo_url   TEXT NOT NULL,
//   website    TEXT,
//   category   TEXT DEFAULT 'partner',
//   active     BOOLEAN DEFAULT true,
//   sort_order INT  DEFAULT 0,
//   created_at TIMESTAMPTZ DEFAULT now()
// );
// → Dikelola di admin panel (manual post)

import { NextResponse } from "next/server";

// Mock data — nanti diisi admin panel
const MOCK_PARTNERSHIPS = [
  { id: "1", name: "AniID",       logo: "🎌", category: "media",     website: "#" },
  { id: "2", name: "CosplayID",   logo: "👘", category: "komunitas", website: "#" },
  { id: "3", name: "MangaFest",   logo: "📚", category: "event",     website: "#" },
  { id: "4", name: "J-Music ID",  logo: "🎵", category: "media",     website: "#" },
  { id: "5", name: "VTuber Fan",  logo: "🎭", category: "komunitas", website: "#" },
  { id: "6", name: "GamersID",    logo: "🎮", category: "komunitas", website: "#" },
  { id: "7", name: "OtakuStore",  logo: "🛍️", category: "sponsor",   website: "#" },
  { id: "8", name: "AnimeConf",   logo: "🏟️", category: "event",     website: "#" },
];

export async function GET() {
  // TODO Kaizo: query Supabase WHERE active = true ORDER BY sort_order ASC
  return NextResponse.json({ data: MOCK_PARTNERSHIPS, error: null });
}
