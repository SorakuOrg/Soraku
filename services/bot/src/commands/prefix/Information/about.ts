import type { Message, Guild } from "discord.js"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

export default {
  name:        "about",
  aliases:     ["info", "botinfo"],
  description: "Info tentang Soraku Community dan bot ini",
  category:    "Information",
  usage:       "!about",

  async execute(message: Message) {
    const guild = message.guild as Guild
    const bot   = message.client

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setAuthor({ name: "Soraku Community", iconURL: bot.user.displayAvatarURL(), url: WEB_URL })
      .setTitle("🌸 Tentang SorakuBot")
      .setDescription(
        "Bot resmi komunitas **Soraku** — tempat nongkrong para pecinta anime, manga, VTuber, dan budaya Jepang Indonesia."
      )
      .addFields(
        { name: "👥 Member",    value: `${guild.memberCount.toLocaleString("id-ID")}`, inline: true },
        { name: "🤖 Bot",       value: `${bot.user.tag}`,                              inline: true },
        { name: "🌐 Website",   value: `[soraku.id](${WEB_URL})`,                      inline: true },
        { name: "📡 Ping",      value: `${bot.ws.ping}ms`,                             inline: true },
        { name: "🏠 Server",    value: `${bot.guilds.cache.size} server`,              inline: true },
        { name: "📅 Platform",  value: "Discord.js v14",                               inline: true },
      )
      .setThumbnail(bot.user.displayAvatarURL())
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(WEB_URL),
      new ButtonBuilder().setLabel("Discord").setEmoji("💬").setStyle(ButtonStyle.Link).setURL("https://discord.gg/qm3XJvRa6B"),
    )

    await message.reply({ embeds: [embed], components: [row] })
  },
}
