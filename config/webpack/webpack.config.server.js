/* eslint-disable import/no-mutable-exports */
import nodeExternals from 'webpack-node-externals';
import paths from '../paths';
import webpackConfig from './webpack.config';

const config = {
  ...webpackConfig,

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
    ...webpackConfig.output,
    libraryTarget: 'commonjs2',
    path: `${paths.BUILD}/server`,
  },
};

if (process.env.NODE_ENV === 'development') {
  config.entry.index.unshift(
    'source-map-support/register',
  );
}

export default config;
