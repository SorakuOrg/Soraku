const { supabase } = require("../../Schema/db")

module.exports = {
  name: "messageDelete",
  run: async (_client, message) => {
    if (message.author?.bot || !message.content) return
    await supabase.schema("bot").from("bot_snipe").upsert({
      channel_id:    message.channelId,
      content:       message.content.slice(0, 2000),
      author_tag:    message.author.tag,
      author_avatar: message.author.displayAvatarURL(),
      deleted_at:    new Date().toISOString(),
    }, { onConflict: "channel_id" }).catch(() => {})
  },
}
