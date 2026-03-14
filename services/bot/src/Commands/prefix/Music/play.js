const { convertTime } = require("../../../Utils/convert")
module.exports = {
  name:"play",aliases:["p"],category:"Music",description:"Putar lagu dari YouTube/Spotify",usage:"play <nama/url>",cooldown:3,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message,args,client)=>{
    if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif. Set LAVA_URL + LAVA_AUTH di ENV.").setFooter({text:"Soraku Community"})]})
    if(!args[0])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan nama/URL lagu.").setFooter({text:"Soraku Community"})]})
    const player=await client.manager.createPlayer({guildId:message.guild.id,voiceId:message.member.voice.channel.id,textId:message.channel.id,volume:80,deaf:true})
    const result=await player.search(args.join(" "),{requester:message.author})
    if(!result.tracks.length)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Lagu tidak ditemukan.").setFooter({text:"Soraku Community"})]})
    if(result.type==="PLAYLIST")for(const t of result.tracks)player.queue.add(t)
    else player.queue.add(result.tracks[0])
    if(!player.playing&&!player.paused)player.play()
    const t=result.tracks[0]
    message.reply({embeds:[client.embed().setDescription(
      result.type==="PLAYLIST"?client.emoji.dot+" Queued **"+result.tracks.length+"** lagu dari **"+result.playlistName+"**"
        :client.emoji.dot+" Added **["+t.title.substring(0,40)+"]("+t.uri+")**\n`"+convertTime(t.length)+"` | "+message.author.displayName
    ).setFooter({text:"Soraku Community"})]})
  }
}