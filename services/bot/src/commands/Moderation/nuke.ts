import { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
module.exports = {
  name:"nuke",category:"Moderation",description:"Clone channel dan hapus semua pesan",usage:"nuke",
  execute:async(message:any,_:any,client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Channels**.").setFooter({text:"Soraku Community"})]})
    const row=new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("nuke_yes").setLabel("Ya, Nuke!").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("nuke_no").setLabel("Batal").setStyle(ButtonStyle.Secondary),
    )
    const confirm=await message.reply({embeds:[client.embed().setDescription(client.emoji.warn+" Yakin ingin nuke channel ini?").setFooter({text:"Soraku Community"})],components:[row]})
    const col=confirm.createMessageComponentCollector({time:15000,filter:(i:any)=>i.user.id===message.author.id})
    col.on("collect",async(i:any)=>{
      if(i.customId==="nuke_no")return i.update({embeds:[client.embed().setDescription("Dibatalkan.").setFooter({text:"Soraku Community"})],components:[]})
      const pos=message.channel.position;const newCh=await message.channel.clone()
      await message.channel.delete();await newCh.setPosition(pos)
      await newCh.send({embeds:[client.embed().setDescription("💥 Channel berhasil di-nuke!").setFooter({text:"Soraku Community"})]})
    })
  }
}