// https://docs.nestjs.com/openapi/cli-plugin#integration-with-ts-jest-e2e-tests

import * as transformer from '@nestjs/swagger/dist/plugin';
import ts from 'typescript';

module.exports.name = 'nestjs-swagger-transformer';
// you should change the version number anytime you change the configuration below - otherwise, jest will not detect changes
module.exports.version = 1;

module.exports.factory = (cs: { program: ts.Program }) => {
  return transformer.before(
    {
      // @nestjs/swagger/plugin options (can be empty)
    },
    cs.program, // "cs.tsCompiler.program" for older versions of Jest (<= v27)
  );
};
