const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const isDevelopment = (process.env.NODE_ENV === 'development')
const isTesting = (process.env.NODE_ENV === 'test')
const dir = __dirname + '/src/scripts/app/entries/'
const entry = glob
  .sync('**/*.tsx', { cwd: dir, root: dir })
  .reduce((entries, path) => {
    return Object.assign(entries, { [path.slice(0, -'.tsx'.length)]: dir + path })
  }, {
    vendor: [
      'axios',
      'react',
      'react-dom',
    ]
  })

const combine = base => addition => (
  Object.keys(addition)
    .reduce((merged, key) => Object.assign({}, merged, {
      [key]: merged[key] === undefined
        ? addition[key]
        : merged[key] instanceof Array
          ? merged[key].concat(addition[key])
          : typeof addition[key] === 'object'
            ? Object.assign({}, merged[key], addition[key])
            : addition[key]
    }), base)
)

const base = {
  context: path.resolve(__dirname, 'src/scripts'),
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.NoEmitOnErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', 'jsx', 'json'],
    alias: {
      app: path.resolve(__dirname, 'src/scripts/app'),
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
              configFile: path.resolve(__dirname, 'tsconfig.test.json'),
            },
          },
        ],
      },
    ],
  },
})

const common = combine(base)({
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js'),
    jsonpFunction: 'vendor',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
  ],
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
