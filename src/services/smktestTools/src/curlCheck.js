const inquirer = require('inquirer');
const axios = require('axios');
const curlirize = require('axios-curlirize');
var shell = require('shelljs');

curlirize(axios);

// Curl Get
module.exports.curlGet = async function (options) {
  //
  let curlResponses = [];

  let testCurl = options.smktest.tests.curl;

  for (const key in testCurl) {
    let element = testCurl[key];

    let portsListContainer = element.curl;

    try {
      response = await axios.get(portsListContainer, {
        timeout: 6500,
        curlirize: false,
      });
    } catch (error) {}

    //! Check if have error content inside of the response
    let errorList = ['error'];
    let isBodyError = false;

    if (response) {
      for (const key in errorList) {
        let e = errorList[key];
        if (response.data.includes(e)) {
          isBodyError = true;
        }
      }
    }

    let responseData = {
      type: element.name,
      statusCode: response ? response.status : 600,
      statusText: response ? response.statusText : 'error',
      data: response ? response.data : '',
      curl: response ? response.config.curlCommand : '',
      url: portsListContainer,
      isBodyError: isBodyError,
    };

    curlResponses.push(responseData);
  }
  options.curlResponse = curlResponses;

  return options;
};

module.exports.evalCurl = async function (options) {
  //

  let response;
  try {
    response = await shell.exec(options.assertCurl, {
      silent: true,
    });
  } catch (error) {}

  options.assertResponse = {
    curl: response,
  };

  return options;
};
