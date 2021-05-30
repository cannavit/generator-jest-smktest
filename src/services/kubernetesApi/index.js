const { getServices } = require('./src/services');
const { getLogs } = require('./src/logs');
const { getPods } = require('./src/pods');

async function collectConfigKube(options) {
  // This is the data for execute the function
  // DATA EXAMPLE: .......
  //   options = {
  //     testConfig: {
  //       kubernetes: {
  //         namespace: 'edutelling-develop',
  //       },
  //     },
  //   };
  // ......................

  options = await getPods(options); // Get Pods Name
  options = await getServices(options); // Get Services and Ports
  options = await getLogs(options); // Get pods Logs Status

  return options;
}

module.exports.collectConfigKube = collectConfigKube;
module.exports.getPods = getPods;
module.exports.getLogs = getLogs;
module.exports.getServices = getServices;
