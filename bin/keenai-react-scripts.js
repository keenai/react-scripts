#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({
  silent: true,
});

const script = process.argv[2];
const args = process.argv.slice(3);

// If not script was given, exit immediately.
if (script === undefined) {
  console.log('You must provide a valid script name.'); // eslint-disable-line no-console
  process.exit(1);
}

switch (script) {
  case 'start': {
    const result = spawn.sync(
      'node',
      [require.resolve(`../build/${script}`)].concat(args),
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
