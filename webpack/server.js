const nodeExternals = require('webpack-node-externals');
const { set } = require('lodash');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DEV_ENV = process.env.NODE_ENV === 'dev';
const PROD_ENV = process.env.NODE_ENV === 'prod';

let config = {
  target: 'node',
  entry: {
    server: './src/server/server.js',
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css|png|jpg|gif|svg|woff2?|eot|ttf|otf)$/i,
        use: ['null-loader']
      },
    ]
  }
};

if (DEV_ENV) {

}

if (PROD_ENV) {
  config.plugins.push(new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['dist'], verbose: true }));
}

module.exports = config;
