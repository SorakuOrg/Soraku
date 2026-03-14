import {
  SlashCommandBuilder, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js"

const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

export const aboutCommand = {
  data: new SlashCommandBuilder().setName("about").setDescription("Info lengkap Soraku Community + stats server 🌸"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    const guild  = interaction.guild!
    await guild.members.fetch().catch(() => {})
    const total  = guild.memberCount
    const online = guild.members.cache.filter(m => m.presence?.status !== "offline" && !m.user.bot).size

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setAuthor({ name: "Soraku Community", iconURL: interaction.client.user.displayAvatarURL(), url: WEB_URL })
      .setTitle("🌸 Soraku Community")
      .setDescription("Komunitas **anime, manga, VTuber & budaya Jepang** Indonesia.\nTempat belajar, berkreasi, dan berkembang bersama~")
      .setThumbnail(guild.iconURL() ?? interaction.client.user.displayAvatarURL())
      .addFields(
        { name: "👥 Member",  value: `${total.toLocaleString("id-ID")}`,  inline: true },
        { name: "🟢 Online",  value: `${online.toLocaleString("id-ID")}`, inline: true },
        { name: "🌐 Website", value: `[soraku.id](${WEB_URL})`,           inline: true },
        { name: "📡 Ping",    value: `${interaction.client.ws.ping}ms`,   inline: true },
        { name: "🏠 Server",  value: `${interaction.client.guilds.cache.size} server`, inline: true },
        { name: "👑 Owner",   value: "Riu",                               inline: true },
      )
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(WEB_URL),
      new ButtonBuilder().setLabel("Discord").setEmoji("💬").setStyle(ButtonStyle.Link).setURL("https://discord.gg/qm3XJvRa6B"),
      new ButtonBuilder().setLabel("Daftar").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/register`),
    )

    await interaction.editReply({ embeds: [embed], components: [row] })
  },
}
