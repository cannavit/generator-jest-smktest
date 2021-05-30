const { getKS } = require('./connect');

module.exports.getLogs = async function (options) {
  const k8sApi = await getKS();

  let namespace = options.testConfig.kubernetes.namespace;
  let pods = options.testConfig.kubernetes.pods;

  let logs = [];

  for (const key in pods) {
    let pod = pods[key];
    let name = pod.pod;

    //TODO is necessary check how red with --since-time
    // public async readNamespacedPodLog (name: string, namespace: string, container?: string, follow?: boolean, insecureSkipTLSVerifyBackend?: boolean, limitBytes?: number, pretty?: string, previous?: boolean, sinceSeconds?: number, tailLines?: number, timestamps?: boolean, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: string;  }> {

    let dataLogs = await k8sApi.readNamespacedPodLog(
      name,
      namespace,
      undefined, //container
      undefined, // follow,
      undefined, //insecureSkipTLSVerifyBackend,
      undefined, // limitBytes
      true, //pretty,
      undefined, // previous
      2011, // sinceSeconds  //TODO add dynamic way for get seconds
      undefined, //tailLines,
      true //timestamps
    );
    k8sApi.readNamespacedPodL;

    let body = dataLogs.body;
    let isLogError = false;
    let logsShort;

    if (body) {
      // Check if exist one body for process it.
      let errorList = ['error'];

      for (const key in errorList) {
        let e = errorList[key];
        if (body.includes(e)) {
          isLogError = true;
        }
      }

      // Create short logs for create report.

      try {
        logsShort =
          body.substring(0, 100) +
          ' ........... ' +
          body.substring(body.length - 100, body.length);
      } catch (error) {
        logsShort = '';
      }
    }

    logs.push({
      name: name,
      logs: body ? body : '',
      isLogError: isLogError ? isLogError : false,
      logsShort: logsShort ? logsShort : '',
    });
  }
  // console.log(body);

  options.testConfig.kubernetes.logs = logs;
  return options;
};
