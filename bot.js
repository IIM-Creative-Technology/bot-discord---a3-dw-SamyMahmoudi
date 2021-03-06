const clientLoader = require('./src/clientLoader');
const commandLoader = require('./src/commandLoader');
require('colors');

const con = require("./src/MySqlConnector");
con.connect();

const COMMAND_PREFIX = '!';

clientLoader.createClient(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'])
  .then(async (client) => {
    await commandLoader.load(client);

    // ADD A ROLE WHEN USER JOIN THE GUILD (GET A ROLE ID FROM YOUR GUILD)

    client.on('guildMemberAdd', async (member) => {
      await member.roles.add('941688869949149257');
    })
    
    client.on('messageCreate', async (message) => {

      if(message.author.bot) return ;
      
      client.commands.get("Banwords").run(client, message)

      // Ne pas tenir compte des messages envoyés par les bots, ou qui ne commencent pas par le préfix
      if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)) return;

      // On découpe le message pour récupérer tous les mots
      const words = message.content.split(' ');

      const commandName = words[0].slice(1); // Le premier mot du message, auquel on retire le préfix
      const arguments = words.slice(1); // Tous les mots suivants sauf le premier

      if (client.commands.has(commandName)) {
        // La commande existe, on la lance
        client.commands.get(commandName).run(client, message, arguments);
        
      } else {
        // La commande n'existe pas, on prévient l'utilisateur
        await message.delete();
        await message.channel.send(`The ${commandName} does not exist.`);
      }
    })
  });
