const { Antinuke } = require("../../Schema/db")
module.exports = {
  name:"antinuke",aliases:["an"],category:"Antinuke",description:"Konfigurasi sistem antinuke server",usage:"antinuke [enable|disable]",
  execute:async(message,args,client)=>{
    const isAuth=message.author.id===message.guild.ownerId||message.author.id===client.ownerID
    const data=await Antinuke.get(message.guild.id)
    const extra=data?.extra_owners??[]
    if(!isAuth&&!extra.includes(message.author.id))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Hanya **Server Owner** atau **Extra Owner** yang bisa pakai ini.").setFooter({text:"Soraku Community"})]})
    const opt=args[0]?.toLowerCase()
    if(!opt){
      return message.reply({embeds:[client.embed().setTitle("🔒 Antinuke").addFields(
        {name:"Status",value:data?.is_enabled?"✅ Aktif":"❌ Nonaktif",inline:true},
        {name:"Extra Owners",value:extra.length?extra.map(id=>"<@"+id+">").join(", "):"Tidak ada",inline:false},
        {name:"Whitelist Users",value:(data?.whitelist_users??[]).length?(data.whitelist_users.map(id=>"<@"+id+">").join(", ")):"Tidak ada",inline:false},
      ).setFooter({text:"Soraku Community"})]})
    }
    const enabled=opt==="enable"||opt==="on"
    await Antinuke.upsert(message.guild.id,{is_enabled:enabled})
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Antinuke **"+(enabled?"diaktifkan":"dinonaktifkan")+"**.").setFooter({text:"Soraku Community"})]})
  }
}