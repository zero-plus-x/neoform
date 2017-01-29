import path from 'path';
import webpack from 'webpack';

export default {
  entry: [
    './lib/index.js'
  ],
  output: {
    path: path.resolve('build/'),
    filename: 'neoform.js',
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
        include: path.resolve('lib/'),
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
