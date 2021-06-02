const { curlGet } = require('./src/curlCheck');
const { pingSmktest } = require('./src/pingCheck');

async function runSmokeTest(options) {
  console.log('@1Marker-No:_354467327');

  // Data format **********
  options = {
    smktest: {
      tests: {
        ping: [
          {
            url: '192.168.1.1',
            name: 'test',
          },
          {
            url: 'google.com',
            name: 'test',
          },
          {
            url: 'yahoo.csssom',
            name: 'test',
          },
        ],
        curl: [
          {
            curl: 'https://www.google.com/',
            passTest: true,
            name: 'test',
          },
          {
            curl: 'www.google22222.com',
            passTest: true,
            name: 'test',
          },
        ],
      },
    },
  };

  options = await pingSmktest(options); // Check ping
  options = await curlGet(options); // Check Curl

  console.log('>>>>>-937600778>>>>>');
  console.log(options);
  console.log('<<<<<<<<<<<<<<<<<<<');
  return options;
}

runSmokeTest(undefined);
