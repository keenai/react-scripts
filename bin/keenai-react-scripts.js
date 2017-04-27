#!/usr/bin/env node
/* eslint-disable comma-dangle, no-console, flowtype/require-valid-file-annotation */
const chalk = require('chalk');
const spawn = require('cross-spawn');

// Verify that the script name argument was provided.
if (process.argv[2] === undefined) {
  console.error(chalk.red('You must provide a valid script name.'));
  process.exit(1);
}

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({
  silent: true,
});

const script = process.argv[2];
const scriptArguments = process.argv.slice(3);
const scriptEnvironment = {
  analyze: 'production',
  build: 'production',
  start: 'development',
  test: 'test',
};

process.env.NODE_ENV = scriptEnvironment[script];

if (!process.env.NODE_ENV) {
  console.error(chalk.red(`Unknown script "${script}".`));
  process.exit(1);
}

process.exit(
  spawn
    .sync(
      'node',
      [require.resolve(`../build/scripts/${script}`)].concat(scriptArguments),
      { stdio: 'inherit' }
    )
    .status
);
