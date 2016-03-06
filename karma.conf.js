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
    ],
    exclude: [],
    preprocessors: {
      'lib/**/*.js': 'browserify',
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
    autoWatch: false,
  });
};