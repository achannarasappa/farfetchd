module.exports = function(config) {
  config.set({
    frameworks: [
      'mocha',
      'chai',
      'chai-as-promised',
      'sinon',
      'sinon-chai',
      'browserify',
    ],
    files: [
      'lib/**/*.js',
      'test/unit/**/*.js',
    ],
    exclude: [],
    preprocessors: {
      'lib/**/*.js': 'browserify',
      'test/unit/**/*.js': 'browserify',
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
    singleRun: true,
  });
};