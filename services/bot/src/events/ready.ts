import type { Client } from "discord.js";

export function handleReady(client: Client<true>) {
  console.log(`[bot] ✅ Online sebagai ${client.user.tag}`);
  client.user.setActivity("Soraku Community 空", { type: 3 }); // WATCHING
}
