import swaggerSmktest from 'swagger-smktest';
import inquirer from 'inquirer';
import fs from 'fs';
//TODO Using this if not is added the loging URL

export async function getTrainingSwaggerSmktest(options) {
  const urlSwagger = options.swaggerUrl;
  //TODO add logic for using other levels

  let trainingSwagger = await swaggerSmktest.trainSmokeTest(
    'basic',
    urlSwagger
  );

  //! PreProcessing data for create table.

  return trainingSwagger;
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

    console.log(apiTest);

    let statusShot =
      `[${element.apiVerb}-${element.assertStatusCode}-${element.passTrainingTest}] ` +
      apiTest;

    rowsList.push({
      name: statusShot,
      value: key,
    });
  }

  return rowsList;
}

export async function createTable(rowsList) {
  console.log('@1Marker-No:_354467327');
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
      console.log('@1Marker-No:_323409289');
      console.log(answers);
      return answers;
    });
}

export const generateCasesSwagger = async (options, next) => {
  return getTrainingSwaggerSmktest(options)
    .then((trainingSwagger) => {
      // Create table structure

      let rowList = createTableFormat(trainingSwagger);
      options.trainingSwagger = {};

      options.trainingSwagger.rowList = rowList;
      options.trainingSwagger.trainingSwagger = trainingSwagger;

      return options;
    })
    .then(async (options) => {
      let rowsList = options.trainingSwagger.rowList;
      // Build table.
      let answers = await createTable(rowsList);
      options.trainingSwagger.answers = answers;

      return options;
    })
    .then((options) => {
      // Build format JSON
      let testList = [];
      for (const key in options.trainingSwagger.trainingSwagger) {
        const element = options.trainingSwagger.trainingSwagger[key];
        const answ =
          options.trainingSwagger.answers['Swagger SmokeTest'][key] || 'apply';
        element.testStatus = answ;
        testList.push(element);
      }
      options.trainingSwagger.testList = testList;
      return options;
    })
    .then((options) => {
      //! Create folder if not exit
      let pathFolderTest =
        options.projectDir +
        '/' +
        options.smktestFolder +
        '/' +
        options.environment;

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

      options.trainingSwagger.oldTest = oldTest;
      return options;
    })
    .then((options) => {
      //TODO Unions old with new test.

      let saveTest = options.trainingSwagger.testList;
      options.trainingSwagger.saveTest = saveTest;
      return options;
    })
    .then((options) => {
      // Save JSON file.
      let saveTest = options.trainingSwagger.saveTest;

      if (saveTest) {
        var json = JSON.stringify(saveTest, null, 4);
        fs.writeFileSync(options.trainingSwagger.pathTests, json, null, 4);
      }
    })

    .catch(next);
};
