// @flow
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import paths from '../paths';
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
      whitelist: [/^webpack/],
    }),
  ],

  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
  },
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
