const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
module.exports = {
  name:"link",description:"Dapatkan link Register atau Login ke web Soraku 🔗",
  execute:async(interaction,client)=>{
    const row=new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Daftar").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/register"),
      new ButtonBuilder().setLabel("Login").setEmoji("🔑").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/login"),
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(client.webUrl),
    )
    await interaction.reply({embeds:[
      client.embed().setTitle("🌸 Bergabung dengan Soraku Community")
        .setDescription("Daftarkan akun kamu — profil, galeri, blog, event & supporter tier terhubung dengan Discord!")
        .setThumbnail(client.webUrl+"/icon.png")
        .setFooter({text:"Soraku Community"}).setTimestamp()
    ],components:[row],ephemeral:true})
  }
}