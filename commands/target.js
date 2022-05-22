const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');

const { valuesHandler } = require("./utils/handlers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('target')
    .setDescription('Replies with collections distribution target.'),
  async execute(interaction) {
    const data = JSON.parse(fs.readFileSync('./commands/data.json'));
    const vials = data.skinVial.traits;

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

    await interaction.reply('Collections distribution target:\n' +
      '```\n' +
      ' ------------------------------------------------------------------------------------\n' +
      '| DNA          | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| SUPPLY       | 10012 |  5990 |  1750 |  1750 |     250 |    120 |       98 |    30 | 20000 |\n` +
      `| DISTRIBUTION | 50.06 | 29.95 |  8.75 |  8.75 |    1.25 |   0.60 |     0.49 |  0.15 |\n` +
      `| FLOOR PRICE  |${floor.human} |${floor.robot} |${floor.demon} |${floor.angel} |  ${floor.reptile} | ${floor.undead} |   ${floor.murakami} |${floor.alien} |\n` +
      ' ------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
