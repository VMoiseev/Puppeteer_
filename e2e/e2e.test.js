/* eslint-disable no-underscore-dangle */
import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // headless: false, // show gui
      // slowMo: 500,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('Should valid card number', async () => {
    await page.goto(baseUrl);
    const widget = await page.$('[data-widget=card-validator-widget]');
    const input = await widget.$('[data-id=input]');
    await input.type('3540123456789016');
    await input.press('Enter');
    const result = await widget.$('[data-id=result]');
    const status = await result.getProperty('className');
    expect(status._remoteObject.value).toBe('result valid');
  });

  test('Should invalid card number', async () => {
    await page.goto(baseUrl);
    const widget = await page.$('[data-widget=card-validator-widget]');
    const input = await widget.$('[data-id=input]');
    await input.type('0000');
    await input.press('Enter');
    const result = await widget.$('[data-id=result]');
    const status = await result.getProperty('className');
    expect(status._remoteObject.value).toBe('result');
  });
});
