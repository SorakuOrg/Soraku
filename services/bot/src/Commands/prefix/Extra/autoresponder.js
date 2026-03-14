const { PermissionFlagsBits } = require("discord.js")
const { Autorespond } = require("../../../Schema/db")
module.exports = {
  name:"autoresponder",aliases:["ar"],category:"Extra",description:"Kelola auto-responder trigger",usage:"autoresponder <add|remove|list> [trigger] [response]",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Server**.").setFooter({text:"Soraku Community"})]})
    const opt=args[0]?.toLowerCase()
    if(opt==="list"){
      const all=await Autorespond.getAll(message.guild.id)
      if(!all.length)return message.reply({embeds:[client.embed().setDescription("Belum ada autoresponder.").setFooter({text:"Soraku Community"})]})
      return message.reply({embeds:[client.embed().setTitle("📝 Autoresponder").setDescription(all.map((r,i)=>"`"+(i+1)+"`. `"+r.trigger+"` → "+r.response).join("
")).setFooter({text:"Soraku Community"})]})
    }
    if(opt==="add"){
      if(!args[1]||!args[2])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Format: `!ar add <trigger> <response>`").setFooter({text:"Soraku Community"})]})
      await Autorespond.add(message.guild.id,args[1],args.slice(2).join(" "))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Autoresponder `"+args[1]+"` ditambahkan.").setFooter({text:"Soraku Community"})]})
    }
    if(opt==="remove"){
      if(!args[1])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan trigger-nya.").setFooter({text:"Soraku Community"})]})
      await Autorespond.remove(message.guild.id,args[1])
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Autoresponder `"+args[1]+"` dihapus.").setFooter({text:"Soraku Community"})]})
    }
  }
}