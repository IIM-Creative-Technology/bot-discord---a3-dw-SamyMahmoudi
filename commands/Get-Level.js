const Discord = require('discord.js');
const con = require("./../src/MySqlConnector");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
    
    const userId = message.author.id 
    var sql = 'SELECT * FROM user_levels WHERE user_id = ' + userId + ' AND server_id = ' + message.guildId
    
    con.executeQuery(sql)
        .then( async (response) => {
           if(response[0]) {
                
            const embed = new Discord.MessageEmbed();
                embed
                    .setImage(message.author.displayAvatarURL())
                    .setTitle(message.author.username)
                    .setDescription('Vous êtes actuellement niveau '+( parseInt(response[0].xp_level)))
                    message.channel.send({
                        embeds: [ embed ]
                    })
                    
            } else {
                return
            }
        })

};

module.exports.name = 'GetLevel';
