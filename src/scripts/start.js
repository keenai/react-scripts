// @flow
import * as constants from '../config/constants';
import * as tasks from '../tasks';
import paths from '../config/paths';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';

const requiredFiles = [
  paths.CLIENT_ENTRY,
  paths.SERVER_ENTRY,
];

const requiredPorts = [
  constants.PORT,
  constants.WEBPACK_PORT,
];

async function runTasks() {
  await tasks.startTimer();
  await tasks.checkRequiredFiles(requiredFiles);
  await tasks.checkRequiredPorts(requiredPorts);
  await tasks.cleanBuildPath();
  await tasks.watchClientBundle(webpackConfigClient);
  await tasks.watchServerBundle(webpackConfigServer);
}

try {
  runTasks();
} catch (error) {
  tasks.error(error || 'Uncaught Error');
  process.exit(1);
}
