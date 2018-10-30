const puppeteer = require('puppeteer');
const utils = require('../utils');

describe('create page', () => {
  let browser, page;
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto('http://localhost:3000');

    await utils.login(page);
  });

  it('creates doc and redirects to detail page', async () => {
    expect.assertions(1);
    await page.goto('http://localhost:3000/create');
    await page.click('button[type=submit]');

    const detailHandle = await page.waitForSelector('#detail', {
      timeout: 1000
    });
    let detailHtml = await page.evaluate(d => d.innerHTML, detailHandle);
    detailHandle.dispose();
    expect(detailHtml).toContain('Enter JSON. It will be validated.');
  });
});
