const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Replies with debugs information.'),
  async execute(interaction) {
    const response = await axios.get(apiUrl);
    const data = response.data;

    await interaction.reply(
      'data.json stringify: `' + `${JSON.stringify(data)}` + '`'
    );
  }
};
