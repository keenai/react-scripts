// @flow
import { Log } from '../utils';
import path from 'path';
import paths from '../config/paths';
import spawn from 'cross-spawn';

const log = new Log();
const queryGlob = path.resolve(paths.SOURCE, '**/*.graphql');
const schemaPath = path.resolve(process.cwd(), 'schema.json');
const schemaUrl = process.env.KEENAI_GRAPHQL_URI;
const typingsPath = path.resolve(process.cwd(), 'flow-typed/schema.js.flow');

async function runTasks() {
  try {
    if (!schemaUrl) {
      throw new TypeError('Please set the "KEENAI_GRAPHQL_URI" environment variable.');
    }

    log.info(`Introspecting ${schemaUrl}.`);
    spawn.sync(
      'apollo-codegen',
      ['introspect-schema', schemaUrl, '--output', schemaPath],
      { stdio: 'inherit' },
    );
    log.success(`Schema file created at ${schemaPath}`);

    log.info(`Generating flow typings for ${queryGlob}.`);
    spawn.sync(
      'apollo-codegen',
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
