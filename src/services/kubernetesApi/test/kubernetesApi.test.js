//! For run the test is necessary to have access one cluster:
const {
  collectConfigKube,
  getPods,
  getLogs,
  getServices,
} = require('../index');
//? Check if is possible

test('Kubernetes smokeTest check if can read PODS', async () => {
  //! Is possible use /api-docs

  let options = {
    testConfig: {
      kubernetes: {
        namespace: 'edutelling-develop',
      },
    },
  };

  options = await getPods(options); // Get Pods Name

  pods = options.testConfig.kubernetes.pods;

  let existPod = false;
  for (const key in pods) {
    let pod = pods[key];
    let name = pod.pod;

    if (name) {
      existPod = true;
    }
  }

  expect(existPod).toBe(true);
});

test('Kubernetes smokeTest check if can read SERVICES', async () => {
  //! Is possible use /api-docs

  let options = {
    testConfig: {
      kubernetes: {
        namespace: 'edutelling-develop',
      },
    },
  };

  options = await getServices(options); // Get Pods Name

  services = options.testConfig.kubernetes.services;

  let existPod = false;
  for (const key in services) {
    let service = services[key];

    let port = service.port;

    if (port) {
      existPod = true;
    }
  }

  expect(existPod).toBe(true);
});

test('Kubernetes smokeTest check if can read LOGS', async () => {
  //! Is possible use /api-docs

  let options = {
    testConfig: {
      kubernetes: {
        namespace: 'edutelling-develop',
      },
    },
  };

  options = await getPods(options); // Get Pods Name
  options = await getServices(options); // Get Pods Name
  options = await getLogs(options); // Get Pods Name

  logs = options.testConfig.kubernetes.logs;

  let existPod = false;
  for (const key in logs) {
    //

    let log = logs[key];

    logData = log;

    if (logData.name) {
      existPod = true;
    }
  }

  expect(existPod).toBe(true);
});
