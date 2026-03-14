const { PermissionFlagsBits } = require("discord.js")
module.exports = {
  name:"mute",aliases:["timeout","to"],category:"Moderation",description:"Timeout member",usage:"mute @user [menit] [alasan]",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Moderate Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan user-nya!").setFooter({text:"Soraku Community"})]})
    const mins=parseInt(args[1])||10
    const reason=args.slice(2).join(" ")||"Tidak ada alasan"
    await t.timeout(mins*60*1000,reason)
    message.reply({embeds:[client.embed().setTitle("🔇 Member Dimute").addFields({name:"👤 User",value:t.user.tag,inline:true},{name:"⏱️",value:mins+"m",inline:true},{name:"📋 Alasan",value:reason}).setFooter({text:"Soraku Community"}).setTimestamp()]})
  }
}