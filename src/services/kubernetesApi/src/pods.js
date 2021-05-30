const { getKS } = require('./connect');
const { getServices } = require('./services');
const { getLogs } = require('./logs');

module.exports.getPods = async function (options) {
  //
  const k8sApi = await getKS();
  let nameSpace = options.testConfig.kubernetes.namespace;
  let listNamespace = await k8sApi.listNamespacedPod(nameSpace);

  let dataPods = [];

  listNamespace.body.items.map((data) => {
    dataPods.push({
      nameSpace: data.metadata.namespace,
      pod: data.metadata.name, //TODO
      clusterName: data.metadata.clusterName,
      service: data.metadata.labels.app,
      statusReady: data.status.containerStatuses[0].ready,
      'stateRestartCount:': data.status.containerStatuses[0].restartCount,
      statusStarted: data.status.containerStatuses[0].started,
      image: data.status.containerStatuses[0].image,
      lastState: {
        running: data.status.containerStatuses[0].lastState.running,
        terminated: data.status.containerStatuses[0].lastState.terminated,
        waiting: data.status.containerStatuses[0].lastState.waiting,
      },
      state: data.status.containerStatuses[0].state,
      volumeName: data.spec.volumes,
    });
  });

  options.testConfig.kubernetes.pods = dataPods;

  listService = await k8sApi.listNamespacedService(nameSpace);

  //TODO get the port using the services
  return options;
};
