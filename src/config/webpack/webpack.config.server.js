// @flow
import { merge } from 'lodash/fp';
import nodeExternals from 'webpack-node-externals';
import paths from '../paths';
import webpackConfig from './webpack.config';

let config = merge(webpackConfig, {
  name: 'server',

  target: 'node',

  entry: {
    index: [
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
    libraryTarget: 'commonjs2',
    path: `${paths.BUILD}/server`,
  },
});

if (process.env.NODE_ENV === 'development') {
  config = merge(config, {
    entry: {
      index: [
        'source-map-support/register',
        paths.SERVER_ENTRY,
      ],
    },
  });
}

export default merge({}, config);
