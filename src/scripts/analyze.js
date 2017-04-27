// @flow
import * as tasks from '../tasks';
import { Log } from '../utils';
import paths from '../config/paths';
import webpackConfigClient from '../config/webpack/webpack.config.client';

const log = new Log();

const requiredFiles = [
  paths.CLIENT_ENTRY,
];

async function runTasks() {
  try {
    log.info('Analyzing bundle...');
    await tasks.checkRequiredFiles(requiredFiles);
    await tasks.analyzeBundle(webpackConfigClient);
    log.success('Analysis complete.');
    log.info(`Results have been saved to ${paths.STATS_FILE}.`);
    process.exit(0);
  } catch (error) {
    console.error(error || 'Uncaught Error');
    process.exit(1);
  }
}

runTasks();
