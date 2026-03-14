import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"purge",aliases:["clear","prune"],category:"Moderation",description:"Hapus banyak pesan (maks 100)",usage:"purge [jumlah]",
  execute:async(message:any,args:string[],client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Messages**.").setFooter({text:"Soraku Community"})]})
    const amount=Math.min(parseInt(args[0])||10,100)
    await message.delete().catch(()=>{})
    const deleted=await message.channel.bulkDelete(amount,true).catch(()=>null)
    const m=await message.channel.send({embeds:[client.embed().setDescription("🗑️ Berhasil menghapus **"+(deleted?.size??0)+"** pesan.").setFooter({text:"Soraku Community"})]})
    setTimeout(()=>m.delete().catch(()=>{}),3000)
  }
}