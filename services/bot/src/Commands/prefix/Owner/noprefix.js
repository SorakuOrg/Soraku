const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { Noprefix, supabase } = require("../../../Schema/db")
module.exports = {
  name:"noprefix",aliases:["nop"],category:"Owner",description:"Kelola akses NoPrefix user",usage:"noprefix @user | noprefix list",owner:true,
  execute:async(message,args,client)=>{
    if(message.author.id!==client.ownerID)return
    if(args[0]?.toLowerCase()==="list"){
      const {data}=await supabase.schema("bot").from("bot_noprefix").select("*")
      const rows=data??[]
      if(!rows.length)return message.reply({embeds:[client.embed().setDescription("Belum ada user NoPrefix.").setFooter({text:"Soraku Community"})]})
      const list=rows.map((r,i)=>"`"+(i+1)+"`. <@"+r.user_id+"> — "+(r.expires_at?"<t:"+Math.floor(new Date(r.expires_at).getTime()/1000)+":R>":"Permanent")).join("\n")
      return message.reply({embeds:[client.embed().setTitle("NoPrefix List").setDescription(list).setFooter({text:"Soraku Community"})]})
    }
    const user=message.mentions.users.first()||await client.users.fetch(args[0]).catch(()=>null)
    if(!user)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan user-nya.").setFooter({text:"Soraku Community"})]})
    const existing=await Noprefix.get(user.id)
    const row=new ActionRowBuilder().addComponents(
      ...(existing?[new ButtonBuilder().setCustomId("nop_remove").setLabel("Hapus NoPrefix").setStyle(ButtonStyle.Danger)]:[
        new ButtonBuilder().setCustomId("nop_bronze").setLabel("Bronze (1 hari)").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("nop_silver").setLabel("Silver (1 minggu)").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("nop_gold").setLabel("Gold (1 bulan)").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("nop_diamond").setLabel("Diamond (Permanent)").setStyle(ButtonStyle.Danger),
      ])
    )
    const msg=await message.reply({embeds:[client.embed().setTitle("NoPrefix — "+user.username).setThumbnail(user.displayAvatarURL()).setDescription(existing?"Status: ✅ Aktif":"Status: ❌ Tidak aktif").setFooter({text:"Soraku Community"})],components:[row]})
    const col=msg.createMessageComponentCollector({time:30000,filter:i=>i.user.id===message.author.id})
    col.on("collect",async i=>{
      col.stop()
      if(i.customId==="nop_remove"){await Noprefix.remove(user.id);return i.update({embeds:[client.embed().setDescription(client.emoji.tick+" NoPrefix dihapus dari **"+user.username+"**.").setFooter({text:"Soraku Community"})],components:[]})}
      const dur={nop_bronze:86400000,nop_silver:604800000,nop_gold:2592000000,nop_diamond:null}
      const exp=dur[i.customId]!==null?new Date(Date.now()+dur[i.customId]).toISOString():undefined
      await Noprefix.add(user.id,exp)
      await i.update({embeds:[client.embed().setDescription(client.emoji.tick+" NoPrefix diberikan ke **"+user.username+"**"+(exp?" sampai <t:"+Math.floor(new Date(exp).getTime()/1000)+":R>":"")+".").setFooter({text:"Soraku Community"})],components:[]})
    })
  }
}