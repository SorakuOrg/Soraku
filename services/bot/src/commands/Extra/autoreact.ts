import { PermissionFlagsBits } from "discord.js"
import { Autoreact } from "../../schema/db"
module.exports = {
  name:"autoreact",aliases:["react"],category:"Extra",description:"Tambah/hapus auto-react pada keyword",usage:"autoreact <add|remove|list> [keyword] [emoji]",
  execute:async(message:any,args:string[],client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Server**.").setFooter({text:"Soraku Community"})]})
    const opt=args[0]?.toLowerCase()
    if(opt==="list"){
      const all=await Autoreact.getAll(message.guild.id) as any[]
      if(!all.length)return message.reply({embeds:[client.embed().setDescription("Belum ada autoreact.").setFooter({text:"Soraku Community"})]})
      return message.reply({embeds:[client.embed().setTitle("✨ Autoreact").setDescription(all.map((r:any,i:number)=>"`"+(i+1)+"`. `"+r.keyword+"` → "+r.emoji).join("\n")).setFooter({text:"Soraku Community"})]})
    }
    if(opt==="add"){
      if(!args[1]||!args[2])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Format: `!autoreact add <keyword> <emoji>`").setFooter({text:"Soraku Community"})]})
      await Autoreact.add(message.guild.id,args[1],args[2])
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Autoreact `"+args[1]+"` → "+args[2]+" ditambahkan.").setFooter({text:"Soraku Community"})]})
    }
    if(opt==="remove"){
      if(!args[1])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan keyword-nya.").setFooter({text:"Soraku Community"})]})
      await Autoreact.remove(message.guild.id,args[1])
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Autoreact `"+args[1]+"` dihapus.").setFooter({text:"Soraku Community"})]})
    }
  }
}