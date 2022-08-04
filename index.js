const { Client, Collection, Intents } = require('discord.js');
const fs = require('node:fs');

const { token } = require('./config.json');

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// client.on('messageCreate', async (msg) => {
//   if (msg.content.toLowerCase() === 'gm') await msg.reply(`GM ${msg.author.tag}!`);
//   if (msg.content.toLowerCase() === 'gn') await msg.reply(`GN ${msg.author.tag}!`);
// });

client.login(token);
client.user.setActivity('@ https://slkappz.com/', {type: "STREAMING"});
