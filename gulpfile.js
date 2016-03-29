'use strict';

var gulp = require('gulp');
var lint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var paths = {
  js: ['*.js', 'lib/*.js', 'test/*.js', 'routes/*.js', 'models/*.js'],
  test: ['test/*.js']
};

gulp.task('lint', function(){
  return gulp.src(paths.js)
    .pipe(lint())
    .pipe(lint.format());
});

gulp.task('test', function(){
  return gulp.src(paths.test)
  .pipe(mocha());
});

gulp.task('test:js', ['test:mocha']);

gulp.task('default', ['lint', 'test']);
