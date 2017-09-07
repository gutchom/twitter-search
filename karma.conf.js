const merge = require('./webpack.config')

module.exports = function(config) {
  config.set({
    basePath: './src/scripts',
    frameworks: ['power-assert', 'mocha'],
    browsers: ['ChromeHeadless'],
    files: [
      'test/**/*.test.ts',
      'test/**/*.test.tsx',
    ],
    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-power-assert',
      'karma-chrome-launcher',
      'karma-sourcemap-writer',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    preprocessors: {
      'app/**/*.ts': ['webpack', 'sourcemap'],
      'app/**/*.tsx': ['webpack', 'sourcemap'],
      'test/**/*.test.ts': ['webpack', 'sourcemap'],
      'test/**/*.test.tsx': ['webpack', 'sourcemap'],
    },
    port: 9876,
    concurrency: Infinity,
    singleRun: false,
    reporters: ['mocha'],
    mochaReporter: {
      colors: true,
    },
    browserConsoleLogOptions: {
      level: '',
      terminal: true,
    },
    loggers: [
      { type: 'console'},
    ],
    logLevel: config.LOG_INFO,
    webpack: merge({
      externals: {
        'react/addons': 'react',
        'react/lib/ExecutionEnvironment': 'react',
        'react/lib/ReactContext': 'react',
      },
    }),
    webpackMiddleware: {
      stats: 'errors-only',
    },
  })
}
