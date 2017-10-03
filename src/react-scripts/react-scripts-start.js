// @flow
import * as constants from '../config/constants';
import * as tasks from '../tasks';
import { Log } from '../utils';
import paths from '../config/paths';
import program from 'commander';
import runTasks from './run-tasks';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';

const log = new Log();

program.parse(process.argv);

runTasks(
  () => log.info('Starting development build.'),
  () => tasks.checkRequiredFiles([paths.CLIENT_ENTRY, paths.SERVER_ENTRY]),
  () => tasks.checkRequiredPorts([constants.PORT, constants.WEBPACK_PORT]),
  () => tasks.cleanBuildPath(),
  () => tasks.watchClientBundle(webpackConfigClient),
  () => tasks.watchServerBundle(webpackConfigServer),
  () => log.success('Build completed.'),
  () => tasks.pause(),
);
