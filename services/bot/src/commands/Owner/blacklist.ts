import { Blacklist } from "../../schema/db"
module.exports = {
  name:"blacklist",aliases:["bl"],category:"Owner",description:"Tambah/hapus user dari blacklist",usage:"blacklist <add|remove|list> [@user]",owner:true,
  execute:async(message:any,args:string[],client:any)=>{
    if(message.author.id!==client.ownerID)return
    const opt=args[0]?.toLowerCase()
    if(opt==="list"){
      const {supabase}=require("../../schema/db")
      const {data}=await supabase.schema("bot").from("bot_blacklist").select("*")
      const rows=(data??[]) as any[]
      if(!rows.length)return message.reply({embeds:[client.embed().setDescription("Blacklist kosong.").setFooter({text:"Soraku Community"})]})
      return message.reply({embeds:[client.embed().setTitle("Blacklist").setDescription(rows.map((r:any,i:number)=>"`"+(i+1)+"`. `"+r.user_id+"`").join("\n")).setFooter({text:"Soraku Community"})]})
    }
    const user=message.mentions.users.first()
    if(!user)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan user-nya.").setFooter({text:"Soraku Community"})]})
    if(opt==="add"){
      await Blacklist.add(user.id)
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" **"+user.username+"** ditambah ke blacklist.").setFooter({text:"Soraku Community"})]})
    }
    if(opt==="remove"){
      await Blacklist.remove(user.id)
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" **"+user.username+"** dihapus dari blacklist.").setFooter({text:"Soraku Community"})]})
    }
  }
}