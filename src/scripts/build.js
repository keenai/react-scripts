/* eslint-disable no-console */
import chalk from 'chalk';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import fs from 'fs';
import paths from '../config/paths';
import rimraf from 'rimraf';
import webpack from 'webpack';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';

const compilers = {};
const requiredFiles = [
  paths.CLIENT_ENTRY,
  paths.SERVER_ENTRY,
];

function buildNodeBundle() {
  return new Promise((resolve, reject) => {
    compilers.server.run((error, stats) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

function buildWebBundle() {
  return new Promise((resolve, reject) => {
    compilers.client.run((error, stats) => {
      if (error) {
        return reject(error);
      }

      fs.writeFileSync(
        'stats.json',
        JSON.stringify(stats.toJson()),
      );

      return resolve();
    });
  });
}

function cleanBuildPath() {
  return new Promise((resolve, reject) => {
    rimraf(paths.BUILD, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function setupCompiler(bundle) {
  const { name } = bundle;
  const compiler = webpack(bundle);

  // "compile" event fires while the bundle is compiling. We want to notify
  // the user when this is occurring.
  compiler.plugin('compile', () => {
    console.log(chalk.yellow(`Compiling ${name}...`));
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', (stats) => {
    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      console.log(chalk.green(`Compiled ${name} successfully!`));
    }

    // If errors exist, only show errors.
    if (stats.hasErrors()) {
      console.log(chalk.red.bold(`Failed to compile ${name}.\n`));
      messages.errors.forEach((message) => {
        console.log(`\n${message}\n`);
      });

      return;
    }

    // Show warnings if no errors were found.
    if (stats.hasWarnings()) {
      console.log(chalk.yellow(`Compiled ${name} with warnings.\n`));
      console.log(messages.warnings.join('\n'));
    }
  });

  return compiler;
}

function setupCompilers() {
  compilers.client = setupCompiler(webpackConfigClient);
  compilers.server = setupCompiler(webpackConfigServer);
}

function validateRequiredFilesExist() {
  if (checkRequiredFiles(requiredFiles)) {
    return Promise.resolve();
  }

  return Promise.reject();
}

validateRequiredFilesExist()
  .then(cleanBuildPath)
  .then(setupCompilers)
  .then(buildWebBundle)
  .then(buildNodeBundle)
  .catch((error) => {
    if (error) {
      console.error(chalk.red.bold(error.name, '\n'));
      console.error(error.message, '\n');
      console.error(error.stack);
    }
    process.exit(1);
  })
;
