// @flow
import * as tasks from '../tasks';
import { Log } from '../utils';
import program from 'commander';
import runTasks from './run-tasks';

const log = new Log();

program
  .option('--project-key <projectKey>', 'crowdin project key', process.env.CROWDIN_PROJECT_KEY)
  .option('--project-id <projectId>', 'crowdin project id', process.env.CROWDIN_PROJECT_ID)
  .option('--id-column-index <index>', 'index of id column in csv', 0)
  .option('--translation-column-index <index>', 'index of translation column in csv', 2)
  .option('-d, --directory <path>', 'the output directory')
  .option('-f, --filename <path>', 'the crowdin file to download')
  .parse(process.argv)
;

if (!program.directory) {
  log.error('You must provide an output directory with the -d, --directory option.');
  process.exit(1);
}

if (!program.filename) {
  log.error('You must provide a filename with the -f, --filename option.');
  process.exit(1);
}

runTasks(
  () => tasks.downloadTranslations(
    program.projectId,
    program.projectKey,
    program.filename,
    program.directory,
    [
      program.idColumnIndex,
      program.translationColumnIndex,
    ],
  ),
  () => log.success('Translation files downloaded.'),
);
