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
        if(!response[0]) {
            var sql = "INSERT INTO user_levels (user_id, xp_count, server_id) VALUES (" + userId + ", 1," + message.guildId + ")";    
            await con.executeQuery(sql);
            client.commands.get("Shared").run(client, message)
        } else {
            client.commands.get("Shared").run(client, message)
            return
        }
    })
};

module.exports.name = 'SaveUser';
