const shell = require('shelljs');

async function getDockerContainers(options) {
  //!
  let CURL = `curl --unix-socket /var/run/docker.sock http://localhost/v1.41/containers/json`;

  options.docker = {};

  let resultOfExec = await shell.exec(CURL, {
    silent: true,
  });

  options.docker.containers = JSON.parse(resultOfExec.stdout);
  options.docker.containerStdErr = resultOfExec.stderr;

  return options;
}

async function dockerFormaterTrain(options) {
  //!

  let containers = options.docker.containers;

  data = [];
  for (const key in containers) {
    let element = containers[key];
    delete element.Labels;
    data.push(element);
  }

  options.docker.containers = data;

  return options;
}

async function createConsoleDockerTable(options) {
  let containers = options.docker.containers;

  let trainOptionsList = [];
  for (const key in containers) {
    let element = containers[key];
    trainOptionsList.push({
      name: `${key}) ${element.Names[0]}:${element.Ports[0].PrivatePort}`,
      value: key,
    });
  }

  options.docker.trainOptionsList = trainOptionsList;
  return options;
}

export async function dockerOptions() {
  let options = {};
  options = await getDockerContainers(options); // Get dockers data
  options = await dockerFormaterTrain(options); // Clean data dockers
  options = await createConsoleDockerTable(options); // Create table data for select console services.

  return dockerOptions;
}

// dockerOptions();
