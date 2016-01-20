var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var Karma = require('karma').Server;
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var server;

gulp.task('default', function() {
});

gulp.task('compile', function() {

  return gulp.src('./**/*.es6')
    .pipe(babel({
      presets: [ 'es2015' ],
    }))
    .pipe(gulp.dest('./'));

});

gulp.task('style', function() {

  return gulp.src('./**/*.es6')
    .pipe(jscs({
      fix: true,
    }))
    .pipe(gulp.dest('./'));

});

gulp.task('bundle', [ 'compile' ], function () {

  var b = browserify({
    entries: './lib/fetch.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('./fetch.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));

});

gulp.task('test', function(done) {
  runSequence([ 'test-server-start', 'test-client', 'test-server', 'test-server-stop' ], done)
});

gulp.task('test-server-start', function() {

  if (!server)
    server = spawn('./node_modules/.bin/json-server', [ './test/functional/db.json' ], {
      detached: true,
      stdio: 'inherit',
    });

});

gulp.task('test-server-stop', function() {

  server.kill();

});

gulp.task('test-client', function(done) {

  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();

});

gulp.task('test-server', function() {

  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }));

});