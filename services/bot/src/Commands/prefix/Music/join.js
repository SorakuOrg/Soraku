module.exports = {
  name:"join",category:"Music",description:"Bot masuk VC",usage:"join",inVoiceChannel:true,
  execute:async(message,_,client)=>{
    if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif.").setFooter({text:"Soraku Community"})]})
    await client.manager.createPlayer({guildId:message.guild.id,voiceId:message.member.voice.channel.id,textId:message.channel.id,volume:80,deaf:true})
    message.reply({embeds:[client.embed().setDescription(client.emoji.join+" Bergabung ke **"+message.member.voice.channel.name+"**").setFooter({text:"Soraku Community"})]})
  }
}