module.exports = {
  name:"roleinfo",aliases:["ri"],category:"Utility",description:"Info detail sebuah role",usage:"roleinfo @role",
  execute:async(message:any,_:any,client:any)=>{
    const role=message.mentions.roles.first()
    if(!role)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Mention role-nya!").setFooter({text:"Soraku Community"})]})
    message.reply({embeds:[client.embed().setTitle("🎭 "+role.name).setColor(role.color||0x7c3aed)
      .addFields(
        {name:"🆔 ID",value:"`"+role.id+"`",inline:true},{name:"🎨 Warna",value:"`"+role.hexColor+"`",inline:true},
        {name:"👥 Member",value:String(role.members.size),inline:true},{name:"📌 Posisi",value:String(role.position),inline:true},
        {name:"🔔 Mentionable",value:role.mentionable?"Ya":"Tidak",inline:true},{name:"📌 Hoisted",value:role.hoist?"Ya":"Tidak",inline:true},
        {name:"📅 Dibuat",value:"<t:"+Math.floor(role.createdTimestamp/1000)+":D>",inline:true},
      ).setFooter({text:"Soraku Community"}).setTimestamp()
    ]})
  }
}