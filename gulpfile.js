var child = require('child_process');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['pm2:start', 'pm2:logs', 'watch']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['browserify']);
  gulp.watch(['test/**/*.js', '!test/browser/*'], ['mocha']);
});

gulp.task('browserify', function(cb) {
  browserify({
    debug: true,
  })
    .transform(babelify.configure({
      blacklist: ['regenerator'],
    }))
    .require('./src/index.js', {
      entry: true,
    })
    .bundle()
    .on('error', function(err) {
      gutil.log(err.message || err);
      cb();
    })
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/js/'))
    .on('end', cb);
});

gulp.task('pm2:start', function(cb) {
  child.spawn('pm2', ['startOrRestart', 'package.json'], {
    stdio: 'inherit',
  })
    .on('exit', cb);
});

gulp.task('pm2:stop', function(cb) {
  child.spawn('pm2', ['stop', 'package.json'], {
    stdio: 'inherit',
  })
    .on('exit', cb);
});

gulp.task('pm2:logs', function(cb) {
  child.spawn('pm2', ['logs', 'firstebook'], {
    stdio: 'inherit',
  })
    .on('exit', cb);
});

gulp.task('mocha', function(done) {
  var env = Object.keys(process.env).reduce(function(env, key) {
    env[key] = process.env[key];
    return env;
  }, {});
  env.NODE_ENV = 'test';
  env.DEBUG = 'wishing:*';
  env.MONGOOSE_DISABLE_STABILITY_WARNING = 1;

  child.spawn('mocha', ['--harmony', '--bail', '--reporter', 'dot'], {
    env: env,
    stdio: 'inherit',
  }).on('close', done);
});

process.on('uncaughtException', function(err) {
  console.log(err.message || err);
  // child.spawn('pm2', ['startOrReload', 'package.json'], {
  //     stdio: 'inherit'
  // });
});

process.on('SIGINT', function() {
  child.spawn('pm2', ['stop', 'package.json'], {
    stdio: 'inherit',
  })
    .on('exit', function() {
      process.exit(0);
    });
});
