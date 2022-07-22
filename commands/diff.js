const fs = require('node:fs');
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { valuesHandler } = require("./utils/handlers");
const { apiUrl } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('diff')
    .setDescription('Replies with differences between revealed and to be revealed data.'),
  async execute(interaction) {
    const response = await axios.get(apiUrl);
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
    const supposedSupply = {
      human: revealedSupply.total * (50.06 / 100),
      robot: revealedSupply.total * (29.95 / 100),
      demon: revealedSupply.total * (8.75 / 100),
      angel: revealedSupply.total * (8.75 / 100),
      reptile: revealedSupply.total * (1.25 / 100),
      undead: revealedSupply.total * (.6 / 100),
      murakami: revealedSupply.total * (.49 / 100),
      alien: revealedSupply.total * (.15 / 100),
      total: revealedSupply.total
    };

    const lastUpdate = data.lastSuccessfullUpdate.toString().slice(0, 10);
    const revealed = {
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
    const supplyDiff = {
      human: valuesHandler((revealedSupply.human - supposedSupply.human).toFixed(1), 6),
      robot: valuesHandler((revealedSupply.robot - supposedSupply.robot).toFixed(1), 6),
      demon: valuesHandler((revealedSupply.demon - supposedSupply.demon).toFixed(1), 6),
      angel: valuesHandler((revealedSupply.angel - supposedSupply.angel).toFixed(1), 6),
      reptile: valuesHandler((revealedSupply.reptile - supposedSupply.reptile).toFixed(1), 6),
      undead: valuesHandler((revealedSupply.undead - supposedSupply.undead).toFixed(1), 6),
      murakami: valuesHandler((revealedSupply.murakami - supposedSupply.murakami).toFixed(1), 6),
      alien: valuesHandler((revealedSupply.alien - supposedSupply.alien).toFixed(1), 6)
    };
    const supplyDiffPercent = {
      human: valuesHandler((100 * ((revealedSupply.human / supposedSupply.human) - 1)).toFixed(2), 6),
      robot: valuesHandler((100 * ((revealedSupply.robot / supposedSupply.robot) - 1)).toFixed(2), 6),
      demon: valuesHandler((100 * ((revealedSupply.demon / supposedSupply.demon) - 1)).toFixed(2), 6),
      angel: valuesHandler((100 * ((revealedSupply.angel / supposedSupply.angel) - 1)).toFixed(2), 6),
      reptile: valuesHandler((100 * ((revealedSupply.reptile / supposedSupply.reptile) - 1)).toFixed(2), 6),
      undead: valuesHandler((100 * ((revealedSupply.undead / supposedSupply.undead) - 1)).toFixed(2), 6),
      murakami: valuesHandler((100 * ((revealedSupply.murakami / supposedSupply.murakami) - 1)).toFixed(2), 6),
      alien: valuesHandler((100 * ((revealedSupply.alien / supposedSupply.alien) - 1)).toFixed(2), 6)
    };
    const supposed = {
      human: valuesHandler(supposedSupply.human.toFixed(1), 6),
      robot: valuesHandler(supposedSupply.robot.toFixed(1), 6),
      demon: valuesHandler(supposedSupply.demon.toFixed(1), 6),
      angel: valuesHandler(supposedSupply.angel.toFixed(1), 6),
      reptile: valuesHandler(supposedSupply.reptile.toFixed(1), 6),
      undead: valuesHandler(supposedSupply.undead.toFixed(1), 6),
      murakami: valuesHandler(supposedSupply.murakami.toFixed(1), 6),
      alien: valuesHandler(supposedSupply.alien.toFixed(1), 6),
      total: valuesHandler(supposedSupply.total, 6)
    };

    await interaction.reply('Differences between revealed and to be revealed supply:\n' +
      '```\n' +
      ' --------------------------------------------------------------------------------------\n' +
      '| DNA            | HUMAN | ROBOT | DEMON | ANGEL | REPTILE | UNDEAD | MURAKAMI | ALIEN | TOTAL |\n' +
      `| REVEALED       |${revealed.human} |${revealed.robot} |${revealed.demon} |${revealed.angel} |  ${revealed.reptile} | ${revealed.undead} |   ${revealed.murakami} |${revealed.alien} |${revealed.total} |\n` +
      `| SUPPOSED       |${supposed.human} |${supposed.robot} |${supposed.demon} |${supposed.angel} |  ${supposed.reptile} | ${supposed.undead} |   ${supposed.murakami} |${supposed.alien} |${supposed.total} |\n` +
      `| SUPPLY DIFF.   |${supplyDiff.human} |${supplyDiff.robot} |${supplyDiff.demon} |${supplyDiff.angel} |  ${supplyDiff.reptile} | ${supplyDiff.undead} |   ${supplyDiff.murakami} |${supplyDiff.alien} |\n` +
      `| SUPPLY DIFF. % |${supplyDiffPercent.human} |${supplyDiffPercent.robot} |${supplyDiffPercent.demon} |${supplyDiffPercent.angel} |  ${supplyDiffPercent.reptile} | ${supplyDiffPercent.undead} |   ${supplyDiffPercent.murakami} |${supplyDiffPercent.alien} |\n` +
      ' --------------------------------------------------------------------------------------\n' +
      '```' +
      `Last successfull update: <t:${lastUpdate}:R>`
    );
  }
};
