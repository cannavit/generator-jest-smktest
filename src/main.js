import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr';
import { configSmktest } from './services/createConfigFile';

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

export async function solveTasks(options) {
  const task = new Listr([
    {
      title: 'Create ConfigFile',
      task: () => configSmktest(options),
    },
  ]);

  await task.run();
}
