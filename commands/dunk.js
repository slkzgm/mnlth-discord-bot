const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const { valuesHandler } = require("./utils/handlers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dunk')
    .setDescription('Replies with vials revealed equipped on Nike Dunk genesis data.'),
  async execute(interaction) {
    const response = await axios.get('https://slkzgm.tk/mnlth');
    const data = response.data;
    const equippedSupply = data.dunkGenesis.equippedSupply;
    const traits = data.dunkGenesis.traits;

    const distribution = {
      human: valuesHandler(((traits.human.supply / equippedSupply) * 100).toFixed(2), 6),
      robot: valuesHandler(((traits.robot.supply / equippedSupply) * 100).toFixed(2), 6),
      demon: valuesHandler(((traits.demon.supply / equippedSupply) * 100).toFixed(2), 6),
      angel: valuesHandler(((traits.angel.supply / equippedSupply) * 100).toFixed(2), 6),
      reptile: valuesHandler(((traits.reptile.supply / equippedSupply) * 100).toFixed(2), 6),
      undead: valuesHandler(((traits.undead.supply / equippedSupply) * 100).toFixed(2), 6),
      murakami: valuesHandler(((traits.murakami.supply / equippedSupply) * 100).toFixed(2), 6),
      alien: valuesHandler(((traits.alien.supply / equippedSupply) * 100).toFixed(2), 6),
      total: valuesHandler(((equippedSupply / equippedSupply) * 100).toFixed(1), 6)
    };
    const floor = {
      human: valuesHandler(traits.human.floorPrice.toFixed(2), 6),
      robot: valuesHandler(traits.robot.floorPrice.toFixed(2), 6),
      demon: valuesHandler(traits.demon.floorPrice.toFixed(2), 6),
      angel: valuesHandler(traits.angel.floorPrice.toFixed(2), 6),
      reptile: valuesHandler(traits.reptile.floorPrice.toFixed(2), 6),
      undead: valuesHandler(traits.undead.floorPrice.toFixed(2), 6),
      murakami: valuesHandler(traits.murakami.floorPrice.toFixed(2), 6),
      alien: valuesHandler(traits.alien.floorPrice.toFixed(2), 6),
      total: valuesHandler(data.dunkGenesis.floorPrice.toFixed(2),6),
    };
    const lastUpdate = data.lastUpdate.toString().slice(0, 10);
    const supply = {
      human: valuesHandler(traits.human.supply, 6),
      robot: valuesHandler(traits.robot.supply, 6),
      demon: valuesHandler(traits.demon.supply, 6),
      angel: valuesHandler(traits.angel.supply, 6),
      reptile: valuesHandler(traits.reptile.supply, 6),
      undead: valuesHandler(traits.undead.supply, 6),
      murakami: valuesHandler(traits.murakami.supply, 6),
      alien: valuesHandler(traits.alien.supply, 6),
      total: valuesHandler(equippedSupply,6),
    };

    await interaction.reply('Revealed DNA equipped on Dunk Genesis:\n' +
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
