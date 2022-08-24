const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");

const commandName = 'left';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with supply left data.'),
  async execute(interaction) {
    const data = (await axios.get(apiUrl + commandName)).data;
    const floor = {};
    const probabilities = {};
    const supply = {}

    data.map(dna => {
      supply[dna.dna] = valuesHandler(dna.supply, 6);
      if (dna.dna !== 'total') {
        floor[dna.dna] = valuesHandler(dna.floorPrice.toFixed(2), 6);
        probabilities[dna.dna] = valuesHandler(dna.probability.toFixed(2), 6);
      }
    });
    await interaction.reply('Supply left to be revealed:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA         | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY      |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| PROBABILITY |${probabilities.human} |${probabilities.robot} |${probabilities.demon} |${probabilities.angel} |  ${probabilities.reptile} | ${probabilities.undead} |   ${probabilities.murakami} |${probabilities.alien} |\n` +
      `| FLOOR PRICE |${floor.human} |${floor.robot} |${floor.demon} |${floor.angel} |  ${floor.reptile} | ${floor.undead} |   ${floor.murakami} |${floor.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```'
    );
  }
};
