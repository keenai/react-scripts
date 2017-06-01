// @flow
import * as tasks from '../tasks';
import { Log } from '../utils';
import paths from '../config/paths';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';

const log = new Log();

const requiredFiles = [
  paths.CLIENT_ENTRY,
  paths.SERVER_ENTRY,
];

async function runTasks() {
  try {
    log.info('Starting production build.');
    await tasks.checkRequiredFiles(requiredFiles);
    await tasks.cleanBuildPath();
    await tasks.buildBundle(webpackConfigClient);
    await tasks.buildBundle(webpackConfigServer);
    log.success('Build completed.');
    process.exit(0);
  } catch (error) {
    console.error(error || 'Uncaught Error');
    process.exit(1);
  }
}

runTasks();
