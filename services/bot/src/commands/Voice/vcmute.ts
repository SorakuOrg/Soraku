import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"vcmute",category:"Voice",description:"Server mute user di voice",usage:"vcmute @user",
  execute:async(message:any,_:any,client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.MuteMembers))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Mute Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t?.voice.channel)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" User tidak di voice channel.").setFooter({text:"Soraku Community"})]})
    await t.voice.setMute(!t.voice.serverMute)
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" **"+t.user.username+"** "+(t.voice.serverMute?"di-unmute":"di-mute")+" di VC.").setFooter({text:"Soraku Community"})]})
  }
}