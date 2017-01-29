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

export const webpackBuild = () => start(
  files('build/'),
  clean(),
  env('NODE_ENV', 'production'),
  webpack(require('./webpack.config').default)
);

export const minify = () => start(
  files('build/*.js'),
  read(),
  babel({
    babelrc: false,
    presets: [ 'babili' ]
  }),
  rename((file) => file.replace(/\.js$/, '.min.js')),
  write('build/')
);

export const build = () => start(
  webpackBuild,
  minify
);

export const demo = (demoName = 'simple') => start(
  env('NODE_ENV', 'development'),
  env('DEMO', demoName),
  webpackDevServer(require('./demo/webpack.config').default)
);

export const lint = () => start(
  files([ 'demo/**/*.js?(x)', 'lib/*.js?(x)' ]),
  eslint()
);
