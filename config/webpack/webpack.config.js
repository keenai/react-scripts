import { merge } from 'lodash/fp';
import getClientEnvironment from '../env';
import paths from '../paths';
import webpack from 'webpack';

const env = getClientEnvironment('');
const host = process.env.HOST || 'localhost';
const isProduction = (process.env.NODE_ENV === 'production');
const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const webpackDevPort = Number(process.env.PORT || 3000) + 1;
const clientUrl = `${protocol}//${host}:${webpackDevPort}/client/`;

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
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `${clientUrl}`,
  },

  performance: {
    hints: 'warning',
    maxEntrypointSize: .25 * 1e6,
    maxAssetSize: .25 * 1e6,
  },

  plugins: [
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
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
    },

    performance: false,
  });
}

export default config;
