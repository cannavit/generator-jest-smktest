//! For run the test is necessary to have access one cluster:
const { collectConfigKube, getPods, getLogs, getServices } = require('./index');
//? Check if is possible

test('Kubernetes smokeTest check if can read Pods', async () => {
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
