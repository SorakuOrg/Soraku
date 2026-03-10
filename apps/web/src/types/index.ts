// ═══════════════════════════════════════
//  Soraku Community — Core Types
//  v0.0.1 — sync with Kaizo (backend)
// ═══════════════════════════════════════

/** Hirarki role struktural */
export type StructuralRole =
  | "OWNER"
  | "MANAGER"
  | "ADMIN"
  | "AGENSI"
  | "KREATOR"
  | "USER";

/** Role supporter (badge khusus) */
export type SupporterRole = "DONATUR" | "VIP" | "VVIP";

export interface User {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: StructuralRole;
  supporter_role: SupporterRole | null;
  discord_id: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  author: Pick<User, "id" | "username" | "display_name" | "avatar_url">;
  tags: string[];
  published_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  event_type: "online" | "offline" | "hybrid";
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  discord_link: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  tags: string[];
  author: Pick<User, "id" | "username" | "display_name" | "avatar_url">;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: { message: string; code?: string };
}
