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
      'Chrome_small',
    ],
    customLaunchers: {
      Chrome_small: {
        base: 'Chrome',
        flags: [
          '--window-size=400,400',
          '--window-position=-400,0'
        ]
      }
    },
    singleRun: true,
    autoWatch: false,
  });
};