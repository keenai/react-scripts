/* eslint-disable import/no-mutable-exports */
import fs from 'fs';
import paths from '../paths';
import webpackConfigClient from './webpack.config.client';

// const isProduction = (process.env.NODE_ENV === 'production');
const publicPath = '/';

let config = {
  ...webpackConfigClient,

  target: 'node',

  entry: [
    paths.SERVER_ENTRY,
  ],

  externals: (
    fs.readdirSync('node_modules').reduce(
      (accumulator, module) => ({
        ...accumulator,
        [module]: `commonjs ${module}`,
      }),
      {},
    )
  ),

  node: {},
};

config = {
  ...config,

  output: {
    filename: 'static/js/server.js',
    path: paths.BUILD,
    pathinfo: true,
    publicPath,
  },
};

export default config;
