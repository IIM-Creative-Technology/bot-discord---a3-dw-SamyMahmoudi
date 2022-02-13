const Discord = require('discord.js');
const con = require("./../src/MySqlConnector");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
        
    const userId = message.author.id
    
    // get actual data of the user
    var sql = 'SELECT * FROM users WHERE user_id = ' + userId + ' AND server_id = ' + message.guildId
    con.executeQuery(sql)

    .then((response) => {
        if(response[0]) {
            // update the xp_level and reset xp_count
            if(response[0].xp_count + 1 == response[0].xp_level + 4) {
                sql = "UPDATE users SET xp_count = 0, xp_level = xp_level + 1 WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId;    
                con.executeQuery(sql);
                
                // embed message
                const embed = new Discord.MessageEmbed();
                embed
                    .setThumbnail(message.author.displayAvatarURL())
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setImage(message.author.displayAvatarURL())
                    .setTitle('Bravo '+ message.author.username + ', vous avez gagné un niveau !')
                    .setDescription('Vous êtes maintenant niveau '+( parseInt(response[0].xp_level) + 1 ))
                    .setFooter({ text: "Niveau actuel : " +  (parseInt(response[0].xp_level)), iconURL: message.author.displayAvatarURL() })
                    .setTimestamp()

                    message.channel.send({
                        embeds: [ embed ]
                    })

                var isRoleExist = false
                
                // get all the roles of the guild
                message.guild.roles.fetch().then(async (responseRole)=>{
                    responseRole.forEach((data)=>{

                        // if the role already exist
                        if(data.name == "LEVEL "+( parseInt(response[0].xp_level)+1 )){
                            isRoleExist = true
                            // add the role to the user
                            message.member.roles.add(data.id)
                        // remove the precedent level
                        } else if (data.name == "LEVEL "+response[0].xp_level) {
                            message.member.roles.remove(data.id)
                        }
                    })
                    
                    // creation of a new role if its doesn't exist
                    if(isRoleExist == false){
                        const newRole = await message.guild.roles.create({
                            name: 'LEVEL '+( parseInt(response[0].xp_level)+1 ),
                            color: 0 + (response[0].xp_level * 75),
                        })
                        // give the role to the user
                        await message.member.roles.add(newRole)
                    }
                })
            // if the level doesn't change
            } else {
                sql = "UPDATE users SET xp_count = xp_count + 1 WHERE user_id="+ userId + ' AND server_id = ' + message.guildId;    
                con.executeQuery(sql);
            }
        } else {
            return
        }
    })  
};

module.exports.name = 'LevelUp';
