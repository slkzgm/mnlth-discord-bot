const axios = require('axios');
const { apiUrl } = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");

const commandName = 'skinvials';

module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Replies with Skin vials data.'),
  async execute(interaction) {
    const data = (await axios.get(apiUrl + commandName)).data;
    const lastUpdate = (await axios.get(apiUrl)).data.lastUpdate.toString().slice(0, 10);
    const floor = {};
    const distribution = {};
    const supply = {};

    data.map(dna => {
      supply[dna.dna] = valuesHandler(dna.supply, 6);
      if (dna.dna !== 'total') {
        floor[dna.dna] = valuesHandler(dna.floorPrice.toFixed(2), 6);
        distribution[dna.dna] = valuesHandler(dna.distribution.toFixed(2), 6);
      }
    });
    await interaction.reply('Revealed skin vials:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA          | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY       |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| DISTRIBUTION |${distribution.human} |${distribution.robot} |${distribution.demon} |${distribution.angel} |  ${distribution.reptile} | ${distribution.undead} |   ${distribution.murakami} |${distribution.alien} |\n` +
      `| FLOOR PRICE  |${floor.human} |${floor.robot} |${floor.demon} |${floor.angel} |  ${floor.reptile} | ${floor.undead} |   ${floor.murakami} |${floor.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
