const dotenv = require("dotenv");
dotenv.config();
const swaggerSmktest = require("../src/services/swaggerSmktest");

//TODO if have one error is beacouse the load of preview have problema. Need change other view before.
test("Basic Swagger smoke-testing with Jest", async () => {
  //! Is possible use /api-docs

  let urlSwagger = process.env.TEST02_URL;

  let {
    responseOfRequest,
    coverage,
    successSmokeTest,
    report,
    abstractReport,
  } = await swaggerSmktest.smokeTest(urlSwagger);

  console.log(report.render());
  console.log(abstractReport.render());

  expect(successSmokeTest).toBe(false);
});
