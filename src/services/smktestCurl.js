import axios from 'axios';

const curlirize = require('axios-curlirize');
curlirize(axios);

export async function curlSmkTest(dataCurl) {
  let responseData = [];
  for (const key in dataCurl) {
    let container = dataCurl[key];

    for (const key in container.urlList) {
      let url = container.urlList[key];
      let response;

      try {
        response = await axios.get(url, {
          timeout: 6500,
          curlirize: true,
        });
      } catch (error) {}

      let urlResponse = {
        name: container.name,
        url: url,
        statusCode: response ? response.status : 600,
        statusText: response ? response.statusText : 'error',
        data: response ? response.data : '',
        curl: response ? response.config.curlCommand : '',
      };

      responseData.push(urlResponse);
    }
  }

  return responseData;
}
