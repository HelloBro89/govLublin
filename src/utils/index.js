const fs = require('fs');
const cheerio = require('cheerio');

const getWarsawTime = () => {
  const date = new Date();

  const options = { timeZone: 'Europe/Warsaw' };
  const formatter = new Intl.DateTimeFormat('en-GB', options);

  const parts = formatter.formatToParts(date);

  const day = parts.find((part) => part.type === 'day').value;
  const month = parts.find((part) => part.type === 'month').value;
  const year = parts.find((part) => part.type === 'year').value;

  // Извлекаем часы и минуты с учетом временной зоны
  const hours = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-часовой формат
  }).format(date);

  const [hh, mm] = hours.split(':'); // Разделяем часы и минуты

  return `${day}-${month}-${year}---${hh}h-${mm}m`;
};

const wait = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const getHTML = async (page) => {
  const html = await page.evaluate(() => document.querySelector('html').outerHTML);
  return cheerio.load(html);
};

const waitForResponse = async (page, waitForUrl, statusCode = 200) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  page.waitForResponse((response) => {
    const сomparableUrl = response.url();
    const status = response.status();
    return сomparableUrl.startsWith(waitForUrl) && status === statusCode;
  });

const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const checkFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`\n File found while checking: ${filePath}`);
      const fileData = fs.readFileSync(filePath);
      return JSON.parse(fileData);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error while working with the file:', error);
    throw error;
  }
};

const handleJsonFile = (filePath, objectToAdd = {}) => {
  console.log(`\n +++++++++++ ${filePath}`);
  try {
    if (fs.existsSync(filePath)) {
      console.log(`\n File found: ${filePath}`);

      const fileData = fs.readFileSync(filePath);

      const jsonData = JSON.parse(fileData);
      console.log('Data to output: ', objectToAdd);
      jsonData.push(objectToAdd);

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log('\n Data successfully updated:', jsonData);

      return jsonData;
    } else {
      console.log(`\n The file not found: ${filePath}`);

      const initialData = [objectToAdd];
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
      console.log('\n Created a new file and added an object:', initialData);

      return initialData;
    }
  } catch (error) {
    console.error('Error while working with the file:', error);
    throw error;
  }
};

module.exports = {
  getWarsawTime,
  wait,
  getHTML,
  waitForResponse,
  formatDate,
  handleJsonFile,
  checkFile,
};
