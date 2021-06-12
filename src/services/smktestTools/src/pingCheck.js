var ping = require('ping');

module.exports.pingSmktest = async function (options) {
  let pingTest = options.smktest.tests.ping;
  let pingIsAlive = [];
  for (const key in pingTest) {
    let element = pingTest[key];
    let host = element.url;
    let msg;

    msg = await ping.promise.probe(host);

    pingIsAlive.push({
      isAlive: msg.alive,
      url: element.url,
      name: element.name,
      output: msg.output,
      time: msg.time,
    });
  }

  options.pingIsAlive = pingIsAlive;

  return options;
};
