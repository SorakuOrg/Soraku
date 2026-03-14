import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"vcunmuteall",category:"Voice",description:"Unmute semua user di VC bot",usage:"vcunmuteall",
  execute:async(message:any,_:any,client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.MuteMembers))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Mute Members**.").setFooter({text:"Soraku Community"})]})
    const vc=message.guild.members.me?.voice.channel
    if(!vc)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Bot tidak di VC.").setFooter({text:"Soraku Community"})]})
    let count=0
    for(const [,m] of vc.members){if(!m.user.bot){await m.voice.setMute(false).catch(()=>{});count++}}
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" **"+count+"** user di-unmute.").setFooter({text:"Soraku Community"})]})
  }
}