const Discord = require('discord.js');
const con = require("./../src/MySqlConnector");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
    
    const userId = message.author.id
    // get the data of a user    
    var sql = 'SELECT * FROM users WHERE user_id = ' + userId + ' AND server_id = ' + message.guildId
    con.executeQuery(sql)
    
    .then( async (response) => {
        // if the user is not already registered
        if(!response[0]) {
            // user is registered
            var sql = "INSERT INTO users (user_id, xp_count, server_id) VALUES (" + userId + ", 1," + message.guildId + ")";    
            await con.executeQuery(sql);
            // share the message in all the guilds
            client.commands.get("Shared").run(client, message)
        // if the user is already registered 
        } else {
            // share the message in all the guilds
            client.commands.get("Shared").run(client, message)
            return
        }
    })
};

module.exports.name = 'SaveUser';
