const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");

const commandName = 'diff';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with differences between revealed and to be revealed supply.'),
  async execute(interaction) {
    const data = (await axios.get(apiUrl + commandName)).data;
    const lastUpdate = (await axios.get(apiUrl)).data.lastUpdate.toString().slice(0, 10);
    const revealed = {};
    const supposed = {};
    const supplyDiff = {};
    const supplyDiffPercent = {};

    data.map(dna => {
      revealed[dna.dna] = dna.revealed ? valuesHandler(dna.revealed, 6) : 0;
      if (dna.dna !== 'total') {
        supposed[dna.dna] = valuesHandler(dna.supposed.toFixed(1), 6) ;
        supplyDiff[dna.dna] = valuesHandler(dna.supplyDiff.toFixed(1), 6);
        supplyDiffPercent[dna.dna] = valuesHandler(dna.supplyDiffPercent.toFixed(2), 6);
      }
    });
    await interaction.reply('Differences between revealed and to be revealed supply:\n' +
      '```\n' +
      ' --------------------------------------------------------------------------------------\n' +
      '| DNA            | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| REVEALED       |${revealed.human} |${revealed.robot} |${revealed.demon} |${revealed.angel} |  ${revealed.reptile} | ${revealed.undead} |   ${revealed.murakami} |${revealed.alien} |${revealed.total} |\n` +
      `| SUPPOSED       |${supposed.human} |${supposed.robot} |${supposed.demon} |${supposed.angel} |  ${supposed.reptile} | ${supposed.undead} |   ${supposed.murakami} |${supposed.alien} |\n` +
      `| SUPPLY DIFF.   |${supplyDiff.human} |${supplyDiff.robot} |${supplyDiff.demon} |${supplyDiff.angel} |  ${supplyDiff.reptile} | ${supplyDiff.undead} |   ${supplyDiff.murakami} |${supplyDiff.alien} |\n` +
      `| SUPPLY DIFF. % |${supplyDiffPercent.human} |${supplyDiffPercent.robot} |${supplyDiffPercent.demon} |${supplyDiffPercent.angel} |  ${supplyDiffPercent.reptile} | ${supplyDiffPercent.undead} |   ${supplyDiffPercent.murakami} |${supplyDiffPercent.alien} |\n` +
      ' --------------------------------------------------------------------------------------\n' +
      '```' +
      `Last update: <t:${lastUpdate}:R>`
    );
  }
};
