const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");

const commandName = 'floor';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with collections floor prices.'),
  async execute(interaction) {
    const data = (await axios.get(apiUrl + commandName)).data;
    let mnlth, mnlth2, dunk, vials;

    data.map(collection => {
      switch (collection.collection) {
        case 'mnlth':
          mnlth = valuesHandler(collection.floorPrice.toFixed(2), 4);
          break;
        case 'monolith':
          mnlth2 = valuesHandler(collection.floorPrice.toFixed(2), 4);
          break;
        case 'cryptokicks':
          dunk = valuesHandler(collection.floorPrice.toFixed(2), 4);
          break;
        case 'skinvials':
          vials = valuesHandler(collection.floorPrice.toFixed(2), 4);
          break;
      }
    });
    await interaction.reply('Collections floor prices:\n' +
      '```\n' +
      '-----------------------------------------------\n' +
      '| COLLECTION  | MNLTH | MNLTH2 | DUNK | VIALS |\n' +
      `| FLOOR PRICE |  ${mnlth} |   ${mnlth2} | ${dunk} |  ${vials} |\n` +
      '-----------------------------------------------\n' +
      '```'
    );
  }
};
