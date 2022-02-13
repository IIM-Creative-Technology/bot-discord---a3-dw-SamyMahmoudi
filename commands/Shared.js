const Discord = require('discord.js');
const con = require("./../src/MySqlConnector");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {

    // get all the guilds
    client.guilds.cache.forEach(guild => {
        
        // get all "shared" channel
        guild.channels.cache.forEach(channel => {
            if(channel.name == 'shared'){        
                // get the user data
                var sql = 'SELECT xp_level FROM users WHERE user_id=' + message.author.id +' AND server_id=' + message.guildId
                con.executeQuery(sql).
                
                then((level)=>{
                    // embed message
                    const embed = new Discord.MessageEmbed();
                    embed
                        .setThumbnail(message.author.displayAvatarURL())
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setImage(message.author.displayAvatarURL())
                        .setTitle(message.author.username + ' a écrit depuis le serveur '+ message.guild.name)
                        .setTimestamp()
                        .setDescription(message.content)
                        .setColor(0 + (parseInt(level[0].xp_level) * 75))
                        .setFooter({ text: "Niveau actuel : " +  (parseInt(level[0].xp_level)), iconURL: message.author.displayAvatarURL() });
                    
                    channel.send({
                        embeds: [embed]
                    })
                })
            }
        })
    })

};

module.exports.name = 'Shared';
