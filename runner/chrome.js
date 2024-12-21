const puppeteer = require('puppeteer');

module.exports = runBrowser = async (config) => {
  try {
    console.log(puppeteer.executablePath());
    const browserOptions = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-dev-profile',
        '--disable-extensions',
      ],
      ignoreHTTPSErrors: true,
      headless: false,
      defaultViewport: { width: 1500, height: 900 },
      devtools: false,
      // executablePath: config.executablePath,
      // userDataDir: config.userDataDir,
    };

    const browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();

    console.log(' -------------- START SCRAPING --------------');
    return { page, browser };
  } catch (err) {
    throw new Error(err);
  }
};
