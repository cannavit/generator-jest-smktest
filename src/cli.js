import arg from 'arg';
import inquirer from 'inquirer';
import { createProject, runMultiTasks } from './main';
import figlet from 'figlet';

import { generateCasesSwagger } from './services/smktestSwagger';
// https://www.twilio.com/blog/how-to-build-a-cli-with-node-js

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
      '--scannerApiMethod': Boolean,
      '--swaggerUrl': String,
      '--curlLogin': String,
      // '--apiTestLevel': Number,
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
    environmentName: args._[0],
    context: args._[1],
    criterial: args._[2],
    scannerApiMethod: args._[3],
    curlLogin: args._[4] || '',
    // criterial: args['--criterial'] || 'basic',
    scannerApi: arg['--scannerApi'] || false,
    autoDetect: arg['--auto-detect'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultCriterial = 'Execution unit coverage';

  if (options.skipPrompts) {
    return {
      ...options,
      criterial: options.criterial || defaultCriterial,
    };
  }

  const questions = [];

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

  if (!options.criterial) {
    questions.push({
      type: 'rawlist',
      name: 'criterial',
      message: 'Please choose a criterion to apply the smoke test:',
      choices: [
        'Execution unit coverage',
        'Service coverage',
        'Service Protocol Coverage',
        'Resources Up',
        'Everything Up',
        'Endpoints coverage',
        'Full Service Coverage',
        'Dependency coverage',
        'System coverage',
      ],
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    environmentVariable:
      options.environmentVariable || answers.environmentVariable,
    environment: options.environment || answers.environment,
    context: options.context || answers.context,
    criterial: options.criterial || answers.criterial,
  };
}

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

  questions.push({
    type: 'input',
    name: 'projectName',
    message: 'Add your projectName:',
  });

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

  if (!options.scannerApiMethod) {
    questions.push({
      type: 'rawlist',
      name: 'scannerApiMethod',
      message: 'Select one scanner api method:',
      choices: ['Swagger/OpenApi', 'GraphQL', 'None'],
    });
  }
  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    projectName: options.projectName || 'projectNameUndefined',
    environmentVariable:
      options.environmentVariable || answers.environmentVariable,
    environment: options.environment || answers.environment,
    context: options.context || answers.context,
    scannerApiMethod: options.scannerApiMethod || answers.scannerApiMethod,
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

  //>>>>>>>>>>>>>>>>
  // TODO add the instructions for GraphQL.
  //<<<<<<<<<<<<<<<<

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    swaggerUrl: options.swaggerUrl || answers.swaggerUrl,
    curlLogin: options.curlLogin || answers.curlLogin,
  };
}

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
  options = await promptForScannerAPI(options);

  runMultiTasks(options);
}
