/* eslint-disable no-console */
import chalk from 'chalk';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
import detect from 'detect-port';
import express from 'express';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import openBrowser from 'react-dev-utils/openBrowser';
import paths from '../config/paths';
import rimraf from 'rimraf';
import spawn from 'cross-spawn';
import waitOn from 'wait-on';
import webpack from 'webpack';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const compilers = {};
const host = process.env.HOST || 'localhost';
const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const serverPort = (process.env.PORT ? Number(process.env.PORT) : 3000);
const clientPort = serverPort + 1;
const requiredPorts = [
  clientPort,
  serverPort,
];
const requiredFiles = [
  paths.CLIENT_ENTRY,
  paths.SERVER_ENTRY,
];

let nodeServer;

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

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
    console.log(chalk.yellow(`Bundle "${name}" has changed...`));
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

function validatePortAvailability() {
  return Promise
    .all(
      requiredPorts.map(detect),
    )
    .then(([
      detectedClientPort,
      detectedServerPort,
    ]) => {
      const clientPortIsAvailable = (detectedClientPort === clientPort);
      const serverPortIsAvailable = (detectedServerPort === serverPort);

      if (!clientPortIsAvailable || !serverPortIsAvailable) {
        console.log([
          chalk.red('Something is already running on the following required port(s):\n'),
          clientPortIsAvailable ? '' : `  - ${clientPort}`,
          serverPortIsAvailable ? '' : `  - ${serverPort}`,
          chalk.red('Please free them up and try again.\n'),
        ].join('\n'));

        return Promise.reject();
      }

      return Promise.resolve();
    })
  ;
}

function watchNodeBundle() {
  let showInstructions = false;

  return new Promise((resolve, reject) => {
    const startServer = () => {
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
        console.log(chalk.yellow('Restarting server...'));
        nodeServer.kill();
      }

      // Start the server.
      nodeServer = spawn(
        'node',
        [webpackConfigServer.output.path],
        {
          stdio: 'inherit',
        },
      );

      // Wait for the port to become available before displaying instructions
      // and resolving.
      waitOn(
        {
          resources: [
            `tcp:${host}:${serverPort}`,
          ],
        },
        (error) => {
          if (error) {
            return reject(error);
          }

          if (showInstructions) {
            const urlToOpen = `${protocol}//${host}:${serverPort}/`;
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
    };

    compilers.server.plugin('done', (stats) => (
      stats.hasErrors() ? reject() : startServer()
    ));

    compilers.server.watch(
      {
        ignored: /node_modules/,
      },
      () => undefined,
    );
  });
}

function watchWebBundle() {
  return new Promise((resolve, reject) => {
    const app = express();
    const devMiddleware = webpackDevMiddleware(compilers.client, {
      compress: true,
      clientLogLevel: 'none',
      contentBase: paths.PUBLIC,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      host,
      hot: true,
      https: protocol === 'https:',
      publicPath: webpackConfigClient.output.publicPath,
      quiet: true,
      watchOptions: {
        aggregateTimeout: 3000,
        ignored: /node_modules/,
      },
    });
    const hotMiddleware = webpackHotMiddleware(compilers.client, {
      log: false,
    });

    compilers.client.plugin('done', (stats) => (
      stats.hasErrors() ? reject() : resolve()
    ));

    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.listen(clientPort, host);
  });
}

validateRequiredFilesExist()
  .then(validatePortAvailability)
  .then(cleanBuildPath)
  .then(setupCompilers)
  .then(watchWebBundle)
  .then(watchNodeBundle)
  .catch((error) => {
    if (error) {
      console.error(chalk.red.bold(error.name, '\n'));
      console.error(error.message, '\n');
      console.error(error.stack);
    }
    process.exit(1);
  })
;
