const merge = require('./webpack.common')

module.exports = config => {
  config.set({
    basePath: './src/scripts',
    frameworks: ['power-assert', 'mocha'],
    browsers: ['ChromeHeadless'],
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    files: [
      'test/**/*.test.+(ts|tsx)',
    ],
    preprocessors: {
      'app/**/*.+(ts|tsx)': ['webpack', 'sourcemap'],
      'test/**/*.test.+(ts|tsx)': ['webpack', 'sourcemap'],
    },
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
    port: 9876,
    concurrency: Infinity,
    singleRun: true,
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
