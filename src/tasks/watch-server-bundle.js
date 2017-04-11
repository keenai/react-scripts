// @flow
import * as constants from '../config/constants';
import { attachCompileListeners } from './attach-compile-listeners';
import { debounce } from 'lodash';
import { success, warn } from './log';
import chalk from 'chalk';
import openBrowser from 'react-dev-utils/openBrowser';
import spawn from 'cross-spawn';
import waitOn from 'wait-on';
import webpack from 'webpack';

let nodeServer;

let showInstructions = false;

const compilerOptions = {
  ignored: /node_modules/,
};

function startServer(bundle: Object): Promise<*> {
  return new Promise((resolve, reject) => {
    // If the server instance has yet to be defined and the console is
    // interactive, then this is considered to be our "first launch".
    // Open the user's browser on a delay of half a second.
    if (!nodeServer && process.stdout.isTTY) {
      showInstructions = true;
    }

    // If we already have a server instance cached, that means we are
    // restarting the server. So, we should send a kill signal to the
    // existing instance.
    if (nodeServer) {
      warn('Restarting server...');
      nodeServer.kill();
    }

    // Start the server.
    nodeServer = spawn('node', [bundle.output.path], { stdio: 'inherit' });

    // Wait for the port to become available before resolving.
    waitOn(
      {
        resources: [
          `tcp:${constants.HOST}:${constants.PORT}`,
        ],
      },
      (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      },
    );
  });
}

export function watchServerBundle(bundle: Object): Promise<*> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(bundle);
    const onCompile = (error, stats) => {
      if (error) {
        return reject(error);
      }

      if (stats.hasErrors()) {
        return reject('Unable to compile server.');
      }

      return startServer(bundle).then(
        () => {
          attachCompileListeners(compiler);
          success('Compiled server successfully!');
          if (showInstructions) {
            const urlToOpen = `${constants.PROTOCOL}//${constants.HOST}:${constants.PORT}/`;
            showInstructions = false;
            console.log();
            console.log('The app is running at:');
            console.log();
            console.log('  ', chalk.cyan(urlToOpen));
            console.log();
            console.log('Note that the development build is not optimized.');
            console.log(`To create a production build, use ${chalk.cyan('yarn build')}`);
            console.log();
            openBrowser(urlToOpen);
          }
          resolve();
        },
        reject,
      );
    };

    compiler.watch(compilerOptions, debounce(onCompile, 500));
  });
}
