#!/usr/bin/env node
/* eslint-disable
  comma-dangle,
  eslint-disable-line no-console,
  flowtype/require-valid-file-annotation,
*/
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

function runScript(scriptName) {
  const executable = [
    require.resolve(`../build/scripts/${scriptName}`)
  ].concat(scriptArguments);

  process.exit(
    spawn.sync('node', executable, { stdio: 'inherit' }).status
  );
}

switch (script) {
  case 'build':
    process.env.NODE_ENV = 'production';
    runScript('build');
    break;

  case 'start':
    process.env.NODE_ENV = 'development';
    runScript('start');
    break;

  case 'test':
    process.env.NODE_ENV = 'test';
    runScript('test');
    break;

  default:
    console.error(chalk.red(`Unknown script "${script}".`));
    process.exit(1);
}
