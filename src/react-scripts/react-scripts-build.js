// @flow
import { buildBundle, checkRequiredFiles, cleanBuildPath } from '../tasks';
import { Log } from '../utils';
import paths from '../config/paths';
import program from 'commander';
import runTasks from './run-tasks';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';

const log = new Log();

program.parse(process.argv);

runTasks(
  () => log.info('Starting production build.'),
  () => checkRequiredFiles([paths.CLIENT_ENTRY, paths.SERVER_ENTRY]),
  () => cleanBuildPath(),
  () => buildBundle(webpackConfigClient),
  () => buildBundle(webpackConfigServer),
  () => log.success('Production build completed'),
);
