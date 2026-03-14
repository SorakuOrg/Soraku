import { PermissionFlagsBits } from "discord.js"
import { convertTime } from "../../utils/convert"
module.exports = {
  name:"play",aliases:["p"],category:"Music",description:"Putar lagu dari YouTube/Spotify",usage:"play <nama/url>",
  cooldown:3,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,args:string[],client:any)=>{
    if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif. Set `LAVA_URL` + `LAVA_AUTH` di Railway ENV.").setFooter({text:"Soraku Community"})]})
    if(!args[0])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan nama/URL lagu. Contoh: `!play Yoasobi Racing Into The Night`").setFooter({text:"Soraku Community"})]})
    if(!message.guild.members.me.permissions.has([PermissionFlagsBits.Speak,PermissionFlagsBits.Connect]))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Aku perlu izin **Connect** dan **Speak** di voice channel.").setFooter({text:"Soraku Community"})]})
    const player=await client.manager.createPlayer({guildId:message.guild.id,voiceId:message.member.voice.channel.id,textId:message.channel.id,volume:80,deaf:true})
    const result=await player.search(args.join(" "),{requester:message.author})
    if(!result.tracks.length)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Lagu tidak ditemukan.").setFooter({text:"Soraku Community"})]})
    if(result.type==="PLAYLIST")for(const t of result.tracks)player.queue.add(t)
    else player.queue.add(result.tracks[0])
    if(!player.playing&&!player.paused)player.play()
    const isPlaylist=result.type==="PLAYLIST"
    message.reply({embeds:[client.embed().setDescription(
      isPlaylist?client.emoji.dot+" Queued **"+result.tracks.length+"** lagu dari playlist **"+result.playlistName+"**"
               :client.emoji.dot+" Added **["+result.tracks[0].title.substring(0,40)+"]("+result.tracks[0].uri+")**
Duration: `"+convertTime(result.tracks[0].length)+"` | By "+message.author.displayName
    ).setFooter({text:"Soraku Community"})]})
  }
}