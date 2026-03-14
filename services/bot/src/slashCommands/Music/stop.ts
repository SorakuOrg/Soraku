module.exports = {
  name:"stop",description:"Stop musik dan hapus queue ⏹️",
  execute:async(interaction:any,client:any)=>{
    const player=client.manager?.players.get(interaction.guild.id)
    if(!player)return interaction.reply({content:"❌ Tidak ada player.",ephemeral:true})
    player.queue.clear();player.data.delete("autoplay");player.loop="none";await player.skip()
    interaction.reply({embeds:[client.embed().setDescription("⏹️ Musik dihentikan.").setFooter({text:"Soraku Community"})]})
  }
}