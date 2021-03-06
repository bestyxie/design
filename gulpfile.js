'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var babel = require('gulp-babel');

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('app/controllers/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {

  // gulp.watch(['lib\**\*.js', 'test/**'], ['test']);
  gulp.watch(['./dev/**'],['es6']);
  gulp.watch([ './public/less/**'], ['less']);

});

gulp.task('less',function(){
  return gulp.src('./public/less/**')
              .pipe(less())
              .pipe(gulp.dest('./public/style'));
});

gulp.task('nodemon',function(){
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development'}
  });
});

gulp.task('es6',function(){
  return gulp.src('dev/**')
            .pipe(babel({
              presets: 'es2015'
            }))
            .pipe(gulp.dest('./'));
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);
