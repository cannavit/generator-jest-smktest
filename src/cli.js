import arg from 'arg';
import inquirer from 'inquirer';
import { createProject, runMultiTasks } from './main';
import figlet from 'figlet';

import { generateCasesSwagger } from './services/smktestSwagger';
// https://www.twilio.com/blog/how-to-build-a-cli-with-node-js

// Kubernetes:
import { cliKubernetes } from './services/kubernetesApi/cli.js';
//Single Test.
import { curlSingleTest } from './services/assertTest/services/curl';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--criterial': String,
      '--context': String,
      '--environmentVariable': String,
      '--environment': String,
      '--scannerApi': Boolean,
      '--auto-detect': Boolean,
      '--namespace': String,
      '--scannerApiMethod': Boolean,
      '--create-config-file': Boolean,
      '--swaggerUrl': String,
      '--curlLogin': String,
      '--assert-curl': String,
      '--project-name': String,
      '--mode-auto': Boolean,
      '-c': '--criterial',
      '-c': '--context',
      '-s': '--scannerApi',
      '-a': '--auto-detect',
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    skipPrompts: args['--yes'] || false,
    projectName: args['--project-name'] || undefined,
    environmentVariable: args['--environmentVariable'] || 'NODE_ENV',
    environment: args['--environment'] || undefined,
    context: args['--context'] || undefined,
    createConfigFile: args['--create-config-file'] || false,
    modeAuto: args['--mode-auto'] || false,
    assertCurl: args['--assert-curl'] || undefined,
    criterial: args._[2],
    scannerApiMethod: args._[3],
    curlLogin: args._[4] || '',
    scannerApi: arg['--scannerApi'] || false,
    autoDetect: arg['--auto-detect'] || false,
    namespace: args['--namespace'] || undefined,
  };
}

// if (!options.criterial) {
//   questions.push({
//     type: 'rawlist',
//     name: 'criterial',
//     message: 'Please choose a criterion to apply the smoke test:',
//     choices: [
//       'Execution unit coverage',
//       'Service coverage',
//       'Service Protocol Coverage',
//       'Resources Up',
//       'Everything Up',
//       'Endpoints coverage',
//       'Full Service Coverage',
//       'Dependency coverage',
//       'System coverage',
//     ],
//   });
// }

//! 1) Option: Criterial.

async function promptForContext(options) {
  const defaultSelection = 'localhost';

  if (options.skipPrompts) {
    return {
      ...options,
      criterial: options.context || defaultSelection,
    };
  }

  const questions = [];

  if (!options.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Add your projectName:',
    });
  }

  if (!options.environmentVariable) {
    questions.push({
      type: 'input',
      name: 'environmentVariable',
      message: 'Add an environment variable to associate (example: NODE_ENV):',
    });
  }

  if (!options.environment) {
    questions.push({
      type: 'input',
      name: 'environment',
      message:
        'Add the smoke test environment where apply the test (example: develop, production, test):',
    });
  }

  if (!options.context) {
    questions.push({
      type: 'rawlist',
      name: 'context',
      message: 'Please choose a smoke test context:',
      choices: ['localhost', 'specific host', 'docker', 'kubernetes'],
    });
  }

  // if (!options.scannerApiMethod) {
  //   questions.push({
  //     type: 'rawlist',
  //     name: 'scannerApiMethod',
  //     message: 'Select one scanner api method:',
  //     choices: ['Swagger/OpenApi', 'GraphQL', 'None'],
  //   });
  // }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    projectName: options.projectName || answers.projectName,
    environmentVariable:
      options.environmentVariable || answers.environmentVariable,
    environment: options.environment || answers.environment,
    context: options.context || answers.context,
    // scannerApiMethod: options.scannerApiMethod || answers.scannerApiMethod,
  };
}

async function promptForScannerAPI(options) {
  //! Context localhost:

  if (options.skipPrompts) {
    return {
      ...options,
      curlLogin: options.curlLogin || '',
      swaggerUrl: options.swaggerUrl || '',
    };
  }

  const questions = [];
  if (options.scannerApiMethod === 'Swagger/OpenApi') {
    // Add the API url swagger

    if (!options.swaggerUrl) {
      questions.push({
        type: 'input',
        name: 'swaggerUrl',
        message:
          'Add you swagger documentation url, example: https://.../v2/swagger.json (N/None)',
      });
    }

    if (!options.curlLogin) {
      questions.push({
        type: 'input',
        name: 'curlLogin',
        message:
          'Copy your CURL for create one login, example: curl -X POST "https://... (N/None)',
      });
    }
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    swaggerUrl: options.swaggerUrl || answers.swaggerUrl,
    curlLogin: options.curlLogin || answers.curlLogin,
  };
}

import promptDocker from './services/dockerService';

export async function cli(args) {
  //! Presentation text:

  console.log(
    figlet.textSync('smkTest', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })
  );

  let options = parseArgumentsIntoOptions(args);

  options.projectDir = __dirname; // SmokeTest route
  options.smktestFolder = 'smktest'; // SmokeTet base directory

  options = await promptForContext(options);

  //! Run Context test.
  if (options.context === 'kubernetes') {
    // await cliKubernetes(options);
  }

  //! Run Direct Accerts >>>>

  if (options.assertCurl) {
    await curlSingleTest(options);
  }
  //! <<<<

  // options = await promptDocker(options);
  // options = await promptForScannerAPI(options);

  // runMultiTasks(options);
}

// create-smktest --project-name=test --environment=develop --context=kubernetes --namespace=NAMESPACE --mode-auto=true --assert-curl="curl www.google.com"

// create-smktest --project-name=test --environment=develop --context=kubernetes --namespace=NAMESPACE --mode-auto=true --assert-curl="curl -X 'GET' 'https://petstore.swagger.io/v2/store/inventory3' -H 'accept: application/json'"

// create-smktest --project-name=test --environment=develop --context=kubernetes --namespace=NAMESPACE --mode-auto=true --assert-curl='curl -X POST "https://edutelling-api-develop.openshift.techgap.it/api/v1/auth/authentication" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"email\": \"formazione@edutelling.it\", \"password\": \"Passw0rd\", \"stayLogged\": false }"'

// create-smktest --project-name=test --environment=develop --context=kubernetes --namespace=NAMESPACE --mode-auto=true --assert-curl='curl -X POST "https://pot-uat.paxitalia.com:8443/api/public/auth/signin" -H "accept: */*" -H "Content-Type: application/json" -d "{ \"password\": \"AdminPOT1111\", \"usernameOrEmail\": \"AdminPOT\"}"'

// docker run -it --rm --entrypoint sh smktest-master

// docker run -it smktest-master sh -c 'create-smktest --project-name=test --environment=develop --context=kubernetes --namespace=NAMESPACE --mode-auto=true --assert-curl="curl www.google.com"'

//docker push smktesting/smoke-master:tagname
