import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"unlock",category:"Moderation",description:"Buka kunci channel",usage:"unlock [#channel]",
  execute:async(message:any,_:any,client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Channels**.").setFooter({text:"Soraku Community"})]})
    const ch=message.mentions.channels.first()??message.channel
    await ch.permissionOverwrites.edit(message.guild.roles.everyone,{SendMessages:null})
    message.reply({embeds:[client.embed().setDescription("🔓 "+ch+" berhasil dibuka.").setFooter({text:"Soraku Community"})]})
  }
}