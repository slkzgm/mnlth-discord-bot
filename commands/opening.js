const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");

const commandName = 'opening';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with live reveal rates data.'),
  async execute(interaction) {
    const data = (await axios.get(apiUrl + commandName)).data;
    let additionnalsInfo = {};
    const diff = {};
    const probabilities = {};
    const supply = {};

    data.map(dna => {
      if (dna.dna) {
        supply[dna.dna] = valuesHandler(dna.supply, 6);
        if (dna.dna !== 'total') {
          diff[dna.dna] = valuesHandler(dna.valueDiff.toFixed(2), 6);
          probabilities[dna.dna] = valuesHandler(dna.probability.toFixed(2), 6);
        }
      } else {
        additionnalsInfo.maxLoss = dna.maxLoss.toFixed(2);
        additionnalsInfo.maxLossPercent = dna.maxLossPercent.toFixed(2);
        additionnalsInfo.minValue = dna.minValue.toFixed(2);
      }
    });
    await interaction.reply('Actual reveal rates:\n' +
      '```\n' +
      ' -----------------------------------------------------------------------------------\n' +
      '| DNA         | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY      |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| PROBABILITY |${probabilities.human} |${probabilities.robot} |${probabilities.demon} |${probabilities.angel} |  ${probabilities.reptile} | ${probabilities.undead} |   ${probabilities.murakami} |${probabilities.alien} |\n` +
      `| VALUE DIFF. |${diff.human} |${diff.robot} |${diff.demon} |${diff.angel} |  ${diff.reptile} | ${diff.undead} |   ${diff.murakami} |${diff.alien} |\n` +
      ' -----------------------------------------------------------------------------------\n' +
      '```' +
      'Worst case scenario:\n' +
      '```\n' +
      `Minimum value obtained: ${additionnalsInfo.minValue} ETH\n` +
      `Maximum value loss: ${additionnalsInfo.maxLoss} ETH (-${additionnalsInfo.maxLossPercent}%)\n` +
      '```'
    );
  }
};
