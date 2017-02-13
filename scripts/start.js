/* eslint-disable no-console */
import chalk from 'chalk';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
import detect from 'detect-port';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import openBrowser from 'react-dev-utils/openBrowser';
import path from 'path';
import paths from '../config/paths';
import spawn from 'cross-spawn';
import webpack from 'webpack';
import webpackConfigClient from '../config/webpack/webpack.config.client';
import webpackConfigServer from '../config/webpack/webpack.config.server';
import WebpackDevServer from 'webpack-dev-server';

const host = process.env.HOST || 'localhost';
const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const serverPort = (process.env.PORT ? Number(process.env.PORT) : 3000);
const clientPort = serverPort + 1;
const requiredFiles = [
  paths.APP_HTML,
  paths.CLIENT_ENTRY,
  paths.SERVER_ENTRY,
];
const url = `${protocol}//${host}:${serverPort}/`;

let expressServer;
let isFirstCompile = true;

// Warn and crash if required files are missing
if (!checkRequiredFiles(requiredFiles)) {
  process.exit(1);
}

function detectPortAvailability(...ports) {
  return Promise.all(
    ports.map(detect),
  );
}

function validatePortAvailability([detectedClientPort, detectedServerPort]) {
  const clientPortIsAvailable = (detectedClientPort === clientPort);
  const serverPortIsAvailable = (detectedServerPort === serverPort);

  if (!clientPortIsAvailable || !serverPortIsAvailable) {
    console.log([
      chalk.red('Something is already running on the following required port(s):\n'),
      clientPortIsAvailable ? '' : `  - ${clientPort}`,
      serverPortIsAvailable ? '' : `  - ${serverPort}`,
      chalk.red('Please free them up and try again.\n'),
    ].join('\n'));
    process.exit(1);
  }

  return Promise.resolve();
}

function setupCompiler(config, name) {
  const compiler = webpack(config);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
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

function compile() {
  console.log(chalk.yellow('Setting up the compilers...'));

  return Promise.all([
    setupCompiler(webpackConfigClient, 'client'),
    setupCompiler(webpackConfigServer, 'server'),
  ]);
}

function runDevServer(compiler) {
  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.PUBLIC,
    hot: true,
    publicPath: webpackConfigClient.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    https: protocol === 'https:',
    host,
  });

  devServer.listen(clientPort, (error) => {
    if (error) {
      throw error;
    }

    console.log(chalk.cyan('Starting the development server...'));
  });
}

function runExpressServer(compiler) {
  compiler.watch({}, (error, stats) => {
    if (error) {
      throw error;
    }

    if (stats.hasErrors()) {
      return;
    }

    if (expressServer) {
      expressServer.kill();
    }

    expressServer = spawn(
      'node',
      [
        path.resolve(paths.BUILD, webpackConfigServer.output.filename),
      ],
      {
        cwd: path.resolve(__dirname, '../..'),
        stdio: 'inherit',
      },
    );

    if (isFirstCompile && process.stdout.isTTY) {
      isFirstCompile = false;

      console.log('The app is running at:\n');
      console.log(` ${chalk.cyan(url)}\n`);
      console.log('Note that the development build is not optimized.');
      console.log(`To create a production build, use ${chalk.cyan('yarn run build')}.`);

      setTimeout(
        () => openBrowser(url),
        500,
      );
    }
  });
}

detectPortAvailability(clientPort, serverPort)
  .then(validatePortAvailability)
  .then(compile)
  .then(([client, server]) => {
    runDevServer(client);
    runExpressServer(server);
  })
  .catch((error) => {
    console.error(chalk.red.bold(error.name, '\n'));
    console.error(error.message, '\n');
    process.exit(1);
  })
;
