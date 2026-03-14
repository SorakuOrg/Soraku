const { PermissionFlagsBits } = require("discord.js")
module.exports = {
  name:"lock",category:"Moderation",description:"Kunci channel",usage:"lock [#channel]",
  execute:async(message,_,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageChannels))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Channels**.").setFooter({text:"Soraku Community"})]})
    const ch=message.mentions.channels.first()??message.channel
    await ch.permissionOverwrites.edit(message.guild.roles.everyone,{SendMessages:false})
    message.reply({embeds:[client.embed().setDescription("🔒 "+ch+" berhasil dikunci.").setFooter({text:"Soraku Community"})]})
  }
}