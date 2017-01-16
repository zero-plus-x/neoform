const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const demoPage = process.env.DEMO || 'simple';

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    `./demo/${demoPage}/index.jsx`
  ],
  output: {
    publicPath: '/',
    path: path.resolve(`./demo/${demoPage}`),
    pathinfo: true
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve('node_modules/'),
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './demo/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
