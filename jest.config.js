const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    // Respect path aliases
    ...pathsToModuleNameMapper(compilerOptions.paths),

    // Global mocks
    // None
  },
  // Respect path aliases
  modulePaths: ['<rootDir>'],

  // ESM & Vite (import.meta)
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
