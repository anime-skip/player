const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

// Respect tsconfig paths
const tsconfigPathsModuleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/',
});

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...require('../../jest.config'),
  globals: {
    EXTENSION_MODE: 'prod',
  },
  moduleNameMapper: {
    ...tsconfigPathsModuleNameMapper,
    'webextension-polyfill': '<rootDir>/src/__mocks__/webextension-polyfill.mock.ts',
  },
};
