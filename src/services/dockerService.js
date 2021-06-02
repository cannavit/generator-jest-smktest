const shell = require('shelljs');
import inquirer from 'inquirer';
import { createTable } from './smktestSwagger';
import axios from 'axios';
import { response } from 'express';
const curlirize = require('axios-curlirize');
import { curlSmkTest } from './smktestCurl';

curlirize(axios);

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

  // await dockerCurlTrain(options);
  options = await dockerBuildSmktestStructure(options); // Get data for create smktest bases

  let responseData = await curlSmkTest(options.docker.trainData); // create train data docker
  options.docker.responseData = responseData;

  return options;
}

async function dockerPingTrain(options) {
  console.log('@1Marker-No:_354467327');

  let test = [];

  return options;
}

async function dockerBuildSmktestStructure(options) {
  //
  let trainData = [];
  //
  for (const key in options.docker.containers) {
    //
    let element = options.docker.containers[key];
    let host = element.Names[0];
    host = host.substr(1, host.length);

    let portList = [];
    let urlList = [];
    for (const key in element.Ports) {
      let port = element.Ports[key].PublicPort;
      if (port) {
        portList.push(port);
        if (!urlList.find((data) => data === host + ':' + port)) {
          urlList.push(host + ':' + port);
        }
        if (!urlList.find((data) => data === 'http://localhost:' + port)) {
          urlList.push('http://localhost:' + port);
        }
        if (!urlList.find((data) => data === 'https://localhost:' + port)) {
          urlList.push('https://localhost:' + port);
        }
      }
    }

    let data = {
      service: '',
      name: host,
      ports: [...new Set(portList)],
      urlList: urlList,
    };

    trainData.push(data);
  }

  options.docker.trainData = trainData;

  return options;
}

async function dockerCurlTrain(options) {
  //
  let curlResponses = [];
  //
  for (const key in options.docker.containers) {
    //
    let element = options.docker.containers[key];

    let host = element.Names[0];
    host = host.substr(1, host.length);

    for (const key in element.Ports) {
      let port = element.Ports[key];

      let portsListContainer = host + ':' + port.PrivatePort;
      let portsListLocalhost = 'http://localhost:' + port.PrivatePort;

      //TODO add here the axios query here connect to portsList

      let response;
      let url;
      try {
        response = await axios.get(portsListLocalhost, {
          timeout: 6500,
          curlirize: false,
        });
        url = portsListLocalhost;
      } catch (error) {
        try {
          response = await axios.get(portsListContainer, {
            timeout: 6500,
            curlirize: false,
          });

          url = portsListContainer;
        } catch (error) {
          url = portsListContainer;
        }
      }

      let responseData = {
        type: 'dockerCurl',
        statusCode: response ? response.status : 600,
        statusText: response ? response.statusText : 'error',
        data: response ? response.data : '',
        curl: response ? response.config.curlCommand : '',
        url: url,
      };

      curlResponses.push(responseData);
    }

    options.docker.trainTestReport = curlResponses;

    return options;
  }
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
