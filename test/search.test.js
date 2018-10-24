const puppeteer = require('puppeteer');

describe('searching', () => {
  let browser, page;
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto('http://localhost:3000');

    await page.click('input[placeholder=Username]');
    await page.type('input[placeholder=Username]', 'admin');
    await page.click('input[placeholder=Password]');
    await page.type('input[placeholder=Password]', 'admin');
    await page.click('button[type=Submit]');
  });

  afterEach(() => browser.close());

  it('finds some results', async () => {
    expect.assertions(1);
    const searchButton = await page.waitForSelector('.ml-execute-search', {
      timeout: 1000
    });
    await searchButton.click();
    searchButton.dispose();

    await page.waitForSelector('.ml-search-results');
    const numberofResults = (await page.$$('.ml-search-result')).length;
    expect(numberofResults).toBe(10);
  });

  it('reports when there are no matching results', async () => {
    expect.assertions(1);
    const searchBar = await page.waitForSelector('.ml-qtext-input', {
      timeout: 1000
    });
    await searchBar.click();
    await searchBar.type('"This does not exist: jlkjlksjdf"');
    const searchButton = await page.$('.ml-execute-search');
    await searchButton.click();
    searchBar.dispose();
    searchButton.dispose();

    const resultsHandle = await page.waitForSelector('.ml-search-results');
    const resultHtml = await page.evaluate(d => d.innerHTML, resultsHandle);
    resultsHandle.dispose();
    expect(resultHtml).toContain('No results matched your search');
  });

  xit('works for a document with an escape sequence', async () => {
    expect.assertions(2);
    const searchBar = await page.waitForSelector('.ml-qtext-input', {
      timeout: 1000
    });
    await searchBar.click();
    await searchBar.type('"I have an escape sequence."');
    const searchButton = await page.$('.ml-execute-search');
    await searchButton.click();
    searchBar.dispose();
    searchButton.dispose();

    await page.waitForSelector('.ml-search-results');
    const linkToDetail = await page.$('.ml-search-result a');
    const detailHref = await page.evaluate(a => a.href, linkToDetail);
    expect(detailHref).toContain('%2FwithEscapeSequence%2520LikeThat');
    const resultHtml = await page.evaluate(d => d.innerHTML, linkToDetail);
    expect(resultHtml).toContain('I have an escape sequence');
    await linkToDetail.click();
  });
});
