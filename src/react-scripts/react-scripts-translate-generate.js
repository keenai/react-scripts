// @flow
import * as tasks from '../tasks';
import { Log } from '../utils';
import program from 'commander';
import runTasks from './run-tasks';

const log = new Log();

let outputFile = '';

program
  .arguments('<output>')
  .action((output: string) => {
    outputFile = output;
  })
  .parse(process.argv)
;

if (!outputFile) {
  log.error('You must provide an output file.');
  process.exit(1);
}

runTasks(
  () => tasks.cleanMessagesPath(),
  () => tasks.extractMessages(),
  () => tasks.generateMessagesJSON(outputFile),
  () => log.success(`Translation file created at "${outputFile}"`),
);
