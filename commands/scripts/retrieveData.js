const cron = require('node-cron');
const fs = require('node:fs');
const { performance } = require('perf_hooks');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const selectors = {
  box: {
    vialBoxDunk: '#Header\\ react-aria-57',
    equippedBox: '#EQUIPPED',
    dnaBoxVial: '#Header\\ react-aria-37',
    dnaBoxDunk: '#Header\\ react-aria-51',
    humanBox: '#HUMAN',
    robotBox: '#ROBOT',
    demonBox: '#DEMON',
    angelBox: '#ANGEL',
    reptileBox: '#REPTILE',
    undeadBox: '#UNDEAD',
    murakamiBox: '#MURAKAMI',
    alienBox: '#ALIEN'
  },
  buyNow: '#Buy_Now > div > span > input',
  firstListingPrice: '#main > div > div > div.sc-1xf18x6-0.sc-z0wxa3-0.hnKAL.hWJuuu > div > div.sc-1po1rbf-6.bUKivE > div.sc-1xf18x6-0.cPWSa-d.AssetSearchView--main > div.AssetSearchView--results.collection--results.AssetSearchView--results--phoenix > div.sc-1xf18x6-0.haVRLx.AssetsSearchView--assets > div.fresnel-container.fresnel-greaterThanOrEqual-sm > div > div > div:nth-child(1) > div > article > a > div.sc-1xf18x6-0.sc-1twd32i-0.sc-jjxyhg-0.sc-nedjig-5.kAcptF.kKpYwv.gakOkv.eAfDhQ > div > div.sc-1xf18x6-0.sc-1twd32i-0.sc-1wwz3hp-0.eGajrB.kKpYwv.kuGBEl > div.AssetCardFooter--price > div > div.sc-7qr9y8-0.iUvoJs.Price--amount',
  floorPrice: '#main > div > div > div.sc-1xf18x6-0.sc-z0wxa3-0.hnKAL.hWJuuu > div > div.sc-1xf18x6-0.haVRLx > div > div.fresnel-container.fresnel-greaterThanOrEqual-md > div > div:nth-child(6) > a > div > span.sc-1xf18x6-0.sc-1w94ul3-0.sc-tbkx81-0.haVRLx.fJzOgY.styledPhoenixText > div',
  noItems: '#main > div > div > div.sc-1xf18x6-0.sc-z0wxa3-0.gczeyg.hWJuuu > div > div.sc-1po1rbf-6.bUKivE > div.sc-1xf18x6-0.bozbIq.AssetSearchView--main > div.AssetSearchView--results.collection--results.AssetSearchView--results--phoenix > div.sc-ixw4tc-0.kyBdWA',
  supply: '#main > div > div > div.sc-1xf18x6-0.sc-z0wxa3-0.hnKAL.hWJuuu > div > div.sc-1po1rbf-6.bUKivE > div.sc-1xf18x6-0.cPWSa-d.AssetSearchView--main > div.AssetSearchView--results.collection--results.AssetSearchView--results--phoenix > div.fresnel-container.fresnel-greaterThanOrEqual-md > div > p',
}
let dunkGenesis = {
  floorPrice: 0,
  supply: 0,
  equippedSupply: 0,
  traits: {
    human: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    robot: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    demon: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    angel: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    reptile: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    undead: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    murakami: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    alien: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
  }
};
let mnlth = {
  floorPrice: 0
};
let mnlth2 = {
  floorPrice: 0
};
let skinVial = {
  floorPrice: 0,
  supply: 0,
  traits: {
    human: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    robot: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    demon: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    angel: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    reptile: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    undead: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    murakami: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
    alien: {
      floorPrice: 0,
      supply: 0,
      supplyListed: 0
    },
  }
};
let timeout = 30000;
let errors = 0;

const retrieveSupply = async (page) => {
  return await page.$eval(selectors.supply, e => parseInt(e.textContent
    .replace(" ", "")
    .replace(",", ""))
  );
};

const retrieveFirstListingPrice = async (page) => {
  return await page.$eval(selectors.firstListingPrice, e => parseFloat(e.textContent));
}

const toClick = async (page, selector) => {
  try {
    await page.click(selector);
    await page.waitForSelector(selectors.firstListingPrice, {timeout});
  } catch (e) {
    console.log(`First listing not found for ${selector} on ${page.url} check for "no items"`);
    await page.waitForSelector(selectors.noItems, {timeout: 10000});
  }
}

const retrieveEquippedDunk = async (page) => {
  try {
    await toClick(page, selectors.box.vialBoxDunk);
    await toClick(page, selectors.box.equippedBox);
    dunkGenesis.equippedSupply = await retrieveSupply(page);
  } catch (e) {console.log(e)}
}

const retrieveTraitsData = async (page, selector, data) => {
  try {
    await toClick(page, selector);
    data.supply = await retrieveSupply(page);
    await toClick(page, selectors.buyNow);
    data.supplyListed = await retrieveSupply(page);
    if (data.supplyListed > 0)
      data.floorPrice = await retrieveFirstListingPrice(page);
    else
      data.floorPrice = 0;
    await toClick(page, selector);
    await toClick(page, selectors.buyNow);
  } catch (err) {console.log(`selector: ${selector} not found.`)}
}

const retrieveMnlthData = async (browser) => {
  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');

    await page.goto('https://opensea.io/collection/rtfkt-mnlth');
    await page.waitForSelector(selectors.floorPrice, {timeout});
    mnlth.floorPrice = await page.$eval(selectors.floorPrice, e => parseFloat(e.textContent));
    page.close();
  } catch (err) {
    console.log('Error while trying to access MNLTH data.')
    errors += 1;
  }
}

const retrieveMnlth2Data = async (browser) => {
  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');

    await page.goto('https://opensea.io/collection/rtfktmonolith');
    await page.waitForSelector(selectors.floorPrice, {timeout});
    mnlth2.floorPrice = await page.$eval(selectors.floorPrice, e => parseFloat(e.textContent));
    page.close();
  } catch (err) {
    console.log('Error while trying to access MNLTH2 data.')
    errors += 1;
  }
}

const retrieveDunkGenesisData = async (browser) => {
  try {
    const collectionSlug = 'rtfkt-nike-cryptokicks';
    const url = `https://opensea.io/collection/${collectionSlug}?search[sortAscending]=true&search[sortBy]=PRICE`;
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');

    await page.goto(url);
    await page.waitForSelector(selectors.floorPrice, {timeout});
    dunkGenesis.floorPrice = await page.$eval(selectors.floorPrice, e => parseFloat(e.textContent));
    dunkGenesis.supply = await retrieveSupply(page);

    await toClick(page, selectors.box.dnaBoxDunk);
    await retrieveTraitsData(page, selectors.box.humanBox, dunkGenesis.traits.human);
    await retrieveTraitsData(page, selectors.box.robotBox, dunkGenesis.traits.robot);
    await retrieveTraitsData(page, selectors.box.demonBox, dunkGenesis.traits.demon);
    await retrieveTraitsData(page, selectors.box.angelBox, dunkGenesis.traits.angel);
    await retrieveTraitsData(page, selectors.box.reptileBox, dunkGenesis.traits.reptile);
    await retrieveTraitsData(page, selectors.box.undeadBox, dunkGenesis.traits.undead);
    await retrieveTraitsData(page, selectors.box.murakamiBox, dunkGenesis.traits.murakami);
    await retrieveTraitsData(page, selectors.box.alienBox, dunkGenesis.traits.alien);
    await retrieveEquippedDunk(page);
    page.close();
  } catch (err) {
    console.log('Error while trying to access Dunk Genesis data.');
    errors += 1;
  }
}

const retrieveSkinVialData = async (browser) => {
  try {
    const collectionSlug = 'skinvial-evox';
    const url = `https://opensea.io/collection/${collectionSlug}?search[sortAscending]=true&search[sortBy]=PRICE`;
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');

    await page.goto(url);
    await page.waitForSelector(selectors.floorPrice, {timeout});
    skinVial.floorPrice = await page.$eval(selectors.floorPrice, e => parseFloat(e.textContent));
    skinVial.supply = await retrieveSupply(page);
    await toClick(page, selectors.box.dnaBoxVial);
    await retrieveTraitsData(page, selectors.box.humanBox, skinVial.traits.human);
    await retrieveTraitsData(page, selectors.box.robotBox, skinVial.traits.robot);
    await retrieveTraitsData(page, selectors.box.demonBox, skinVial.traits.demon);
    await retrieveTraitsData(page, selectors.box.angelBox, skinVial.traits.angel);
    await retrieveTraitsData(page, selectors.box.reptileBox, skinVial.traits.reptile);
    await retrieveTraitsData(page, selectors.box.undeadBox, skinVial.traits.undead);
    await retrieveTraitsData(page, selectors.box.murakamiBox, skinVial.traits.murakami);
    await retrieveTraitsData(page, selectors.box.alienBox, skinVial.traits.alien);
    page.close();
  } catch (err) {
    console.log('Error while trying to access Skin Vials data.');
    errors += 1;
  }
}

const retrieveData = async () => {
  const start = performance.now();
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1200,
      height: 800
    }
  });
  let data = {};

  if (fs.existsSync('./commands/data.json'))
    data = JSON.parse(fs.readFileSync('./commands/data.json'));
  else
    data.lastSuccessfullUpdate = 0;

  errors = 0;
  await Promise.all([
    retrieveMnlthData(browser),
    retrieveMnlth2Data(browser),
    retrieveDunkGenesisData(browser),
    retrieveSkinVialData(browser)
  ]);
  await browser.close();

  console.log(performance.now() - start);
  return ({
    mnlth,
    mnlth2,
    skinVial,
    dunkGenesis,
    lastUpdate: Date.now(),
    lastSuccessfullUpdate: errors >= 1 ? data.lastSuccessfullUpdate : Date.now()
  });
}

const updateJSON = async () => {
  const data = await retrieveData();
  const json = JSON.stringify(data);

  fs.writeFile('./commands/data.json', json, () => console.log('json updated.'));
}

(async () => {
  await updateJSON();
  cron.schedule('*/5 * * * *', async () => {
    await updateJSON();
  })
})();
