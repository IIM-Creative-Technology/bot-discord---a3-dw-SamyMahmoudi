const Discord = require('discord.js');
const BanwordsData = require("./../data/banwords.json");
const con = require("./../src/MySqlConnector");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {

    const userId = message.author.id
    const content = message.content.toLowerCase()
    var isBanword = false
    
    // verify if the message content contain a banword
    BanwordsData.forEach(element => {
        if(content.includes(element)) {
            isBanword = true
            return
        }            
    });

    // if there is not banword
    if (!isBanword) {
        // command to register ine the database
        client.commands.get("SaveUser").run(client, message)
        // update the xp_count or xp_level
        client.commands.get("LevelUp").run(client, message)
    // if there is a banword
    } else {
        var sql = 'SELECT * FROM users WHERE user_id = ' + userId + ' AND server_id = ' + message.guildId
        con.executeQuery(sql)
        .then( async (response) => {
            
            if(response[0]) {

                // add a warning if its under the limits
                if(response[0].warnings != 3) {
                    sql = "UPDATE users SET warnings = warnings + 1 WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId;    
                    con.executeQuery(sql);  
                    
                    // embed message
                    const embed = new Discord.MessageEmbed();
                    embed
                        .setThumbnail(message.author.displayAvatarURL())
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setImage(message.author.displayAvatarURL())
                        .setTitle("Attention " + message.author.username)
                        .setDescription("Vous avez : " + ( parseInt(response[0].warnings) + 1 ) + " avertissement(s)")
                        .setColor("RED")
                        .setFooter({ text: "Niveau actuel : " +  (parseInt(response[0].xp_level)), iconURL: message.author.displayAvatarURL() })
                        .setTimestamp()
                        
                        message.channel.send({
                            embeds: [ embed ]
                        })

                        message.author.send({
                            embeds: [ embed ]
                        })
                // if the limit is exceeded 
                } else {
                    // if the user is an admin 
                    if (message.member.permissions.any("ADMINISTRATOR"))
                    { 
                        var isRoleExist = false
                        message.guild.roles.fetch().then(async (responseRole)=>{
                            responseRole.forEach((data)=>{
                                // if the role already exist
                                if(data.name == "ADMIN MECHANT") {
                                    isRoleExist = true
                                    // add the role to the user
                                    message.member.roles.add(data.id)
                                // remove the precedent level
                                } else if (data.name == "ADMIN MECHANT") {
                                    message.member.roles.remove(data.id)
                                }
                            })
                            // creation of a new role if its doesn't exist
                            if(isRoleExist == false){
                                const newRole = await message.guild.roles.create({
                                    name: "ADMIN MECHANT",
                                    color: "RED",
                                })
                                // give the role to the user
                                await message.member.roles.add(newRole)
                            }
                        })
                    } else {
                        // the user is banned and delete in the database
                        sql = "DELETE FROM users WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId ;
                        con.executeQuery(sql).then(
                            message.member.ban({ reason: "Vous avez trop d'avertissements !" })
                        )
                    }

                }    
            }
        })
    }
};

module.exports.name = 'Banwords';
