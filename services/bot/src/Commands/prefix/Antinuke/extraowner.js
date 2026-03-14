const { Antinuke } = require("../../Schema/db")
module.exports = {
  name:"extraowner",aliases:["eo"],category:"Antinuke",description:"Tambah/hapus extra owner antinuke",usage:"extraowner <add|remove> @user",
  execute:async(message,args,client)=>{
    if(message.author.id!==message.guild.ownerId&&message.author.id!==client.ownerID)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Hanya **Server Owner**.").setFooter({text:"Soraku Community"})]})
    const opt=args[0]?.toLowerCase()
    const target=message.mentions.users.first()
    if(!opt||!target)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Format: `!extraowner add|remove @user`").setFooter({text:"Soraku Community"})]})
    const data=await Antinuke.get(message.guild.id)
    const list=data?.extra_owners??[]
    if(opt==="add"&&!list.includes(target.id))list.push(target.id)
    if(opt==="remove"){const idx=list.indexOf(target.id);if(idx>-1)list.splice(idx,1)}
    await Antinuke.upsert(message.guild.id,{extra_owners:list})
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" <@"+target.id+"> "+(opt==="add"?"ditambah ke":"dihapus dari")+" Extra Owner.").setFooter({text:"Soraku Community"})]})
  }
}