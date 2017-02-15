#!/usr/bin/env node
const spawn = require('cross-spawn');

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({
  silent: true,
});

// Verify that a script was given. If none was passed, exit immediately.
const script = process.argv[2];
const args = process.argv.slice(3);
if (script === undefined) {
  console.log('You must provide a valid script name.'); // eslint-disable-line no-console
  process.exit(1);
}

switch (script) {
  case 'start': {
    process.env.NODE_ENV = 'development';

    const result = spawn.sync(
      'node',
      [require.resolve(`../build/scripts/${script}`)].concat(args),
      { stdio: 'inherit' } // eslint-disable-line comma-dangle
    );

    process.exit(result.status);

    break;
  }

  default: {
    console.log(`Unknown script "${script}."`); // eslint-disable-line no-console

    break;
  }
}
