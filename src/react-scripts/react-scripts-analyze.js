// @flow
import { analyzeBundle, checkRequiredFiles } from '../tasks';
import { Log } from '../utils';
import paths from '../config/paths';
import program from 'commander';
import runTasks from './run-tasks';
import webpackConfigClient from '../config/webpack/webpack.config.client';

type Options = {
  output: string,
};

program
  .option('-o --output <filename>', 'file to output stats to', 'stats.json')
  .parse(process.argv)
;

const log = new Log();
const options: Options = program.opts();

runTasks(
  () => checkRequiredFiles([paths.CLIENT_ENTRY]),
  () => analyzeBundle(webpackConfigClient, options.output),
  () => log.success(`Results have been saved to "${options.output}".`),
);
