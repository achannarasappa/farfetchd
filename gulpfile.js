var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var shell = require('gulp-shell');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var Karma = require('karma').Server;
var runSequence = require('run-sequence');
var mockServer = require('mockserver-grunt');
var express = require('express');
var zlib = require('zlib');
var fs = require('fs');
var configuration = require('./test/configuration');
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

gulp.task('coveralls', shell.task('./node_modules/.bin/gulp test:cover && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls'));

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

gulp.task('docs:prepare', shell.task('./node_modules/.bin/gitbook install'));

gulp.task('docs:compile', function() {

  return gulp.src([
    'lib/body.es6',
    'lib/fetch.es6',
    'lib/headers.es6',
    'lib/request.es6',
    'lib/response.es6',
  ]).pipe(gulpJsdoc2md({
      template: '{{#module}}{{>docs~}}{{/module}}',
      'no-gfm': true,
    }))
    .on('error', function (err) {
      console.log('jsdoc2md failed')
      console.log(err.message);
    })
    .pipe(rename(function (path) {
      path.extname = '.md'
    }))
    .pipe(gulp.dest('./docs/api'))

});

gulp.task('docs:clean', shell.task('./node_modules/.bin/rimraf _book'));

gulp.task('docs:build', shell.task('./node_modules/.bin/gulp docs:clean && ./node_modules/.bin/gulp docs:compile && ./node_modules/.bin/gulp docs:prepare && ./node_modules/.bin/gitbook build'));

gulp.task('docs:publish', shell.task('./node_modules/.bin/gulp docs:build && cd _book && echo \'farfetchd.js.org\' > CNAME && git init && git checkout -b gh-pages && git add . && git commit -am \'update docs\' && git push git@github.com:achannarasappa/farfetchd gh-pages -f'));

gulp.task('docs:serve', shell.task('./node_modules/.bin/gulp docs:build && ./node_modules/.bin/gitbook serve'));

gulp.task('test:cover', shell.task('./node_modules/.bin/nyc --reporter=lcov --reporter=text ./node_modules/.bin/mocha --compilers es6:babel-register ./test/unit/*.es6'));

gulp.task('test:setup:mockserver:start', function() {

  return mockServer.start_mockserver({
    serverPort: configuration.MOCK_SERVER_PORT,
  })

});

gulp.task('test:setup:mockserver:stop', function() {

  return mockServer.stop_mockserver();

});

gulp.task('test:setup:express:start', function() {

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

    res.set('Content-Encoding', 'gzip');
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

gulp.task('test:setup:express:stop', function() {

  server.close();

});

gulp.task('test:unit:client', function(done) {

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

gulp.task('test:functional:client', function(done) {

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

gulp.task('test:unit:server', shell.task('./node_modules/.bin/mocha --colors --compilers es6:babel-register ./test/unit/*.es6'));

gulp.task('test:functional:server', shell.task('./node_modules/.bin/mocha --colors --compilers es6:babel-register ./test/functional/*.es6'));

gulp.task('test:functional', function(done) {

  runSequence(
    'test:setup:express:start',
    'test:setup:mockserver:start',
    'test:functional:client',
    'test:functional:server',
    'test:setup:mockserver:stop',
    'test:setup:express:stop',
    done
  )

});

gulp.task('test:unit', function(done) {

  runSequence(
    'test:unit:client',
    'test:unit:server',
    done
  )

});

gulp.task('test', function(done) {

  runSequence(
    'test:unit',
    'test:functional',
    done
  )

});