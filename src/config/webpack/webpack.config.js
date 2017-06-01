// @flow
import * as constants from '../constants';
import eslintFormatter from 'react-dev-utils/eslintFormatter';
import merge from 'webpack-merge';
import paths from '../paths';

let config = {
  bail: false,

  devtool: 'cheap-module-source-map',

  externals: [],

  module: {
    rules: [
      {
        enforce: 'pre',
        include: paths.SOURCE,
        test: /\.(js|jsx|gql|graphql)$/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: eslintFormatter,
          },
        },
      },

      {
        include: paths.SOURCE,
        test: /\.(js|jsx)$/,
        use: 'react-hot-loader/webpack',
      },

      {
        include: paths.SOURCE,
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },

      {
        test: /\.svg$/,
        use: 'file-loader?name=media/[name].[hash:8].[ext]',
      },

      {
        include: paths.SOURCE,
        test: /\.(graphql|gql)$/,
        use: 'graphql-tag/loader',
      },

      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.gql$/,
          /\.graphql$/,
          /\.json$/,
          /\.svg$/,
        ],
        use: 'url-loader?limit=10000&name=media/[name].[hash:8].[ext]',
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
