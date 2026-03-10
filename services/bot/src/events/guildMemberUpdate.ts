import type { GuildMember } from "discord.js";

/**
 * Dipanggil setiap kali role member Discord berubah.
 * Kirim ke web API untuk sync supporter_tier di DB.
 */
export async function syncRoleOnUpdate(oldMember: GuildMember, newMember: GuildMember) {
  // Hanya proses jika roles berubah
  const oldRoles = [...oldMember.roles.cache.keys()];
  const newRoles = [...newMember.roles.cache.keys()];
  const changed =
    oldRoles.length !== newRoles.length ||
    newRoles.some((r) => !oldRoles.includes(r));

  if (!changed) return;

  try {
    const res = await fetch(`${process.env.SORAKU_API_URL}/api/discord/role-sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-soraku-secret": process.env.SORAKU_API_SECRET!,
      },
      body: JSON.stringify({
        discordId:    newMember.user.id,
        discordRoles: newRoles,
      }),
    });

    const data = await res.json() as { synced: boolean; tier: string | null };
    if (data.synced) {
      console.log(`[bot] role-sync: ${newMember.user.tag} → tier: ${data.tier ?? "none"}`);
    }
  } catch (err) {
    console.error("[bot] role-sync error:", err);
  }
}
