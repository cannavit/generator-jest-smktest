import inquirer from 'inquirer';
import { createProject, runMultiTasks } from './main';
import figlet from 'figlet';


//TODO 
async function promptForScannerAPI(options) {
  //! Context localhost:

  const questions = [];
  //   if (options.scannerApiMethod === 'Swagger/OpenApi') {
  //     // Add the API url swagger

  //     if (!options.swaggerUrl) {
  //       questions.push({
  //         type: 'input',
  //         name: 'swaggerUrl',
  //         message:
  //           '',
  //       });
  //     }

  //     if (!options.curlLogin) {
  //       questions.push({
  //         type: 'input',
  //         name: 'curlLogin',
  //         message:
  //           'Copy your CURL for create one login, example: curl -X POST "https://... (N/None)',
  //       });
  //     }
  //   }

  //   const answers = await inquirer.prompt(questions);
  //   return {
  //     ...options,
  //     swaggerUrl: options.swaggerUrl || answers.swaggerUrl,
  //     curlLogin: options.curlLogin || answers.curlLogin,
  //   };
}
