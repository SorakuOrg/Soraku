module.exports = {
  name:"play",description:"Putar lagu dari YouTube/Spotify 🎵",
  options:[{name:"query",description:"Nama lagu atau URL",type:3,required:true}],
  execute:async(interaction,client)=>{
    if(!client.manager)return interaction.reply({content:"❌ Musik tidak aktif.",ephemeral:true})
    if(!interaction.member.voice.channel)return interaction.reply({content:"❌ Kamu harus di VC.",ephemeral:true})
    await interaction.deferReply()
    const q=interaction.options.getString("query")
    const player=await client.manager.createPlayer({guildId:interaction.guild.id,voiceId:interaction.member.voice.channel.id,textId:interaction.channel.id,volume:80,deaf:true})
    const result=await player.search(q,{requester:interaction.user}).catch(()=>null)
    if(!result?.tracks.length)return interaction.editReply({embeds:[client.embed().setDescription(client.emoji.cross+" Lagu tidak ditemukan.").setFooter({text:"Soraku Community"})]})
    if(result.type==="PLAYLIST")for(const t of result.tracks)player.queue.add(t)
    else player.queue.add(result.tracks[0])
    if(!player.playing&&!player.paused)player.play()
    const t=result.tracks[0]
    interaction.editReply({embeds:[client.embed().setDescription(client.emoji.dot+" "+(result.type==="PLAYLIST"?"Queued **"+result.tracks.length+"** lagu dari **"+result.playlistName+"**":"Added **["+t.title.substring(0,40)+"]("+t.uri+")**")).setFooter({text:"Soraku Community"})]})
  }
}