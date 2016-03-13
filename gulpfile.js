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
var mockServer = require('mockserver-grunt');
var configuration = require('./test/configuration')

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

gulp.task('server-mockserver-start', function() {

  return mockServer.start_mockserver({
    serverPort: configuration.MOCK_SERVER_PORT,
  })

})

gulp.task('server-mockserver-stop', function() {

  return mockServer.stop_mockserver();

})

gulp.task('test-unit-client', function(done) {

  new Karma({
    configFile: __dirname + '/karma.conf.js',
    files: [
      'test/unit/**/*.js',
    ],
    preprocessors: {
      'test/unit/**/*.js': 'browserify',
    },
  }, () => done()).start();

});

gulp.task('test-functional-client', function(done) {

  new Karma({
    configFile: __dirname + '/karma.conf.js',
    files: [
      'test/functional/**/*.js',
    ],
    preprocessors: {
      'test/functional/**/*.js': 'browserify',
    },
  }, () => done()).start();

});

gulp.task('test-unit-server', function() {

  return gulp.src(['test/unit/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }));

});

gulp.task('test-functional-server', function() {

  return gulp.src(['test/functional/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }));

});

gulp.task('test-functional', function(done) {

  runSequence(
    'server-mockserver-start',
    'test-functional-client',
    //'test-functional-server',
    'server-mockserver-stop',
    done
  )

});

gulp.task('test', function(done) {

  runSequence(
    'test-unit-client',
    'test-unit-server',
    'test-functional',
    done
  )

});