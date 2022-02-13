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
                // if the limit is exceeded 
                } else {
                    sql = "DELETE FROM users WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId ;
                    // the user is banned
                    con.executeQuery(sql).then(
                        message.member.ban({ reason: "Vous avez trop d'avertissements !" })
                    )
                }    
            }
        })
    }
};

module.exports.name = 'Banwords';
