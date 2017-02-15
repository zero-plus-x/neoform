import path from 'path';
import webpack from 'webpack';

export default (packageName) => ({
  entry: [
    `./packages/${packageName}/src/index.js`
  ],
  output: {
    path: path.resolve(`packages/${packageName}/dist/`),
    filename: `${packageName}.js`,
    library: packageName,
    libraryTarget: 'umd',
    pathinfo: true
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
});
