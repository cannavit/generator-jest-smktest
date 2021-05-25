const axios = require('axios');
const express = require('express');
const curlirize = require('axios-curlirize');
curlirize(axios);
async function test() {
  console.log('@1Marker-No:_354467327');

  // initializing axios-curlirize with your axios instance

  // creating dummy route

  let response = await axios.get('https://www.keycdn.com', {
    curlirize: false,
  });

  console.log('>>>>>1689129193>>>>>');
  // console.log(response.config.curlCommand);
  console.log('<<<<<<<<<<<<<<<<<<<');
}

test();
