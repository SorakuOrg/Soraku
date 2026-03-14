import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"kick",aliases:["k"],category:"Moderation",description:"Kick member dari server",usage:"kick @user [alasan]",
  execute:async(message:any,args:string[],client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.KickMembers))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Kick Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t||!t.kickable)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" User tidak valid.").setFooter({text:"Soraku Community"})]})
    const reason=args.slice(1).join(" ")||"Tidak ada alasan"
    await t.kick(reason)
    message.reply({embeds:[client.embed().setTitle("👢 Member Dikick").addFields({name:"👤 User",value:t.user.tag,inline:true},{name:"📋 Alasan",value:reason}).setFooter({text:"Soraku Community"}).setTimestamp()]})
  }
}