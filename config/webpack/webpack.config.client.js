/* eslint-disable import/no-mutable-exports */
import AssetsPlugin from 'assets-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import paths from '../paths';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

const host = process.env.HOST || 'localhost';
const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const webpackDevPort = Number(process.env.PORT || 3000) + 1;
const clientUrl = `${protocol}//${host}:${webpackDevPort}`;

const config = {
  ...webpackConfig,

  name: 'client',

  entry: {
    index: [
      paths.CLIENT_ENTRY,
    ],
  },

  output: {
    ...webpackConfig.output,
    libraryTarget: 'var',
    path: `${paths.BUILD}/client`,
  },

  plugins: [
    ...webpackConfig.plugins,

    // Generates a JSON file containing a map of all the output files for
    // our webpack bundle.  A necessisty for our server rendering process
    // as we need to interogate these files in order to know what JS/CSS
    // we need to inject into our HTML. We only need to know the assets for
    // our client bundle.
    new AssetsPlugin({
      filename: 'assets.json',
      path: `${paths.BUILD}/client`,
    }),
  ],
};

if (process.env.NODE_ENV === 'development') {
  config.entry.index.unshift(
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?reload=true&path=${clientUrl}/__webpack_hmr`,
  );

  config.plugins.push(
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
  );
}

export default config;
