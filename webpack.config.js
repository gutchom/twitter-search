const { resolve } = require('path')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const isDevelopment = (process.env.NODE_ENV === 'development')
const isTesting = (process.env.NODE_ENV === 'test')

const combine = base => addition => {
  return Object.keys(addition)
    .reduce((merged, key) => Object.assign({}, merged, {
      [key]: merged[key] === undefined
        ? addition[key]
        : merged[key] instanceof Array
          ? merged[key].concat(addition[key])
          : typeof addition[key] === 'object'
            ? Object.assign({}, merged[key], addition[key])
            : addition[key]
    }), base)
}

const base = {
  context: resolve(__dirname, 'src/scripts'),
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.NoEmitOnErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', 'jsx', 'json'],
    alias: {
      app: resolve(__dirname, 'src/scripts/app'),
    },
  },
}

const test = combine(base)({
  devtool: 'cheap-module-eval-source-map',
  externals: {
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: true,
      parallel: {
        cache: true,
        workers: 4
      },
      output: {
        comments: true,
        beautify: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: ['node_modules'],
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: {
              configFile: resolve(__dirname, 'tsconfig.test.json'),
            },
          },
        ],
      },
    ],
  },
})

const common = combine(base)({
  entry: {
    app: resolve(__dirname, 'src/scripts/app/index.tsx')
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'public/js'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: ['node_modules', /\.test\.tsx?$/],
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
})

const development = combine(common)({
  devtool: 'cheap-module-eval-source-map',
  output: {
    pathinfo: true,
  },
  stats: {
    errorDetails: true,
    colors: true,
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: true,
      parallel: {
        cache: true,
        workers: 4
      },
      output: {
        comments: true,
        beautify: true,
      },
    }),
  ],
  watch: true,
})

const production = combine(common)({
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: true,
      parallel: {
        cache: true,
        workers: 4
      },
      output: {
        comments: false,
        beautify: false,
      },
    }),
  ],
})

module.exports = isTesting ? test : isDevelopment ? development : production
