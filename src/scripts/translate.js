// @flow
import * as tasks from '../tasks';
import { Log } from '../utils';
import paths from '../config/paths';
import program from 'commander';

const log = new Log();

program
  .option('-o, --out <file>', 'Output file', `${paths.SOURCE}/i18n/localizable.csv`)
  .parse(process.argv)
;

async function runTasks() {
  try {
    await tasks.cleanMessagesPath();
    await tasks.extractMessages();
    await tasks.generateMessagesJSON(program.out);
    log.success(`Translation file created at "${program.out}"`);
    process.exit(0);
  } catch (error) {
    console.error(error || 'Uncaught Error');
    process.exit(1);
  }
}

runTasks();
