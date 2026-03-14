import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from "discord.js"

const API_URL = process.env.SORAKU_API_URL ?? process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

export const slashEventCommand = {
  data: new SlashCommandBuilder().setName("event").setDescription("Event Soraku yang akan datang 🎌"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    let events: Array<{ title: string; startdate: string; slug: string; description?: string }> = []
    try {
      const res  = await fetch(`${API_URL}/api/events?status=online&limit=5`, {
        headers: { "x-soraku-secret": process.env.SORAKU_API_SECRET ?? "" },
      })
      const json = await res.json() as { data: typeof events }
      events = json.data ?? []
    } catch {
      events = []
    }

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setAuthor({ name: "Soraku Community — Events", url: `${WEB_URL}/events` })
      .setTitle("🎌 Event yang Akan Datang")
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    if (!events.length) {
      embed.setDescription("Belum ada event mendatang. Pantau terus ya~")
    } else {
      for (const ev of events) {
        const date = new Date(ev.startdate)
        embed.addFields({
          name:  ev.title,
          value: `📅 <t:${Math.floor(date.getTime() / 1000)}:F>\n🔗 [Detail](${WEB_URL}/events/${ev.slug})`,
          inline: false,
        })
      }
    }

    await interaction.editReply({ embeds: [embed] })
  },
}
