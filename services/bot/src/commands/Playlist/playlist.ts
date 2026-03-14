import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Playlist } from "../../schema/db"
import { convertTime } from "../../utils/convert"
module.exports = {
  name:"playlist",aliases:["pl"],category:"Playlist",description:"Kelola playlist musik pribadi",usage:"playlist <create|delete|list|load|info|save> [nama]",
  execute:async(message:any,args:string[],client:any)=>{
    const opt=args[0]?.toLowerCase()
    const name=args.slice(1).join(" ")
    if(!opt||opt==="list"){
      const lists=await Playlist.getAll(message.author.id) as any[]
      if(!lists.length)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Kamu belum punya playlist. Buat dengan `!playlist create <nama>`").setFooter({text:"Soraku Community"})]})
      return message.reply({embeds:[client.embed().setTitle(client.emoji.queue+" Playlist Kamu")
        .setDescription(lists.map((p:any,i:number)=>"`"+(i+1)+"`. **"+p.name+"** ("+( p.tracks?.length||0)+" lagu)").join("\n"))
        .setFooter({text:"Soraku Community"})]})
    }
    if(opt==="create"){
      if(!name)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan nama playlist.").setFooter({text:"Soraku Community"})]})
      const exist=await Playlist.get(message.author.id,name)
      if(exist)return message.reply({embeds:[client.embed().setDescription(client.emoji.warn+" Playlist `"+name+"` sudah ada.").setFooter({text:"Soraku Community"})]})
      await Playlist.create(message.author.id,name)
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Playlist **"+name+"** berhasil dibuat.").setFooter({text:"Soraku Community"})]})
    }
    if(opt==="delete"){
      if(!name)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan nama playlist.").setFooter({text:"Soraku Community"})]})
      await Playlist.delete(message.author.id,name)
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Playlist **"+name+"** dihapus.").setFooter({text:"Soraku Community"})]})
    }
    if(opt==="save"){
      if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif.").setFooter({text:"Soraku Community"})]})
      const player=client.manager.players.get(message.guild.id)
      if(!player?.queue.current)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Tidak ada lagu yang diputar.").setFooter({text:"Soraku Community"})]})
      if(!name)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan nama playlist.").setFooter({text:"Soraku Community"})]})
      const pl=await Playlist.get(message.author.id,name) as any
      if(!pl)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Playlist tidak ditemukan.").setFooter({text:"Soraku Community"})]})
      const tracks=[player.queue.current,...player.queue].map((t:any)=>({title:t.title,uri:t.uri,length:t.length,author:t.author}))
      await Playlist.update(message.author.id,name,[...(pl.tracks||[]),...tracks])
      return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" "+tracks.length+" lagu disimpan ke **"+name+"**.").setFooter({text:"Soraku Community"})]})
    }
    if(opt==="load"){
      if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif.").setFooter({text:"Soraku Community"})]})
      if(!message.member.voice.channel)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Kamu harus di voice channel.").setFooter({text:"Soraku Community"})]})
      if(!name)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan nama playlist.").setFooter({text:"Soraku Community"})]})
      const pl=await Playlist.get(message.author.id,name) as any
      if(!pl||!pl.tracks?.length)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Playlist kosong atau tidak ditemukan.").setFooter({text:"Soraku Community"})]})
      const player=await client.manager.createPlayer({guildId:message.guild.id,voiceId:message.member.voice.channel.id,textId:message.channel.id,volume:80,deaf:true})
      for(const t of pl.tracks){
        const r=await player.search(t.uri,{requester:message.author}).catch(()=>null)
        if(r?.tracks[0])player.queue.add(r.tracks[0])
      }
      if(!player.playing&&!player.paused)player.play()
      return message.reply({embeds:[client.embed().setDescription(client.emoji.dot+" Loading **"+pl.tracks.length+"** lagu dari **"+name+"**...").setFooter({text:"Soraku Community"})]})
    }
    message.reply({embeds:[client.embed().setDescription("Opsi: `create` `delete` `list` `save` `load`").setFooter({text:"Soraku Community"})]})
  }
}