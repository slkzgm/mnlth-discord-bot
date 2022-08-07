const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commandName = 'target';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with collections distribution target.'),
  async execute(interaction) {
    const lastUpdate = (await axios.get(apiUrl)).data.lastUpdate.toString().slice(0, 10);

    await interaction.reply('Collections distribution target:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA          | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY       | 10012 |  5990 |  1750 |  1750 |     250 |    120 |       98 |    30 | 20000 |\n` +
      `| DISTRIBUTION | 50.06 | 29.95 |  8.75 |  8.75 |    1.25 |   0.60 |     0.49 |  0.15 |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
