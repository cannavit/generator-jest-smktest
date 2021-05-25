import fs from 'fs';

//! Create directory:
export async function createSmktestDir(options) {
  // Create directory
  let dir = options.projectDir + '/' + options.smktestFolder;

  options.smkDirectory = dir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  dir =
    options.projectDir +
    '/' +
    options.smktestFolder +
    '/' +
    options.projectName;

  options.smkDirectory = dir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  options.smkDirectory = dir;

  return options;
}

export async function createContextFolder(options) {
  // Create directory

  var dir =
    options.projectDir +
    '/' +
    options.smktestFolder +
    '/' +
    options.projectName +
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
      createConfigFile(options, optList);
    })
    .then(() => {
      createContextFolder(options);
    })
    .catch(next);
};
