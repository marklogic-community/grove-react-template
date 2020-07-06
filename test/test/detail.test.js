const puppeteer = require('puppeteer');
const utils = require('../utils');

describe('detail', () => {
  let browser, page;
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto('http://localhost:3000');

    await utils.login(page);
  });

  afterEach(() => browser.close());

  it('works', async () => {
    expect.assertions(1);
    await page.goto(
      'http://localhost:3000/detail?id=%2Fsample-data%2Fdata-2240.json&something=else'
    );
    // TODO: this method could cause false positives, if
    // "Hello, Townsend Frank!" existed on the bad page ...
    let detailHandle;
    try {
      detailHandle = await page.waitForSelector('#detail', {
        timeout: 2000
      });
    } catch (e) {
      if (e.name === 'TimeoutError') {
        // show us what is in div#root for more helpful test failure
        detailHandle = await page.$('#root');
      } else {
        throw e;
      }
    }
    let detailHtml = await page.evaluate(d => d.innerHTML, detailHandle);
    detailHandle.dispose();
    expect(detailHtml).toContain('Hello, Townsend Frank!');
  });
});
