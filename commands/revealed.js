const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const { valuesHandler } = require("./utils/handlers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('revealed')
    .setDescription('Replies with revealed data.'),
  async execute(interaction) {
    const response = await axios.get('https://slkzgm.tk/mnlth');
    const data = response.data;
    const dunk = data.dunkGenesis.traits;
    const equippedSupply = data.dunkGenesis.equippedSupply;
    const vials = data.skinVial.traits;
    const revealedSupply = {
      human: vials.human.supply + dunk.human.supply,
      robot: vials.robot.supply + dunk.robot.supply,
      demon: vials.demon.supply + dunk.demon.supply,
      angel: vials.angel.supply + dunk.angel.supply,
      reptile: vials.reptile.supply + dunk.reptile.supply,
      undead: vials.undead.supply + dunk.undead.supply,
      murakami: vials.murakami.supply + dunk.murakami.supply,
      alien: vials.alien.supply + dunk.alien.supply,
      total: data.skinVial.supply + equippedSupply
    };

    const distribution = {
      human: valuesHandler(((revealedSupply.human / revealedSupply.total) * 100).toFixed(2), 6),
      robot: valuesHandler(((revealedSupply.robot / revealedSupply.total) * 100).toFixed(2), 6),
      demon: valuesHandler(((revealedSupply.demon / revealedSupply.total) * 100).toFixed(2), 6),
      angel: valuesHandler(((revealedSupply.angel / revealedSupply.total) * 100).toFixed(2), 6),
      reptile: valuesHandler(((revealedSupply.reptile / revealedSupply.total) * 100).toFixed(2), 6),
      undead: valuesHandler(((revealedSupply.undead / revealedSupply.total) * 100).toFixed(2), 6),
      murakami: valuesHandler(((revealedSupply.murakami / revealedSupply.total) * 100).toFixed(2), 6),
      alien: valuesHandler(((revealedSupply.alien / revealedSupply.total) * 100).toFixed(2), 6),
      total: valuesHandler(((revealedSupply.total / revealedSupply.total) * 100).toFixed(1), 6)
    };
    const floorPrice = {
      human: valuesHandler(vials.human.floorPrice.toFixed(2), 6),
      robot: valuesHandler(vials.robot.floorPrice.toFixed(2), 6),
      demon: valuesHandler(vials.demon.floorPrice.toFixed(2), 6),
      angel: valuesHandler(vials.angel.floorPrice.toFixed(2), 6),
      reptile: valuesHandler(vials.reptile.floorPrice.toFixed(2), 6),
      undead: valuesHandler(vials.undead.floorPrice.toFixed(2), 6),
      murakami: valuesHandler(vials.murakami.floorPrice.toFixed(2), 6),
      alien: valuesHandler(vials.alien.floorPrice.toFixed(2), 6),
      total: valuesHandler(data.skinVial.floorPrice.toFixed(2), 6)
    };
    const lastUpdate = data.lastUpdate.toString().slice(0, 10);
    const supply = {
      human: valuesHandler(revealedSupply.human, 6),
      robot: valuesHandler(revealedSupply.robot, 6),
      demon: valuesHandler(revealedSupply.demon, 6),
      angel: valuesHandler(revealedSupply.angel, 6),
      reptile: valuesHandler(revealedSupply.reptile, 6),
      undead: valuesHandler(revealedSupply.undead, 6),
      murakami: valuesHandler(revealedSupply.murakami, 6),
      alien: valuesHandler(revealedSupply.alien, 6),
      total: valuesHandler(revealedSupply.total, 6)
    };

    await interaction.reply('Total revealed supply:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA          | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY       |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| DISTRIBUTION |${distribution.human} |${distribution.robot} |${distribution.demon} |${distribution.angel} |  ${distribution.reptile} | ${distribution.undead} |   ${distribution.murakami} |${distribution.alien} |\n` +
      `| FLOOR PRICE  |${floorPrice.human} |${floorPrice.robot} |${floorPrice.demon} |${floorPrice.angel} |  ${floorPrice.reptile} | ${floorPrice.undead} |   ${floorPrice.murakami} |${floorPrice.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
