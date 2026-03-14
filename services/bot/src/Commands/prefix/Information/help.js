const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js")

const CAT_COLOR = {
  Information: 0x7c3aed, Moderation: 0xef4444, Antinuke: 0xf97316,
  Automod: 0x3b82f6, Config: 0x22c55e, Music: 0xec4899,
  Playlist: 0xa855f7, Utility: 0xf59e0b, Role: 0x6366f1,
  Voice: 0x0ea5e9, Welcome: 0x84cc16, Extra: 0x14b8a6,
  Owner: 0xfbbf24, Profile: 0x8b5cf6,
}
const CAT_EMOJI = {
  Information: "📋", Moderation: "🛡️", Antinuke: "🔒", Automod: "🤖",
  Config: "⚙️", Music: "🎵", Playlist: "📀", Utility: "🔧",
  Role: "🎭", Voice: "🔊", Welcome: "👋", Extra: "✨",
  Owner: "👑", Profile: "👤",
}

module.exports = {
  name: "help", aliases: ["h", "cmds"], category: "Information",
  description: "Tampilkan semua command SorakuBot 📖", usage: "help",
  execute: async (message, _args, client, prefix) => {
    const cats = {}
    for (const cmd of client.commands.values()) {
      if (!cats[cmd.category]) cats[cmd.category] = []
      if (!cats[cmd.category].find(c => c.name === cmd.name)) cats[cmd.category].push(cmd)
    }

    const overview = client.embed()
      .setTitle("🤖 SorakuBot — Help")
      .setDescription(`Prefix: \`${prefix}\` — Pilih kategori di dropdown\nTotal: **${client.commands.size}** prefix · **${client.slash.size}** slash`)
      .setThumbnail(client.user.displayAvatarURL())

    for (const [cat, cmds] of Object.entries(cats)) {
      overview.addFields({ name: `${CAT_EMOJI[cat] ?? "📌"} ${cat}`, value: cmds.map(c => `\`${c.name}\``).join(" "), inline: false })
    }
    overview.setFooter({ text: "Soraku Community" }).setTimestamp()

    const buildMenu = (selected) => {
      const menu = new StringSelectMenuBuilder().setCustomId("help_cat").setPlaceholder("✨ Pilih kategori command...")
      for (const [cat, cmds] of Object.entries(cats)) {
        const opt = new StringSelectMenuOptionBuilder()
          .setValue(cat).setLabel(cat)
          .setDescription(`${cmds.length} command`)
          .setEmoji(CAT_EMOJI[cat] ?? "📌")
        if (cat === selected) opt.setDefault(true)
        menu.addOptions(opt)
      }
      return new ActionRowBuilder().addComponents(menu)
    }

    const reply = await message.reply({ embeds: [overview], components: [buildMenu()] })
    const col = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, time: 5 * 60 * 1000,
      filter: i => i.customId === "help_cat" && i.user.id === message.author.id,
    })
    col.on("collect", async i => {
      const cat  = i.values[0]
      const cmds = cats[cat] ?? []
      const embed = client.embed()
        .setColor(CAT_COLOR[cat] ?? 0x7c3aed)
        .setTitle(`${CAT_EMOJI[cat] ?? "📌"} ${cat}`)
        .setDescription(cmds.map(c => `\`${prefix}${c.name}\` — ${c.description}`).join("\n"))
        .setFooter({ text: "Soraku Community" }).setTimestamp()
      await i.update({ embeds: [embed], components: [buildMenu(cat)] })
    })
    col.on("end", async () => {
      const d = new StringSelectMenuBuilder().setCustomId("x").setDisabled(true)
        .setPlaceholder("⏱️ Sesi berakhir — ketik !help lagi")
        .addOptions(new StringSelectMenuOptionBuilder().setValue("x").setLabel("x"))
      await reply.edit({ components: [new ActionRowBuilder().addComponents(d)] }).catch(() => {})
    })
  },
}
