const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

// Respect tsconfig paths
const tsconfigPathsModuleNameMapper = pathsToModuleNameMapper(compilerOptions.paths);
const tsconfigModulePaths = ['<rootDir>'];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...tsconfigPathsModuleNameMapper,
    'webextension-polyfill': '<rootDir>/src/__mocks__/webextension-polyfill.mock.ts',
  },
  modulePaths: [...tsconfigModulePaths],
};
