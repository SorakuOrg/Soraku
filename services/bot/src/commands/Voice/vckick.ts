import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"vckick",category:"Voice",description:"Kick user dari voice channel",usage:"vckick @user",
  execute:async(message:any,_:any,client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.MoveMembers))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Move Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t?.voice.channel)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" User tidak di voice channel.").setFooter({text:"Soraku Community"})]})
    await t.voice.disconnect()
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" **"+t.user.username+"** dikick dari VC.").setFooter({text:"Soraku Community"})]})
  }
}