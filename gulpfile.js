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
var runSequence = require('run-sequence');
var mockServer = require('mockserver-grunt');
var express = require('express');
var zlib = require('zlib');
var configuration = require('./test/configuration')
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

gulp.task('server-mockserver-start', function() {

  return mockServer.start_mockserver({
    serverPort: configuration.MOCK_SERVER_PORT,
  })

});

gulp.task('server-mockserver-stop', function() {

  return mockServer.stop_mockserver();

});

gulp.task('server-express-start', function() {

  var gzippedBody = zlib.gzipSync('test compressed body');
  var redirect = function(count) {

    return function(req, res) {

      return res.redirect('/redirect_' + (count + 1))

    };

  };
  var app = express();

  // Redirect endpoints
  app.get('/redirect_1', redirect(1));
  app.get('/redirect_2', redirect(2));
  app.get('/redirect_3', redirect(3));
  app.get('/redirect_4', function(req, res) {

    res.send('end redirect');

  });

  // Compression endpoint
  app.get('/compression', function(req, res) {

    res.set('Content-Encoding', 'gzip,deflate');
    res.send(gzippedBody);

  });

  // Timeout endpoint
  app.get('/timeout', function(req, res) {

    setTimeout(function() {

      return res.send('test timeout body')

    }, 5000);

  });

  server = app.listen(configuration.EXPRESS_SERVER_PORT);

});

gulp.task('server-express-stop', function() {

  server.close();

});

gulp.task('test-unit-client', function(done) {

  new Karma({
    configFile: __dirname + '/karma.conf.js',
    files: [
      'test/unit/**/*.js',
    ],
    preprocessors: {
      'test/unit/**/*.js': 'browserify',
    },
  }, function() {

    return done();

  }).start();

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
  }, function() {

    return done();

  }).start();

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
    'server-express-start',
    'server-mockserver-start',
    'test-functional-client',
    //'test-functional-server',
    'server-mockserver-stop',
    'server-express-stop',
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