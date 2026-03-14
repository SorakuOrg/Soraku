const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const { convertTime } = require("../../Utils/convert")

function makeRow(paused) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(paused ? "resume" : "pause").setEmoji(paused ? "▶️" : "⏸️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("skip").setEmoji("⏭️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("stop").setEmoji("⏹️").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("loop").setEmoji("🔁").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("shuffle").setEmoji("🔀").setStyle(ButtonStyle.Secondary),
  )
}

module.exports = {
  name: "playerStart",
  run: async (client, player, track) => {
    const channel = client.channels.cache.get(player.textId)
    if (!channel?.send) return

    const embed = new EmbedBuilder().setColor("#7c3aed")
      .setTitle("🎵 Now Playing")
      .setThumbnail(track.thumbnail)
      .setDescription(`[**${track.title.substring(0, 60)}**](${track.uri})`)
      .addFields(
        { name: "⏱️ Duration",  value: "\`" + convertTime(track.length) + "\`", inline: true },
        { name: "👤 Requester", value: String(track.requester), inline: true },
        { name: "🎤 Artist",    value: track.author || "—", inline: true },
      )
      .setFooter({ text: "Soraku Community" }).setTimestamp()

    const msg = await channel.send({ embeds: [embed], components: [makeRow(false)] }).catch(() => null)
    if (!msg) return
    player.data.set("message", msg)

    const col = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: track.length })
    col.on("collect", async (i) => {
      if (i.member.voice.channelId !== player.voiceId)
        return i.reply({ content: "Kamu harus di voice channel yang sama!", ephemeral: true })
      switch (i.customId) {
        case "pause":   player.pause(true);  await i.update({ components: [makeRow(true)] });  break
        case "resume":  player.pause(false); await i.update({ components: [makeRow(false)] }); break
        case "skip":    player.skip(); await i.reply({ content: "⏭️ Skipped.", ephemeral: true }); break
        case "stop":    player.queue.clear(); player.data.delete("autoplay"); player.loop = "none"; await player.skip(); await i.reply({ content: "⏹️ Stopped.", ephemeral: true }); break
        case "loop":    player.setLoop(player.loop === "none" ? "track" : "none"); await i.reply({ content: "🔁 Loop: **" + (player.loop === "none" ? "off" : "on") + "**", ephemeral: true }); break
        case "shuffle": player.queue.shuffle(); await i.reply({ content: "🔀 Queue diacak.", ephemeral: true }); break
      }
    })
  },
}
