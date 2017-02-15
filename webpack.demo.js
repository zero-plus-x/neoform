import path from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

export default (packageName) => ({
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    `./packages/${packageName}/demo/index.jsx`
  ],
  output: {
    publicPath: '/',
    pathinfo: true
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: [ '.js', '.jsx' ],
    alias: {
      '~': path.resolve('packages/')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\//,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: `./packages/${packageName}/demo/index.html`
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
});
