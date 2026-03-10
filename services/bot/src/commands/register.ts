import {
  REST,
  Routes,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  Collection,
} from "discord.js";

// ─── Command definitions ───────────────────────────────────────────────────────

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Cek apakah bot Soraku aktif"),
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply({
      content: `🏓 Pong! Latency: **${latency}ms** · Bot Soraku aktif 空`,
      ephemeral: true,
    });
  },
};

const memberCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("member")
    .setDescription("Lihat jumlah member komunitas Soraku"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const res  = await fetch(`${process.env.SORAKU_API_URL}/api/discord/stats`);
      const data = await res.json() as { memberCount: number; onlineCount: number };
      await interaction.editReply(
        `👥 **Member Soraku**\n` +
        `Total: **${data.memberCount.toLocaleString("id-ID")}** member\n` +
        `Online: **${data.onlineCount.toLocaleString("id-ID")}** member`
      );
    } catch {
      await interaction.editReply("Gagal mengambil data member.");
    }
  },
};

const eventCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Lihat event Soraku yang akan datang"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const res  = await fetch(`${process.env.SORAKU_API_URL}/api/events?status=upcoming`);
      const data = await res.json() as { data: Array<{ title: string; starts_at: string; slug: string }> };
      const events = data.data?.slice(0, 5) ?? [];

      if (!events.length) {
        await interaction.editReply("Tidak ada event yang akan datang saat ini.");
        return;
      }

      const list = events
        .map((e, i) => {
          const date = new Date(e.starts_at).toLocaleString("id-ID", {
            dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
          });
          return `${i + 1}. **${e.title}** — ${date} WIB\n   🔗 ${process.env.SORAKU_API_URL}/events/${e.slug}`;
        })
        .join("\n\n");

      await interaction.editReply(`📅 **Event Soraku yang Akan Datang**\n\n${list}`);
    } catch {
      await interaction.editReply("Gagal mengambil data event.");
    }
  },
};

// ─── Registry ──────────────────────────────────────────────────────────────────

export const commands = new Collection<string, Command>();
commands.set(pingCommand.data.name, pingCommand);
commands.set(memberCommand.data.name, memberCommand);
commands.set(eventCommand.data.name, eventCommand);

// ─── Register ke Discord API ───────────────────────────────────────────────────

export async function registerCommands() {
  const token   = process.env.DISCORD_TOKEN!;
  const guildId = process.env.DISCORD_GUILD_ID!;

  const rest = new REST({ version: "10" }).setToken(token);

  // Ambil client ID dari token
  const tokenParts = token.split(".");
  const clientId   = Buffer.from(tokenParts[0], "base64").toString("utf-8");

  const body = [...commands.values()].map((c) => c.data.toJSON());

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    console.log(`[bot] ✅ ${body.length} slash commands registered`);
  } catch (err) {
    console.error("[bot] Failed to register commands:", err);
  }
}
