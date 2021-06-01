//! For run the test is necessary to have access one cluster:
const {
  collectConfigKube,
  getPods,
  getLogs,
  getServices,
} = require('../index');
//? Check if is possible

async function test(options) {
  console.log('@1Marker-No:_354467327');

  options = {
    testConfig: {
      kubernetes: {
        namespace: 'edutelling-develop',
      },
    },
  };

  options = await getPods(options); // Get Pods Name
  options = await getServices(options); // Get Pods Name
  options = await getLogs(options); // Get Pods Name

  console.log('>>>>>-571666021>>>>>');
  console.log(options.testConfig.kubernetes);
  console.log('<<<<<<<<<<<<<<<<<<<');

  console.log('>>>>> Services DATA checkCurl>>>>>');
  console.log(options.testConfig.kubernetes.services[0].checkCurl);
  console.log('<<<<<<<<<<<<<<<<<<<');

  return options;
}

//node src/services/kubernetesApi/test/example.js
test(); // Example function
