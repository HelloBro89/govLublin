const { chrome } = require('../config/mainConfig.json');
const runBrowser = require('../runner/chrome');
const logs = require('../logs.json');
const { getWarsawTime, wait, getHTML } = require('../src/utils');

const SELECTORS = {
  registerBtn: '#Operacja2 > div:nth-child(2) button',
  nextBtn: '.wizard-card-footer button',
  arrowNextMonth: '.vc-arrow.is-right',
  arrowNextMonthDisabled: '.vc-arrow.is-right.is-disabled',
  datePage: '.vc-pane-container .vc-title',
  february: `xpath/.//div[contains(@class, 'vc-pane-container')]//div[contains(@class, 'vc-title') and contains(text(), 'luty 2025')]`,
  activeDays: '.vc-pane-container .vc-day span:not(.is-disabled)',
};

const startBot = async () => {
  const { page, browser } = await runBrowser(chrome);
  await page.goto(chrome.URL_START, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await page.waitForSelector(SELECTORS.registerBtn);
  await page.click(SELECTORS.registerBtn);

  await wait(1500);

  await page.waitForSelector(SELECTORS.nextBtn);
  await page.click(SELECTORS.nextBtn);

  await page.waitForSelector(SELECTORS.datePage);
  await wait(500);

  for (let i = 0; i < 4; i++) {
    console.log(`Попытка ${i + 1}... Кликаем по кнопке.`);
    await page.click(SELECTORS.arrowNextMonth);
    await wait(1000);

    const desiredMonth = await page.$$(SELECTORS.february);
    const disabledArrow = await page.$$(SELECTORS.arrowNextMonthDisabled);

    if (desiredMonth.length > 0) {
      console.log('The desired month has been found!');
      break; // Останавливаем цикл, если больше нельзя кликать
    }

    if (disabledArrow.length) {
      console.log('It is was a last month on the calendar!');
      break;
    }
  }

  // ------- logs logic

  const $ = await getHTML(page);

  await browser.close();
};

module.exports = { startBot };
