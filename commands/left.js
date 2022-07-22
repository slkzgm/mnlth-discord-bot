const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const { valuesHandler } = require("./utils/handlers");
const { apiUrl } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('left')
    .setDescription('Replies with supply left data.'),
  async execute(interaction) {
    const response = await axios.get(apiUrl);
    const data = response.data;
    const dunk = data.dunkGenesis.traits;
    const equippedSupply = data.dunkGenesis.equippedSupply;
    const vials = data.skinVial.traits;
    const supplyLeft = {
      human: 10012 - (vials.human.supply + dunk.human.supply),
      robot: 5990 - (vials.robot.supply + dunk.robot.supply),
      demon: 1750 - (vials.demon.supply + dunk.demon.supply),
      angel: 1750 - (vials.angel.supply + dunk.angel.supply),
      reptile: 250 - (vials.reptile.supply + dunk.reptile.supply),
      undead: 120 - (vials.undead.supply + dunk.undead.supply),
      murakami: 98 - (vials.murakami.supply + dunk.murakami.supply),
      alien: 30 - (vials.alien.supply + dunk.alien.supply),
      total: 20000 - (data.skinVial.supply + equippedSupply)
    }

    const floor = {
      human: valuesHandler(vials.human.floorPrice.toFixed(2), 6),
      robot: valuesHandler(vials.robot.floorPrice.toFixed(2), 6),
      demon: valuesHandler(vials.demon.floorPrice.toFixed(2), 6),
      angel: valuesHandler(vials.angel.floorPrice.toFixed(2), 6),
      reptile: valuesHandler(vials.reptile.floorPrice.toFixed(2), 6),
      undead: valuesHandler(vials.undead.floorPrice.toFixed(2), 6),
      murakami: valuesHandler(vials.murakami.floorPrice.toFixed(2), 6),
      alien: valuesHandler(vials.alien.floorPrice.toFixed(2), 6)
    };
    const lastUpdate = data.lastSuccessfullUpdate.toString().slice(0, 10);
    const probabilities = {
      human: valuesHandler(((supplyLeft.human / supplyLeft.total) * 100).toFixed(2), 6),
      robot: valuesHandler(((supplyLeft.robot / supplyLeft.total) * 100).toFixed(2), 6),
      demon: valuesHandler(((supplyLeft.demon / supplyLeft.total) * 100).toFixed(2), 6),
      angel: valuesHandler(((supplyLeft.angel / supplyLeft.total) * 100).toFixed(2), 6),
      reptile: valuesHandler(((supplyLeft.reptile / supplyLeft.total) * 100).toFixed(2), 6),
      undead: valuesHandler(((supplyLeft.undead / supplyLeft.total) * 100).toFixed(2), 6),
      murakami: valuesHandler(((supplyLeft.murakami / supplyLeft.total) * 100).toFixed(2), 6),
      alien: valuesHandler(((supplyLeft.alien / supplyLeft.total) * 100).toFixed(2), 6),
      total: valuesHandler(((supplyLeft.total / supplyLeft.total) * 100).toFixed(1), 6)
    };
    const supply = {
      human: valuesHandler(supplyLeft.human, 6),
      robot: valuesHandler(supplyLeft.robot, 6),
      demon: valuesHandler(supplyLeft.demon, 6),
      angel: valuesHandler(supplyLeft.angel, 6),
      reptile: valuesHandler(supplyLeft.reptile, 6),
      undead: valuesHandler(supplyLeft.undead, 6),
      murakami: valuesHandler(supplyLeft.murakami, 6),
      alien: valuesHandler(supplyLeft.alien, 6),
      total: valuesHandler(supplyLeft.total, 6)
    };

    await interaction.reply('Supply left to be revealed:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA         | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY      |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| PROBABILITY |${probabilities.human} |${probabilities.robot} |${probabilities.demon} |${probabilities.angel} |  ${probabilities.reptile} | ${probabilities.undead} |   ${probabilities.murakami} |${probabilities.alien} |\n` +
      `| FLOOR PRICE |${floor.human} |${floor.robot} |${floor.demon} |${floor.angel} |  ${floor.reptile} | ${floor.undead} |   ${floor.murakami} |${floor.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
