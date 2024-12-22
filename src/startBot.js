const { chrome, brave } = require('../config/mainConfig.json');
const runBrowser = require('../runner/chrome');

const {
  waitForResponse,
  handleJsonFile,
  formatDate,
  checkFile,
  wait,
  getWarsawTime,
} = require('../src/utils');

const SELECTORS = {
  registerBtn: '#Operacja2 > div:nth-child(2) button',
  nextBtn: '.wizard-card-footer button',
  arrowNextMonth: '.vc-arrow.is-right',
  arrowNextMonthDisabled: '.vc-arrow.is-right.is-disabled',
  datePage: '.vc-pane-container .vc-title',
  february: `xpath/.//div[contains(@class, 'vc-pane-container')]//div[contains(@class, 'vc-title') and contains(text(), 'luty 2025')]`,
  activeDays: '.vc-pane-container .vc-day span:not(.is-disabled)',
};

const startBot = async (launchTime) => {
  const { page, browser } = await runBrowser(chrome);
  await page.goto(chrome.URL_START, {
    waitUntil: 'domcontentloaded',
  });
  await wait(2000);

  await page.waitForSelector(SELECTORS.registerBtn);
  await wait(2000);
  await page.click(SELECTORS.registerBtn);

  const res = await waitForResponse(
    page,
    'https://webqms.lublin.uw.gov.pl/api/Slot/GetAvailableDaysForOperation',
  );
  const responseBody = JSON.parse(await res.text());
  const { availableDays, disabledDays, minDate, maxDate } = responseBody;

  // ------- logs logic
  const outputFileName = `${launchTime}.json`;
  const outputFilePath = `./output/${outputFileName}`;

  const currentFile = await checkFile(outputFilePath);

  const lastCompareDateTo = currentFile ? currentFile.at(-1).maxDate : maxDate;

  const isDateRefreshed = currentFile
    ? formatDate(currentFile.at(-1).maxDate) !== formatDate(maxDate)
    : false;

  handleJsonFile(outputFilePath, {
    launchTime,
    availableDays,
    minDate,
    maxDate,
    lastCompareDateTo: formatDate(lastCompareDateTo),
    isDateRefreshed,
    jobTime: getWarsawTime(),
  });

  await browser.close();
};

module.exports = { startBot };
