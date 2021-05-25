const shell = require('shelljs');
import inquirer from 'inquirer';
import { createTable } from './smktestSwagger';

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

  let data = [];
  for (const key in containers) {
    let element = containers[key];
    delete element.Labels;
    data.push(element);
  }

  //   options.docker.containers = data;

  return options;
}

async function createConsoleDockerTable(options) {
  let containers = options.docker.containers;

  let trainOptionsList = [];
  for (const key in containers) {
    let element = containers[key];
    trainOptionsList.push(
      `${key}) ${element.Names[0]}:${element.Ports[0].PrivatePort}`
    );
  }

  options.docker.trainOptionsList = trainOptionsList;
  return options;
}

async function dockerOptions(options) {
  options = await getDockerContainers(options); // Get dockers data
  options = await dockerFormaterTrain(options); // Clean data dockers
  options = await createConsoleDockerTable(options); // Create table data for select console services.

  await createTestCurl(options);
  return options;
}

async function createTestCurl(options) {
  for (const key in options.docker.containers) {
    let element = options.docker.containers[key];

    let host = element.Names[0];
    host = host.substr(1, host.length);
    console.log(element);

    for (const key in element.Ports) {
      let port = element.Ports[key];

      let portsList = host + ':' + port.PublicPort;
      //TODO add here the axios query here connect to portsList
    }
  }

  return options;
}
export default async function promptDocker(options) {
  await dockerOptions(options);

  //   let questions = [];
  //   if (options.context === 'docker') {
  //     options = await dockerOptions(options); // Get docker options

  //     questions.push({
  //       type: 'checkbox',
  //       name: 'dockerContainers',
  //       default: true,
  //       message: '--Do you want use all containers for smktest?',
  //       choices: options.docker.trainOptionsList,
  //     });

  //     questions.push({
  //       type: 'checkbox',
  //       name: 'dockerTest',
  //       default: true,
  //       message: '(default: All) What docker test do you want to apply?',
  //       choices: [
  //         'Ping-TCP',
  //         'Check Logs errors',
  //         'Check all service active',
  //         'Check volumes',
  //       ],
  //     });
  //   }

  //   const answers = await inquirer.prompt(questions);
  //   //TODO use this aswers for select services

  return options;
}
