// import swaggerSmktest from 'swagger-smktest';

import inquirer from 'inquirer';
import fs from 'fs';
//TODO Connect library and update that libraryp
const swaggerSmktest = require('../../externalLibraryNPM/swagger-smktest/index');

//TODO Using this if not is added the loging URL

export async function getTrainingSwaggerSmktest(options) {
  const urlSwagger = options.swaggerUrl;
  //TODO add logic for using other levels

  let trainingSwagger;
  if (options.curlLogin === 'N') {
    //! With out auth
    trainingSwagger = await swaggerSmktest.trainSmokeTest(urlSwagger);
  } else {
    //
    options.tokenConfig = {
      curlRequest: options.curlLogin,
    };
    //! With autl
    trainingSwagger = await swaggerSmktest.trainSmokeTest(urlSwagger, options);
  }

  //! PreProcessing data for create table.
  options.trainingSwagger = trainingSwagger;

  return options;
}

// Create table structure for select test.
export function createTableFormat(trainingSwagger) {
  let rowsList = [];
  for (const key in trainingSwagger) {
    let element = trainingSwagger[key];

    let apiTest = element.apiTest;
    apiTest = apiTest.split('/');
    apiTest =
      apiTest[0] +
      '/.../' +
      apiTest[apiTest.length - 2] +
      '/' +
      apiTest[apiTest.length - 1];

    let statusShot =
      `[ ${key}) ${element.apiVerb}-${element.assertStatusCode}-${element.passTrainingTest}] ` +
      apiTest;

    rowsList.push({
      name: statusShot,
      value: key,
    });
  }

  return rowsList;
}

export async function createTable(rowsList) {
  //! Check table
  inquirer.registerPrompt('table', require('inquirer-table-prompt'));

  return inquirer
    .prompt([
      {
        type: 'table',
        name: 'Swagger SmokeTest',
        message: 'Check your tests for applying: (default: Apply All)',
        columns: [
          {
            name: 'Apply',
            value: 'apply',
            default: true,
          },
          {
            name: 'Ignore',
            value: 'ignore',
          },
          {
            name: 'Quarantine',
            value: 'quarantine',
          },
        ],
        rows: rowsList,
      },
    ])
    .then((answers) => {
      /*
      { workoutPlan:
        [ 'arms', 'legs', 'cardio', undefined, 'legs', 'arms', undefined ] }
      */
      return answers;
    });
}

export const generateCasesSwagger = async (options, next) => {
  return getTrainingSwaggerSmktest(options)
    .then((options) => {
      // Create table structure
      let trainingSwagger = options.trainingSwagger;
      let rowList = createTableFormat(trainingSwagger);

      options.rowList = rowList;
      options.answers = trainingSwagger;

      return options;
    })
    .then(async (options) => {
      let rowsList = options.rowList;
      // Build table.
      let answers = await createTable(rowsList);
      options.answers = answers;

      return options;
    })
    .then((options) => {
      // Build format JSON
      let testList = [];

      for (const key in options.answers['Swagger SmokeTest']) {
        const element = options.trainingSwagger[key];
        const answ = options.answers['Swagger SmokeTest'][key] || 'apply';
        element.testStatus = answ;

        testList.push(element);
      }
      options.testList = testList;
      return options;
    })
    .then((options) => {
      //! Create folder if not exit

      let pathFolderTest = options.smkDirectory + '/' + options.environment;
      if (!fs.existsSync(pathFolderTest)) {
        fs.mkdirSync(pathFolderTest);
      }

      options.trainingSwagger.pathTests =
        pathFolderTest +
        '/smktest_' +
        options.context +
        '_' +
        options.scannerApiMethod.replace('/', '') +
        '.json';

      return options;
    })
    .then((options) => {
      //! Load Old File
      let pathTestFile = options.trainingSwagger.pathTests;
      let oldTest;
      if (fs.existsSync(pathTestFile)) {
        oldTest = fs.readFileSync(pathTestFile);
        try {
          oldTest = JSON.parse(pathTestFile);
        } catch (error) {
          oldTest = undefined;
        }
      }

      options.oldTest = oldTest;
      return options;
    })
    .then((options) => {
      //TODO Unions old with new test.

      let saveTest = options.testList;
      options.saveTest = saveTest;
      return options;
    })
    .then((options) => {
      // Save JSON file.
      let saveTest = options.saveTest;

      if (saveTest) {
        var json = JSON.stringify(saveTest, null, 4);
        fs.writeFileSync(options.trainingSwagger.pathTests, json, null, 4);
      }
    })

    .catch(next);
};
