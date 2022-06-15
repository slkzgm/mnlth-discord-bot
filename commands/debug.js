const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Replies with debugs information.'),
  async execute(interaction) {
    const response = await axios.get('https://slkzgm.tk/mnlth');
    const data = response.data;
    const lastUpdate = data.lastUpdate.toString().slice(0, 10);
    const lastSuccessfullUpdate = data.lastSuccessfullUpdate.toString().slice(0, 10);

    await interaction.reply(
      `Last update: ${data.lastUpdate} (<t:${lastUpdate}:R>)\n` +
      `Last successfull update: ${data.lastSuccessfullUpdate} (<t:${lastSuccessfullUpdate}:R>)\n` +
      'data.json stringify: `' + `${JSON.stringify(data)}` + '`'
    );
  }
};
