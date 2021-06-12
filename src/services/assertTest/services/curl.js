const { evalCurl } = require('../../smktestTools/src/curlCheck');
const assert = require('assert');

export async function curlSingleTest(options) {
  options = await evalCurl(options);

  let stdout = options.assertResponse.curl.stdout;

  let passTest = false;

  if (stdout) {
    passTest = true;
  }

  //! Check if curl
  assert(passTest === true, 'Error with assertCurl: ' + options.assertCurl);

  //! Check if exist code 500 or 400 family.
  let dataJson;
  try {
    dataJson = JSON.parse(stdout);
  } catch (error) {}
  passTest = true;
  let variableName, codeValue;

  for (const key in dataJson) {
    if (String(key).toLowerCase().includes('code')) {
      variableName = String(key);
      codeValue = dataJson[key];

      if (String(codeValue).substring(0, 1) !== '2') {
        passTest = false;
      }
    }

    if (String(key).toLowerCase().includes('status')) {
      variableName = String(key);
      codeValue = dataJson[key];

      if (String(codeValue).substring(0, 1) !== '2') {
        passTest = false;
      }
    }
  }

  assert(
    passTest === true,
    'Error in Response of the CURL  ' + variableName + '=' + codeValue
  );

  options.assertResponse.curl.passTest = passTest;
  options.assertResponse.curl.response;
  return options;
}
