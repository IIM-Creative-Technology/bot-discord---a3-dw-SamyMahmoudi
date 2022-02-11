const Discord = require('discord.js');
const con = require("./../src/MySqlConnector");
/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {

    if (!message.author.bot) {
        
        const userId = message.author.id
        
        var sql = 'SELECT * FROM user_levels WHERE user_id = ' + userId + ' AND server_id = ' + message.guildId
        con.executeQuery(sql)
        .then((response) => {
            
            if(response[0]) {
                if(response[0].xp_count+1 == response[0].xp_level + 4) {
                    sql = "UPDATE user_levels SET xp_count = 0, xp_level = xp_level + 1 WHERE user_id="+ userId  + ' AND server_id = ' + message.guildId;    
                    con.executeQuery(sql);
                    
                    const embed = new Discord.MessageEmbed();
                    embed
                        .setTitle('Bravo '+ message.author.username + ', vous avez gagné un niveau !')
                        .setDescription('Vous êtes maintenant niveau '+( parseInt(response[0].xp_level) + 1 ))
                        message.channel.send({
                            embeds: [ embed ]
                            })

                    var isRoleExist = false
                    
                    message.guild.roles.fetch().then(async (responseRole)=>{
                        responseRole.forEach((data)=>{
                            if(data.name == "LEVEL "+( parseInt(response[0].xp_level)+1 )){
                                isRoleExist = true
                                message.member.roles.add(data.id)
                            }else if(data.name == "LEVEL "+response[0].xp_level){
                                message.member.roles.remove(data.id)
                            }
                        })
    
                        if(isRoleExist == false){
                            const newRole = await message.guild.roles.create({
                                name: 'LEVEL '+( parseInt(response[0].xp_level)+1 ),
                                color: 0 + (response[0].xp_level * 75),
                            })
                            await message.member.roles.add(newRole)
                        }
                    })
                } else {
                    var sql = "UPDATE user_levels SET xp_count = xp_count + 1 WHERE user_id="+ userId + ' AND server_id = ' + message.guildId;    
                    con.executeQuery(sql);
                }
                
            } else {
                var sql = "INSERT INTO user_levels (user_id, xp_count, server_id) VALUES (" + userId + ", 1," + message.guildId + ")";    
                con.executeQuery(sql);
            }
        })  
    }
};

module.exports.name = 'LevelUp';
