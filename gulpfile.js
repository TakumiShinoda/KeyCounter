const gulp = require('gulp');
const pug = require('gulp-pug');
const electron = require('electron-connect').server.create();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const webpackConfig = require('./dev/webpack.config.js');
const async = require('async');
const {copyChain, routes} = require('./dev/gulpChain.json');
const {distPath, srcPath} = require('./dev/path');

gulp.task('make_bundle', () => {
  return new Promise((res, rej) => {
    for(var i = 0; i < routes.length; i++){
      webpackStream(webpackConfig.config(routes[i]), webpack)
        .on('error', (e) => {
          plumber();
        })
        .pipe(gulp.dest('./dist/bundles'));
    }
    res();
  })
});

gulp.task('pug_compile', () => {
  return new Promise((res, rej) => {
    gulp.src(['./src/**/*.pug', '!./pug/**/_*.pug'])
      .pipe(plumber())
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./dist'));
    res();
  })
});

gulp.task('asset_copy', () => {
  return new Promise((res, rej) => {

    for(var i = 0; i < copyChain.length; i++){
      gulp.src([copyChain[i].src], {base: copyChain[i].base})
      .pipe(gulp.dest(copyChain[i].dest));
    }
    res();
  })
});

gulp.task('build_dist', gulp.series('asset_copy', 'pug_compile', 'make_bundle'));

gulp.task('main', () => {
  return new Promise((res, rej) => {
    gulp.watch(['./src/**'], gulp.task('build_dist'));
    gulp.watch(['./src/app/main.js'], () => {
      console.log("hogehoge");
      electron.restart();
    });

    setTimeout(() => {
      electron.start();
      res();
    }, 1000);
  })
});

gulp.task('start', gulp.series('build_dist', 'main'));

process.on('exit', () => {
  try{
    electron.stop();
  }catch(e){
  }
});
