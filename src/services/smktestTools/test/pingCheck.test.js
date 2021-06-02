//! For run the test is necessary to have access one cluster:
const { pingSmktest } = require('../src/pingCheck');
//? Check if is possible

test('Test function: pingCheck ', async () => {
  //! Is possible use /api-docs

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
      },
    },
  };

  options = await pingSmktest(options); // Check Curl

  let passTest = false;
  for (const key in options.pingIsAlive) {
    let element = options.pingIsAlive[key];
    if (element.isAlive) {
      passTest = true;
    }
  }

  expect(passTest).toBe(true);
});
