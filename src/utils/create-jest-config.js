// @flow
import path from 'path';
import paths from '../config/paths';

export default function createJestConfig(rootDir: string = process.cwd()) {
  return {
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/**/*.{spec,test}.{js,jsx}',
      '!src/**/*.story.{js,jsx}',
      '!src/**/__tests__/*.{js,jsx}',
    ],

    coverageDirectory: '<rootDir>/coverage',

    modulePaths: paths.NODE_PATHS,

    rootDir,

    setupTestFrameworkScriptFile: require.resolve('jest-enzyme'),

    testEnvironment: 'node',

    testURL: 'http://localhost',

    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.js?(x)',
      '<rootDir>/src/**/tests/**/*.js?(x)',
      '<rootDir>/src/**/?(*.)(spec|test).js?(x)',
    ],

    transform: {
      '^.+\\.(gql|graphql)$': (
        require.resolve('jest-transform-graphql')
      ),
      '^.+\\.(js|jsx)$': (
        path.resolve(paths.JEST_CONFIG, 'babel-transform.js')
      ),
      '.*': (
        path.resolve(paths.JEST_CONFIG, 'file-transform.js')
      ),
    },

    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
    ],
  };
}
