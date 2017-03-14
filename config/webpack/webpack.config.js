/* eslint-disable import/no-mutable-exports */
import getClientEnvironment from '../env';
import paths from '../paths';
import webpack from 'webpack';

const env = getClientEnvironment('');
const host = process.env.HOST || 'localhost';
const isProduction = (process.env.NODE_ENV === 'production');
const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const webpackDevPort = Number(process.env.PORT || 3000) + 1;
const clientUrl = `${protocol}//${host}:${webpackDevPort}/client/`;

const config = {
  bail: isProduction,

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
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
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
    filename: (
      isProduction
        ? '[name]-[chunkhash].js'
        : '[name].js'
    ),
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `${clientUrl}`,
  },

  performance: false,

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

export default config;
