#! /usr/bin/env node
// @flow
// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({
  silent: true,
});

import { version } from '../../package.json';
import program from 'commander';

program
  .version(version)
  .command('build', 'build your project')
  .command('codegen', 'generate graphql schema and definitions')
  .command('start', 'start your project')
  .command('test', 'execute your tests')
  .command('translate', 'crowdin translation tasks')
;

program.on('command:*', ([command]) => {
  process.env.NODE_ENV = {
    build: 'production',
    test: 'test',
  }[command] || 'development';
});

program.parse(process.argv);
