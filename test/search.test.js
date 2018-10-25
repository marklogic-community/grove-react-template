const puppeteer = require('puppeteer');
const utils = require('./utils');

describe('searching', () => {
  let browser, page;
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto('http://localhost:3000');

    await utils.login(page);
  });

  afterEach(() => browser.close());

  it('finds some results', async () => {
    expect.assertions(1);
    const searchButton = await page.waitForSelector('.ml-execute-search', {
      timeout: 1000
    });
    await searchButton.click();

    await page.waitForSelector('.ml-search-results', {
      timeout: 1000
    });
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

    const resultsHandle = await page.waitForSelector('.ml-search-results', {
      timeout: 1000
    });
    const resultHtml = await page.evaluate(d => d.innerHTML, resultsHandle);
    expect(resultHtml).toContain('No results matched your search');
  });

  it('works for a document with an escape sequence', async () => {
    expect.assertions(5);
    const searchBar = await page.waitForSelector('.ml-qtext-input', {
      timeout: 1000
    });
    await searchBar.click();
    await searchBar.type('"I have an escape sequence."');
    const searchButton = await page.$('.ml-execute-search');
    await searchButton.click();

    await page.waitForSelector('.ml-search-results', {
      timeout: 1000
    });
    const cardLinkToDetail = await page.$('.ml-search-result a');
    const cardDetailHref = await page.evaluate(a => a.href, cardLinkToDetail);
    expect(cardDetailHref).toContain('%2FwithEscapeSequence%2520LikeThat');
    const resultHtml = await page.evaluate(d => d.innerHTML, cardLinkToDetail);
    expect(resultHtml).toContain('I have an escape sequence');

    const switchToListView = await page.$(
      'input[name=result-options][value=List]'
    );
    await switchToListView.click();
    const listLinkToDetail = await page.$('.ml-search-result a');
    const listDetailHref = await page.evaluate(a => a.href, listLinkToDetail);
    expect(listDetailHref).toContain('%2FwithEscapeSequence%2520LikeThat');
    await listLinkToDetail.click();

    let detailHandle = await page.waitForSelector('#detail', {
      timeout: 1000
    });
    let detailHtml = await page.evaluate(d => d.innerHTML, detailHandle);
    detailHandle.dispose();
    expect(detailHtml).toContain('I have an escape sequence');

    // regression test
    await page.goBack();
    await page.goForward();
    detailHandle = await page.waitForSelector('#detail', {
      timeout: 1000
    });
    detailHtml = await page.evaluate(d => d.innerHTML, detailHandle);
    detailHandle.dispose();
    expect(detailHtml).toContain('I have an escape sequence');
  });
});
