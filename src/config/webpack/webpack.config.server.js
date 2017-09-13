// @flow
import * as constants from '../constants';
import getClientEnvironment from '../environment';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import paths from '../paths';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

let config = merge(webpackConfig, {
  name: 'server',

  target: 'node',

  entry: {
    server: [
      paths.SERVER_ENTRY,
    ],
  },

  externals: [
    nodeExternals({
      whitelist: [
        /^@keenai\/eyecon/,
        /^webpack/,
      ],
    }),
  ],

  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': getClientEnvironment(constants.PUBLIC_PATH, {
        __SERVER__: true,
      }),
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  config = merge
    .strategy({
      entry: 'prepend',
    })
    .call(
      merge,
      config,
      {
        devtool: 'eval-source-map',
        entry: {
          server: [
            'source-map-support/register',
          ],
        },
      },
    );
}

export default { ...config };
