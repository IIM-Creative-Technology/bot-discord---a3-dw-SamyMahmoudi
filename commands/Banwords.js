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
    
    BanwordsData.forEach(element => {
        if(content.includes(element)) {
            isBanword = true
            return
        }            
    });

    if (!isBanword) {
        client.commands.get("SaveUser").run(client, message)
        client.commands.get("LevelUp").run(client, message)
    } else {
        var sql = 'SELECT * FROM user_levels WHERE user_id = ' + userId + ' AND server_id = ' + message.guildId
        con.executeQuery(sql)
        .then( async (response) => {
            
            if(response[0]) {

                if(response[0].warnings != 3) {
                    sql = "UPDATE user_levels SET warnings = warnings + 1 WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId;    
                    con.executeQuery(sql);  
                    
                    const embed = new Discord.MessageEmbed();
                    embed
                        .setImage(message.author.displayAvatarURL())
                        .setTitle(message.author.username)
                        .setDescription("Vous avez : " + ( parseInt(response[0].warnings) + 1 ) + " avertissement(s)")
                        .setColor("RED")
                        message.channel.send({
                            embeds: [ embed ]
                        })
                } else {
                    sql = "DELETE FROM user_levels WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId ;
                    con.executeQuery(sql).then(
                        message.member.ban({ reason: "Vous avez trop d'avertissements !" })
                    )
                }    
            }
        })
    }
};

module.exports.name = 'Banwords';
