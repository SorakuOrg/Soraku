module.exports = {
  name:"skip",description:"Skip lagu sekarang ⏭️",
  execute:async(interaction:any,client:any)=>{
    const player=client.manager?.players.get(interaction.guild.id)
    if(!player?.queue.current)return interaction.reply({content:"❌ Tidak ada lagu.",ephemeral:true})
    player.skip()
    interaction.reply({embeds:[client.embed().setDescription("⏭️ Lagu di-skip.").setFooter({text:"Soraku Community"})]})
  }
}