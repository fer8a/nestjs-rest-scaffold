// https://docs.nestjs.com/openapi/cli-plugin#integration-with-ts-jest-e2e-tests

// eslint-disable-next-line @typescript-eslint/no-var-requires
const transformer = require('@nestjs/swagger/plugin');

module.exports.name = 'nestjs-swagger-transformer';
// you should change the version number anytime you change the configuration below - otherwise, jest will not detect changes
module.exports.version = 1;

module.exports.factory = (cs: { program: any }) => {
  return transformer.before(
    {
      // @nestjs/swagger/plugin options (can be empty)
    },
    cs.program, // "cs.tsCompiler.program" for older versions of Jest (<= v27)
  );
};
