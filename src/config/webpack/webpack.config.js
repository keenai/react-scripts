// @flow
import * as constants from '../constants';
import { merge } from 'lodash/fp';
import getClientEnvironment from '../environment';
import paths from '../paths';
import webpack from 'webpack';

const environment = getClientEnvironment('');

let config = {
  bail: true,

  devtool: 'source-map',

  externals: [],

  module: {
    rules: [
      {
        enforce: 'pre',
        include: paths.SOURCE,
        loader: 'eslint-loader',
        test: /\.(js|jsx)$/,
      },

      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
        ],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]',
        },
      },

      {
        test: /\.(js|jsx)$/,
        include: paths.SOURCE,
        loader: 'react-hot-loader/webpack',
      },

      {
        test: /\.(js|jsx)$/,
        include: paths.SOURCE,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['@keenai/keenai', {
              modules: false,
            }],
          ],
        },
      },

      {
        test: /\.svg$/,
        loader: 'file-loader',
        query: {
          name: 'media/[name].[hash:8].[ext]',
        },
      },
    ],
  },

  node: {
    __dirname: true,
    __filename: true,
  },

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: `${constants.PROTOCOL}//${constants.HOST}:${constants.PORT}/client/`,
  },

  performance: {
    hints: 'warning',
    maxEntrypointSize: constants.MAX_ENTRYPOINT_SIZE,
    maxAssetSize: constants.MAX_ASSET_SIZE,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': environment,
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [
      'node_modules',
      paths.NODE_MODULES,
      paths.NODE_MODULES_SELF,
      ...paths.NODE_PATHS,
    ],
  },

  resolveLoader: {
    modules: [
      paths.NODE_MODULES,
      paths.NODE_MODULES_SELF,
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  config = merge(config, {
    bail: false,

    devtool: 'cheap-module-source-map',

    output: {
      filename: '[name].js',
      publicPath: `${constants.PROTOCOL}//${constants.HOST}:${constants.WEBPACK_PORT}/client/`,
    },

    performance: {
      hints: false,
    },
  });
}

export default merge({}, config);
