const cron = require('node-cron');
const fs = require('node:fs');
const { performance } = require('perf_hooks');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const selectors = {
  buyNow: '#Body\\ react-aria-2 > div > div > button:nth-child(1)',
  clearFilter: '#main > div > div > div.Blockreact__Block-sc-1xf18x6-0.elqhCm > div > div > div > div.AssetSearchView--results.collection--results > div.AssetSearchView--results-header-pills > div > button',
  dunkGenesis: {
    humanBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(1)',
    robotBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(2)',
    demonBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(3)',
    angelBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(4)',
    reptileBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(5)',
    undeadBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(6)',
    murakamiBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(7)',
    alienBox: '#Body\\ react-aria-12 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(8)',
  },
  firstListingPrice: '#main > div > div > div.Blockreact__Block-sc-1xf18x6-0.elqhCm > div > div > div > div.AssetSearchView--results.collection--results > div.Blockreact__Block-sc-1xf18x6-0.elqhCm.AssetsSearchView--assets > div.fresnel-container.fresnel-greaterThanOrEqual-sm > div > div > div:nth-child(1) > div > article > a > div.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.SpaceBetweenreact__SpaceBetween-sc-jjxyhg-0.AssetCardFooterreact__StyledContainer-sc-nedjig-0.kLMBbO.jYqxGr.gJwgfT.cBTfDg > div > div.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.FlexColumnreact__FlexColumn-sc-1wwz3hp-0.hrRSNm.jYqxGr.ksFzlZ > div.AssetCardFooter--price > div',
  floorPrice: '#main > div > div > div.CollectionHeaderreact__DivContainer-sc-1woywpk-0.jgfqaE > div.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.fZLRIh.jYqxGr > div:nth-child(5) > div > div:nth-child(3) > a > div > div.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.elqhCm.jYqxGr.Info--icon > div > span > div',
  skinVial: {
    humanBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(1)',
    robotBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(2)',
    demonBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(3)',
    angelBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(4)',
    reptileBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(5)',
    undeadBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(6)',
    murakamiBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(7)',
    alienBox: '#Body\\ react-aria-10 > div > div > div.Scrollboxreact__DivContainer-sc-1b04elr-0.gUuGNP.StringTraitFilter--results > div > button:nth-child(8)'
  },
  supply: '#main > div > div > div.Blockreact__Block-sc-1xf18x6-0.elqhCm > div > div > div > div.AssetSearchView--results.collection--results > div.Blockreact__Block-sc-1xf18x6-0.fbumkB > div > p',
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

const retrieveSupply = async (page) => {
  return await page.$eval(selectors.supply, e =>
    parseInt(e.textContent
      .replace(" ", "")
      .replace(",", ""))
  );
};

const retrieveFirstListingPrice = async (page) => {
  return await page.$eval(selectors.firstListingPrice, e => parseFloat(e.textContent));
}

const toClick = async (page, selector) => {
  await page.$eval(selector, button => button.click());
  await page.waitForSelector(selectors.firstListingPrice, {timeout});
}

// todo: replace with correct selector method instead of URL access
const retrieveEquippedDunk = async (page) => {
  try {
    await page.goto('https://opensea.io/collection/rtfkt-nike-cryptokicks?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=VIAL&search[stringTraits][0][values][0]=EQUIPPED');
    await page.waitForSelector(selectors.floorPrice, {timeout});
    dunkGenesis.equippedSupply = await retrieveSupply(page);
  } catch (err) {console.log('Error while tryna access equipped dunks data.')}
}

const retrieveTraitsData = async (page, selector, data) => {
  try {
    await toClick(page, selector);
    data.supply = await retrieveSupply(page);
    await toClick(page, selectors.buyNow);
    data.floorPrice = await retrieveFirstListingPrice(page);
    data.supplyListed = await retrieveSupply(page);
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
  } catch (err) {console.log('Error while trying to access MNLTH data.')}
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
  } catch (err) {console.log('Error while trying to access MNLTH2 data.')}
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

    await retrieveTraitsData(page, selectors.dunkGenesis.humanBox, dunkGenesis.traits.human);
    await retrieveTraitsData(page, selectors.dunkGenesis.robotBox, dunkGenesis.traits.robot);
    await retrieveTraitsData(page, selectors.dunkGenesis.demonBox, dunkGenesis.traits.demon);
    await retrieveTraitsData(page, selectors.dunkGenesis.angelBox, dunkGenesis.traits.angel);
    await retrieveTraitsData(page, selectors.dunkGenesis.reptileBox, dunkGenesis.traits.reptile);
    await retrieveTraitsData(page, selectors.dunkGenesis.undeadBox, dunkGenesis.traits.undead);
    await retrieveTraitsData(page, selectors.dunkGenesis.murakamiBox, dunkGenesis.traits.murakami);
    await retrieveTraitsData(page, selectors.dunkGenesis.alienBox, dunkGenesis.traits.alien);
    await retrieveEquippedDunk(page);
    page.close();
  } catch (err) {console.log('Error while trying to access Dunk Genesis data.')}
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
    await retrieveTraitsData(page, selectors.skinVial.humanBox, skinVial.traits.human);
    await retrieveTraitsData(page, selectors.skinVial.robotBox, skinVial.traits.robot);
    await retrieveTraitsData(page, selectors.skinVial.demonBox, skinVial.traits.demon);
    await retrieveTraitsData(page, selectors.skinVial.angelBox, skinVial.traits.angel);
    await retrieveTraitsData(page, selectors.skinVial.reptileBox, skinVial.traits.reptile);
    await retrieveTraitsData(page, selectors.skinVial.undeadBox, skinVial.traits.undead);
    await retrieveTraitsData(page, selectors.skinVial.murakamiBox, skinVial.traits.murakami);
    await retrieveTraitsData(page, selectors.skinVial.alienBox, skinVial.traits.alien);
    page.close();
  } catch (err) {console.log('Error while trying to access Skin Vials data.')}
}

const retrieveData = async () => {
  const start = performance.now();
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: true
  });

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
    lastUpdate: Date.now()
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
