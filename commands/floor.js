const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const { valuesHandler } = require("./utils/handlers");
const { apiUrl } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('floor')
    .setDescription('Replies with collections floor prices.'),
  async execute(interaction) {
    const response = await axios.get(apiUrl);
    const data = response.data;

    const dunk = valuesHandler(data.dunkGenesis.floorPrice.toFixed(2), 4);
    const lastUpdate = data.lastUpdate.toString().slice(0, 10);
    const mnlth = valuesHandler(data.mnlth.floorPrice.toFixed(2), 4);
    const mnlth2 = valuesHandler(data.mnlth2.floorPrice.toFixed(2), );
    const vials = valuesHandler(data.skinVial.floorPrice.toFixed(2), 4);

    await interaction.reply('Collections floor prices:\n' +
      '```\n' +
      '-----------------------------------------------\n' +
      '| COLLECTION  | MNLTH | MNLTH2 | DUNK | VIALS |\n' +
      `| FLOOR PRICE |  ${mnlth} |   ${mnlth2} | ${dunk} |  ${vials} |\n` +
      '-----------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
