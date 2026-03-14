const { PermissionFlagsBits } = require("discord.js")
module.exports = {
  name:"unmute",aliases:["untimeout"],category:"Moderation",description:"Hapus timeout member",usage:"unmute @user",
  execute:async(message,_args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Moderate Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan user-nya!").setFooter({text:"Soraku Community"})]})
    await t.timeout(null)
    message.reply({embeds:[client.embed().setTitle("🔊 Timeout Dihapus").addFields({name:"👤 User",value:t.user.tag,inline:true}).setFooter({text:"Soraku Community"}).setTimestamp()]})
  }
}