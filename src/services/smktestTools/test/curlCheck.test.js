//! For run the test is necessary to have access one cluster:
const { curlGet } = require('../src/curlCheck');
//? Check if is possible

test('Test function: curlCheck ', async () => {
  //! Is possible use /api-docs

  options = {
    smktest: {
      tests: {
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

  options = await curlGet(options); // Check Curl

  let passTest = false;
  for (const key in options.curlResponse) {
    let element = options.curlResponse[key];

    if (String(element.statusCode).substr(0, 1) === '2') {
      passTest = true;
    }
  }

  expect(passTest).toBe(true);
});
