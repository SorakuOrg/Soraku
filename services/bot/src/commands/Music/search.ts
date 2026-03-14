import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { convertTime } from "../../utils/convert"
module.exports = {
  name:"search",category:"Music",description:"Cari lagu dan pilih dari list",usage:"search <query>",inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,args:string[],client:any)=>{
    if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif.").setFooter({text:"Soraku Community"})]})
    if(!args[0])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan kata kunci pencarian.").setFooter({text:"Soraku Community"})]})
    const result=await client.manager.search(args.join(" "),{requester:message.author}).catch(()=>null)
    if(!result?.tracks.length)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Tidak ada hasil.").setFooter({text:"Soraku Community"})]})
    const top=result.tracks.slice(0,5)
    const list=top.map((t:any,i:number)=>`\`${i+1}.\` **${t.title.substring(0,40)}** \`${convertTime(t.length)}\``).join("
")
    const row=new ActionRowBuilder<ButtonBuilder>().addComponents(
      ...top.map((_:any,i:number)=>new ButtonBuilder().setCustomId("search_"+i).setLabel(String(i+1)).setStyle(ButtonStyle.Primary)),
      new ButtonBuilder().setCustomId("search_cancel").setLabel("Batal").setStyle(ButtonStyle.Danger)
    )
    const msg=await message.reply({embeds:[client.embed().setTitle(client.emoji.search+" Hasil Pencarian").setDescription(list).setFooter({text:"Soraku Community — Pilih nomor"})],components:[row]})
    const col=msg.createMessageComponentCollector({time:30000,filter:(i:any)=>i.user.id===message.author.id})
    col.on("collect",async(i:any)=>{
      col.stop()
      if(i.customId==="search_cancel")return i.update({embeds:[client.embed().setDescription("Dibatalkan.").setFooter({text:"Soraku Community"})],components:[]})
      const idx=parseInt(i.customId.replace("search_",""))
      const player=await client.manager.createPlayer({guildId:message.guild.id,voiceId:message.member.voice.channel.id,textId:message.channel.id,volume:80,deaf:true})
      player.queue.add(top[idx])
      if(!player.playing&&!player.paused)player.play()
      await i.update({embeds:[client.embed().setDescription(client.emoji.dot+" Added **"+top[idx].title.substring(0,40)+"**").setFooter({text:"Soraku Community"})],components:[]})
    })
    col.on("end",(_:any,r:string)=>{if(r==="time")msg.edit({components:[]}).catch(()=>{})})
  }
}