import inquirer from 'inquirer';

async function prompt(options) {
  const questions = [];

  if (!options.namespace) {
    questions.push({
      type: 'input',
      name: 'namespace',
      message: 'Add kubernetes namespace:',
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    namespace: options.namespace || answers.namespace,
  };
}

export async function cliKubernetes(options) {
  console.log('@1Marker-No:_354467327');
  console.log('>>>>>-1390624476>>>>>');
  // Console kubernetes options
  options = await prompt(options);
  console.log(options);
  console.log('<<<<<<<<<<<<<<<<<<<');
}
