// @flow
import * as constants from '../config/constants';
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

const requiredPorts = [
  constants.PORT,
  constants.WEBPACK_PORT,
];

async function runTasks() {
  try {
    log.info('Starting development build.');
    await tasks.checkRequiredFiles(requiredFiles);
    await tasks.checkRequiredPorts(requiredPorts);
    await tasks.cleanBuildPath();
    await tasks.watchClientBundle(webpackConfigClient);
    await tasks.watchServerBundle(webpackConfigServer);
    log.success('Build completed.');
  } catch (error) {
    log.error(error || 'Uncaught Error');
    process.exit(1);
  }
}

runTasks();
