// @flow
import * as tasks from '../tasks';
import { Log } from '../utils';
import program from 'commander';
import runTasks from './run-tasks';

const log = new Log();

let inputFile = '';

program
  .option('--project-key <projectKey>', 'crowdin project key', process.env.CROWDIN_PROJECT_KEY)
  .option('--project-id <projectId>', 'crowdin project id', process.env.CROWDIN_PROJECT_ID)
  .arguments('<input>')
  .action((input: string) => {
    inputFile = input;
  })
  .parse(process.argv)
;

if (!inputFile) {
  log.error('You must provide an input file.');
  process.exit(1);
}

runTasks(
  () => tasks.uploadTranslation(program.projectId, program.projectKey, inputFile),
  () => log.success('Translation file uploaded.'),
);
