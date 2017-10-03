// @flow
import { analyzeBundle, checkRequiredFiles } from '../tasks';
import { Log } from '../utils';
import commander from 'commander';
import paths from '../config/paths';
import runTasks from './run-tasks';
import webpackConfigClient from '../config/webpack/webpack.config.client';

const log = new Log();

const program = commander
  .option('-o --output <filename>', 'file to output stats to', 'stats.json')
  .parse(process.argv)
;

runTasks(
  () => checkRequiredFiles([paths.CLIENT_ENTRY]),
  () => analyzeBundle(webpackConfigClient, program.output),
  () => log.success(`Results have been saved to "${program.output}".`),
);
