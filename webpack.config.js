/* eslint-disable prefer-const */
/* eslint-disable curly */
const webpack = require('webpack');

const eslintFormatter = require('react-dev-utils/eslintFormatter');

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const set = require('lodash/set');

const paths = require('./config/webpack/paths');

const DEV_ENV = process.env.NODE_ENV === 'development';
const PROD_ENV = process.env.NODE_ENV === 'production';

let config = {
  target: 'web',
  mode: process.env.NODE_ENV,
  output: {
    path: paths.out,
    publicPath: paths.public,
    filename: '[name].js',
  },
  entry: {
    client: './src/client/index.js',
  },
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HtmlWebPackPlugin({
      template: './src/client/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: DEV_ENV ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: DEV_ENV ? '[id].css' : '[id].[contenthash].css',
      experimentalUseImportModule: true,
    }),
    new WasmPackPlugin({
      crateDirectory: paths.wasmCrate,
      outDir: paths.wasmOut,
    }),
  ],
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ],
    modules: [
      'node_modules',
      paths.nodeModules,
      paths.src
    ],
    alias: {
      'webpack.config': paths.webpackConfig,
    },
    plugins: [
      new ModuleScopePlugin([ paths.src, paths.nodeModules ], [paths.packageJson])
    ]
  },
  devServer: {
    contentBase: paths.out,
    publicPath: paths.public,
    open: true,
    hot: DEV_ENV,
    historyApiFallback: true,
  },
  module: {
    rules: [
      // src
      {
        enforce: 'pre',
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'eslint-loader', options: { formatter: eslintFormatter }},
        ],
      },
      {
        test: /\.jsx?$/i,
        exclude: /(node_modules|\.worker\.js$)/,
        use: [
          { loader: 'react-hot-loader/webpack' },
          { loader: 'babel-loader' }
        ],
        resolve: { fullySpecified: false }
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: [
          { loader: 'react-hot-loader/webpack' },
          { loader: 'ts-loader'}
        ],
      },
      {
        test: /\.worker\.js$/i,
        use: [
          { loader: 'worker-loader' }
        ],
      },
      // config
      {
        test: /\.ya?ml$/i,
        type: 'json',
        use: [
          { loader: 'yaml-loader' }
        ],
      },
      // styles
      {
        test: /\.s[ac]ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { modules: { localIdentName: '[local]__[contenthash:base64:5]' } } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { modules: { localIdentName: '[local]__[contenthash:base64:5]' } } },
          { loader: 'postcss-loader' }
        ]
      },
      // files
      {
        test: /\.(png|je?pg|gif|svg)$/i,
        use: [
          { loader: 'url-loader', options: { limit: 8192 } },
          { loader: 'img-loader', options: { enable: PROD_ENV } }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          { loader: 'file-loader' },
        ],
      },
    ]
  }
};

if (DEV_ENV) {
  set(config, 'devtool', 'eval-cheap-module-source-map');
  set(config, 'entry.client', [ 'react-hot-loader/patch', config.entry.client ]);
  config.plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false, defaultSizes: 'gzip', analyzerPort: 8989 }));
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  set(config, 'resolve.alias.react-dom', '@hot-loader/react-dom');
}

if (PROD_ENV) {
  config.plugins.push(new WebpackManifestPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false, defaultSizes: 'gzip', analyzerMode: 'static' }));
  config.plugins.push(new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['dist'], verbose: true }));
  set(config, 'optimization.chunkIds', 'total-size');
  set(config, 'optimization.moduleIds', 'size');
}

module.exports = config;
