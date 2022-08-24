const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");

const commandName = 'revealed';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with revealed supply data.'),
  async execute(interaction) {
    const data = (await axios.get(apiUrl + commandName)).data;
    const distribution = {};
    const floorPrice = {};
    const supply = {};

    data.map(dna => {
      supply[dna.dna] = valuesHandler(dna.supply, 6);
      if (dna.dna !== 'total') {
        distribution[dna.dna] = valuesHandler(dna.distribution.toFixed(2), 6);
        floorPrice[dna.dna] = valuesHandler(dna.floorPrice.toFixed(2), 6);
      }
    });
    await interaction.reply('Total revealed supply:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA          | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY       |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| DISTRIBUTION |${distribution.human} |${distribution.robot} |${distribution.demon} |${distribution.angel} |  ${distribution.reptile} | ${distribution.undead} |   ${distribution.murakami} |${distribution.alien} |\n` +
      `| FLOOR PRICE  |${floorPrice.human} |${floorPrice.robot} |${floorPrice.demon} |${floorPrice.angel} |  ${floorPrice.reptile} | ${floorPrice.undead} |   ${floorPrice.murakami} |${floorPrice.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```'
    );
  }
};
