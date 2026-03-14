const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
module.exports = {
  name:"about",description:"Info lengkap Soraku Community + stats server 🌸",
  execute:async(interaction,client)=>{
    await interaction.deferReply()
    const guild=interaction.guild
    await guild.members.fetch().catch(()=>{})
    const embed=client.embed()
      .setTitle("🌸 Soraku Community")
      .setDescription("Komunitas **anime, manga, VTuber & budaya Jepang** Indonesia.\nTempat belajar, berkreasi, dan berkembang bersama~")
      .setThumbnail(guild.iconURL()??client.user.displayAvatarURL())
      .addFields(
        {name:"👥 Member",value:guild.memberCount.toLocaleString("id-ID"),inline:true},
        {name:"🌐 Website",value:"[soraku.id]("+client.webUrl+")",inline:true},
        {name:"📡 Ping",value:client.ws.ping+"ms",inline:true},
        {name:"🏠 Server",value:client.guilds.cache.size+" server",inline:true},
        {name:"👑 Owner",value:"Riu",inline:true},
      )
      .setFooter({text:"Soraku Community"}).setTimestamp()
    const row=new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(client.webUrl),
      new ButtonBuilder().setLabel("Discord").setEmoji("💬").setStyle(ButtonStyle.Link).setURL(client.support),
    )
    await interaction.editReply({embeds:[embed],components:[row]})
  }
}