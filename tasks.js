import Start from 'start';
import reporter from 'start-pretty-reporter';
import env from 'start-env';
import webpack from 'start-webpack';
import webpackDevServer from 'start-webpack-dev-server';
import files from 'start-files';
import clean from 'start-clean';
import read from 'start-read';
import rename from 'start-rename';
import babel from 'start-babel';
import write from 'start-write';
import eslint from 'start-eslint';

const start = Start(reporter());

export const build = (packageName) => {
  const webpackConfig = require('./webpack.build').default;

  return start(
    files(`packages/${packageName}/build/`),
    clean(),
    env('NODE_ENV', 'production'),
    env('PACKAGE', packageName),
    webpack(webpackConfig(packageName)),
    files(`packages/${packageName}/build/*.js`),
    read(),
    babel({
      babelrc: false,
      presets: [ 'babili' ]
    }),
    rename((file) => file.replace(/\.js$/, '.min.js')),
    write('packages/')
  );
};

export const demo = (packageName) => {
  const webpackConfig = require('./webpack.demo').default;

  return start(
    env('NODE_ENV', 'development'),
    webpackDevServer(webpackConfig(packageName))
  );
};

export const lint = () => start(
  files([ 'packages/*/@(lib|demo)/**/*.js?(x)' ]),
  eslint()
);
