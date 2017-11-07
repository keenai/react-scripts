// @flow
import { downloadSchema, introspectSchema } from '../tasks';
import { Log } from '../utils';
import program from 'commander';
import runTasks from './run-tasks';

type Options = {
  glob: string,
  schema: string,
  typeDefinitions: string,
  introspectHeaders: {
    [string]: string,
  },
  introspectMethod: 'GET' | 'POST' | 'PUT',
};

let graphUrl = '';

program
  .option('-g, --glob <glob>', 'glob of query files', '**/*.graphql')
  .option('-s, --schema <path>', 'output path of schema introspection', 'schema.json')
  .option('-t, --type-definitions <path>', 'path where flow definitions are output', 'flow-typed/schema.js.flow')
  .option('--introspect-headers <headers>', 'additional headers for the graph introspection', JSON.parse, {})
  .option('--introspect-method <method>', 'http method for graph introspection', 'POST')
  .arguments('<url>')
  .action((url: string) => {
    graphUrl = url;
  })
  .parse(process.argv)
;

const log = new Log();
const options: Options = program.opts();

if (!graphUrl) {
  log.error('You must pass a valid GraphQL URL.');
  process.exit(1);
}

if (!options.schema) {
  log.error('You must provide a schema output path with the -s, --schema option.');
  process.exit(1);
}

runTasks(
  () => log.info('Generating schema and type definitions.'),
  () => downloadSchema(graphUrl, options.schema),
  () => introspectSchema(options.glob, options.schema, options.typeDefinitions),
  () => log.success('Code generation complete.'),
  (process) => process.exit(0),
);
