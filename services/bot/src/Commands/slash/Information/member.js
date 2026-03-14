module.exports = {
  name:"member",description:"Lihat jumlah member server 👥",
  execute:async(interaction,client)=>{
    await interaction.deferReply()
    const guild=interaction.guild
    await guild.members.fetch()
    const bots=guild.members.cache.filter(m=>m.user.bot).size
    const humans=guild.memberCount-bots
    const online=guild.members.cache.filter(m=>m.presence?.status!=="offline"&&!m.user.bot).size
    await interaction.editReply({embeds:[
      client.embed().setTitle("👥 Member — "+guild.name)
        .addFields(
          {name:"🧑 Manusia",value:humans.toLocaleString("id-ID"),inline:true},
          {name:"🟢 Online",value:online.toLocaleString("id-ID"),inline:true},
          {name:"🤖 Bot",value:bots.toLocaleString("id-ID"),inline:true},
          {name:"📊 Total",value:guild.memberCount.toLocaleString("id-ID"),inline:true},
        )
        .setThumbnail(guild.iconURL())
        .setFooter({text:"Soraku Community"}).setTimestamp()
    ]})
  }
}