import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"lock",category:"Moderation",description:"Kunci channel agar tidak bisa kirim pesan",usage:"lock [#channel]",
  execute:async(message:any,_:any,client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Channels**.").setFooter({text:"Soraku Community"})]})
    const ch=message.mentions.channels.first()??message.channel
    await ch.permissionOverwrites.edit(message.guild.roles.everyone,{SendMessages:false})
    message.reply({embeds:[client.embed().setDescription("🔒 "+ch+" berhasil dikunci.").setFooter({text:"Soraku Community"})]})
  }
}