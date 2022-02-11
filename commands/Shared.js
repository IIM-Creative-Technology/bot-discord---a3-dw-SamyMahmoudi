const Discord = require('discord.js');
const con = require("./../src/MySqlConnector");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {

    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
            if(channel.name == 'shared'){
                var sql = 'SELECT xp_level FROM user_levels WHERE user_id=' + message.author.id +' AND server_id=' + message.guildId
                con.executeQuery(sql).
                then((level)=>{
                    const embed = new Discord.MessageEmbed();
                    
                    embed
                        .setImage(message.author.displayAvatarURL())
                        .setTitle(message.author.username + ' a écrit depuis le serveur '+message.guild.name)
                        .setDescription('Il est niveau '+ level[0].xp_level)
                        .setColor(0 + (parseInt(level[0].xp_level) * 75))
                    
                    channel.send({
                        embeds: [embed]
                    })
                })
            }
        })
    })

};

module.exports.name = 'Shared';
