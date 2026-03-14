import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from "discord.js"

module.exports = {
  name: "help", aliases: ["h", "cmds"], category: "Information",
  description: "Daftar semua command SorakuBot", usage: "help",
  execute: async (message: any, _args: any, client: any, prefix: string) => {
    const cats: Record<string, any[]> = {}
    for (const cmd of client.commands.values()) {
      if (!cats[cmd.category]) cats[cmd.category] = []
      if (!cats[cmd.category].find((c: any) => c.name === cmd.name)) cats[cmd.category].push(cmd)
    }

    const COLOR: Record<string, number> = {
      Information: 0x7c3aed, Moderation: 0xef4444, Antinuke: 0xf97316,
      Automod: 0x3b82f6, Config: 0x22c55e, Music: 0xec4899,
      Playlist: 0xa855f7, Utility: 0xf59e0b, Role: 0x6366f1,
      Voice: 0x0ea5e9, Welcome: 0x84cc16, Extra: 0x14b8a6,
      Owner: 0xfbbf24, Profile: 0x8b5cf6,
    }

    const overview = client.embed()
      .setTitle("🤖 SorakuBot — Help")
      .setDescription(`Prefix: \`${prefix}\` — Pilih kategori di dropdown\nTotal: **${client.commands.size}** prefix · **${client.slashCommands.size}** slash`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    for (const [cat, cmds] of Object.entries(cats)) {
      overview.addFields({ name: `${getCatEmoji(cat)} ${cat}`, value: cmds.map((c: any) => `\`${c.name}\``).join(" "), inline: false })
    }

    const buildMenu = (selected?: string) => {
      const menu = new StringSelectMenuBuilder().setCustomId("help_select").setPlaceholder("✨ Pilih kategori...")
      for (const [cat, cmds] of Object.entries(cats)) {
        const opt = new StringSelectMenuOptionBuilder()
          .setValue(cat).setLabel(cat).setEmoji(getCatEmoji(cat))
          .setDescription(`${cmds.length} command`)
        if (cat === selected) opt.setDefault(true)
        menu.addOptions(opt)
      }
      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
    }

    const reply = await message.reply({ embeds: [overview], components: [buildMenu()] })
    const col = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, time: 5 * 60 * 1000,
      filter: (i: any) => i.customId === "help_select" && i.user.id === message.author.id,
    })
    col.on("collect", async (i: any) => {
      const cat  = i.values[0]
      const cmds = cats[cat] ?? []
      const embed = client.embed()
        .setColor(COLOR[cat] ?? 0x7c3aed)
        .setTitle(`${getCatEmoji(cat)} ${cat}`)
        .setDescription(cmds.map((c: any) => `\`${prefix}${c.name}\` — ${c.description}`).join("\n"))
        .setFooter({ text: "Soraku Community" }).setTimestamp()
      await i.update({ embeds: [embed], components: [buildMenu(cat)] })
    })
    col.on("end", async () => {
      const d = new StringSelectMenuBuilder().setCustomId("x").setDisabled(true)
        .setPlaceholder("⏱️ Sesi berakhir").addOptions(new StringSelectMenuOptionBuilder().setValue("x").setLabel("x"))
      await reply.edit({ components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(d)] }).catch(() => {})
    })
  },
}

function getCatEmoji(cat: string): string {
  const map: Record<string, string> = {
    Information: "📋", Moderation: "🛡️", Antinuke: "🔒", Automod: "🤖",
    Config: "⚙️", Music: "🎵", Playlist: "📀", Utility: "🔧",
    Role: "🎭", Voice: "🔊", Welcome: "👋", Extra: "✨",
    Owner: "👑", Profile: "👤",
  }
  return map[cat] ?? "📌"
}
