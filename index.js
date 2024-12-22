const { startBot } = require('./src/startBot');
const { getWarsawTime } = require('./src/utils/index');

const interval = 10 * 60 * 1000;

const runInterval = async () => {
  try {
    const launchTime = getWarsawTime();
    setInterval(async () => {
      await startBot(launchTime);
    }, interval);
    console.log({ launchTime });
    // await startBot(launchTime);
  } catch (error) {
    console.error('Error: ', error);
  }
};

(async () => {
  await runInterval();
  console.log('\n -------------- FINISH --------------');
})();
