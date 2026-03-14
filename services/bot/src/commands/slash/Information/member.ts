import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from "discord.js"

export const slashMemberCommand = {
  data: new SlashCommandBuilder().setName("member").setDescription("Lihat jumlah member server 👥"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    const guild  = interaction.guild!
    await guild.members.fetch()
    const total  = guild.memberCount
    const bots   = guild.members.cache.filter(m => m.user.bot).size
    const humans = total - bots
    const online = guild.members.cache.filter(m => m.presence?.status !== "offline" && !m.user.bot).size

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed).setTitle(`👥 Member — ${guild.name}`)
      .addFields(
        { name: "🧑 Manusia",  value: `${humans.toLocaleString("id-ID")}`,  inline: true },
        { name: "🟢 Online",   value: `${online.toLocaleString("id-ID")}`,  inline: true },
        { name: "🤖 Bot",      value: `${bots.toLocaleString("id-ID")}`,    inline: true },
        { name: "📊 Total",    value: `${total.toLocaleString("id-ID")}`,   inline: true },
      )
      .setThumbnail(guild.iconURL())
      .setFooter({ text: "Soraku Community" }).setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  },
}
