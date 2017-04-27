// @flow
import * as constants from '../constants';
import getClientEnvironment from '../environment';
import merge from 'webpack-merge';
import paths from '../paths';
import webpack from 'webpack';

let config = {
  bail: false,

  devtool: 'cheap-module-source-map',

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
    ],
  },

  node: {
    __dirname: true,
    __filename: true,
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
    path: paths.BUILD,
    publicPath: '/',
  },

  performance: {
    hints: false,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': getClientEnvironment(constants.PUBLIC_PATH),
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
    modules: [
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
    output: {
      publicPath: `${constants.PROTOCOL}//${constants.HOST}:${constants.WEBPACK_PORT}/`,
    },
  });
}

if (process.env.NODE_ENV === 'production') {
  config = merge(config, {
    bail: true,

    devtool: 'source-map',

    output: {
      filename: '[name].[chunkhash].js',
    },

    performance: {
      hints: 'warning',
      maxEntrypointSize: constants.MAX_ENTRYPOINT_SIZE,
      maxAssetSize: constants.MAX_ASSET_SIZE,
    },
  });
}

export default { ...config };
