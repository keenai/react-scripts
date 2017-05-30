// @flow
import { Log } from '../utils';
import path from 'path';
import paths from '../config/paths';
import spawn from 'cross-spawn';

const apolloBinary = path.resolve(paths.NODE_MODULES_SELF, '.bin/apollo-codegen');
const log = new Log();
const queryGlob = path.resolve(paths.SOURCE, '**/*.graphql');
const schemaPath = path.resolve(process.cwd(), 'schema.json');
const schemaUrl = process.argv[2];
const typingsPath = path.resolve(process.cwd(), 'flow-typed/schema.js.flow');

async function runTasks() {
  try {
    if (!schemaUrl) {
      throw new TypeError('You must pass a valid GraphQL URL.');
    }

    log.info(`Introspecting ${schemaUrl}.`);
    spawn.sync(
      apolloBinary,
      ['introspect-schema', schemaUrl, '--output', schemaPath],
      { stdio: 'inherit' },
    );
    log.success(`Schema file created at ${schemaPath}`);

    log.info(`Generating flow typings for ${queryGlob}.`);
    spawn.sync(
      apolloBinary,
      ['generate', queryGlob, '--schema', schemaPath, '--output', typingsPath, '--target', 'flow'],
      { stdio: 'inherit' },
    );
    log.success(`Flow typings created at ${typingsPath}`);
  } catch (error) {
    log.error(error || new Error('Uncaught Error'));
    process.exit(1);
  }
}

runTasks();
