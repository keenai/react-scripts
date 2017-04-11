// @flow
import * as constants from '../config/constants';
import { attachCompileListeners } from './attach-compile-listeners';
import express from 'express';
import paths from '../config/paths';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

export function watchClientBundle(bundle: Object): Promise<*> {
  return new Promise((resolve, reject) => {
    const app = express();
    const compiler = attachCompileListeners(webpack(bundle));

    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        return reject(
          new Error('Unable to compile client.'),
        );
      }

      return resolve();
    });

    app.use(
      webpackDevMiddleware(compiler, {
        compress: true,
        clientLogLevel: 'debug',
        contentBase: paths.PUBLIC,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        host: constants.HOST,
        hot: true,
        https: constants.PROTOCOL === 'https:',
        publicPath: bundle.output.publicPath,
        quiet: true,
        watchOptions: {
          ignored: /node_modules/,
        },
      }),
    );

    app.use(
      webpackHotMiddleware(compiler, {
        log: false,
      }),
    );

    app.listen(
      constants.WEBPACK_PORT,
      constants.HOST,
    );
  });
}
