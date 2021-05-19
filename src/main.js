import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirector || process.cwd,
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.log('%s Invalid template name', chalk.red.bold('ERROR'));
  }

  await copyTemplateFiles(options);

  console.log(' %s Project ready', chalk.green.bold('DONE'));

  return true;
}

//! Create directory:
export async function createSmktestDir(options) {
  // Create directory
  var dir = options.projectDir + '/' + options.smktestFolder;
  options.smkDirectory = dir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return options;
}

export async function createContextFolder(options) {
  // Create directory
  var dir =
    options.projectDir +
    '/' +
    options.smktestFolder +
    '/' +
    options.environment;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return options;
}

export function createConfigFile(options, optList) {
  if (optList) {
    var json = JSON.stringify(optList, null, 4);
    fs.writeFileSync(
      options.smkDirectory + '/smktestConfig.json',
      json,
      null,
      4
    );
  }
}

// Load fine with olds configurations

export function loadOldJsonFiles(options) {
  //? Check if exist the file.
  let fileJson = options.smkDirectory + '/smktestConfig.json';
  let fileJsonData;

  if (fs.existsSync(fileJson)) {
    let fileJsonData = fs.readFileSync(fileJson);
    try {
      options.oldJsonConfig = JSON.parse(fileJsonData);
    } catch (error) {
      options.oldJsonConfig = undefined;
    }
  }

  return options;
}

export function pushJsonFile(options) {
  let optionsList = {};

  let optionsSave = options;
  if (options.oldJsonConfig) {
    let oldJson = options.oldJsonConfig;
    delete options.oldJsonConfig;

    optionsList = oldJson;
  }

  let envName = options.environment || 'localhost';

  optionsList[envName] = optionsSave;

  return { options: optionsSave, optList: optionsList };
}

export const configSmktest = (options, next) => {
  return createSmktestDir(options)
    .then(() => {
      // Delete old files
      try {
        fs.rmdir(options.smkDirectory + '/smktestConfig.json', {
          recursive: true,
        });
      } catch (error) {
        let e = true;
      }
    })
    .then(() => {
      options = loadOldJsonFiles(options);
    })
    .then(() => {
      let data = pushJsonFile(options);

      return data;
    })
    .then((data) => {
      // Create JSON file:
      options = data.options;
      let optList = data.optList;
      options = createConfigFile(options, optList);
    })
    .then(() => {
      // Create context folder:
      // createContextFolder(options);
    })
    .catch(next);
};
