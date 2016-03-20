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
      configure: function(bundle) {
        bundle.once('prebundle', function() {
          bundle.require('http-browserify', { expose: 'http' });
        });
      }
    },
    browsers: [
      'Chrome_small',
    ],
    customLaunchers: {
      Chrome_small: {
        base: 'Chrome',
        flags: [
          '--window-size=400,400',
          '--window-position=-400,0',
          '--disable-web-security',
        ]
      }
    },
    singleRun: true,
    autoWatch: false,
  });
};