// const autoprefixer = require('autoprefixer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const getClientEnvironment = require('../env');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const paths = require('../paths');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const webpack = require('webpack');

const isProduction = (process.env.NODE_ENV === 'production');
const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const sharedConfig = {
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

  plugins: [
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl,
    }),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.APP_HTML,
    }),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),

    // This is necessary to emit hot updates:
    new webpack.HotModuleReplacementPlugin(),

    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),

    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.NODE_MODULES),
  ],

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
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },

      {
        test: /\.(js|jsx)$/,
        include: paths.SOURCE,
        loader: 'babel-loader',
        query: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
        },
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
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

if (isProduction) {
  module.exports = Object.assign({
    bail: true,

    devtool: 'source-map',

    entry: [
      paths.CLIENT_ENTRY,
    ],

    output: {
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      filename: 'static/js/[name].[chunkhash:8].js',
      path: paths.BUILD,
      publicPath,
    },
  }, sharedConfig);
}

module.exports = Object.assign({
  devtool: 'cheap-module-source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    paths.CLIENT_ENTRY,
  ],

  output: {
    filename: 'static/js/bundle.js',
    path: paths.BUILD,
    pathinfo: true,
    publicPath,
  },
}, sharedConfig);
