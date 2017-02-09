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

// Because our scripts are written in ES6, we require the `babel-node` executable.
// Since it is a dependency of this package, we should first check for it here. If
// it is unavailable here, we check the bin path relative to the package that is
// executing the script.
let babelNodeExecutable;
[
  path.resolve(__dirname, process.cwd(), 'node_modules/.bin/babel-node'),
  path.resolve(__dirname, '../node_modules/.bin/babel-node'),
].forEach((babelNodePath) => {
  try {
    fs.statSync(babelNodePath);
    babelNodeExecutable = babelNodePath;
  } catch (e) {
    // eslint-disable-line no-empty
  }
});

switch (script) {
  case 'start': {
    const result = spawn.sync(
      babelNodeExecutable,
      [require.resolve(`../scripts/${script}`)].concat(args),
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
