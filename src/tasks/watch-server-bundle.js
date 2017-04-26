// @flow
import * as constants from '../config/constants';
import { attachCompileListeners } from '../utils';
import chalk from 'chalk';
import fs from 'fs';
import openBrowser from 'react-dev-utils/openBrowser';
import paths from '../config/paths';
import spawn from 'cross-spawn';
import waitOn from 'wait-on';
import webpack from 'webpack';

let nodeServer;
let showInstructions = false;

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
      nodeServer.kill();
    }

    // Start the server.
    nodeServer = spawn(
      'node',
      [
        '--debug',
        `${bundle.output.path}/server`,
      ],
      {
        stdio: 'inherit',
      })
    ;

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

        return resolve();
      },
    );
  });
}

function backdateAssetFile() {
  const now = Date.now() / 1000;
  const then = now - 10;

  fs.utimesSync(paths.MANIFEST_JSON, then, then);
}

export function watchServerBundle(bundle: Object): Promise<*> {
  return new Promise((resolve, reject) => {
    const compiler = attachCompileListeners(webpack(bundle));

    backdateAssetFile();

    compiler.watch(
      { ignored: /node_modules/ },
      (error) => {
        if (error) {
          return reject(error);
        }

        return startServer(bundle).then(
          resolve,
          reject,
        );
      },
    );
  });
}
