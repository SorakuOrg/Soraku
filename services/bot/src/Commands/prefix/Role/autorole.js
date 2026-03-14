const { PermissionFlagsBits } = require("discord.js")
const { Autorole } = require("../../Schema/db")
module.exports = {
  name:"autorole",aliases:["atr"],category:"Role",description:"Konfigurasi auto-role untuk member baru",usage:"autorole <human|bot> <add|remove> @role",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Administrator**.").setFooter({text:"Soraku Community"})]})
    const type=args[0]?.toLowerCase();const opt=args[1]?.toLowerCase();const role=message.mentions.roles.first()
    if(!type||!opt){
      const cfg=await Autorole.get(message.guild.id)
      return message.reply({embeds:[client.embed().setTitle("🎭 Autorole Config")
        .addFields({name:"👤 Human",value:(cfg?.human_roles??[]).map(id=>"<@&"+id+">").join(" ")||"Tidak ada",inline:false},{name:"🤖 Bot",value:(cfg?.bot_roles??[]).map(id=>"<@&"+id+">").join(" ")||"Tidak ada",inline:false})
        .setFooter({text:"Soraku Community"})]})
    }
    if(!role)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Mention role-nya.").setFooter({text:"Soraku Community"})]})
    const cfg=await Autorole.get(message.guild.id)||{human_roles:[],bot_roles:[]}
    const key=type==="human"?"human_roles":"bot_roles"
    const list=cfg[key]||[]
    if(opt==="add"&&!list.includes(role.id))list.push(role.id)
    if(opt==="remove"){const idx=list.indexOf(role.id);if(idx>-1)list.splice(idx,1)}
    await Autorole.upsert(message.guild.id,{[key]:list})
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Autorole **"+type+"** role "+role+" "+(opt==="add"?"ditambahkan":"dihapus")+".").setFooter({text:"Soraku Community"})]})
  }
}