import Start from 'start';
import reporter from 'start-pretty-reporter';
import parallel from 'start-parallel';
import env from 'start-env';
import webpack from 'start-webpack';
import webpackDevServer from 'start-webpack-dev-server';
import jest from 'start-jest';
import files from 'start-files';
import clean from 'start-clean';
import read from 'start-read';
import rename from 'start-rename';
import babel from 'start-babel';
import write from 'start-write';
import eslint from 'start-eslint';
import codecov from 'start-codecov';

const start = Start(reporter());

export const makeDist = (packageName) => {
  const webpackConfig = require('./webpack.build').default;

  return start(
    files(`packages/${packageName}/dist/`),
    clean(),
    webpack(webpackConfig(packageName)),
    files(`packages/${packageName}/dist/*.js`),
    read(),
    babel({
      babelrc: false,
      presets: [ 'babili' ]
    }),
    rename((file) => file.replace(/\.js$/, '.min.js')),
    write(`packages/${packageName}/dist/`)
  );
};

export const makeLib = (packageName) => start(
  files(`packages/${packageName}/lib/`),
  clean(),
  files(`packages/${packageName}/src/**/*.js?(x)`),
  read(),
  babel({
    plugins: [ 'transform-es2015-modules-commonjs' ]
  }),
  rename((file) => file.replace(/\.jsx$/, '.js')),
  write(`packages/${packageName}/lib/`)
);

export const makeES = (packageName) => start(
  files(`packages/${packageName}/es/`),
  clean(),
  files(`packages/${packageName}/src/**/*.js?(x)`),
  read(),
  babel(),
  rename((file) => file.replace(/\.jsx$/, '.js')),
  write(`packages/${packageName}/es/`)
);

export const build = () => start(
  env('NODE_ENV', 'production'),
  parallel(
    makeDist,
    makeES,
    makeLib
  )
);

export const demo = (packageName) => {
  const webpackConfig = require('./webpack.demo').default;

  return start(
    env('NODE_ENV', 'development'),
    webpackDevServer(webpackConfig(packageName))
  );
};

export const lint = () => start(
  files([ 'packages/*/@(src|demo)/**/*.js?(x)' ]),
  eslint()
);

export const test = () => start(
  env('NODE_ENV', 'test'),
  jest('.jestrc')
);

export const ci = () => start(
  lint,
  test,
  files('coverage/lcov.info'),
  read(),
  codecov()
);
