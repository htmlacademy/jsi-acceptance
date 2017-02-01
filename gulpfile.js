'use strict';

const gulp = require('gulp');
const {spawnSync} = require('child_process');

gulp.task('dev:install', () => {
  console.log('$ npm i -g .');

  const res = spawnSync('npm', [
    'install', '-g', '.'
  ]);

  console.log('stdout:');
  console.log(res.output[1].toString());
  console.log('stderr:');
  console.log(res.output[2].toString());
});

gulp.task('default', () => {
  gulp.watch(
    ['acceptance/**/*.js', 'lib/**/*.js', 'package.json'], 
    ['dev:install']
  );
});
