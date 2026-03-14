const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js")
module.exports = {
  name:"help",description:"Daftar semua command SorakuBot 📖",
  execute:async(interaction,client)=>{
    const prefix=client.prefix
    const CATS={
      "🌸 Soraku":{emoji:"🌸",color:0x7c3aed,cmds:["/link","/profile"]},
      "📋 Information":{emoji:"📋",color:0x3b82f6,cmds:["/about","/ping","/member","/event","/help"]},
      "💬 Prefix Info":{emoji:"💬",color:0x22c55e,cmds:[prefix+"help",prefix+"ping",prefix+"about",prefix+"serverinfo",prefix+"userinfo",prefix+"avatar"]},
      "🔧 Prefix Utility":{emoji:"🔧",color:0xf59e0b,cmds:[prefix+"afk",prefix+"snipe",prefix+"roleinfo",prefix+"profile"]},
      "🛡️ Prefix Mod":{emoji:"🛡️",color:0xef4444,cmds:[prefix+"ban",prefix+"kick",prefix+"mute",prefix+"unmute",prefix+"purge",prefix+"nuke",prefix+"lock",prefix+"unlock"]},
      "⚙️ Config":{emoji:"⚙️",color:0x6366f1,cmds:[prefix+"setprefix",prefix+"ignore",prefix+"antinuke",prefix+"antilink",prefix+"welcome",prefix+"autorole"]},
      "🎵 Music":{emoji:"🎵",color:0xec4899,cmds:[prefix+"play",prefix+"skip",prefix+"stop",prefix+"queue",prefix+"nowplaying",prefix+"volume",prefix+"loop",prefix+"shuffle"]},
      "✨ Extra":{emoji:"✨",color:0x14b8a6,cmds:[prefix+"autoresponder",prefix+"autoreact"]},
    }
    const overview=client.embed()
      .setTitle("🤖 SorakuBot — Help")
      .setDescription("Prefix: `"+prefix+"` · Pilih kategori di dropdown")
      .setThumbnail(client.user.displayAvatarURL())
    for(const[name,cat]of Object.entries(CATS))overview.addFields({name,value:cat.cmds.map(c=>"`"+c+"`").join(" "),inline:false})
    overview.setFooter({text:"Soraku Community"}).setTimestamp()

    const buildMenu=(sel)=>{
      const menu=new StringSelectMenuBuilder().setCustomId("slash_help").setPlaceholder("✨ Pilih kategori command...")
      for(const[name,cat]of Object.entries(CATS)){
        const opt=new StringSelectMenuOptionBuilder().setValue(name).setLabel(name.replace(/^\S+\s/,"")).setEmoji(cat.emoji)
        if(name===sel)opt.setDefault(true)
        menu.addOptions(opt)
      }
      return new ActionRowBuilder().addComponents(menu)
    }

    const reply=await interaction.reply({embeds:[overview],components:[buildMenu()],fetchReply:true})
    const col=reply.createMessageComponentCollector({componentType:ComponentType.StringSelect,time:300_000,filter:i=>i.customId==="slash_help"&&i.user.id===interaction.user.id})
    col.on("collect",async i=>{
      const cat=CATS[i.values[0]]
      const embed=client.embed().setColor(cat.color).setTitle(i.values[0]).setDescription(cat.cmds.map(c=>"`"+c+"`").join("\n")).setFooter({text:"Soraku Community"}).setTimestamp()
      await i.update({embeds:[embed],components:[buildMenu(i.values[0])]})
    })
    col.on("end",async()=>{
      const d=new StringSelectMenuBuilder().setCustomId("x").setDisabled(true).setPlaceholder("⏱️ Sesi berakhir").addOptions(new StringSelectMenuOptionBuilder().setValue("x").setLabel("x"))
      await interaction.editReply({components:[new ActionRowBuilder().addComponents(d)]}).catch(()=>{})
    })
  }
}