const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');

const { valuesHandler } = require("./utils/handlers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skinvials')
    .setDescription('Replies with Skin vials data.'),
  async execute(interaction) {
    const data = JSON.parse(fs.readFileSync('./commands/data.json'));
    const traits = data.skinVial.traits;

    const floor = {
      human: valuesHandler(traits.human.floorPrice.toFixed(2), 6),
      robot: valuesHandler(traits.robot.floorPrice.toFixed(2), 6),
      demon: valuesHandler(traits.demon.floorPrice.toFixed(2), 6),
      angel: valuesHandler(traits.angel.floorPrice.toFixed(2), 6),
      reptile: valuesHandler(traits.reptile.floorPrice.toFixed(2), 6),
      undead: valuesHandler(traits.undead.floorPrice.toFixed(2), 6),
      murakami: valuesHandler(traits.murakami.floorPrice.toFixed(2), 6),
      alien: valuesHandler(traits.alien.floorPrice.toFixed(2), 6),
      total: valuesHandler(data.skinVial.floorPrice.toFixed(2),6)
    };
    const lastUpdate = data.lastSuccessfullUpdate.toString().slice(0, 10);
    const probabilities = {
      human: valuesHandler(((traits.human.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      robot: valuesHandler(((traits.robot.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      demon: valuesHandler(((traits.demon.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      angel: valuesHandler(((traits.angel.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      reptile: valuesHandler(((traits.reptile.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      undead: valuesHandler(((traits.undead.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      murakami: valuesHandler(((traits.murakami.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      alien: valuesHandler(((traits.alien.supply / data.skinVial.supply) * 100).toFixed(2), 6),
      total: valuesHandler(((data.skinVial.supply / data.skinVial.supply) * 100).toFixed(1), 6),
    };
    const supply = {
      human: valuesHandler(traits.human.supply, 6),
      robot: valuesHandler(traits.robot.supply, 6),
      demon: valuesHandler(traits.demon.supply, 6),
      angel: valuesHandler(traits.angel.supply, 6),
      reptile: valuesHandler(traits.reptile.supply, 6),
      undead: valuesHandler(traits.undead.supply, 6),
      murakami: valuesHandler(traits.murakami.supply, 6),
      alien: valuesHandler(traits.alien.supply, 6),
      total: valuesHandler(data.skinVial.supply,6),
    };

    await interaction.reply('Revealed skin vials:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA          | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY       |${supply.human} |${supply.robot} |${supply.demon} |${supply.angel} |  ${supply.reptile} | ${supply.undead} |   ${supply.murakami} |${supply.alien} |${supply.total} |\n` +
      `| DISTRIBUTION |${probabilities.human} |${probabilities.robot} |${probabilities.demon} |${probabilities.angel} |  ${probabilities.reptile} | ${probabilities.undead} |   ${probabilities.murakami} |${probabilities.alien} |\n` +
      `| FLOOR PRICE  |${floor.human} |${floor.robot} |${floor.demon} |${floor.angel} |  ${floor.reptile} | ${floor.undead} |   ${floor.murakami} |${floor.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
