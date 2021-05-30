const k8s = require('@kubernetes/client-node');

module.exports.getKS = async function () {
  let k8sApi;
  try {
    // ! Use outside of cluster.
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  } catch (error) {
    // ! Use inside of cluster.
    k8sApi = k8s.Config.fromCluster();
  }

  return k8sApi;
};
