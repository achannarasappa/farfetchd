module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [
      'mocha',
      'chai',
      'chai-as-promised',
      'browserify',
    ],
    files: [
      'lib/**/*.js',
      'test/**/*.js',
    ],
    exclude: [
      'test/functional/fetch.js',
    ],
    preprocessors: {
      'lib/**/*.js': [
        'browserify',
      ],
      'test/**/*.js': [
        'browserify',
      ],
    },
    browserify: {
      debug: true,
      transform: [
        'babelify',
      ],
    },
    browsers: [
      'PhantomJS',
    ],
  });
};