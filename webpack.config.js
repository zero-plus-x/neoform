const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './lib/index.js'
  ],
  output: {
    path: path.resolve('build/'),
    filename: 'index.js',
    library: 'neoform',
    libraryTarget: 'umd',
    pathinfo: true
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'lodash.get': {
      commonjs2: 'lodash.get',
      commonjs: 'lodash.get',
      amd: 'lodash.get'
    }
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve('node_modules/'),
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
