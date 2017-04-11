// @flow
import * as constants from '../constants';
import { concat, merge } from 'lodash/fp';
import AssetsPlugin from 'assets-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import paths from '../paths';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

const clientUrl = `${constants.PROTOCOL}//${constants.HOST}:${constants.WEBPACK_PORT}`;

let config = merge(webpackConfig, {
  name: 'client',

  entry: {
    index: [
      'babel-polyfill',
      paths.CLIENT_ENTRY,
    ],
  },

  output: {
    libraryTarget: 'var',
    path: `${paths.BUILD}/client`,
  },

  plugins: concat(webpackConfig.plugins, [
    // Generates a JSON file containing a map of all the output files for
    // our webpack bundle.  A necessisty for our server rendering process
    // as we need to interogate these files in order to know what JS/CSS
    // we need to inject into our HTML. We only need to know the assets for
    // our client bundle.
    new AssetsPlugin({
      filename: 'assets.json',
      path: paths.BUILD_SELF,
    }),
  ]),
});

if (process.env.NODE_ENV === 'development') {
  config = merge(config, {
    entry: {
      index: [
        'babel-polyfill',
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?reload=true&path=${clientUrl}/__webpack_hmr`,
        paths.CLIENT_ENTRY,
      ],
    },

    plugins: concat(config.plugins, [
      // This is necessary to emit hot updates:
      new webpack.HotModuleReplacementPlugin(),

      // prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),

      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin(),

      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebookincubator/create-react-app/issues/186
      new WatchMissingNodeModulesPlugin(paths.NODE_MODULES),
    ]),
  });
}

if (process.env.NODE_ENV === 'production') {
  config = merge(config, {
    plugins: concat(config.plugins, [
      // Add GZip compression for static files. This will generate a sibling .gz
      // file with each asset. You must then configure your server with the appropriate
      // middleware so that static .gz files are served when they exist. For an example,
      // see [pre-compressed-assets](https://github.com/domadams/pre-compressed-assets).
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|jsx|css|html)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),

      // The LoaderOptionsPlugin is unlike other plugins. It exists to help people move
      // from webpack 1 to webpack 2. With webpack 2 the schema for a webpack.config.js
      // became stricter; no longer open for extension by other loaders / plugins. With
      // webpack 2 the intention is that you pass options directly to loaders / plugins.
      // i.e. options are not global / shared.
      //
      // However, until a loader has been updated
      // to depend upon options being passed directly to them, the LoaderOptionsPlugin
      // exists to bridge the gap. You can configure global / shared loader options with
      // this plugin and all loaders will receive these options.
      //
      // In the future this plugin may be removed.
      //
      // See https://webpack.js.org/plugins/loader-options-plugin/.
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),

      // The plugin has a peer dependency to uglify-js, so in order to use the plugin, also
      // uglify-js has to be installed. The currently (2017/1/25) available uglify-js npm
      // packages, however, do not support minification of ES6 code. In order to support ES6,
      // an ES6-capable, a.k.a. harmony, version of UglifyJS has to be provided.
      //
      // See https://webpack.js.org/plugins/uglifyjs-webpack-plugin/.
      new UglifyJSPlugin(),
    ]),
  });
}

export default merge({}, config);
