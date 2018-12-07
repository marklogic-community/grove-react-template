const puppeteer = require('puppeteer');
const utils = require('../utils');

describe('login', () => {
  let browser, page;
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto('http://localhost:3000');
  });

  afterEach(() => browser.close());

  it('allows login after bad attempt', async () => {
    await utils.login(page, { password: 'bad-password' });
    await utils.login(page);
    const searchButton = await page.waitForSelector('.ml-execute-search', {
      timeout: 2000
    });
    expect(searchButton).toBeTruthy();
  });
});
