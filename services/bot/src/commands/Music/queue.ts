import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { convertTime } from "../../utils/convert"
module.exports = {
  name:"queue",aliases:["q"],category:"Music",description:"Tampilkan queue musik",usage:"queue",player:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player?.queue.current)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada lagu.").setFooter({text:"Soraku Community"})]})
    const songs=player.queue.map((t:any,i:number)=>"`"+(i+1)+"`. **"+t.title.substring(0,35)+"** | `"+convertTime(t.length)+"` | "+t.requester)
    const CHUNK=10
    const pages=[]
    for(let i=0;i<Math.max(1,songs.length);i+=CHUNK)pages.push(songs.slice(i,i+CHUNK))
    if(!pages.length)pages.push([])
    let page=0
    const cur=player.queue.current
    const makeEmbed=()=>client.embed()
      .setTitle(client.emoji.queue+" Queue — "+message.guild.name)
      .setDescription(
        "**Sekarang:** "+cur.title.substring(0,40)+" `"+convertTime(cur.length)+"`

"+
        (pages[page].length?pages[page].join("
"):"Queue kosong.")
      )
      .setFooter({text:"Soraku Community — Halaman "+(page+1)+"/"+pages.length})
    const row=new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("q_prev").setEmoji("⬅️").setStyle(ButtonStyle.Secondary).setDisabled(pages.length<=1),
      new ButtonBuilder().setCustomId("q_next").setEmoji("➡️").setStyle(ButtonStyle.Secondary).setDisabled(pages.length<=1),
    )
    const msg=await message.reply({embeds:[makeEmbed()],components:pages.length>1?[row]:[]})
    if(pages.length<=1)return
    const col=msg.createMessageComponentCollector({time:60000,filter:(i:any)=>i.user.id===message.author.id})
    col.on("collect",async(i:any)=>{
      if(i.customId==="q_next")page=(page+1)%pages.length
      else page=(page-1+pages.length)%pages.length
      await i.update({embeds:[makeEmbed()]})
    })
    col.on("end",()=>msg.edit({components:[]}).catch(()=>{}))
  }
}