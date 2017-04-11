// @flow
import { error, log, success, warn } from './log';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

export function attachCompileListeners(compiler: Object): Object {
  const { name } = compiler;

  // "compile" event fires while the bundle is compiling. We want to notify
  // the user when this is occurring.
  compiler.plugin('compile', () => {
    log(`Compiling ${name}...`);
  });

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
    warn(`Bundle "${name}" has changed...`);
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
      success(`Compiled ${name} successfully!`);
    }

    // If errors exist, only show errors.
    if (stats.hasErrors()) {
      error(`Failed to compile ${name}.`);

      messages.errors.forEach((message) => {
        console.log(`\n${message}\n`);
      });

      return;
    }

    // Show warnings if no errors were found.
    if (stats.hasWarnings()) {
      warn(`Compiled ${name} with warnings.`);
      console.log(messages.warnings.join('\n'));
    }
  });

  return compiler;
}
