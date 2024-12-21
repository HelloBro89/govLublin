const { startBot } = require('./src/startBot');
const { getWarsawTime } = require('./src/utils/index');

const runInterval = async () => {
  try {
    const launchTime = getWarsawTime();
    // setInterval(async () => {
    //   await startBot();
    // }, 25000);
    console.log({ launchTime });
    await startBot(launchTime);
  } catch (error) {
    console.error('Error: ', error);
  }
};

(async () => {
  await runInterval();
  console.log('\n -------------- FINISH --------------');
})();
