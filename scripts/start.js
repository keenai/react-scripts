/* eslint-disable no-console */
import chalk from 'chalk';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
import clearConsoleUtil from 'react-dev-utils/clearConsole';
import configClient from '../config/webpack/webpack.config.client';
import detect from 'detect-port';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import openBrowser from 'react-dev-utils/openBrowser';
import paths from '../config/paths';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const PORT = process.env.PORT || 3000;

function clearConsole() {
  if (process.stdout.isTTY) {
    clearConsoleUtil();
  }
}

// Warn and crash if required files are missing
if (!checkRequiredFiles([
  paths.APP_HTML,
  paths.CLIENT_ENTRY,
  paths.SERVER_ENTRY,
])) {
  process.exit(1);
}

function setupCompiler(host, port, protocol, config) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  const compiler = webpack(config);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
    clearConsole();
    console.log('Compiling...');
  });

  let isFirstCompile = true;

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', (stats) => {
    clearConsole();

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && (process.stdout.isTTY || isFirstCompile);

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
    }

    if (showInstructions) {
      console.log([
        'The app is running at:\n',
        ` ${chalk.cyan(`${protocol}//${host}:${port}/`)}\n\n`,
        'Note that the development build is not optimized.\n',
        `To create a production build, use ${chalk.cyan('yarn run build')}.\n`,
      ].join(''));
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n'));

      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n'));
    }
  });

  return compiler;
}

function runDevServer(host, port, protocol, config, compiler) {
  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.PUBLIC,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    https: protocol === 'https:',
    host,
  });

  // Launch WebpackDevServer.
  devServer.listen(port, (err) => {
    if (err) {
      console.log(err);

      return;
    }

    clearConsole();
    console.log(chalk.cyan('Starting the development server...\n'));
    openBrowser(`${protocol}//${host}:${port}/`);
  });
}

function run(port) {
  const host = process.env.HOST || 'localhost';
  const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
  const clientCompiler = setupCompiler(host, port, protocol, configClient);

  runDevServer(host, port, protocol, configClient, clientCompiler);
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
detect(PORT).then((port) => {
  if (port !== PORT) {
    // eslint-disable-next-line no-console
    console.log(
      chalk.red(`Something is already running on port ${PORT}.`),
    );

    process.exit(1);
  }

  run(port);
});
